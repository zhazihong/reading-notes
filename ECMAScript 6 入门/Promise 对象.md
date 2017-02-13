# Promise 对象

## 1. Promise 的含义

Promise 对象有以下两个特点。

（1）对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：Pending（进行中）、Resolved（已完成，又称 Fulfilled）和 Rejected（已失败）。只有异步操作的结果，可以决定当前是哪种状态，任何其他操作都无法改变这个状态。

（2）一旦状态改变，就不会再变。任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 Pending 变为 Resolved 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了。

Promise 也有一些缺点。首先，无法取消 Promise，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。第三，当处于 Pending 状态时，无法得知目前进展到哪一个阶段。

## 2. 基本用法

Promise 对象本质是一个构造函数，用来生成 Promise 实例。

```javascript
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。它们是两个函数，resolve 函数的作用是，将 Promise 对象的状态从 Pending 变为 Resolve，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。reject 函数的作用是，将 Promise 对象的状态从 Pending 变为 Rejected，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise 实例生成后，可以用 then 方法分别指定 Resolved 状态和 Rejected 状态的回调函数（第二个可选）。

```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

值得注意的是，**Promise 新建后就会立即执行**。

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('Resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// Resolved
```

思考这样一个场景，有两个异步事件，异步事件二需要在异步事件一结束后调用，同时需要用到异步事件一的结果。因为用 "裸" 的 Promise 实例对象无法传递参数，所以我们一般可以把 Promise 实例放在一个函数中返回。

```javascript
let async1 = () => {
  let p1 = new Promise((resolve, reject) => {
    resolve(1);
  });
  return p1;
};

// 这样可以传递参数
// first 为前次异步操作的返回值
let async2 = (first) => {
  let p2 = new Promise((resolve, reject) => {
    resolve(first + 2);
  });
  return p2;
};

async1().then(data => {
  return async2(data);
}).then(data => console.log(data));

// 3
```

## 3. Promise.prototype.then()

then 方法返回的是一个新的 Promise 实例，因此可以采用链式写法，来解决传说中的 callback hell。

```javascript
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```
在 then 方法中，可以直接 return 数据而不是 Promise 对象，在后面的 then 中就可以接收到数据了。

## 4. Promise.prototype.catch()

catch 方法有两个作用，其一是可以代替 then 方法的第二个参数，其二是当 then 方法指定的回调函数抛出错误，会被 catch 方法捕获。

建议用 catch 方法来代替 then 方法中的第二个参数。

## 5. Promise.all()

略。

## 6. Promise.race()

略。

## 7. Promise.resolve()

有时需要将现有对象转为 Promise 对象，Promise.resolve 方法就起到这个作用。

Promise.resolve 等价于下面的写法。

```javascript
Promise.resolve('foo');

// 等价于
new promise(resolve => resolve('foo'));
```

## 8. Promise.reject()

Promise.reject(reason) 方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。

```javascript
var p = Promise.reject('出错了');

// 等同于
// var p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});

// 出错了
```
