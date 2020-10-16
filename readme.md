# jsctags

jsctags generator using [tern](https://github.com/marijnh/tern)

## install

For access to the binary:

```sh
npm install -g git+https://github.com/sergioramos/jsctags.git
```

Otherwise, add to your project's package.json under dependencies or
dev-dependencies:

```json
"jsctags": "git://github.com/sergioramos/jsctags.git"
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
const jsctags = require('jsctags');
const fs = require('fs');

const file = '/path/to/file.js';
const dir = '/path/to/';
const content = fs.readFileSync(file, 'utf8');

jsctags(file, dir, content, function (e, tags) {
  console.log(tags);
});
```

## Usage with Vim

If you'd like to take a JavaScript project and generate a `tags` file that Vim can parse, you can use the below command. It searches your directory for any `.js` files, excluding `./node_modules`, formats the tags correctly for Vim and outputs them into `tags`.

```bash
find . -type f -iregex ".*\.js$" -not -path "./node_modules/*" -exec jsctags {} -f \; | sed '/^$/d' | LANG=C sort > tags
```

If you would like tags generated for files within `node_modules/`, just remove the `-not -path "./node_modules/*` part of the command:

```bash
find . -type f -iregex ".*\.js$" -exec jsctags {} -f \; | sed '/^$/d' | LANG=C sort > tags
```

## examples

- [arguments](test/fixtures/arguments.js)
- [array_holes](test/fixtures/array_holes.js)
- [arrow](test/fixtures/arrow.js)
- [autothis](test/fixtures/autothis.js)
- [bind](test/fixtures/bind.js)
- [block_scope](test/fixtures/block_scope.js)
- [blowup](test/fixtures/blowup.js)
- [browser](test/fixtures/browser.js)
- [builtins](test/fixtures/builtins.js)
- [catch_error](test/fixtures/catch_error.js)
- [cautiouspropagation](test/fixtures/cautiouspropagation.js)
- [class](test/fixtures/class.js)
- [computedprop](test/fixtures/computedprop.js)
- [contextcomplete](test/fixtures/contextcomplete.js)
- [copyprops](test/fixtures/copyprops.js)
- [ctorpattern](test/fixtures/ctorpattern.js)
- [defineProperty](test/fixtures/defineProperty.js)
- [destructure](test/fixtures/destructure.js)
- [docstrings](test/fixtures/docstrings.js)
- [effects](test/fixtures/effects.js)
- [empty_overridden_prop](test/fixtures/empty_overridden_prop.js)
- [es6-features](test/fixtures/es6.js.md)
- [extends](test/fixtures/extends.js)
- [finddef](test/fixtures/finddef.js)
- [findref](test/fixtures/findref.js)
- [fn_arguments](test/fixtures/fn_arguments.js)
- [for_of](test/fixtures/for_of.js)
- [generate](test/fixtures/generate.js)
- [generator](test/fixtures/generator.js)
- [generic_each](test/fixtures/generic_each.js)
- [getter](test/fixtures/getter.js)
- [global_this](test/fixtures/global_this.js)
- [hint-objlit](test/fixtures/hint.js.md)
- [hint_browser](test/fixtures/hint_browser.js)
- [hint_ecma5](test/fixtures/hint_ecma5.js)
- [hint_simple](test/fixtures/hint_simple.js)
- [indirect_class](test/fixtures/indirect_class.js)
- [infinite-expansion](test/fixtures/infinite.js.md)
- [jsdoc](test/fixtures/jsdoc.js)
- [map](test/fixtures/map.js)
- [merge](test/fixtures/merge.js)
- [mixin](test/fixtures/mixin.js)
- [new_array](test/fixtures/new_array.js)
- [new_to_prototype](test/fixtures/new_to_prototype.js)
- [object_create](test/fixtures/object_create.js)
- [objectlit](test/fixtures/objectlit.js)
- [objnames](test/fixtures/objnames.js)
- [order_of_definition](test/fixtures/order_of_definition.js)
- [phantom_object](test/fixtures/phantom_object.js)
- [plus](test/fixtures/plus.js)
- [promise](test/fixtures/promise.js)
- [proto](test/fixtures/proto.js)
- [protoname](test/fixtures/protoname.js)
- [react](test/fixtures/react.js)
- [replace_bogus_prop](test/fixtures/replace_bogus_prop.js)
- [set](test/fixtures/set.js)
- [simple](test/fixtures/simple.js)
- [simple_generic](test/fixtures/simple_generic.js)
- [super](test/fixtures/super.js)
- [symbol](test/fixtures/symbol.js)
- [template](test/fixtures/template.js)

## license

MIT
