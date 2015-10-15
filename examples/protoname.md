# protoname

### Input file

```js
function Base() {}
Base.prototype = {};

Base.prototype; //: Base.prototype
new Base; //: Base

function Sub1() {}
Sub1.prototype = new Base();
new Sub1(); //: Sub1

function Sub2() {}
Sub2.prototype = Object.create(Base.prototype);
new Sub2(); //: Sub2

function Base2() {}

function Sub3() {}
Sub3.prototype = new Base2();

new Sub3(); //: Sub3
```

### Output - JSON

```json
[
  {
    "name": "Base",
    "addr": "/Base/",
    "kind": "f",
    "type": "void function()",
    "lineno": 1,
    "tagfile": "/protoname.js"
  },
  {
    "name": "Sub1",
    "addr": "/Sub1/",
    "kind": "f",
    "type": "void function()",
    "lineno": 7,
    "tagfile": "/protoname.js"
  },
  {
    "name": "Sub2",
    "addr": "/Sub2/",
    "kind": "f",
    "type": "void function()",
    "lineno": 11,
    "tagfile": "/protoname.js"
  },
  {
    "name": "Base2",
    "addr": "/Base2/",
    "kind": "f",
    "type": "void function()",
    "lineno": 15,
    "tagfile": "/protoname.js"
  },
  {
    "name": "Sub3",
    "addr": "/Sub3/",
    "kind": "f",
    "type": "void function()",
    "lineno": 17,
    "tagfile": "/protoname.js"
  }
]
```

### Output - ctags

```ctags
Base	/protoname.js	/Base/;"	f	lineno:1	type:void function()
Base2	/protoname.js	/Base2/;"	f	lineno:15	type:void function()
Sub1	/protoname.js	/Sub1/;"	f	lineno:7	type:void function()
Sub2	/protoname.js	/Sub2/;"	f	lineno:11	type:void function()
Sub3	/protoname.js	/Sub3/;"	f	lineno:17	type:void function()

```
