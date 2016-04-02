var condense = require('tern/lib/condense');
var format = require('util').format;
var merge = require('deepmerge');
var tryor = require('tryor');
var path = require('path');
var tern = require('tern');
var fs = require('fs');
var once = require('once');

require('tern-react');
require('./local-scope');

var config = function(dir, file) {
  var config = tryor(function() {
    return fs.readFileSync(path.join(dir, '.tern-project'), 'utf8');
  }, '{}');

  var extname = path.extname(file).replace(/^\./, '');

  var confs = {
    jsx: {
      jsx: {}
    },
    js: {}
  };

  var plugins = {
    doc_comment: true,
    'local-scope': true
  };

  return merge(JSON.parse(config), {
    libs: ['browser', 'ecma5', 'ecma6'],
    loadEagerly: false,
    plugins: merge(plugins, confs[extname] || {})
  });
};

var defs = function(libs) {
  var base = path.resolve(__dirname, '../node_modules/tern/defs');

  return libs.map(function(lib) {
    if (!/\.json$/.test(lib)) lib = lib + '.json';
    var file = path.join(base, lib);
    if (fs.existsSync(file)) return require(file);
  }).filter(function(lib) {
    return !!lib;
  });
};

var server = function(config, dir) {
  var base = path.resolve(__dirname, '../node_modules/tern/plugin');

  Object.keys(config.plugins).forEach(function(plugin) {
    var file = path.join(base, format('%s.js', plugin));

    if (fs.existsSync(file)) {
      return require(file);
    }
  });

  return new tern.Server({
    async: false,
    defs: defs(config.libs),
    plugins: config.plugins,
    projectDir: dir
  });
};

module.exports = function(options, fn) {
  var __fn = once(fn);

  var _fn = function(err, tags) {
    if (err) {
      return __fn(err);
    }

    if (tags) {
      return __fn(err, tags);
    }
  };

  if (!options.server) {
    options.server = server(config(options.dir, options.file), options.dir);
  }

  var filename = options.server.normalizeFilename(options.file);

  options.server.request({
    files: [{
      name: filename,
      text: options.content,
      type: 'full'
    }]
  }, function(err) {
    _fn(err);
  });

  options.server.flush(function(err) {
    if (err) {
      return _fn(err);
    }

    _fn(null, condense.condense(filename, filename, {
      spans: true,
      server: options.server
    }));
  });
};
