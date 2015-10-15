# proto

### Input file

```js
function Foo(x) {
  this.x = x;
  this.y = [1];
}
Foo; //: fn(x: bool)

Foo.prototype = {
  makeString: function() { return "hi"; },
  bar: 13
};

var z = new Foo(true); //:: {x: bool, y: [number]}

z.toString; //: fn() -> string

z.bar; //: number
```

### Output - JSON

```json
[
  {
    "name": "Foo",
    "addr": "/Foo/",
    "kind": "f",
    "type": "void function(bool)",
    "lineno": 1,
    "tagfile": "/proto.js"
  },
  {
    "name": "x",
    "addr": "/x/",
    "kind": "v",
    "type": "boolean",
    "lineno": 2,
    "namespace": "Foo",
    "tagfile": "/proto.js"
  },
  {
    "name": "y",
    "addr": "/y/",
    "kind": "v",
    "type": "[number]",
    "lineno": 3,
    "namespace": "Foo",
    "tagfile": "/proto.js"
  },
  {
    "name": "makeString",
    "addr": "/makeString/",
    "kind": "f",
    "type": "string function()",
    "lineno": 8,
    "namespace": "Foo.prototype",
    "tagfile": "/proto.js"
  },
  {
    "name": "bar",
    "addr": "/bar/",
    "kind": "v",
    "type": "number",
    "lineno": 9,
    "namespace": "Foo.prototype",
    "tagfile": "/proto.js"
  },
  {
    "name": "z",
    "addr": "/z/",
    "kind": "v",
    "type": "+Foo",
    "lineno": 12,
    "tagfile": "/proto.js"
  }
]
```

### Output - ctags

```ctags
Foo	/proto.js	/Foo/;"	f	lineno:1	type:void function(bool)
bar	/proto.js	/bar/;"	v	lineno:9	namespace:Foo.prototype	type:number
makeString	/proto.js	/makeString/;"	f	lineno:8	namespace:Foo.prototype	type:string function()
x	/proto.js	/x/;"	v	lineno:2	namespace:Foo	type:boolean
y	/proto.js	/y/;"	v	lineno:3	namespace:Foo	type:[number]
z	/proto.js	/z/;"	v	lineno:12	type:+Foo

```
