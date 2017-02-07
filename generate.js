// to generate README.md

let fs = require("fs");
let basePath = '编写可维护的 JavaScript';
let baseUrl = 'https://github.com/hanzichi/reading-notes/blob/master/编写可维护的%20JavaScript/';
let mdSrc = 'README.md';

let md = '# Reading Notes';
md += '\n\n';
md += '## 编写可维护的 JavaScript';
md += '\n\n';

fs.readdir(basePath, function(err, files) {
  // 需要排序
  let res = [];

  files.forEach(function(fileName) {
    let pattern = /第 (\d+) 章/;
    let arr = pattern.exec(fileName);

    res.push({
      index: +arr[1],
      fileName: fileName.replace('.md', ''),
      fileUrl: baseUrl + encodeURIComponent(fileName)
    });
  });

  res.sort((a, b) => (a.index - b.index));

  res.forEach((item) => {
    md += '- [' + item.fileName + '](' + item.fileUrl + ')\n';
  });

  fs.writeFile(mdSrc, md, (err) => {
    if (err) throw err;
    console.log("Saved!");
  });
});
