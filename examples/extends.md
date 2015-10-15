# extends

### Input file

```js
// Follows the pattern CoffeeScript uses to define classes.

var __extends = function(child, parent) {
  for (var key in parent) { child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
};

var Top = (function() {
  function Top() {}
  Top.prototype.topMethod = function() {return "hey";};
  Top.topStatic = 20;
  return Top;
})();

var SubOne = (function(_super) {
  function SubOne(arg) { this.argOne = arg; }
  __extends(SubOne, _super);
  SubOne.prototype.methodOne = function() {return 11;};
  return SubOne;
})(Top);

var SubTwo = (function(_super) {
  function SubTwo(arg) { this.argTwo = arg; }
  __extends(SubTwo, _super);
  SubTwo.prototype.methodTwo = function() {return null;};
  return SubTwo;
})(Top);

var SubEleven = (function(_super) {
  function SubEleven(arg) { SubOne.call(this, arg); }
  __extends(SubEleven, SubOne);
  SubEleven.prototype.methodEleven = function() {return "blah";};
  return SubEleven;
})(SubOne);

var top = new Top, one = new SubOne(true), two = new SubTwo(false), elf = new SubEleven(true);

one.topMethod; //: fn() -> string

one.methodOne; //: fn() -> number

one.argOne; //: bool

one.argTwo; //: ?

two.argTwo; //: bool

one.methodTwo; //: ?

one.methodEleven; //: ?

SubEleven.topStatic; //: number

elf.methodOne; //: fn() -> number

elf.methodEleven(); //: string

two.methodEleven; //: ?
```

### Output - JSON

```json
[
  {
    "name": "__extends",
    "addr": "/__extends/",
    "kind": "f",
    "type": "void function(fn(arg: bool)",
    "lineno": 3,
    "tagfile": "/extends.js"
  },
  {
    "name": "Top",
    "addr": "/Top/",
    "kind": "f",
    "type": "void function()",
    "lineno": 10,
    "tagfile": "/extends.js"
  },
  {
    "name": "topMethod",
    "addr": "/topMethod/",
    "kind": "f",
    "type": "string function()",
    "lineno": 12,
    "namespace": "Top.prototype",
    "tagfile": "/extends.js"
  },
  {
    "name": "topStatic",
    "addr": "/topStatic/",
    "kind": "v",
    "type": "number",
    "lineno": 13,
    "namespace": "Top",
    "tagfile": "/extends.js"
  },
  {
    "name": "SubOne",
    "addr": "/SubOne/",
    "kind": "f",
    "type": "void function(bool)",
    "lineno": 17,
    "tagfile": "/extends.js"
  },
  {
    "name": "argOne",
    "addr": "/argOne/",
    "kind": "v",
    "type": "boolean",
    "lineno": 18,
    "namespace": "SubOne",
    "tagfile": "/extends.js"
  },
  {
    "name": "argOne",
    "addr": "/argOne/",
    "kind": "v",
    "type": "boolean",
    "lineno": 18,
    "namespace": "SubEleven",
    "tagfile": "/extends.js"
  },
  {
    "name": "methodOne",
    "addr": "/methodOne/",
    "kind": "f",
    "type": "number function()",
    "lineno": 20,
    "namespace": "SubOne.prototype",
    "tagfile": "/extends.js"
  },
  {
    "name": "SubTwo",
    "addr": "/SubTwo/",
    "kind": "f",
    "type": "void function(bool)",
    "lineno": 24,
    "tagfile": "/extends.js"
  },
  {
    "name": "argTwo",
    "addr": "/argTwo/",
    "kind": "v",
    "type": "boolean",
    "lineno": 25,
    "namespace": "SubTwo",
    "tagfile": "/extends.js"
  },
  {
    "name": "methodTwo",
    "addr": "/methodTwo/",
    "kind": "f",
    "type": "void function()",
    "lineno": 27,
    "namespace": "SubTwo.prototype",
    "tagfile": "/extends.js"
  },
  {
    "name": "SubEleven",
    "addr": "/SubEleven/",
    "kind": "f",
    "type": "void function(bool)",
    "lineno": 31,
    "tagfile": "/extends.js"
  },
  {
    "name": "methodEleven",
    "addr": "/methodEleven/",
    "kind": "f",
    "type": "string function()",
    "lineno": 34,
    "namespace": "SubEleven.prototype",
    "tagfile": "/extends.js"
  },
  {
    "name": "one",
    "addr": "/one/",
    "kind": "v",
    "type": "+SubOne",
    "lineno": 38,
    "tagfile": "/extends.js"
  },
  {
    "name": "two",
    "addr": "/two/",
    "kind": "v",
    "type": "+SubTwo",
    "lineno": 38,
    "tagfile": "/extends.js"
  },
  {
    "name": "elf",
    "addr": "/elf/",
    "kind": "v",
    "type": "+SubEleven",
    "lineno": 38,
    "tagfile": "/extends.js"
  }
]
```

### Output - ctags

```ctags
SubEleven	/extends.js	/SubEleven/;"	f	lineno:31	type:void function(bool)
SubOne	/extends.js	/SubOne/;"	f	lineno:17	type:void function(bool)
SubTwo	/extends.js	/SubTwo/;"	f	lineno:24	type:void function(bool)
Top	/extends.js	/Top/;"	f	lineno:10	type:void function()
__extends	/extends.js	/__extends/;"	f	lineno:3	type:void function(fn(arg: bool)
argOne	/extends.js	/argOne/;"	v	lineno:18	namespace:SubEleven	type:boolean
argOne	/extends.js	/argOne/;"	v	lineno:18	namespace:SubOne	type:boolean
argTwo	/extends.js	/argTwo/;"	v	lineno:25	namespace:SubTwo	type:boolean
elf	/extends.js	/elf/;"	v	lineno:38	type:+SubEleven
methodEleven	/extends.js	/methodEleven/;"	f	lineno:34	namespace:SubEleven.prototype	type:string function()
methodOne	/extends.js	/methodOne/;"	f	lineno:20	namespace:SubOne.prototype	type:number function()
methodTwo	/extends.js	/methodTwo/;"	f	lineno:27	namespace:SubTwo.prototype	type:void function()
one	/extends.js	/one/;"	v	lineno:38	type:+SubOne
topMethod	/extends.js	/topMethod/;"	f	lineno:12	namespace:Top.prototype	type:string function()
topStatic	/extends.js	/topStatic/;"	v	lineno:13	namespace:Top	type:number
two	/extends.js	/two/;"	v	lineno:38	type:+SubTwo

```
