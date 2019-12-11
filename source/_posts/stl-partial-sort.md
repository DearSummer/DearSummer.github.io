---
title: 'stl:partial_sort'
tags:
  - stl
  - algorithm
abbrlink: b0a82fc8
date: 2019-12-11 16:21:54
---

void partial_sort(first,middle,last);

<!-- more -->

------

在stl当中，`partial_sort(first,middle,last)`，是一个局部排序的算法，是从`[first,end)`的区间中对元素进行排序，最终使得`[first,middle)`中的元素为`[first,last)`当中的前k个。

这个问题其实就是从一个数组当中从小到大排序k个元素，与直接排列整个数组的`sort`不同，当k相较于数组长度n比较小的时候，这个排序将会比直接排序整个数组快很多。

实现这个排序的思路就在于维护一个最大堆
- 首先，建立一个从`[first,middle)`之间的元素的最大堆
- 然后，在`[middle,last)`区间中进行向后的扫描，当遇见一个比堆顶元素小的元素的时候，弹出堆顶元素并将这个新的元素加入到堆当中
- 最后，扫描完成后，堆中的元素最大的也是第k大的元素了，因此，对堆进行堆排序，从而实现`[first,middle)`之间的有序

首先，建立一个堆，以及对堆的插入的操作时间复杂度都是O(logk)的，扫描整个数组，因此是O(nlogk)，然后，要对堆内进行堆排序，因此整个算法的时间复杂度应该是O((n+k)logk),空间复杂度要维护整个堆k个元素，因此是O(k)

```cpp
template<class RandomAccessIterator>
inline void partial_sort(RandomAccessIterator first,
			RandomAccessIterator middle,
			RandomAccessIterator last)
{
	__partial_sort(first,middle,last,value_type(first));
}

template<class RandomAccessIterator,class T>
__partial_sort( RandomAccessIterator first,
		RandomAccessIterator middle,
		RandomAccessIterator last, T*);
{
	make_heap(first,middle);
	for(*i < *first)
		__pop_heap(first,middle,i,T(*i),distance_type(first));
	sort_heap(first,middle);
}
```


- 引用资料《stl源码剖析》
