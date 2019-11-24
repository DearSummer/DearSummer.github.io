---
title: 'sort:冒泡的另一种进阶方式'
tags:
  - algorithm
  - sort
photos: >-
  https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574604727427&di=5635c520941f8b6fcb61a3fb74cd4111&imgtype=0&src=http%3A%2F%2Fi-7.vcimg.com%2Ftrim%2Ffae0a72f46dba61f832f51ad35a50d89298857%2Ftrim.jpg
abbrlink: 106f3846
date: 2019-11-24 18:35:01
---

论插入排序

<!-- more -->

------


首先，向我们回顾一下冒泡排序。

```cpp
3 5 6 7 1 2 9
```

想要对这个数组进行排序，那么，我们就需要不断的将不符合数组序列要求的元素进行交换，当我们成功的排列了一个数组的时候，将会进行很多很多次的交换，但是，在这么大量的交换下，也就会造成大量的内存读写操作。那么，我们怎么才能避免出现这种情况呢？

这个时候，我们可以使用精准的交换方式，就比如上面这个数组，我们可以选择最小的一个数1，与3交换，然后，选第二小的2与5交换，那么，每一次的排序，都只会交换一次，这样便可以大大节省了交换元素时所带来的读写内存的操作。

```cpp
vector<int> sortArray(vector<int>& nums) {
        for(int i = 0;i < nums.size();i++)
        {
            int min = nums[i];
            int index = i;
            for(int j = i;j < nums.size();j++)
            {
                if(min > nums[j])
                {
                    min = nums[j];
                    index = j;
                }
            }

            swap(nums[i],nums[index]);
        }

        return nums;
    }
```

不过，可惜的一点是。虽然是减少了内存的读写操作，但是时间复杂度是没有任何的变化的，而且，与冒泡排序相比，这是一个不稳定的排序，也就是说，无法确定在自己前面的这个元素在排序之后仍然在自己的前面，比如以下这个数组

```cpp
5 8 5 3 6
```
经过第一次排序之后，3和5交换，这个时候，两个5的位置就发生了交换了。而这个在冒泡排序当中是不存在的，第一个5永远会在第二个5的前面，因为他是一个稳定的排序
