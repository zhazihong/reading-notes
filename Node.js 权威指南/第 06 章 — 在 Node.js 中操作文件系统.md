# 在 Node.js 中操作文件系统

## 对文件执行读写操作

假设有文件 a.txt，内容为 `hello world`

读文件：

```js
const fs = require('fs')

fs.readFile('a.txt', (err, data) => {
  console.log(data) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64 0a>
})

fs.readFile('a.txt', (err, data) => {
  console.log(data.toString()) // hello world
})

fs.readFile('a.txt', 'utf-8', (err, data) => {
  console.log(data) // hello world
})

fs.readFile('a.txt', {encoding: 'utf-8'}, (err, data) => {
  console.log(data) // hello world
})
```

写文件：

```js
const fs = require('fs')

let data = 'hello world'

// 基本写文件
fs.writeFile('b.txt', data, err => {
  if (err) console.log('写文件操作失败')
  else console.log('写文件操作成功')
})

// 追加数据
fs.writeFile('b.txt', data, {flag: 'a'}, err => {
  if (err) console.log('写文件操作失败')
  else console.log('写文件操作成功')
})

// 追加数据
fs.appendFile('b.txt', data, err => {
  if (err) console.log('追加文件操作失败')
  else console.log('追加文件操作成功')
})

// 复制文件（本质是先读再写）
fs.readFile('1.png', 'base64', (err, data) => {
  fs.writeFile('2.png', data, 'base64', err => {
    if (err) console.log('写文件操作失败')
    else console.log('写文件操作成功')
  })
})
```

从指定位置开始读写：

