// generate README.md

let fs = require("fs");
let basePath = '编写可维护的 JavaScript';
let baseUrl = 'https://github.com/hanzichi/reading-notes/blob/master/编写可维护的%20JavaScript/';
let mdSrc = 'README.md';

let md = '# Reading Notes';
md += '\n\n';
md += '## 编写可维护的 JavaScript';
md += '\n\n';

fs.readdir(basePath, function(err, files) {
  files.forEach(function(fileName) {
    // console.log(fileName)
    md += '- [' + fileName + '](' +baseUrl + encodeURIComponent(fileName) + ')\n';
  });

  fs.writeFile(mdSrc, md);
});
