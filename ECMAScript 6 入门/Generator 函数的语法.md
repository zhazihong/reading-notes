# Generator 函数的语法

## 1. 简介

### 基本概念

**执行 Generator 函数会返回一个遍历器对象**，返回的遍历器对象（其实就是 Iterator Object），可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。一是 function 关键字和函数名之间有一个星号；二是函数内部使用 yield 语句，定义不同的内部状态。

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

每次调用 next 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 yield 语句（或 return 语句）为止。换言之，Generator 函数是分段执行的，**yield 语句是暂停执行的标记，而 next 方法可以恢复执行**。

### yield 语句

由于 Generator 函数返回的遍历器对象，只有调用 next 方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield 语句就是暂停标志。

遍历器对象的 next 方法的运行逻辑如下：

1. 遇到 yield 语句，就暂停执行后面的操作，并将紧跟在 yield 后面的那个表达式的值，作为返回的对象的 value 属性值。
2. 下一次调用 next 方法时，再继续往下执行，直到遇到下一个 yield 语句。
3. 如果没有遇到新的 yield 语句，就一直运行到函数结束，直到 return 语句为止，并将 return 语句后面的表达式的值，作为返回的对象的 value 属性值。
4. 如果该函数没有 return 语句，则返回对象的 value 属性值为 undefined。

### 与 Iterator 接口的关系

任意一个对象的 Symbol.iterator 方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的 Symbol.iterator 属性，从而使得该对象具有 Iterator 接口。

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

## 2. next 方法的参数

yield 语句本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，**该参数就会被当做上一个 yield 语句的返回值**。

```javascript
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

注意，next 方法带的参数会被当做 **上一个** yield 语句的返回值，所以第三次 g.next() 带的参数 true 会被当做第二个 yield 语句的返回值，所以第三次调用 g.next() 时，此时reset 变量为 true（变量值为上一个 yield 语句的返回值，即为 true），进入 if 语句，i 被赋值为 -1，然后回到 for 循环语句，i++ 后 i 为 0，所以 yield 语句后跟的 i 应该是 0。

再看个例子：

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

注意，由于 next 方法的参数表示上一个 yield 语句的返回值，所以第一次使用 next 方法时，不能带有参数（V8 会直接忽略）。

## 3. for...of 循环

for...of 循环可以自动遍历 Generator 函数生成的 Iterator 对象（内部实现其实就是调用 next 方法）。

```javascript
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

需要注意的是，一旦 next 方法的返回对象的 done 属性为 true，for...of 循环就会中止，所以上面代码的 return 语句后返回的 6，不包括在 for...of 循环之中。

下面是一个利用 Generator 函数和 for...of 循环，实现斐波那契数列的例子。

```javascript
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

除了 for...of 循环以外，扩展运算符（...）、解构赋值和 Array.from 方法内部调用的，都是遍历器接口。**这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数**。

```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

## 4. Generator.prototype.throw()

略

## 5. Generator.prototype.return()

略

## 6. yiled* 语句

如果在 Generator 函数内部，调用另一个 Generator 函数，默认情况下是没有效果的。

```javascript
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  foo();
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "y"
```

**这就需要用到 yield*  语句，用来在一个 Generator 函数里面执行另一个 Generator 函数**。从语法角度看，如果 yield 命令后面跟的是一个遍历器对象，需要在 yield 命令后面加上星号，表明它返回的是一个遍历器对象。

```javascript
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

yield* 后面的 Generator 函数（没有 return 语句时），等同于在 Generator 函数内部，部署一个 for...of 循环。

```javascript
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于
function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

**实际上，任何数据结构只要有 Iterator 接口，就可以被 yield* 遍历**。

如果 yield* 后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。

```javascript
function* gen(){
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }
```

字符串具有 Iterator 接口，所以被 yield* 遍历。

```javascript
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"
```

**如果被代理的 Generator 函数有 return 语句，那么就可以向代理它的 Generator 函数返回数据**。

```javascript
function *foo() {
  yield 2;
  yield 3;
  return "foo";
}

function *bar() {
  yield 1;
  var v = yield *foo();
  console.log( "v: " + v );
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

yield* 命令可以很方便地取出嵌套数组的所有成员。

```javascript
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
// a
// b
// c
// d
// e
```

## 7. 作为对象属性的 Generator 函数

如果一个对象的属性是 Generator 函数，可以简写成下面的形式。

```javascript
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
```

它的完整形式如下：

```javascript
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

## 8. Generator 函数的 this

略

## 9. 含义

略

## 10. 应用

Generator 可以暂停函数执行，返回任意表达式的值。这种特点使得 Generator 有多种应用场景。

### 异步操作的同步化表达

Generator 函数的暂停执行的效果，意味着可以把异步操作写在 yield 语句里面，等到调用 next 方法时再往后执行。所以，Generator 函数的一个重要实际意义就是用来处理异步操作，改写回调函数。

Ajax 是典型的异步操作，通过 Generator 函数部署 Ajax 操作，可以用同步的方式表达。

```javascript
function* main() {
  // 把异步操作写在 yield 语句里面
  // 等到调用 next 方法时再往后执行
  var result = yield request("http://some.url");

  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
```

下面是另外一个例子，通过 Generator 函数逐行读取文本文件。

```javascript
function* numbers() {
  let file = new FileReader("numbers.txt");
  try {
    while(!file.eof) {
      yield parseInt(file.readLine(), 10);
    }
  } finally {
    file.close();
  }
}
```

### 控制流管理

如果有一个多步操作非常耗时，采用回调函数，可能会写成下面这样。

```javascript
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});
```

采用 Promise 改写。

```javascript
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // Do something with value4
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done();
```

Generator 函数可以进一步改善代码运行流程。

```javascript
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```

然后，使用一个函数，按次序自动执行所有步骤。

```javascript
// 参数为一个遍历器对象
// 可以在该对象上调用 next 方法
scheduler(longRunningTask(initialValue));

function scheduler(task) {
  // next 带参数，表示上个 yield 语句的返回值
  var taskObj = task.next(task.value);
  // 如果 Generator 函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task);
  }
}
```

注意，上面这种做法，只适合同步操作，即所有的 task 都必须是同步的。

利用 for...of 循环会自动依次执行 yield 命令的特性，提供一种更一般的流程管理的方法。

```javascript
let steps = [step1Func, step2Func, step3Func];

function *iterateSteps(steps){
  for (var i=0; i< steps.length; i++){
    var step = steps[i];
    yield step();
  }
}
```

上面代码中，数组 steps 封装了一个任务的多个步骤，Generator 函数 iterateSteps 则是依次为这些步骤加上 yield 命令。

最后，就可以用 for...of 循环一次性依次执行所有任务。

```javascript
for (let step of iterateSteps(steps)) {
  console.log(step.id);
}
```










