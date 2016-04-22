# jsctags

[![](https://img.shields.io/travis/ramitos/jsctags.svg)](https://travis-ci.org/ramitos/jsctags) [![](https://img.shields.io/codeclimate/coverage/github/ramitos/jsctags.svg)](https://codeclimate.com/github/ramitos/jsctags/coverage) [![](https://img.shields.io/npm/v/jsctags.svg)](https://www.npmjs.com/package/jsctags) [![](https://img.shields.io/david/ramitos/jsctags.svg)](https://david-dm.org/ramitos/jsctags) [![](https://img.shields.io/codeclimate/github/ramitos/jsctags.svg)](https://codeclimate.com/github/ramitos/jsctags) [![](https://img.shields.io/npm/l/jsctags.svg)](https://www.npmjs.com/package/jsctags)

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
$ jsctags [--dir=/path/to] /path/to/file.js [-f]
```

```sh
$ cat /path/to/file.js | jsctags [--dir=/path/to] [--file=/path/to/file.js] [-f]
```

By default, `jsctags` will output a JSON file. Use the `-f` flag to output an exuberant ctags-compatible file.

```js
var jsctags = require('jsctags'),
    fs = require('fs')

var file = '/path/to/file.js'
var dir = '/path/to/'
var content = fs.readFileSync(file, 'utf8')

jsctags(file, dir, content, function(e, tags) {
  console.log(tags)
})
```

## Usage with Vim

If you'd like to take a JavaScript project and generate a `tags` file that Vim can parse, you can use the below command. It searches your directory for any `.js` files, excluding `./node_modules`, formats the tags correctly for Vim and outputs them into `tags`.

```bash
find . -type f -iregex ".*\.js$" -not -path "./node_modules/*" -exec jsctags {} -f \; | sed '/^$/d' | sort > tags
```

If you would like tags generated for files within `node_modules/`, just remove the `-not -path "./node_modules/*` part of the command:

```bash
find . -type f -iregex ".*\.js$" -exec jsctags {} -f \; | sed '/^$/d' | sort > tags
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
