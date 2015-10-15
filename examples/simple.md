# simple

### Input file

```js
var foo = (function() {
  return 42;
})();
foo; //: number

var x = {};

function init(v) {
  v.foo = 10;
  v.bar = 1 + 1;
}
init; //:: fn(v: {bar: number, foo: number})

init(x);
x; //:: {bar: number, foo: number}
```

### Output - JSON

```json
[
  {
    "name": "foo",
    "addr": "/foo/",
    "kind": "v",
    "type": "number",
    "lineno": 1,
    "tagfile": "/simple.js"
  },
  {
    "name": "init",
    "addr": "/init/",
    "kind": "f",
    "type": "void function(x)",
    "lineno": 8,
    "tagfile": "/simple.js"
  },
  {
    "name": "foo",
    "addr": "/foo/",
    "kind": "v",
    "type": "number",
    "lineno": 9,
    "namespace": "x",
    "tagfile": "/simple.js"
  },
  {
    "name": "bar",
    "addr": "/bar/",
    "kind": "v",
    "type": "number",
    "lineno": 10,
    "namespace": "x",
    "tagfile": "/simple.js"
  }
]
```

### Output - ctags

```ctags
bar	/simple.js	/bar/;"	v	lineno:10	namespace:x	type:number
foo	/simple.js	/foo/;"	v	lineno:1	type:number
foo	/simple.js	/foo/;"	v	lineno:9	namespace:x	type:number
init	/simple.js	/init/;"	f	lineno:8	type:void function(x)

```
