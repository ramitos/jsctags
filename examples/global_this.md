# global_this

### Input file

```js
var foo = 10;

(function() {
  this.foo; //: number
})();
```

### Output - JSON

```json
[
  {
    "name": "foo",
    "addr": "/foo/",
    "kind": "v",
    "type": "number",
    "lineno": 1,
    "tagfile": "/global_this.js"
  }
]
```

### Output - ctags

```ctags
foo	/global_this.js	/foo/;"	v	lineno:1	type:number

```
