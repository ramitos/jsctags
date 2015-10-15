# new_array

### Input file

```js
var a = new Array();
a.push("hi");
a[0]; //: string

var b = new Array(true, false, true);
b[0]; //: bool

var c = new Array(1);
c[0]; //: ?

var d = new Array("one");
d[0]; //: string
```

### Output - JSON

```json
[
  {
    "name": "a",
    "addr": "/a/",
    "kind": "v",
    "type": "[string]",
    "lineno": 1,
    "tagfile": "/new_array.js"
  },
  {
    "name": "b",
    "addr": "/b/",
    "kind": "v",
    "type": "[bool]",
    "lineno": 5,
    "tagfile": "/new_array.js"
  },
  {
    "name": "c",
    "addr": "/c/",
    "kind": "v",
    "type": "[?]",
    "lineno": 8,
    "tagfile": "/new_array.js"
  },
  {
    "name": "d",
    "addr": "/d/",
    "kind": "v",
    "type": "[string]",
    "lineno": 11,
    "tagfile": "/new_array.js"
  }
]
```

### Output - ctags

```ctags
a	/new_array.js	/a/;"	v	lineno:1	type:[string]
b	/new_array.js	/b/;"	v	lineno:5	type:[bool]
c	/new_array.js	/c/;"	v	lineno:8	type:[?]
d	/new_array.js	/d/;"	v	lineno:11	type:[string]

```
