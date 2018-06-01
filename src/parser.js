const format = require('util').format;
const isString = require('lodash.isstring');
const includes = require('lodash.includes');
const isUndefined = require('lodash.isundefined');
const isObject = require('lodash.isplainobject');
const isArray = require('lodash.isarray');
const isFunction = require('lodash.isfunction');
const sortBy = require('lodash.sortby');
const without = require('lodash.without');
const get = require('lodash.get');
const objectHash = require('object-hash');
const clone = require('lodash.clonedeep');
const uuid = require('node-uuid');
const path = require('path');

const condense = require('./condenser');

const MATCHES = {
  pos: /^(\d*?)\[\d*?\:\d*?\]-(\d*?)\[\d*?\:\d*?\]$/,
  addr: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
  fn: /^fn\*?\(/,
  args: /^fn\*?\((.*?)\)/,
  arg: /^.*?\: (.*?)$/,
  arrArg: /^\[/,
  ret: /-> (.*?)$/,
  lineno: /^\d*?\[(\d*?)\:\d*?\]-\d*?\[\d*?\:\d*?\]$/,
  namespace: /\//
};

const DEFAULT_TYPES = [
  /^\?/,
  MATCHES.fn,
  /^\</,
  /^\{/,
  /^\[/,
  /^\+/,
  'number',
  'bool',
  'string'
];

const TYPE_MAPPING = {
  Number: 'number',
  bool: 'boolean',
  String: 'string',
  RegExp: 'regexp'
};

const hashNode = function(n) {
  const node = clone(n);
  node.id = undefined;
  node.namespace = undefined;
  node.parent = undefined;
  return objectHash(node);
};

const isDefaultType = function(type) {
  // Nested object
  if (isUndefined(type)) {
    return true;
  }

  if (isFunction(type)) {
    return true;
  }

  return DEFAULT_TYPES.some(dt => {
    if (isString(dt)) {
      return type === dt;
    }

    return dt.test(type);
  });
};

const Parser = function(ctx) {
  if (!(this instanceof Parser)) {
    return new Parser(ctx);
  }

  const extname = path.extname(ctx.file);
  const basename = path.basename(ctx.file, extname);

  this.fileId = format('%s%s', basename, extname.replace(/\./, '`'));

  this.ctx = ctx;
  this.condense = ctx.condense || {};
  this.tags = [];
  this.define = {};
  this.walked = [];
  this.bySpan = {};
};

Parser.prototype.parse = function(fn) {
  const self = this;

  if (Object.keys(self.condense).length) {
    return self.hasCondense(fn);
  }

  condense(self.ctx, (err, condense) => {
    if (err) {
      return fn(err);
    }

    self.condense = condense;
    self.hasCondense(fn);
  });
};

Parser.prototype.hasCondense = function(fn) {
  if (this.condense['!define']) {
    this.define = this.condense['!define'];
  }

  this.fromTree(this.condense);

  this.clean();

  this.tags = this.tags.sort((a, b) => {
    return a.lineno - b.lineno;
  });

  fn(null, this.tags);
};

Parser.prototype.clean = function() {
  if (!this.ctx.clean) {
    return;
  }

  const onSpan = function(span) {
    const tags = this.bySpan[span];

    if (tags.length < 2) {
      return;
    }

    this.tags = without(
      this.tags,
      sortBy(tags, tag => {
        return (tag.namespace || '').split(/\./).length;
      }).pop()
    );
  };

  Object.keys(this.bySpan).forEach(onSpan, this);
};

Parser.prototype.fromTree = function(tree, parent) {
  if (!isObject(tree)) {
    return;
  }

  return Object.keys(tree)
    .filter(key => {
      return !/^!/.test(key);
    })
    .map(function(name) {
      return this.onNode(name, tree[name], parent);
    }, this);
};

Parser.prototype.namespace = function(node, parent) {
  if (!parent) {
    return;
  }

  if (parent.namespace) {
    return format('%s.%s', parent.namespace, parent.name);
  }

  if (MATCHES.namespace.test(parent.name)) {
    return;
  }

  if (parent.name === this.fileId) {
    return;
  }

  return parent.name;
};

Parser.prototype.lineno = function(node) {
  if (!isString(node['!span'])) {
    return;
  }

  return Number(node['!span'].match(MATCHES.lineno).pop()) + 1;
};

Parser.prototype.returns = function(node) {
  if (!isString(node['!type'])) {
    return;
  }

  const ret = node['!type'].match(MATCHES.ret);

  if (!ret || !Array.isArray(ret)) {
    return 'void';
  }

  return this.type({
    '!type': ret[1]
  });
};

Parser.prototype.isFn = function(node) {
  if (!isString(node['!type'])) {
    return false;
  }

  return MATCHES.fn.test(node['!type']);
};

Parser.prototype.fnArgs = function(node) {
  if (!isString(node['!type'])) {
    return [];
  }

  const args = node['!type'].match(MATCHES.args);

  if (!Array.isArray(args) || !args.length) {
    return '';
  }

  return args
    .pop()
    .split(',')
    .map(function(arg) {
      const t = arg.match(MATCHES.arg);

      if (!Array.isArray(t) || !t.length) {
        return;
      }

      const type = t.pop();

      if (this.define[type] && this.define[type]['!type']) {
        return this.typeFn(this.define[type]['!type']);
      }

      if (type && MATCHES.arrArg.test(type)) {
        return 'Array'.concat(type);
      }

      return type;
    }, this)
    .filter(type => {
      return Boolean(type);
    });
};

Parser.prototype.typeFn = function(node) {
  const args = this.fnArgs(node);
  const ret = this.returns(node);

  return format('%s function(%s)', ret, args ? args.join(', ') : '');
};

Parser.prototype.type = function(node) {
  if (!isString(node['!type'])) {
    return;
  }

  if (this.isFn(node)) {
    return this.typeFn(node);
  }

  const clean = node['!type'].replace(/^\+/, '');
  const mapped = TYPE_MAPPING[clean];

  if (mapped) {
    return mapped;
  }

  return this.ctx.preserveType ? node['!type'] : clean;
};

Parser.prototype.kind = function(node) {
  return this.isFn(node) ? 'f' : 'v';
};

Parser.prototype.addr = function(node) {
  if (!isString(node['!span'])) {
    return;
  }

  const pos = node['!span'].match(MATCHES.pos);

  const end = pos.pop();
  const start = pos.pop();

  const blob = this.ctx.content.slice(start, end);
  const regexp = blob
    .split(/\n/)
    .shift()
    .replace(MATCHES.addr, '\\$&');
  const str = new RegExp(regexp).toString();

  return str;
};

Parser.prototype.walk = function(node, parent) {
  const hash = parent ? hashNode(parent) : undefined;
  const id = format('%s-%s', node, hash);

  if (hash && includes(this.walked, id)) {
    return;
  }

  if (parent) {
    this.walked.push(id);
  }

  return get(this.condense, node, node);
};

Parser.prototype.push = function(tag) {
  this.tags.push(tag);

  const hasSpan = tag.origin && tag.origin['!span'];

  if (!hasSpan) {
    return;
  }

  const span = tag.origin['!span'];

  if (!isArray(this.bySpan[span])) {
    this.bySpan[span] = [];
  }

  this.bySpan[span].push(tag);
};

Parser.prototype.onNode = function(name, node, parent) {
  if (!node) {
    return false;
  }

  if (isString(node)) {
    node = this.walk(node, parent);
  }

  if (!isObject(node)) {
    return;
  }

  if (!isDefaultType(node['!type'])) {
    return;
  }

  const tag = {
    id: uuid.v1(),
    name,
    addr: this.addr(node),
    kind: this.kind(node),
    type: this.type(node),
    lineno: this.lineno(node),
    namespace: this.namespace(node, parent),
    parent: parent ? parent.id : undefined,
    origin: {
      '!span': node['!span'],
      '!type': node['!type'],
      '!data': node['!data']
    }
  };

  if (node['!type'] || node['!span']) {
    this.push(tag);
  }

  this.fromTree(node, tag);
};

module.exports = function(ctx, fn) {
  return new Parser(ctx).parse(fn);
};

module.exports.ctags = require('./ctags');
