# jsdoc

### Input file

```js
/** @type {Date} */
var a = getSomething();
a; //: Date

a.getTime; //: fn() -> number

/** @type {{x: Integer, y: [String]}} */
var c = somethingElse();
c; //:: {x: number, y: [string]}

/**
 * This is a function
 * @return {[Number]}
 * @param {Number} a
 * @param {String} b
 */
function foo(a, b) { return hohoho(); }
foo; //: fn(a: number, b: string) -> [number]

/**
 * This is also a function
 * @returns {string}
 * @arg {Number} a
 */
var bar = function(a, b) { return goop(); };
bar(gulp(), 10);
bar; //: fn(a: number, b: number) -> string

var o = {
  /** @type {String} */
  prop1: mystery(),

  /** @returns {Number} */
  prop2: function() { return anything(); }
};

/** @returns {String} */
o.prop3 = function() { return something(); };

o.prop1; //: string
o.prop2; //: fn() -> number
o.prop3; //: fn() -> string
```

### Output - JSON

```json
[
  {
    "name": "a",
    "addr": "/a/",
    "kind": "v",
    "type": "+Date",
    "lineno": 2,
    "tagfile": "/jsdoc.js"
  },
  {
    "name": "foo",
    "addr": "/foo/",
    "kind": "f",
    "type": "Array function(number, string)",
    "lineno": 17,
    "tagfile": "/jsdoc.js"
  },
  {
    "name": "bar",
    "addr": "/bar/",
    "kind": "f",
    "type": "string function(number, number)",
    "lineno": 25,
    "tagfile": "/jsdoc.js"
  },
  {
    "name": "prop1",
    "addr": "/prop1/",
    "kind": "v",
    "type": "string",
    "lineno": 31,
    "namespace": "o",
    "tagfile": "/jsdoc.js"
  },
  {
    "name": "prop2",
    "addr": "/prop2/",
    "kind": "f",
    "type": "number function()",
    "lineno": 34,
    "namespace": "o",
    "tagfile": "/jsdoc.js"
  },
  {
    "name": "prop3",
    "addr": "/prop3/",
    "kind": "f",
    "type": "string function()",
    "lineno": 38,
    "namespace": "o",
    "tagfile": "/jsdoc.js"
  }
]
```

### Output - ctags

```ctags
a	/jsdoc.js	/a/;"	v	lineno:2	type:+Date
bar	/jsdoc.js	/bar/;"	f	lineno:25	type:string function(number, number)
foo	/jsdoc.js	/foo/;"	f	lineno:17	type:Array function(number, string)
prop1	/jsdoc.js	/prop1/;"	v	lineno:31	namespace:o	type:string
prop2	/jsdoc.js	/prop2/;"	f	lineno:34	namespace:o	type:number function()
prop3	/jsdoc.js	/prop3/;"	f	lineno:38	namespace:o	type:string function()

```
