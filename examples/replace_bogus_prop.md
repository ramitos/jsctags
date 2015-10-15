# replace_bogus_prop

### Input file

```js
var x = new Type();

x.foo; //: string

function Type() {}
Type.prototype.foo = "hi";
```

### Output - JSON

```json
[
  {
    "name": "x",
    "addr": "/x/",
    "kind": "v",
    "type": "+Type",
    "lineno": 1,
    "tagfile": "/replace_bogus_prop.js"
  },
  {
    "name": "Type",
    "addr": "/Type/",
    "kind": "f",
    "type": "void function()",
    "lineno": 5,
    "tagfile": "/replace_bogus_prop.js"
  },
  {
    "name": "foo",
    "addr": "/foo/",
    "kind": "v",
    "type": "string",
    "lineno": 6,
    "namespace": "Type.prototype",
    "tagfile": "/replace_bogus_prop.js"
  }
]
```

### Output - ctags

```ctags
Type	/replace_bogus_prop.js	/Type/;"	f	lineno:5	type:void function()
foo	/replace_bogus_prop.js	/foo/;"	v	lineno:6	namespace:Type.prototype	type:string
x	/replace_bogus_prop.js	/x/;"	v	lineno:1	type:+Type

```
