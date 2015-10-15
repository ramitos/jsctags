# copyprops

### Input file

```js
function buildCopy(o) {
  var oo = {};
  for (var prop in o) oo[prop] = o[prop];
  return oo;
}

buildCopy({xx: 10, yy: 20}); //:: {xx: number, yy: number}
```

### Output - JSON

```json
[
  {
    "name": "buildCopy",
    "addr": "/buildCopy/",
    "kind": "f",
    "type": "? function(buildCopy.!0)",
    "lineno": 1,
    "tagfile": "/copyprops.js"
  }
]
```

### Output - ctags

```ctags
buildCopy	/copyprops.js	/buildCopy/;"	f	lineno:1	type:? function(buildCopy.!0)

```
