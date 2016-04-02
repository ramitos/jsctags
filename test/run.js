var assert = require('assert');
var deepEqual = require('assert-diff').deepEqual;
var forceArray = require('force-array');
var cp = require('child_process');
var clc = require('cli-color');
var collect = require('collect-stream');
var includes = require('lodash.includes');
var defaults = require('lodash.defaults');
var format = require('util').format;
var path = require('path');
var merge = require('deepmerge');
var async = require('async');
var fs = require('fs');
var md5 = require('md5');

var read = function(filenames) {
  return forceArray(filenames).map(function(filename) {
    return fs.readFileSync(filename, 'utf-8');
  }).join('\n');
};

var test = function(t, fn) {
  var clean = function(v) {
    return [{
      m: /__DIR__/g,
      r: t.dir
    }, {
      m: /\n\s+"id"\:\s+".+",\n/g,
      r: '\n'
    }, {
      m: /\n\s+"parent"\:\s+".+",\n/g,
      r: '\n'
    }].reduce(function(v, r) {
      return v.replace(r.m, r.r || '');
    }, v);
  };

  return function(err, stdio) {
    if (err || stdio.stderr.length) {
      return fn(err || new Error(stdio.stderr.toString()));
    }

    var expected = read((function() {
      if (!t.filename) {
        return path.join(__dirname, format('cases/_%s', t.ext));
      }

      return t.filename.replace(/\.jsx|\.js$/ig, t.ext);
    })());

    var cleaned = {
      result: clean(stdio.stdout.toString()),
      expected: clean(expected)
    };

    var hasErr = false;

    try {
      assert.deepEqual(cleaned.result.trim(), cleaned.expected.trim());
    } catch (error) {
      hasErr = true;
    }

    var color = hasErr ? 'red' : 'green';
    var symbol = hasErr ? '✗' : '✓';
    console.log('%s %s', clc[color](symbol), t.name || t.cmd);

    fn(hasErr ? merge(cleaned, t) : undefined);
  };
};

var logErr = function(fn) {
  return function(err) {
    if (!err) {
      return fn();
    }

    if (err && err instanceof Error) {
      throw err;
    }

    var firstchar = function(str) {
      var match = (/^[\x20\x09\x0a\x0d]*(.)/).exec(str);
      return match ? match[1] : '';
    };

    var parse = function(v) {
      return includes(['[', '{'], firstchar(v)) ? JSON.parse(v) : v;
    };

    var write = function(type) {
      var filename = format('%s.%s%s', md5(err.expected), type, err.ext);
      fs.writeFileSync(path.join(process.cwd(), filename), err[type], 'utf-8');
      console.log('wrote %s', filename);
    };

    ['expected', 'result'].forEach(write);

    deepEqual(parse(err.result), parse(err.expected));
    throw new Error('Unexpected result'); // make sure we throw
  };
};

module.exports = function(ctx) {
  return function(t, fn) {
    var child = cp.spawn(ctx.bin, t.cmd.split(/\s/), {
      cwd: process.cwd()
    });

    if (t.stdin) {
      child.stdin.write(read(t.filename));
      child.stdin.end();
    }

    async.parallel({
      stdout: async.apply(collect, child.stdout),
      stderr: async.apply(collect, child.stderr)
    }, test(defaults(t, ctx), logErr(fn)));
  };
};
