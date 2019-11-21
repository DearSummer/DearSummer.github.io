---
title: 'sort:冒泡排序不得不说的秘密?'
tags:
  - algorithm
photos: 
  https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574348320955&di=321b2b3f4851e51e96490420e594720d&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F51e15d8fb5f68065873bd4bbbd7f20314c8b85e1565f5-SjdKM0_fw658
abbrlink: b446b6c0
date: 2019-11-21 20:07:44
---

你知道冒泡排序有几种写...咳咳...优化方法吗

<!-- more -->

------

## 冒泡冒泡冒

从数组头到为，每一对(n,n+1)的元素，若位置不对，就交换之，重复n遍，元素会慢慢漂浮到正确的位置，如同碳酸饮料中的气泡一样。顾名思义，冒泡排序

**普通的冒泡排序**

这个就是很常规的方式🌶

```cpp
for(int i = 0;i < nums.size();i++)
    for(int j = 0;j < nums.size() - 1;j++)
	if(nums[j] > nums[j+1])
	    swap(nums[j],nums[j+1];
			
```


虽然说，冒泡排序是一个平均时间复杂度为O(n^2)的算法，不过他的最好时间复杂度是O(n)。在面对大量有序的情况下，他还是比较快的。

那么，首先就是第一步，假如有这么一个序列

```
2 1 3 4 5 6 7 8
```

实际上，只要进行一次交换(2,1)交换，就能够得到一个有序的数组了，但是，按照常规的方式，却还是要跑完全程才能解决。而剩下的循环是不必须的，因此，我们可以让他尽早的跳出循环(当数组有序的时候，就结束循环)

```cpp
bool sorted;
for(int i = 0;i < nums.size();i++)
{
    sorted = true;
    for(int j = 0;j < nums.size() - 1;j++)
        if(nums[j] > nums[j+1])
	{    
            swap(nums[j],nums[j+1];
            sort = false;
        }

    if(sorted)
       break;
}

```

添加一个标志位，从而使其能够早早跳出不必要的循环

ver1的确确实实优化了冒泡排序，虽然还是O(n^2)是改不了的。

然后我们再看看以下这个情况

```
4 3 2 1 5 6 7 8
```

在这个序列当中，5...8明显是不需要排序的，但是，我们还是要去对他进行对比，这也是一些不必要的操作，既然这样，我们为何不优化他呢？让我们看看冒泡排序ver2


```cpp
bool sorted;
int unorderBorder = nums.size() - 1;
for(int i = 0;i < nums.size();i++)
{
    sorted = true;
    int lastExchange = 0;
    for(int j = 0;j < unorderBorder;j++)
        if(nums[j] > nums[j+1])
	{    
            swap(nums[j],nums[j+1];
            sort = false;
            lastExchange = j;
        }
    
    unorderBorder = lastExchange;
    if(sorted)
       break;
}
```

我们使用一个变量去确认未排序边界到底在哪里，那么最后一个被交换的元素的位置，自然就是最后一个无序元素的地址了，这样我们就可以找到无序元素的边界，从而让排序算法只在无序元素当中处理。

这些优化方法，在大量数据都是有序的时候都是比较有用的(毕竟冒泡排序也只是在大量有序的情况下才会展示其优势嘛)


## 鸡尾酒排序

鸡尾酒排序其实就是冒泡排序的一种优化，本质上还是冒泡排序。

他的算法思路就是从右往左进行了一次冒泡之后，我就从左往右再进行一次排序，这样最小和最大的元素实际上就已经分开完毕了。可能就是这在左往右倒，右往左倒的方式，和调酒有点相似吧，因此，这个算法就叫作鸡尾酒排序。


和上面的ver1,ver2一样，鸡尾酒排序其实也是为了解决一种在大量有序的情况下的性能比较低的场景而出现的，让我们看看以下的数组

```
2 3 4 5 6 7 8 1
```

按照，之前的冒泡排序，这个1要回到正确的位置，那可必须要跑完n*n的完整的算法才能回归到正确的位置。这自然是很不合算的。那么，鸡尾酒排序就展现了其优势了，先从左到右排好，然后右往左一下，1就回归了，再根据之前ver1,ver2的优化，这个数组就不用再排序了，算法就跳出来了。

```cpp

        bool sorted;
        int unorderLeftBorder = 0,unorderRightBorder = nums.size() - 1;
        int lastLeftExchange = 0,lastRightExchange = nums.size() - 1;
        for(int i = 0;i < nums.size() / 2;i++)
        {
            sorted = true;

            for(int j = unorderLeftBorder;j < unorderRightBorder;j++)
            {
                if(nums[j] > nums[j + 1])
                {
                    swap(nums[j],nums[j + 1]);
                    sorted = false;
                    lastRightExchange = j;
                }
            }

            if(sorted)
                break;

            sorted = true;
            unorderRightBorder = lastRightExchange;
            for(int j = unorderRightBorder;j > unorderLeftBorder;j--)
            {
                if(nums[j - 1] > nums[j])
                {
                    swap(nums[j - 1],nums[j]);
                    sorted = false;
                    lastLeftExchange = j;
                }
            }
            
            unorderLeftBorder = lastLeftExchange;
            if(sorted)
                break;
        }
```

在大量数据有序的情况下，这个方式确实是比冒泡排序优良不少

