# browser

### Input file

```js
// environment=browser

window.document.body; //: Element

var newElt = document.createElement("div"); //: Element

newElt.style.border; //: string

var e_which;
window.addEventListener("mousemove", function(e) { e_which = e.which; });
e_which; //: number
```

### Output - JSON

```json
[
  {
    "name": "newElt",
    "addr": "/newElt/",
    "kind": "v",
    "type": "+Element",
    "lineno": 5,
    "tagfile": "/browser.js"
  },
  {
    "name": "e_which",
    "addr": "/e_which/",
    "kind": "v",
    "type": "number",
    "lineno": 9,
    "tagfile": "/browser.js"
  }
]
```

### Output - ctags

```ctags
e_which	/browser.js	/e_which/;"	v	lineno:9	type:number
newElt	/browser.js	/newElt/;"	v	lineno:5	type:+Element

```
