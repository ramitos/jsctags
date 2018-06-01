require('longjohn');

const async = require('async');
const format = require('util').format;
const path = require('path');
const glob = require('glob');
const os = require('os');

const bin = path.join(__dirname, '../bin/jsctags');
const dir = path.join(__dirname, 'cases');

const run = require('./run')({
  bin,
  dir
});

const files = ['js', 'jsx']
  .reduce((sum, ext) => {
    const pattern = format('test/cases/*.%s', ext);
    return sum.concat(
      glob.sync(pattern, {
        nosort: true,
        silent: true
      })
    );
  }, [])
  .map(name => {
    return {
      name,
      filename: path.resolve(process.cwd(), name)
    };
  });

async.forEachLimit(
  files,
  os.cpus().length,
  (f, fn) => {
    async.parallel(
      [
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
      ],
      fn
    );
  },
  err => {
    if (err) {
      throw err;
    }

    const names = files.map(f => {
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
  }
);
