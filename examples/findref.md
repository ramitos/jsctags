# findref

### Input file

```js
function hello(a, b) {
  var c = a + b;
  hello(a, c);
  a; //refs: 1,15 2,10 3,8, 4,2
  c; //refs: 2,6 3,11 5,2
}

hello; //refs: 1,9 3,2 8,0

var obj = {
  x //<refs: 11,2 16,4 19,4
  : 10,
  y: 20
};

obj.x = 30;
obj.z = "hi";

obj.x;
obj.z; //refs: 17,4 20,4
```

### Output - JSON

```json
[
  {
    "name": "hello",
    "addr": "/hello/",
    "kind": "f",
    "type": "void function(?, ?)",
    "lineno": 1,
    "tagfile": "/findref.js"
  },
  {
    "name": "x",
    "addr": "/x/",
    "kind": "v",
    "type": "number",
    "lineno": 11,
    "namespace": "obj",
    "tagfile": "/findref.js"
  },
  {
    "name": "y",
    "addr": "/y/",
    "kind": "v",
    "type": "number",
    "lineno": 13,
    "namespace": "obj",
    "tagfile": "/findref.js"
  },
  {
    "name": "z",
    "addr": "/z/",
    "kind": "v",
    "type": "string",
    "lineno": 17,
    "namespace": "obj",
    "tagfile": "/findref.js"
  }
]
```

### Output - ctags

```ctags
hello	/findref.js	/hello/;"	f	lineno:1	type:void function(?, ?)
x	/findref.js	/x/;"	v	lineno:11	namespace:obj	type:number
y	/findref.js	/y/;"	v	lineno:13	namespace:obj	type:number
z	/findref.js	/z/;"	v	lineno:17	namespace:obj	type:string

```
