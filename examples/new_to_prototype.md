# new_to_prototype

### Input file

```js
function A() {}
A.prototype.prop_A = 1;
function B() {}
B.prototype = new A;
B.prototype.prop_B = 2;
function C() {}
C.prototype = new A;
C.prototype.prop_C = 3;

(new A).prop_ //+ prop_A
;
(new B).prop_ //+ prop_A, prop_B
;
(new C).prop_ //+ prop_A, prop_C
```

### Output - JSON

```json
[
  {
    "name": "A",
    "addr": "/A/",
    "kind": "f",
    "type": "void function()",
    "lineno": 1,
    "tagfile": "/new_to_prototype.js"
  },
  {
    "name": "prop_A",
    "addr": "/prop_A/",
    "kind": "v",
    "type": "number",
    "lineno": 2,
    "namespace": "A.prototype",
    "tagfile": "/new_to_prototype.js"
  },
  {
    "name": "B",
    "addr": "/B/",
    "kind": "f",
    "type": "void function()",
    "lineno": 3,
    "tagfile": "/new_to_prototype.js"
  },
  {
    "name": "prop_B",
    "addr": "/prop_B/",
    "kind": "v",
    "type": "number",
    "lineno": 5,
    "namespace": "B.prototype",
    "tagfile": "/new_to_prototype.js"
  },
  {
    "name": "C",
    "addr": "/C/",
    "kind": "f",
    "type": "void function()",
    "lineno": 6,
    "tagfile": "/new_to_prototype.js"
  },
  {
    "name": "prop_C",
    "addr": "/prop_C/",
    "kind": "v",
    "type": "number",
    "lineno": 8,
    "namespace": "C.prototype",
    "tagfile": "/new_to_prototype.js"
  }
]
```

### Output - ctags

```ctags
A	/new_to_prototype.js	/A/;"	f	lineno:1	type:void function()
B	/new_to_prototype.js	/B/;"	f	lineno:3	type:void function()
C	/new_to_prototype.js	/C/;"	f	lineno:6	type:void function()
prop_A	/new_to_prototype.js	/prop_A/;"	v	lineno:2	namespace:A.prototype	type:number
prop_B	/new_to_prototype.js	/prop_B/;"	v	lineno:5	namespace:B.prototype	type:number
prop_C	/new_to_prototype.js	/prop_C/;"	v	lineno:8	namespace:C.prototype	type:number

```
