---
title: 'sort:排序算法中居然还有此等邪道?'
tags:
  - algorithm
  - sort
photos: >-
  https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1115052063,1751615944&fm=26&gp=0.jpg
abbrlink: b7e22b5b
date: 2019-11-22 21:50:28
---

其实只是计数排序而已🌶

<!-- more -->

------

计数排序是一种很快速的排序方式，其时间复杂度可达到O(n)，可以说是完爆其他算法，当然其缺点也是比较明显。现在，就让我们先看看这个排序到底是怎么操作的吧。

首先，常规的排序手法一般都是对数组当中的元素进行交换与排序，但是，计数排序不同，他是根据数组元素位置的统计来进行排序的，从原理上来说，他并没有对数组当中的任何一个元素进行交换。

就让我们举个例子吧

```cpp
5 4 4 2 3
```

我们要如何进行计数排序呢？最简单的方法即使建立一个大小为6的数组，当出现5的时候，下标为5的地方就加一，最终，得到一个关于每一个元素的数量的统计的数组，然后，按照顺序输出这个数组，就可以达成目的了。

```cpp
int arr[6];
for(int i = 0;i < 5;i++)
  arr[num[i]]++;
```

当然，这里有一个问题，那就是比如这个数组的数字十分之大比如
```
92 91 93 94 95
```

那么，我们的数组就会有大量的空间被浪费，因此，我们可以在进行计数排序之前，先统计数组的最大值与最小值，然后，建立一个合适大小的数组，然后，根据与最小值的偏移量来确定数组的下标，从而得到了一个比较合适的计数数组

```cpp
vector<int> sortArray(vector<int>& nums) {
        int min = INT_MAX,max = -INT_MAX;
        for(int i = 0;i < nums.size();i++)
        {
            if(nums[i] > max)
                max = nums[i];
            if(nums[i] < min)
                min = nums[i];
        }

        int *arr = new int[max - min + 1];
        memset(arr,0, sizeof(int) * (max - min + 1));
        for(int i = 0;i < nums.size();i++)
        {
            arr[nums[i] - min]++;
        }
        vector<int> result(nums.size());
        int index= 0;
        for(int i = 0;i < max- min + 1;i++)
        {
            for(int j = 0;j < arr[i];j++)
            {
                result[index]= i +min;
                index++;
            }
        }
        return result;
    }
```

计数排序确实很快，但是他的局限性也是很大，首先一旦max 与 min的差距十分之大，那么他的空间消耗将会十分严重，同时，他对于非整型的数就没有办法了，比如浮点数，根本就不知道应该怎么去确立统计数组
