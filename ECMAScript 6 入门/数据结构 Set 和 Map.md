# 数据结构 Set 和 Map

## Set

```javascript
// 可以接受数组或者类数组作为参数初始化
let s = new Set();

// add
[1, 2, 3, 4, 3, 2, 1].forEach(x => s.add(x));

console.log(s.size); // 4

// delete
let isDeleted = s.delete(4);
console.log(isDeleted); // true

// has
let hasFour = s.has(4);
console.log(hasFour); // false

// Set -> Array
// 方法一
let a = [...s]; // [ 1, 2, 3 ]
// 方法二
let b = Array.from(s); // [ 1, 2, 3 ]

// 遍历
// 以下前三种遍历方式效果一致
// 因为 Set 的 key 和 value 可以看做一致
for (let item of s) {
  console.log(item);
}
// 1
// 2
// 3

for (let item of s.keys()) {
  console.log(item);
}

for (let item of s.values()) {
  console.log(item);
}

for (let item of s.entries()) {
  console.log(item);
}
// [ 1, 1 ]
// [ 2, 2 ]
// [ 3, 3 ]

// clear
s.clear();
console.log(s.size); // 0
```

## Map

```javascript
// Map 可以接受一个数组作为参数
// 该数组的成员是一个个表示键值对的数组
let m = new Map([
  ['kobe', 1996],
  ['kidd', 1994],
  ['wade', 2003],
  ['yao', 2002]
]);

// set
m.set('yi', 2007);

// get
console.log(m.get('kidd')); // 1994
console.log(m.get('bird')); // undefined

// delete
let isDeleted = m.delete('wade');
console.log(isDeleted); // true

// has
console.log(m.has('wade')); // false

console.log(m.size); // 4

// 遍历
for (let item of m.entries()) {
  console.log(item);
}
// [ 'kobe', 1996 ]
// [ 'kidd', 1994 ]
// [ 'yao', 2002 ]
// [ 'yi', 2007 ]

for (let item of m) {
  console.log(item);
}
// 输出同上

for (let [key, value] of m) {
  console.log(key, value);
}
// kobe 1996
// kidd 1994
// yao 2002
// yi 2007

for (let key of m.keys()) {
  console.log(key);
}
// kobe
// kidd
// yao
// yi

for (let value of m.values()) {
  console.log(value);
}
// 1996
// 1994
// 2002
// 2007

// Map -> Array
console.log([...m])
// [ [ 'kobe', 1996 ],
//   [ 'kidd', 1994 ],
//   [ 'yao', 2002 ],
//   [ 'yi', 2007 ] ]

console.log([...m.keys()]);
// [ 'kobe', 'kidd', 'yao', 'yi' ]

console.log([...m.values()]);
// [ 1996, 1994, 2002, 2007 ]

m.clear();
console.log(m.size); // 0
```
