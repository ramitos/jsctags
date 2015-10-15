# objnames

### Input file

```js
function Ctor1() { this.x = 10; }
Ctor1.prototype = {a: 1};

function Ctor2() {}

var singleton = {a: 10, b: 20}; //: singleton

new Ctor1(); //: Ctor1
new Ctor2(); //: Ctor2
```

### Output - JSON

```json
[
  {
    "name": "Ctor1",
    "addr": "/Ctor1/",
    "kind": "f",
    "type": "void function()",
    "lineno": 1,
    "tagfile": "/objnames.js"
  },
  {
    "name": "a",
    "addr": "/a/",
    "kind": "v",
    "type": "number",
    "lineno": 2,
    "namespace": "Ctor1.prototype",
    "tagfile": "/objnames.js"
  },
  {
    "name": "Ctor2",
    "addr": "/Ctor2/",
    "kind": "f",
    "type": "void function()",
    "lineno": 4,
    "tagfile": "/objnames.js"
  },
  {
    "name": "a",
    "addr": "/a/",
    "kind": "v",
    "type": "number",
    "lineno": 6,
    "namespace": "singleton",
    "tagfile": "/objnames.js"
  },
  {
    "name": "b",
    "addr": "/b/",
    "kind": "v",
    "type": "number",
    "lineno": 6,
    "namespace": "singleton",
    "tagfile": "/objnames.js"
  }
]
```

### Output - ctags

```ctags
Ctor1	/objnames.js	/Ctor1/;"	f	lineno:1	type:void function()
Ctor2	/objnames.js	/Ctor2/;"	f	lineno:4	type:void function()
a	/objnames.js	/a/;"	v	lineno:2	namespace:Ctor1.prototype	type:number
a	/objnames.js	/a/;"	v	lineno:6	namespace:singleton	type:number
b	/objnames.js	/b/;"	v	lineno:6	namespace:singleton	type:number

```
