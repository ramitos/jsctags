const assert = require('assert');
const deepEqual = require('assert-diff').deepEqual;
const forceArray = require('force-array');
const cp = require('child_process');
const clc = require('cli-color');
const collect = require('collect-stream');
const includes = require('lodash.includes');
const defaults = require('lodash.defaults');
const format = require('util').format;
const path = require('path');
const merge = require('deepmerge');
const async = require('async');
const fs = require('fs');
const md5 = require('md5');

const read = function(filenames) {
  return forceArray(filenames)
    .map(filename => {
      return fs.readFileSync(filename, 'utf-8');
    })
    .join('\n');
};

const test = function(t, fn) {
  const clean = function(v) {
    return [
      {
        m: /__DIR__/g,
        r: t.dir
      },
      {
        m: /\n\s+"id"\:\s+".+",\n/g,
        r: '\n'
      },
      {
        m: /\n\s+"parent"\:\s+".+",\n/g,
        r: '\n'
      }
    ].reduce((v, r) => {
      return v.replace(r.m, r.r || '');
    }, v);
  };

  return function(err, stdio) {
    if (err || stdio.stderr.length) {
      return fn(err || new Error(stdio.stderr.toString()));
    }

    const expected = read(
      (function() {
        if (!t.filename) {
          return path.join(__dirname, format('cases/_%s', t.ext));
        }

        return t.filename.replace(/\.jsx|\.js$/gi, t.ext);
      })()
    );

    const cleaned = {
      result: clean(stdio.stdout.toString()),
      expected: clean(expected)
    };

    let hasErr = false;

    try {
      assert.deepEqual(cleaned.result.trim(), cleaned.expected.trim());
    } catch (error) {
      hasErr = true;
    }

    const color = hasErr ? 'red' : 'green';
    const symbol = hasErr ? '✗' : '✓';
    console.log('%s %s', clc[color](symbol), t.name || t.cmd);

    fn(hasErr ? merge(cleaned, t) : undefined);
  };
};

const logErr = function(fn) {
  return function(err) {
    if (!err) {
      return fn();
    }

    if (err && err instanceof Error) {
      throw err;
    }

    const firstchar = function(str) {
      const match = /^[\x20\x09\x0a\x0d]*(.)/.exec(str);
      return match ? match[1] : '';
    };

    const parse = function(v) {
      return includes(['[', '{'], firstchar(v)) ? JSON.parse(v) : v;
    };

    const write = function(type) {
      const filename = format('%s.%s%s', md5(err.expected), type, err.ext);
      fs.writeFileSync(path.join(process.cwd(), filename), err[type], 'utf-8');
      console.log('wrote %s', filename);
    };

    ['expected', 'result'].forEach(write);

    deepEqual(parse(err.result), parse(err.expected));
    throw new Error('Unexpected result'); // Make sure we throw
  };
};

module.exports = function(ctx) {
  return function(t, fn) {
    const child = cp.spawn(ctx.bin, t.cmd.split(/\s/), {
      cwd: process.cwd()
    });

    if (t.stdin) {
      child.stdin.write(read(t.filename));
      child.stdin.end();
    }

    async.parallel(
      {
        stdout: async.apply(collect, child.stdout),
        stderr: async.apply(collect, child.stderr)
      },
      test(defaults(t, ctx), logErr(fn))
    );
  };
};
