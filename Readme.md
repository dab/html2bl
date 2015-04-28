## Html2Bl

Tiny little script for getting blocks dirs from HTML file with redefinition levels.

```js
var params = { levels: ['common.blocks', 'project.blocks'], htmlSrc: 'index.html'
},
    getFileNames = require('html2bl').getFileNames(params);

getFileNames.then(function(files) {
    // your logic here
})
.done()
```
