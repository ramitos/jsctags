# autothis

### Input file

```js
function Bar() { this.prop = 10; }
Bar.prototype.hallo = function() {
  this; //: Bar
  this.prop; //: number
};

Bar.prototype.fn2 = function() {
  this; //: Date
};

Date.prototype.fn2 = Bar.prototype.fn2;
new Date().fn2();
```

### Output - JSON

```json
[
  {
    "name": "Bar",
    "addr": "/Bar/",
    "kind": "f",
    "type": "void function()",
    "lineno": 1,
    "tagfile": "/autothis.js"
  },
  {
    "name": "hallo",
    "addr": "/hallo/",
    "kind": "f",
    "type": "void function()",
    "lineno": 2,
    "namespace": "Bar.prototype",
    "tagfile": "/autothis.js"
  },
  {
    "name": "fn2",
    "addr": "/fn2/",
    "kind": "f",
    "type": "void function()",
    "lineno": 11,
    "namespace": "Date.prototype",
    "tagfile": "/autothis.js"
  }
]
```

### Output - ctags

```ctags
Bar	/autothis.js	/Bar/;"	f	lineno:1	type:void function()
fn2	/autothis.js	/fn2/;"	f	lineno:11	namespace:Date.prototype	type:void function()
hallo	/autothis.js	/hallo/;"	f	lineno:2	namespace:Bar.prototype	type:void function()

```
