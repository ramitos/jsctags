const condense = require('tern/lib/condense');
const format = require('util').format;
const merge = require('deepmerge');
const tryor = require('tryor');
const path = require('path');
const tern = require('tern');
const fs = require('fs');
const once = require('once');

require('tern-jsx');
require('./local-scope');

const config = function (dir, file) {
  const config = tryor(() => {
    return fs.readFileSync(path.join(dir, '.tern-project'), 'utf8');
  }, '{}');

  const extname = path.extname(file).replace(/^\./, '');

  const confs = {
    jsx: {
      jsx: {}
    }
  };

  const plugins = {
    doc_comment: true, // eslint-disable-line camelcase
    'local-scope': true
  };

  return merge(JSON.parse(config), {
    libs: ['browser', 'ecmascript'],
    loadEagerly: false,
    plugins: merge(plugins, confs[extname] || {})
  });
};

const defs = function (libs) {
  const base = path.resolve(__dirname, '../node_modules/tern/defs');

  return libs
    .map(lib => {
      if (!/\.json$/.test(lib)) {
        lib += '.json';
      }
      const file = path.join(base, lib);
      if (fs.existsSync(file)) {
        return require(file);
      }

      return null;
    })
    .filter(lib => {
      return Boolean(lib);
    });
};

const server = function (config, dir) {
  const base = path.resolve(__dirname, '../node_modules/tern/plugin');

  Object.keys(config.plugins).forEach(plugin => {
    const file = path.join(base, format('%s.js', plugin));

    if (fs.existsSync(file)) {
      return require(file);
    }
    return tryor(require.bind(require, 'tern-' + plugin));
  });

  return new tern.Server({
    async: false,
    defs: defs(config.libs),
    plugins: config.plugins,
    projectDir: dir
  });
};

module.exports = function (options, fn) {
  const __fn = once(fn);

  const _fn = function (err, tags) {
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

  const filename = options.server.normalizeFilename(options.file);

  options.server.request(
    {
      files: [
        {
          name: filename,
          text: options.content,
          type: 'full'
        }
      ]
    },
    err => {
      _fn(err);
    }
  );

  options.server.flush(err => {
    if (err) {
      return _fn(err);
    }

    _fn(
      null,
      condense.condense(filename, filename, {
        spans: true,
        server: options.server
      })
    );
  });
};
