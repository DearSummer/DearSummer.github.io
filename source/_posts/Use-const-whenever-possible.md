---
title: Use const whenever possible
date: 2019-04-03 20:40:34
tags:
- c++
---

{% asset_img cpp.jpg  %}

Effective CPP Chapter 1 

<!-- more -->

------

> Use Const Whenever Possible
>
> ​										----- effective cpp



最近在Effective Cpp一书当中看到了一些关于`const`的用法，深有体会。

## Const基本操作

首先还是介绍一下一些关于const的基本操作

```cpp
const char *p = greeting    //non-const pointer,const data
char* const p = greeting    //const pointer,non-const data

const char* const p = greeting //both
```

简单来说就是在星号左边的`const`表示修饰指针所指的为常量，而星号右边的`const`修饰的就是指针本身

除此之外还有些有基本的关于`const`的`STL`操作，比如

```cpp
const std::vector<int>::iterator iter // like T* const
std::vector<int>::const_iterator iter // like const T*
```

不过，让我比较深刻的还是将`const`应用在函数身上的操作

## Const Member Function

### operator * ...

首先就是例如这样的

```cpp
class Rational{...};
const Rational operator *(const Rational& r,const Rational& l);
```

使用`const`可以有效的避免了一些诸如

```cpp
Rational a,b,c;
(a + b) = c;

if(a + b = c){...}
```

之类的看上去就很蠢的错误。因此当你这样写的时候，编译器是会报错的，那样你就可以很快的发现问题所在，而若那个乘法的返回值没有`const`的话，那么，他将会默认调用了`operator =`的操作（假如有的话），而这个时候，编译器是不会报错的，那么这些很蠢的问题可能要在很久之后才能发现。

### operator[] ...

现在我有一个类`TextBlock`

```cpp
class TextBlock
{
	std::string text;
public:
	explicit TextBlock(const char* t) { text = std::string(t); }

	const char&operator[](size_t p) const
	{
		return text[p];
	}
	char &operator[](size_t p) {
		return text[p];
	}
};

......
    
TextBlock tb("hello");
const TextBlock ctb("hi");

cout << tb[0];
cout << ctb[0];
```

在这里，带有const的ctb调用的是带有const的operator[],而没带const的tb调用的则是没有const的operator[],因此，tb[0]是可以赋值的而ctb[0]是不可以的。

在这里，effective cpp讨论了一些关于const的问题，即是，bitwise constness与logical constness

### bitwise constness

位常量性，指的是对形如`const char& operator[](size_t p) const`这些常量函数的描述。

在c++当中，当函数被声明了常量之后，那么这个函数意味着不会对成员变量进行修改，而这些不修改在c++编译器当中即是代表着，一个位都不会有变化，从编译器的角度来说，这是一件很容易确定的事，因此他只需要注意在函数内对成员变量没有任何一个位的修改就可以了。

而c++里面对常量的定义确实就是位常量。

但是，这并不代表成员变量一定是无法被修改的。例如

```cpp
class C_TextBlock
{
	char* pText;
public:
	explicit C_TextBlock(const char* t)
	{
		pText = new char[10];
		strcpy(pText, t);
	}

	char&operator[](size_t p) const
	{
		return pText[p];
	}

};

........
    
const C_TextBlock cctb("Hello");
char *pc = &cctb[0];
*pc = 'J';
```

这样，cctb[0]里面的字母就被替代成了J了。

因此，这里虽然声明了const变量但是调用的函数仅仅是const 成员函数，返回值并不是const的，因此，这里的变量仍然可以被修改。

### logical constness

逻辑常量性，我们可以认为，我们是可以修改成员变量的，但是，对于客户端来说，无法察觉到这些变化，因此，从逻辑上来说，这是常量。

在effective cpp当中举了一个例子

```cpp
class C_TextBlock
{
	char* pText;
    size_t textLength;
    bool lengthValid;
public:
	explicit C_TextBlock(const char* t)
	{
		pText = new char[10];
		strcpy(pText, t);
	}
    
    size_t length() const
    {
        if(!lengthValid)
        {
            textLength = strlen(pText);
            lengthValid = true;
        }
        return textLength;
    }

	char&operator[](size_t p) const
	{
		return pText[p];
	}

};
```

但是`length()`修改了成员函数，也就是违背了位常量性，那么这个代码将不会被编译了，那应该怎么解决呢？在c++当中有一个很简单的解决方案。那就是关键字`mutable`，这个关键字让一个非静态的变量免于位常量性的约束

```cpp
size_t textLength; -> mutable size_t textLength;
bool lengthValid; -> mutable bool lengthValid;
```

### avoding duplication in const and non-const

最后一点则是对const与non-const之间的函数的封装。

由于为了保持变量的常量的属性，那么在一些地方自然就要写上const与non-const的版本，但是这些版本的代码都是相似的。要是使用大量的复制的方法，那么也就有点蠢蠢的感觉（当代码重复变多的时候），这个时候我们是可以使用复用方法的。

```cpp
class C_TextBlock
{
	char* pText;
public:
	const char&operator[](size_t p) const
	{
        //假如里面要加入边界检测之类的乱七八糟的东西
        //那么这里将会多很多内容
        .......
		return text[p];
	}

	char&operator[](size_t p) const
	{
        //这里也会多很多相似的内容
        .......
		return pText[p];
	}

};
```

当然我们可以用封装的方法，将相似的内容封装出来，然后，分别调用方法，但是，这也是需要复制一行的，那么有没有不需要复制的方法呢？当然有啦。

```cpp
class TextBlock
{
	std::string text;
public:
	explicit TextBlock(const char* t) { text = std::string(t); }

	const char&operator[](size_t p) const
	{
		return text[p];
	}
	char &operator[](size_t p) {
		return const_cast<char &>(
			static_cast<const TextBlock&>(*this)[p]);
	}
};
```

总所周知，想要调用带有const返回参数的方法就需要const的变量，那么我们可以将`*this`转化为const的，而从non-const转换为const是一种安全的转换，我们完全不用担心问题，而得到的结果自然是调用了`const char& operator[](size_t p) const`，因此我们需要使用`const_cast<char&>`去消除const，这样，我们复用的目的就达成了。

当然，像是例子这样的函数不去使用这种方法也是没有关系的，毕竟都是很简单的，但是知道这种方法还是很重要的。

当然，知晓这种方法的好处自然不单纯是在于写const与non-const版本的时候减少代码的复制量。

这里的核心思想在于，const变量承诺了成员变量的不变性，而non-const则是不会有这种承诺的。那么，如果我们想要从non-const方法中获取const变量，则需要自己承担不改变对象的风险，这也是为什么直接调用non-const方法赋值到const变量会出现错误的原因。因此我们只能使用`const_cast`去为其赋予const属性。

而相反的操作却是安全的，因此non-const方法并没有对变量进行约束，因此我们从const方法中获取的东西是没有任何问题的。

这也是`operator[]`方法当中为什么可以使用`static_cast`与`const_cast`方法进行转换从而达成复用的原因。（毕竟是安全的转换）

## Thing to Remember

> 