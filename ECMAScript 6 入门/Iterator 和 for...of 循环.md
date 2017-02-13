# Iterator 和 for...of 循环

## 1. Iterator（遍历器）的概念

Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排序；三是 ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费。

Iterator 的遍历过程是这样的。

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

在 ES6 中，有些数据结构原生具备 Iterator 接口（比如数组），不用任何处理就能被 for...of 遍历，有些就不行（比如对象）。原因在于，这些数据结构原生部署了 Symbol.iterator 属性，另外一些数据结构没有。
凡是部署了 Symbol.iterator 属性的数据结构，就称为部署了遍历器接口。

## 2. 数据结构的默认 Iterator 接口

当使用 for...of 循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是 "可遍历的"（iterable）。

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，**一个数据数据结构只要具有 Symbol.iterator 属性，就可以认为是 "可遍历的"（iterable）**。Symbol.iterator 属性本身是一个函数，**就是当前数据结构默认的遍历器生成函数**。执行这个函数，就会返回一个遍历器。

在 ES6 中，有三类数据结构原生具备 Iterator 接口：数组、某些类数组、Set 和 Map。

```javascript
let arr = ['a', 'b', 'c'];

// 执行这个函数，就会返回一个遍历器
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

对于某些类数组，部署 Iterator 接口，有一个简便方法，就是 Symbol.iterator 直接引用数组的 Iterator 接口。

```javascript
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

## 3. 调用 Iterator 接口的场合

**（1）解构赋值**

```javascript
let set = new Set().add('a').add('b').add('c');

let [x, y] = set;
console.log(x, y); // a b

let [first, ...rest] = set;
console.log(first, rest);
// a ['b', 'c']
```

**（2）扩展运算符**

```javascript
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

**实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组**。

**（3）yield***

yield\* 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

## 4. 字符串的 Iterator 接口

字符串是一个类似数组的对象，也原生具有 Iterator 接口。

```javascript
var someString = "hi";
typeof someString[Symbol.iterator]
// "function"

var iterator = someString[Symbol.iterator]();

iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
```

所以字符串可以用 for...of 遍历。

```javascript
let str = 'hello';
for (let letter of str) {
  console.log(letter);
}
// h
// e
// l
// l
// o
```

## 5. Iterator 接口与 Generator 函数

Symbol.iterator 方法的最简单实现，还是使用 Generator 函数。

```javascript
var myIterable = {};

myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
console.log([...myIterable]);
// [1, 2, 3]


// 或者采用下面的简洁写法
let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// hello
// world
```

## 6. 遍历器对象的 return(), throw()

遍历器对象除了具有 next 方法，还可以具有 return 方法和 throw 方法。

return 方法的使用场景是，如果 for...of 循环提前退出（通常是因为出错，或者有 break 语句或者 continue 语句），就会
在内部调用 return 方法。

```javascript
let arr = [0, 1, 2, 3, 4];

for (let item of arr) {
  if (item === 2)
    break; // 在内部调用 return 方法
  console.log(item);
}
// 0
// 1
```
throw 方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法。


## 7. for...of 循环

一个数据结构只要部署了 Symbol.iterator 属性，就被视为具有 iterator 接口，就可以用 for...of 循环遍历它的成员。也就是说，for...of 循环内部调用的是数据结构的 Symbol.iterator 方法。

for...of 循环适用于数组、Set 和 Map、某些类似数组的对象（arguments、NodeList）、Generator 对象，以及字符串。

