# generic_each

### Input file

```js
// Underscore's each function (roughly)
var each = function(obj, iterator, context) {
  if (obj == null) return;
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++)
      iterator.call(context, obj[i], i, obj);
  }
};

each([1, 2, 3, 4], function(n) {
  n; //: number
  this; //: Date
}, new Date);

each([{x: 10}], function(o) {
  o; //: {x}
  this; //: String
}, new String("x"));
```

### Output - JSON

```json
[
  {
    "name": "each",
    "addr": "/each/",
    "kind": "f",
    "type": "void function(Array[number]|[each.!0.<i>], fn(n: number)",
    "lineno": 2,
    "tagfile": "/generic_each.js"
  }
]
```

### Output - ctags

```ctags
each	/generic_each.js	/each/;"	f	lineno:2	type:void function(Array[number]|[each.!0.<i>], fn(n: number)

```
