# finddef

### Input file

```js
function blah() {}

var jaja = 40;

var obj = {
  prop1: 10,
  prop2: function(foo) {}
};

obj.prop3 = "hi";

blah; //loc: 1, 9
jaja; //loc: 3, 4
obj; //loc: 5, 4
obj.prop1; //loc: 6, 2
obj.prop2; //loc: 7, 2
obj.prop3; //loc: 10, 4

function hide() { return obj.prop2; }

hide(); //loc: 7, 9

function another(arg) {
  var local = 1;
  arg; // 23, 17
  local; //loc: 24, 6
}
```

### Output - JSON

```json
[
  {
    "name": "blah",
    "addr": "/blah/",
    "kind": "f",
    "type": "void function()",
    "lineno": 1,
    "tagfile": "/finddef.js"
  },
  {
    "name": "jaja",
    "addr": "/jaja/",
    "kind": "v",
    "type": "number",
    "lineno": 3,
    "tagfile": "/finddef.js"
  },
  {
    "name": "prop1",
    "addr": "/prop1/",
    "kind": "v",
    "type": "number",
    "lineno": 6,
    "namespace": "obj",
    "tagfile": "/finddef.js"
  },
  {
    "name": "prop2",
    "addr": "/prop2/",
    "kind": "f",
    "type": "void function(?)",
    "lineno": 7,
    "namespace": "obj",
    "tagfile": "/finddef.js"
  },
  {
    "name": "prop3",
    "addr": "/prop3/",
    "kind": "v",
    "type": "string",
    "lineno": 10,
    "namespace": "obj",
    "tagfile": "/finddef.js"
  },
  {
    "name": "hide",
    "addr": "/hide/",
    "kind": "f",
    "type": "fn(foo: ?) function()",
    "lineno": 19,
    "tagfile": "/finddef.js"
  },
  {
    "name": "another",
    "addr": "/another/",
    "kind": "f",
    "type": "void function(?)",
    "lineno": 23,
    "tagfile": "/finddef.js"
  }
]
```

### Output - ctags

```ctags
another	/finddef.js	/another/;"	f	lineno:23	type:void function(?)
blah	/finddef.js	/blah/;"	f	lineno:1	type:void function()
hide	/finddef.js	/hide/;"	f	lineno:19	type:fn(foo: ?) function()
jaja	/finddef.js	/jaja/;"	v	lineno:3	type:number
prop1	/finddef.js	/prop1/;"	v	lineno:6	namespace:obj	type:number
prop2	/finddef.js	/prop2/;"	f	lineno:7	namespace:obj	type:void function(?)
prop3	/finddef.js	/prop3/;"	v	lineno:10	namespace:obj	type:string

```
