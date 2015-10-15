# ctorpattern

### Input file

```js
// Verify that the binding of `this` to the top scope is overridden by
// the binding to an instance.

function Ctor() {
  if (!(this instanceof Ctor)) return new Ctor();
  this.foo = 20;
}

Ctor().foo; //: number
foo; //: ?
```

### Output - JSON

```json
[
  {
    "name": "Ctor",
    "addr": "/Ctor/",
    "kind": "f",
    "type": "+Ctor function()",
    "lineno": 4,
    "tagfile": "/ctorpattern.js"
  },
  {
    "name": "foo",
    "addr": "/foo/",
    "kind": "v",
    "type": "number",
    "lineno": 6,
    "namespace": "Ctor",
    "tagfile": "/ctorpattern.js"
  }
]
```

### Output - ctags

```ctags
Ctor	/ctorpattern.js	/Ctor/;"	f	lineno:4	type:+Ctor function()
foo	/ctorpattern.js	/foo/;"	v	lineno:6	namespace:Ctor	type:number

```
