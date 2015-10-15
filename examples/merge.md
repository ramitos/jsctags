# merge

### Input file

```js
function sum(a) {
  return a.x + 20;
}

sum({x: 10, y: 20});
sum({x: 10, y: 20});

sum; //:: fn(a: {x: number, y: number}) -> number
```

### Output - JSON

```json
[
  {
    "name": "sum",
    "addr": "/sum/",
    "kind": "f",
    "type": "number function(?)",
    "lineno": 1,
    "tagfile": "/merge.js"
  }
]
```

### Output - ctags

```ctags
sum	/merge.js	/sum/;"	f	lineno:1	type:number function(?)

```
