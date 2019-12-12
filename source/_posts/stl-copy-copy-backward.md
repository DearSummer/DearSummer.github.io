---
title: 'stl:copy/copy_backward'
tags:
  - stl
abbrlink: fffcaacd
date: 2019-12-12 16:41:05
---

copy(first,last,result)
copy_backward(first,last,result);

<!-- more -->

------

## copy

在stl当中，copy是从前往后拷贝的，也就是说
```cpp
for(;first != last;++first)
	*result = *first;
```
大致是这种形式的，因此，当result的头部区域处于`[first,last)`之间的时候，就会有可能出现拷贝出错的情况。
比如
```
0 1 2 3 4 5 6
  |   | |
 first| last
     result
```

这种情况，在first还没遍历到3之前，3已经作为result被修改了，因此，会出现拷贝出错的情况。但是，之所以说是可能出现出错的情况，是因为，copy进行了大量的泛化，特化与强化的工作，因此，也有可能不会有问题。

在copy当中，为了保证效率的最高，它将拷贝的操作分为两种可能，一种是对`char*/wchar_t*`进行的操作，另一种是非`char*/wchar_t*`进行的操作。当类型推导推导出这个特化的类型的时候，它就会调用`memmove()`来进行拷贝，这是一个很快的底层拷贝操作

```cpp
//对于wchar_t*也一样（利用函数的重载的功能）
inline char* copy(const char* first,const char* last,const char* result)
{
	memmove(result,first,last - first);
	return result +(last - first);
}
```

而对于非字符指针之外的操作，就是完全的泛化的操作
```cpp
template<class InputIterator,class OutputIterator>
inline OutputIterator copy(
	InputIterator first,InputIterator last,OutputIterator result)
{
	return __copy_dispatch<InputIterator,OutputIterator>()
		(first,last,result);
}
```

当然，虽然是泛化的版本，但是，在这里对于不同的Iteraotr也是进行不同的特化的操作的，当迭代器为指针类型，也就是说要对指针进行操作的时候，那就要看这个指针有没有*trivial operator=*当存在着支持这种原生的指针操作的时候，自然也要使用效率极高的`memmove()`了。不然，就是用复制的强化版操作，因此，当你自定义了指针赋值操作后，我们是不知道你要怎么对对象进行赋值的，因此，直接拷贝内存这种粗暴的方式自然是不可行的。

假如，迭代器不是指针类型，那就同样要看这个迭代器的类型是怎么样的了，假如这个迭代器是随机访问的迭代器，那就说明能够很简单的求得拷贝区域的长度，因此，也可以使用强化版本，不然，那就只能使用最简单的也是最慢的最泛化的版本了。

```cpp
//利用了仿函数进行内容的特化，根据萃取出的不同的iterator来进行不同的操作
template<class InputIterator,class OutputIterator>
struct __copy_dispath
{
	OutputIterator operator()(
		InputIterator first,InputIteratorlast,OutputIterator result)
	{
		return __copy(first,last,result,iterator_category(first));
	}
}

```

首先看看的是泛化的版本，也就是根据不同的iterator来进行强化的copy方式

```
template<class InputIterator,class OutputIterator>
inline OutputIterator __copy(
	InputIterator first,InputIterator last,
	OutputIterator result,input_iterator_tag)
{
	for(;first != last;++result,++first)
		*result = *first;
	return result;
}

template<class RandomAccessIterator,class OutputIterator>
inline OutputIterator __copy(
	RandomAccessIterator first,RandomAccessIterator last,
	OutputIterator result,random_access_iterator_tag)
{
	return __copy_d(first,last,result,distance_type(first));
}

template<class RandomAccessIterator,class OutputIterator,class Distance>
inline OutputIterator __copy_d(
	RandomAccessIterator first,RandomAccessIterator last,
	OutputIterator result,Distance *)
{
	for(Distance n = last - first;n > 0;--n,++result,++first)
		*result = *first;
	return result;
}

```

而RandomAccessIterator比较快的原因，大致就是因为不用一直对比迭代器，因此就避免了大量访问迭代器的时间。

之后，就是对于指针类型的强化了。

```cpp
template<class T>
struct __copy_dispath<T*,T*>
{
	T* operator()(T* first,T*,T* result)
	{
		typedef typename __type_traits<T>::has_trivial_assignment_operator t;
		return __copy_t(first,last,result,t());
	}
}

//第一个参数为const的版本
template<class T>
struct __copy_dispath<const T*,T*>
{...}
```

由于要分为是否有*trivial operator=*，因此，在调用的时候，就先萃取出了t，来判断有没有原生的指针，然后，根据不同的类型来进行不同的拷贝操作

```cpp
template<class T>
inline T* __copy_t(const T* first,const T* last,const T* result,__true_type)
{
	memmove(result,first,sizeof(T) * (last - first));
	return first +(last - first);
}

template<class T>
inline T* __copy_t(const T* first,const T* last,const T* result,__false_type)
{
	return __copy_d(first,last,result,(ptrdiff_t*)0);
}

```

在此，copy的所有操作都进行了尽可能的优化了

## move_backward

move_backward的优化方式与copy是完全一样的。而它的拷贝方式则是与copy相反，它是从尾到头开始拷贝的
```cpp
--last;
for(;first != last;--last,--result)
	*result = *last;
```

因此，假如拷贝区间的尾部处于`[first,last)`之间的话，拷贝就有可能出错

```
0 1 2 3 4 5 6
| |   | |
|first| last
result|
```

假如result的区间是`[0,3)`，当从last开始拷贝的时候，就已经破坏了`[first,last)`还未拷贝的地方，因此，有可能会出错

当然，当时用`memmove()`的时候是不会出错的。

- 参考资料《stl源码剖析》
