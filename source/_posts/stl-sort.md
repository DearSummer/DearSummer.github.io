---
title: 'stl:sort'
tags:
  - stl
  - algorithm
  - sort
abbrlink: bb1dff1a
date: 2019-12-11 17:16:51
---

void sort(first,last)

<!-- more -->

------

在STL当中的sort的算法，并不是一个简单的单一的算法，是一个复合的算法，里面涵盖了堆排序，快速排序和插入排序

- 当数据量比较少的时候，快速排序体现不到其优势，而且会因为使用递归带来比较大的额外开销，因此使用的是插入排序
- 当数据量比较大的时候，就会使用快速排序。但是，快速排序有一个缺点，那就是当数据量大部分有序的时候，就会导致时间复杂度倾向于O(n^2)，因此，当时间复杂度有向O(n^2)倾斜的时候，就会改为使用堆排序，从而将时间复杂度最坏情况控制在O(nlogn)
- 再者，由于插入排序在大量元素有序的情况下，性能将会十分的好，因此，当快速排序到达"就差一点点就全部有序"的状态的时候，改为使用插入排序对元素进行最终的排序

因此，在stl当中的排序是这样的

```cpp
template<class RandomAccessIterator>
inline void sort(RandomAccessIterator first,RandomAccessIteratorlast)
{
	if(first != last)
	{
		__introsort_loop(first,last,value_type(first),__lg(last-first) * 2);
		__final_insertion_sort(first,last);
	}
}
```

其中，`__introsort_loop`就是之前所说的堆，快排，插入排序的复合排序了

首先，我们要知道，想要知道元素要多大才是快排，又要多大才是插入排序，我们就需要一个阈值,这个阈值是一个全局的变量`const int __stl_threshold = 16;`。首先，对元素进行数量上的检查，根据数量上的差别来判断是否使用快速排序。

第二点就是要检查元素是否是大部分有序的了。这个，我们可以从快排的分割上入手。因此，在理想情况下，快速排序每一次的分割都能很好的对半分层，因此，理论上在最好的情况下就需要分logn层，一旦元素大部分有序，就需要多很多次的分割，因此，我们可以为这个分割设定一个阈值，一旦超过这个阈值，就说明元素的排序并不是很理想，要使用堆排序了，这个阈值就是函数`__lg(size)`了

```cpp
template<class Size>
inline Size __lg(Size n)
{
	Size k;
	for(k = 0;n > 1;n >> 1) ++k;
	return k;
}
```
假设数组元素是40个，那么期望的分层就是5，那么我们对其的最大分割限制就是5*2;

```cpp
template<class RandomAccessIterator,class T，class Size>
void __introsort_loop(RandomAccessIterator first,RandomAccessIrerator last,T*,Size depth_limit)
{
	//在这里，利用了阈值很巧妙的将排序到"差一点就完成"的状态构建了出来
	while(last - first > __stl_threshold)
	{
		if(depth_limit == 0)
		{
			//这个就是堆排序
			partial_sort（first,last,last);
			return;
		}

		--depth_limit;

		//快排的partition，在这里使用的是三点分割
		//意思是，取piovt的时候，取第一个元素，最后一个元素，和中间的元素当中的中值当作piovit
		RandomAccessIterator cut = __unguarded_partition(
			first,last,
			T(__median(*first,*(first + (last - first) / 2),*(last - 1))));

		//先对右半边进行递归
		__introsort_loop(cut,last,value_type(first),depth_limit);

		//下一次就是对左半边了
		last = cut;	
	}
}

template<RandomAccessIterator>
void __final_insertion_sort(RandomAccessIterator first,RandomAccessIterator last)
{
	//假如元素数量小于阈值，直接插入排序，否则用插入排序为快排收尾
	if(last - first> __stl_threshold)
	{
		__insertion_sort(first,first + __stl_threshold);
		__unguarded_insertion_sort(first + __stl_threshold,last);
	}
	else
		__insert_sort(first,last);
}
```

- 参考资料《stl源码剖析》
