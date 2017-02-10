# 函数的扩展 - rest 参数和扩展运算符

## rest 参数

ES6 引入了 rest 参数（形式为 "...变量名"），用于获取函数的多余参数，这样就不需要使用 arguments 对象了。rest 参数搭配的变量是一个**数组**，该变量将多余的参数放入数组中。

```javascript
function add(...values) {
  let sum = 0;

  for (let val of values)
    sum += val;

  return sum;
}

console.log(add(1, 2, 3)); // 6
```

rest 参数中的变量代表一个**数组**，所以数组特有的方法都可以用于这个变量。

```javascript
function push(array, ...items) {
  items.forEach(item => array.push(item));
  return array;
}

let ans = push([1, 2, 3], 4, 5, 6);
console.log(ans); // [ 1, 2, 3, 4, 5, 6 ]
```

值得注意的是，**rest 参数之后不能再有其他参数**。

```javascript
// 报错
function fn(a, ...b, c) {
  // ...
}
```

## 扩展运算符

扩展运算符（spread）是三个点（...），**将一个数组转为用逗号分隔的参数序列**。（反正只要认准 ... 后跟的都是数组就对了）

```javascript
console.log(...[1, 2, 3]) // 1 2 3
console.log(1, ...[2, 3, 4], 5) // 1 2 3 4 5
console.log([...document.querySelectorAll('div')]) // 将 NodeList 转为数组
```

一些应用：

```javascript
let a = [3, 2, 1];
Math.max(...a) // 3

let b = [5, 6, 7];
b.push(...a);

let c = [...a, ...b];

// 扩展运算符还可以将字符串转为真正的数组
// 这招略吊，比用 split() 和 Array.from() 方便好多
let str = 'hello';
let arr = [...str];
console.log(arr); // [ 'h', 'e', 'l', 'l', 'o' ]

// 将 NodeList 转为数组
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];
```
