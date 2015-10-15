# plus

### Input file

```js
var x = 10;
var y = "foo";

x + 20; //: number
x + y; //: string
"foo" + y; //: string
"foo" + x; //: string
```

### Output - JSON

```json
[
  {
    "name": "x",
    "addr": "/x/",
    "kind": "v",
    "type": "number",
    "lineno": 1,
    "tagfile": "/plus.js"
  },
  {
    "name": "y",
    "addr": "/y/",
    "kind": "v",
    "type": "string",
    "lineno": 2,
    "tagfile": "/plus.js"
  }
]
```

### Output - ctags

```ctags
x	/plus.js	/x/;"	v	lineno:1	type:number
y	/plus.js	/y/;"	v	lineno:2	type:string

```
