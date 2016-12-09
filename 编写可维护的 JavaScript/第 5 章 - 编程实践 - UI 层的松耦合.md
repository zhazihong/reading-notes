# 第 5 章 - 编程实践 - UI 层的松耦合

在实际场景中，CSS 和 JavaScript 更像是兄弟关系而非依赖关系。一个页面很可能只有 HTML 和 CSS 而没有 JavaScript，同样，一个页面也可以只有 HTML 和 JavaScript 而没有 CSS。（解耦）

## 5.1 什么是松耦合

**当你能够做到修改一个组件而不需要更改其他的组件时，你就做到了松耦合。**（这里的组件理解更倾向于 HTML、JavaScript 以及 CSS）

如果一个 Web UI 是松耦合的，则很容易调试。和文本或结构相关的问题，通过查找 HTML 即可定位。当发生了样式相关的问题，你知道问题出现在 CSS 中。最后，对于那些行为相关的问题，你直接去 JavaScript 中找到问题所在，这种能力是 Web 界面的可维护性的核心部分。


## 5.2 将 JavaScript 从 CSS 中抽离

避免使用 CSS 表达式。（IE 9 不再支持）


## 5.3 将 CSS 从 JavaScript 中抽离

```javascript
// 不好的写法
element.style.color = "red";

// 不好的写法
element.style.cssText = "color: red; left: 10px; top: 100px";
```

将 CSS 从 JavaScript 中抽离意味着所有的样式信息都应当保持在 CSS 中。当需要通过 JavaScript 来修改元素样式的时候，**最佳方法是操作 CSS 的 className**。

比如，我想在页面中显示一个对话框，在 CSS 中的样式定义是像下面这样的：

```css
.reveal {
  color: red;
  left: 10px;
  top: 100px;
}
```

然后，用 JavaScript 将样式添加至元素。

```javascript
// 好的写法，原生方法
element.className += " reveal";

// 好的写法，HTML5
element.classList.add("reveal");

// 好的写法，jQuery
$(element).addClass("reveal");
```

**JavaScript 不应当直接操作样式，以便保持和 CSS 的松耦合。**

不过也有例外，有一种使用 style 属性的情形是可以接受的：当你需要给页面中的元素做定位，使其相对于另外一个元素或整个页面重新定位。这种计算是无法在 CSS 中完成的，因此这时是可以使用 style.top、style.left、style.bottom 和 style.right 来对元素做正确定位的。在 CSS 中定义这个元素的默认属性，而在 JavaScript 中修改这些默认值。


## 5.4 将 JavaScript 从 HTML 中抽离

在 HTML 代码中，不应当直接给 on 属性挂载事件处理程序。

**最好将所有的 JavaScript 代码都放入外置文件中**，以确保在 HTML 代码中不会有内联的 JavaScript 代码。这样做的原因是出于紧急调试的考虑。当 JavaScript 报错，你的下意识的行为应当是去 JavaScript 文件中查找原因。如果在 HTML 中包含 JavaScript 代码，则会阻断你的工作流。


## 5.5 将 HTML 从 JavaScript 中抽离

在 JavaScript 中使用 HTML 的情形往往是给 innerHTML 属性赋值时。

JavaScript 通常用来修改 UI，必然需要通过 JavaScript 向页面插入或者修改标签。有多种方法可以以低耦合的方式完成这项工作。

### 5.5.1 方法 1：从服务器加载

第一种方法是将模板放置于远程服务器。

文中举的例子是 AJAX 请求服务端，然后接收到 HTML 拼接成的字符串，然后在客户端用 innerHTML 渲染上去，相当于一个后台请求页面直出的概念。当然，服务端的工作，可以用一些类似 smarty 的模板减少工作量（将模板放置于远程服务器）。

但是这不是真正意义上的前后端分离，更优雅的做法是把数据渲染交给前端，使用前端模板引擎。

### 5.5.2 方法 2：简单客户端模板

自己实现一个简单的客户端模板，可以参考 [Underscore.template](https://github.com/hanzichi/underscore-analysis/issues/26)

对于简单的 DOM 结构渲染，Underscore.template 完全够用了。

### 5.5.3 复杂客户端模板

之前在写 [浅谈 Web 中前后端模板引擎的使用](https://github.com/hanzichi/underscore-analysis/issues/25) 一文时，也简单调研了几个流行的前端模板引擎，综合考虑，如果有需要，决定启用 Handlebars（毕竟支持 IE6，虽然某些地方有坑待填）

---

2016.11.25 add：好尴尬，刚决定在项目中使用 Handlebars，就碰到了问题。如果是简单的单页，应该没有什么问题，坑爹的是页面是 PHP 生成的，就像那种新闻列表详情页，非常多不可能一个个写，然后这边是用 smarty 生成。然后决定做半个前后端分离，在 tpl 中放前端模板，渲染页面需要的数据，smarty 相当于只是生成一个静态页面。但是 smarty 和 Handlebars 都用的是 `{{}}`，虽然 smarty 是可以替换的，但是代码涉及的地方比较多，就考虑 Handlebars 方来做通配符的替换，但是坑爹的是，居然不能替换！[How to change the default delimiter of Handlebars.js?](http://stackoverflow.com/questions/14324850/how-to-change-the-default-delimiter-of-handlebars-js)（Google handlebars delimiter）

解决方法貌似不少，不想折腾了，直接上了 Underscore.template。

## 5.6 将 CSS 从 JavaScript 中抽离

书中并没有本节，但是却是我在工作中真实遇到过的，故记之。

有的时候，我们需要动态生成样式（字符串），然后插入页面。

```javascript
function loadStyleString(css) {
  var style = document.createElement("style");
  style.type = "text/css";
  try {
      style.appendChild(document.createTextNode(css));
  } catch (ex) {
      style.styleSheet.cssText = css;
  }
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
}
```

其实这个场景和上一小结「将 HTML 从 JavaScript 中抽离」类似，也可以用前端模板来解决。

那么，什么时候会用到动态生成样式表呢？比如我们需要一个可定制的页面，页面的一些样式可定制，通过 JavaScript 我们可以动态生成样式字符串。
