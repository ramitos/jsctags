# cautiouspropagation

### Input file

```js
var grabbag = {};
grabbag[foo()] = "hi";
grabbag[bar()] = {abc: 10};
grabbag[baz()] = [1, 2, 3];
var inner = 55 || grabbag[quux()];
inner; //: number

var simple = {};
simple[foo()] = "a";
simple[bar()] = "b";
simple[baz()] = "c";
simple[quux()]; //: string
```

### Output - JSON

```json
[
  {
    "name": "inner",
    "addr": "/inner/",
    "kind": "v",
    "type": "number",
    "lineno": 5,
    "tagfile": "/cautiouspropagation.js"
  },
  {
    "name": "<i>",
    "addr": "/foo\\(\\)/",
    "kind": "v",
    "type": "string",
    "lineno": 9,
    "namespace": "simple",
    "tagfile": "/cautiouspropagation.js"
  }
]
```

### Output - ctags

```ctags
<i>	/cautiouspropagation.js	/foo\(\)/;"	v	lineno:9	namespace:simple	type:string
inner	/cautiouspropagation.js	/inner/;"	v	lineno:5	type:number

```
