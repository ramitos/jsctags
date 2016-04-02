require('longjohn');

var async = require('async');
var format = require('util').format;
var path = require('path');
var glob = require('glob');

var bin = path.join(__dirname, '../bin/jsctags');
var dir = path.join(__dirname, 'cases');

var run = require('./run')({
  bin: bin,
  dir: dir
});

var files = [
  'js',
  'jsx'
].reduce(function(sum, ext) {
  var pattern = format('test/cases/*.%s', ext);
  return sum.concat(glob.sync(pattern, {
    nosort: true,
    silent: true
  }));
}, []).map(function(name) {
  return {
    name: name,
    filename: path.resolve(process.cwd(), name)
  };
});

async.forEachSeries(files, function(f, fn) {
  async.parallel([
    async.apply(run, {
      cmd: f.name,
      filename: f.filename,
      ext: '.json'
    }),
    async.apply(run, {
      cmd: format('--file %s', f.name),
      filename: f.filename,
      ext: '.json',
      stdin: true
    }),
    async.apply(run, {
      cmd: format('--find %s', f.name),
      filename: f.filename,
      ext: '.json'
    }),
    async.apply(run, {
      cmd: format('%s -f', f.name),
      filename: f.filename,
      ext: '.tags'
    }),
    async.apply(run, {
      cmd: format('--file %s -f', f.name),
      filename: f.filename,
      ext: '.tags',
      stdin: true
    }),
    async.apply(run, {
      cmd: format('--find %s -f', f.name),
      filename: f.filename,
      ext: '.tags'
    })
  ], fn);
}, function() {
  var names = files.map(function(f) {
    return f.name;
  });

  async.series([
    async.apply(run, {
      name: '~all~ -f',
      cmd: format('%s -f', names.join(' ')),
      ext: '.tags'
    }),
    async.apply(run, {
      name: '~all~',
      cmd: format('%s', names.join(' ')),
      ext: '.json'
    }),
    async.apply(run, {
      cmd: '--find test/cases/*.js --find test/cases/*.jsx -f',
      ext: '.tags'
    }),
    async.apply(run, {
      cmd: '--find test/cases/*.js --find test/cases/*.jsx',
      ext: '.json'
    })
  ]);
});
