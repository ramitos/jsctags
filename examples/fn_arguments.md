# fn_arguments

### Input file

```js
function abc() {
  return arguments[1];
}

abc(1, 2, 3); //: number
```

### Output - JSON

```json
[
  {
    "name": "abc",
    "addr": "/abc/",
    "kind": "f",
    "type": "number function()",
    "lineno": 1,
    "tagfile": "/fn_arguments.js"
  }
]
```

### Output - ctags

```ctags
abc	/fn_arguments.js	/abc/;"	f	lineno:1	type:number function()

```
