## Html2Bl

Tiny little script for getting blocks dirs from HTML file with redefinition levels.

```js
var params = { levels: ['common.blocks', 'project.blocks'], index: 'index.html'
},
    html2bl = require('html2bl').files(params);

html2bl.then(function(files) {
    // your logic here
})
.done()
```
