'use strict'

const format = require('util').format
const isString = require('is-string')
const includes = require('lodash.includes')
const isUndefined = require('lodash.isundefined')
const isObject = require('lodash.isplainobject')
const isArray = require('lodash.isarray')
const isFunction = require('lodash.isfunction')
const sortBy = require('lodash.sortby')
const without = require('lodash.without')
const get = require('lodash.get')
const objectHash = require('object-hash')
const clone = require('lodash.clonedeep')
const uuid = require('uuid')


class Parser {
  constructor(ctx) {
    this.ctx = ctx
    this.condense = ctx.condense || {}
    this.tags = []
    this.define = {}
    this.walked = []
    this.bySpan = {}
  }

  parse(callback) {
    const that = this

    if (Object.keys(that.condense).length) {
      return that.hasCondense(callback)
    }
    return ''
  }

  hasCondense(callback) {
    if (this.condense['!define']) {
      this.define = this.condense['!define']
    }

    this.fromTree(this.condense)

    this.clean()

    this.tags = this.tags.sort(function (a, b) {
      return a.lineno - b.lineno
    })

    callback(null, this.tags)
  }

  clean() {
    if (!this.ctx.clean) {
      return
    }

    const onSpan = function (span) {
      const tags = this.bySpan[span]

      if (tags.length < 2) {
        return
      }

      this.tags = without(this.tags, sortBy(tags, function (tag) {
        return (tag.namespace || '').split(/\./).length
      }).pop())
    }

    Object.keys(this.bySpan).forEach(onSpan, this)
  }

  fromTree(tree, parent) {
    if (!isObject(tree)) {
      return null
    }

    return Object.keys(tree).filter(function (key) {
      return !(/^!/.test(key))
    }).map(function (name) {
      return this.onNode(name, tree[name], parent)
    }, this)
  }

  namespace(node, parent) {
    if (!parent) {
      return null
    }

    if (parent.namespace) {
      return format('%s.%s', parent.namespace, parent.name)
    }

    if (Parser.MATCHES.namespace.test(parent.name)) {
      return null
    }

    return parent.name
  }

  lineno(node) {
    if (!isString(node['!span'])) {
      return null
    }

    return Number(node['!span'].match(Parser.MATCHES.lineno).pop()) + 1
  }

  returns(node) {
    if (!isString(node['!type'])) {
      return null
    }

    const ret = node['!type'].match(Parser.MATCHES.ret)

    if (!ret || !Array.isArray(ret)) {
      return 'void'
    }

    return this.type({
      '!type': ret[1],
    })
  }

  isFn(node) {
    if (!isString(node['!type'])) {
      return false
    }

    return Parser.MATCHES.fn.test(node['!type'])
  }

  fnArgs(node) {
    if (!isString(node['!type'])) {
      return []
    }

    const args = node['!type'].match(Parser.MATCHES.args)

    if (!Array.isArray(args) || !args.length) {
      return ''
    }

    return args.pop().split(',').map(function (arg) {
      const t = arg.match(Parser.MATCHES.arg)

      if (!Array.isArray(t) || !t.length) {
        return null
      }

      const type = t.pop()

      if (this.define[type] && this.define[type]['!type']) {
        return this.typeFn(this.define[type]['!type'])
      }

      if (type && Parser.MATCHES.arrArg.test(type)) {
        return 'Array'.concat(type)
      }

      return type
    }, this).filter(function (type) {
      return !!type
    })
  }

  typeFn(node) {
    const args = this.fnArgs(node)
    const ret = this.returns(node)

    return format('%s function(%s)', ret, args ? args.join(', ') : '')
  }

  type(node) {
    if (!isString(node['!type'])) {
      return null
    }

    if (this.isFn(node)) {
      return this.typeFn(node)
    }

    const clean = node['!type'].replace(/^\+/, '')
    const mapped = Parser.TYPE_MAPPING[clean]

    if (mapped) {
      return mapped
    }

    return this.ctx.preserveType ? node['!type'] : clean
  }

  kind(node) {
    return this.isFn(node) ? 'f' : 'v'
  }

  addr(node) {
    if (!isString(node['!span'])) {
      return null
    }

    const pos = node['!span'].match(Parser.MATCHES.pos)

    const end = pos.pop()
    const start = pos.pop()

    const blob = this.ctx.content.slice(start, end)
    const regexp = blob.split(/\n/).shift().replace(Parser.MATCHES.addr, '\\$&')
    const str = new RegExp(regexp).toString()

    return str
  }

  walk(node, parent) {
    const hash = parent ? this.hashNode(parent) : undefined
    const id = format('%s-%s', node, hash)

    if (hash && includes(this.walked, id)) {
      return null
    }

    if (parent) {
      this.walked.push(id)
    }

    return get(this.condense, node, node)
  }

  push(tag) {
    this.tags.push(tag)

    const hasSpan = (
      tag.origin &&
      tag.origin['!span']
    )

    if (!hasSpan) {
      return
    }

    const span = tag.origin['!span']

    if (!isArray(this.bySpan[span])) {
      this.bySpan[span] = []
    }

    this.bySpan[span].push(tag)
  }

  onNode(name, node, parent) {
    let _node = node
    if (!_node) {
      return false
    }

    if (isString(_node)) {
      _node = this.walk(node, parent)
    }

    if (!isObject(_node)) {
      return false
    }

    if (!this.isDefaultType(_node['!type'])) {
      return false
    }

    const tag = {
      id: uuid.v1(),
      name,
      addr: this.addr(_node),
      kind: this.kind(_node),
      type: this.type(_node),
      lineno: this.lineno(_node),
      namespace: this.namespace(_node, parent),
      parent: parent ? parent.id : undefined,
      origin: {
        '!span': _node['!span'],
        '!type': _node['!type'],
        '!data': _node['!data'],
      },
    }

    if (_node['!type'] || _node['!span']) {
      this.push(tag)
    }

    this.fromTree(_node, tag)
    return true
  }

  isDefaultType(type) {
    // nested object
    if (isUndefined(type)) {
      return true
    }

    if (isFunction(type)) {
      return true
    }

    return Parser.DEFAULT_TYPES.some(function (dt) {
      if (isString(dt)) {
        return type === dt
      }

      return dt.test(type)
    })
  }

  hashNode(node) {
    const _node = clone(node)
    _node.id = undefined
    _node.namespace = undefined
    _node.parent = undefined
    return objectHash(_node)
  }

}

Parser.MATCHES = {
  pos: /^(\d*?)\[\d*?\:\d*?\]-(\d*?)\[\d*?\:\d*?\]$/,
  addr: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
  fn: /^fn\*?\(/,
  args: /^fn\*?\((.*?)\)/,
  arg: /^.*?\: (.*?)$/,
  arrArg: /^\[/,
  ret: /-> (.*?)$/,
  lineno: /^\d*?\[(\d*?)\:\d*?\]-\d*?\[\d*?\:\d*?\]$/,
  namespace: /\//,
}

Parser.DEFAULT_TYPES = [
  /^\?/,
  Parser.MATCHES.fn,
  /^\</,
  /^\{/,
  /^\[/,
  /^\+/,
  'number',
  'bool',
  'string',
]

Parser.TYPE_MAPPING = {
  Number: 'number',
  bool: 'boolean',
  String: 'string',
  RegExp: 'regexp',
}

module.exports = function (ctx, fn) {
  return (new Parser(ctx)).parse(fn)
}

module.exports.ctags = require('./ctags')
