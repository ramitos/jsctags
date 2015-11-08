# jsctags [![Build Status](https://travis-ci.org/ramitos/jsctags.svg?branch=master)](https://travis-ci.org/ramitos/jsctags)
[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)

jsctags generator using [tern](https://github.com/marijnh/tern)

## install

For access to the binary:

```sh
npm install -g git+https://github.com/ramitos/jsctags.git
```

Otherwise, add to your project's package.json under dependencies or
dev-dependencies:

```json
"jsctags": "git://github.com/ramitos/jsctags.git"
```

## usage

```sh
$ jsctags [-o=/path/to/output/file] [--dir=/path/to] /path/to/file.js [-f]
```

```sh
$ cat /path/to/file.js | jsctags [-o=/path/to/output/file] [--dir=/path/to] [--file=/path/to/file.js] [-f]
```

By default, `jsctags` will output a JSON file. Use the `-f` flag to output an exuberant ctags-compatible file.

```js
var jsctags = require('jsctags'),
    fs = require('fs')

var file = '/path/to/file.js'
var dir = '/path/to/'
var content = fs.readFileSync(file, 'utf8')

jsctags(file, dir, content, function (e, tags) {
  console.log(tags)
})
```

## examples

 * [arguments](examples/arguments.md)
 * [autothis](examples/autothis.md)
 * [browser](examples/browser.md)
 * [builtins](examples/builtins.md)
 * [cautiouspropagation](examples/cautiouspropagation.md)
 * [copyprops](examples/copyprops.md)
 * [ctorpattern](examples/ctorpattern.md)
 * [docstrings](examples/docstrings.md)
 * [effects](examples/effects.md)
 * [extends](examples/extends.md)
 * [finddef](examples/finddef.md)
 * [fn_arguments](examples/fn_arguments.md)
 * [generic_each](examples/generic_each.md)
 * [global_this](examples/global_this.md)
 * [infinite-expansion](examples/infinite-expansion.md)
 * [jsdoc](examples/jsdoc.md)
 * [merge](examples/merge.md)
 * [new_array](examples/new_array.md)
 * [new_to_prototype](examples/new_to_prototype.md)
 * [object_create](examples/object_create.md)
 * [objnames](examples/objnames.md)
 * [plus](examples/plus.md)
 * [proto](examples/proto.md)
 * [protoname](examples/protoname.md)
 * [replace_bogus_prop](examples/replace_bogus_prop.md)
 * [simple_generic](examples/simple_generic.md)
 * [simple](examples/simple.md)


## license

MIT
