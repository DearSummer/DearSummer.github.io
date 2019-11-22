---
title: 'sort:简单易懂的快排'
tags:
  - algorithm
  - sort
photos: >-
  https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574400278624&di=c806ee53e33960d9c290adca308a8040&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201812%2F02%2F20181202185808_sxcuy.thumb.700_0.jpg
abbrlink: 1a46f86c
date: 2019-11-22 10:34:13
---

其实快排和冒泡有着这样那样的关系哦

<!-- more -->

------

快速排序，其实是从冒泡排序演变而来的一种算法，但是比冒泡排序高效的多，因此，就叫做快速排序了。

和冒泡排序的一轮只移动一个元素相比，快速排序使用了分治的思想，在每一轮都挑选一个基准元素，然后将比基准元素大的都放在基准元素的右边，比基准元素小的，都放在其左边，从而把数组分为两个部分。

在分治的思想下，每一轮数组都可以分成两个子数组，直到不可在分的时候，在平均情况下，需要分logn轮，也就是说，快速排序的平均时间复杂度是O(nlogn)

**确定基准元素**

那么，第一个问题就是基准元素怎么确定，一般来说，都是选择数组的第一个元素，也就是最左边的元素作为基准元素，不过会有以下的这种情况

```
8 7 6 5 4 3 2 1
```

那么，当我们每一次都选择最左边的元素作为基准元素的话，每一次都只能分割出`L[1],R[N-1]`两个数组，换句话说，就是一次只能确定一个元素的位置。这样，就和冒泡排序是一模一样的了，所以，在最坏情况下(逆序)快速排序的时间复杂度为O(n^2)。不过，在大量无序的情况下，这在情形出现的概率实在是太小了，因此，快速排序的平均时间复杂度仍然为O(nlogn)

不过，为了更好的避免这种情况，我们可以从数组当中随机选出一个数来作为基准值。

**构建快速排序**

按照快排的算法思路，我们可以大致的将快速排序的算法写出来，那么，唯一的问题就是分治是怎么做的了

```cpp
void quickSort(vector<int>& nums,int left,int right)
{
	if(left >= right)
		return;
	int index = partition(nums,left,right);
	
	quickSort(num,left,index -1);
	quickSort(num,index +1,right);
}
```

## partition

首先，在每一次的分治当中，我们就简单的取最左边的元素作为基准值了.

```cpp
piovt = num[left];
```
### 挖坑法

挖坑法，简单来说就是，对于每一次交换的时候都挖一个坑，下一次交换的时候将这个坑填上。

**step1**
首先，现找到基准元素，并记住其index，这就是一个坑。
**step2**
当右指针所指的元素比基准元素大的时候，右指针向左移动。当右指针所指位置比基准元素小的时候，就将右指针的数填入坑当中，并且，右指针所指位置就是新的坑
```cpp
num[index] = num[right];
index = right;
```
**step3**
当左指针所指元素比基准元素小的时候，左指针向右移动。当左指针所指位置比基准元素大的时候，就将左指针的数填入坑中，并且，左指针所在的位置就是新的坑
```cpp
num[index] = num[left];
index = left;
```
**step4**
最后的最后，那么，左右指针就会重叠在一起，这个时候退出循环并将基准值`piovt`赋予到最后一个坑当中(毕竟第一个坑的指本里就是基准元素的，这个时候要还回来)

这样，简单的快排分治的一轮就完成了。

```cpp

    int partition(vector<int>&num,int left,int right)
    {
        int pivot = num[left];
        int index = left;
        while(right > left)
        {
            while(right > left)
            {
                if(num[right] < pivot)
                {
                    num[index] = num[right];
                    index = right;
                    left++;
                    break;
                }
                right--;
            }
            
            while(left < right)
            {
                if(num[left] > pivot)
                {
                    num[index] = num[left];
                    index = left;
                    right--;
                    break;
                }
                left++;
            }
                   
        }

        num[index] = pivot;
        return index;
    }
```


### 指针交换法

指针交换法和挖坑法相比，就更加的直观暴力了，那就是，找到不符合要求的左边的元素和右边的元素，然后使其交换位置，直到两个指针重叠位置，这个时候，将基准元素赋予给这个中间位置。

**step1**
首先，现找到基准元素，并记住其值`pivot`
**step2**
当右指针所指的元素比基准元素大的时候，右指针向左移动。当右指针所指位置比基准元素小的时候，就停下来
```cpp
while(left < right && num[right] > pivot)
	right--;
```
**step3**
当左指针所指元素比基准元素小的时候，左指针向右移动。当左指针所指位置比基准元素大的时候，也停下来
```cpp
while(left < right && num[left] < piovt)
	left++;
```
**step4**
之后由于此时两边的指针都是指向不符合要求的元素，因此，交换其位置
```cpp
swap(num[left],num[right]);
```
**step5**
最后，两个指针重叠在一起了，就将基准元素赋予给他
```cpp
swap(num[left],num[pivotIndex]);
```

指针交换法就完成了
```cpp
    int partition(vector<int>& num,int left,int right)
    {
        int pivot = num[left];
        int startPoint = left;
        while(left != right)
        {
            while(left < right && num[right] >= pivot)
                right--;
            
            while(left < right && num[left] <= pivot)
                left++;

            if(left != right)
            {
                swap(num[left],num[right]);
            }
        }

        swap(num[left],num[startPoint]);
        return left;
    }
```

快速排序这种分而治之的思想其实和BST十分的相似，不过，说到底，BST和快排的模式其实就是一样的，思路都是比基准小的放在左边，大的放在右边。平均时间复杂度和最坏时间复杂度都是一样的。
