---
title: 'sort:如天下第一武道大会般的排序'
tags:
  - algorithm
  - sort
abbrlink: 1e089afc
date: 2019-11-24 21:37:00
photos: https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2817242211,1746574287&fm=26&gp=0.jpg
---

并归与淘汰赛不得不说的故事

<!-- more -->

------

想起童年时期观看的龙珠，天下第一武道大会吸引了世界各地的武术高手前来参赛，而每一个武术高手都需要两两对决，直至16强8强4强，最后才决出冠军。而并归排序于这种淘汰赛有着异曲同工之妙。

并归排序就像是在元素之间举办一场武道大赛，这场大赛分为两个阶段

- 分组
首先，对于一个集合，假设有n个元素，那么我们就对其不断的两两均分。
第一层是原数组有n个元素
第二层每个组有n/2个元素
第三层每个组有n/4个元素
第四层则是n/8个元素
......
直到每一组都只有1个元素为止
- 合并(merge)
在将所有的元素都成功的分组之后，我们就要对元素进行合并了。如同天下第一武道大会的比试一样。不过，不同的在于，天下第一武道大会是比出谁更强，而归并排序仅仅只要小组内比出谁大谁小，然后，每一个小组都会根据大小合并成一个顺序的更大的组

比如
```cpp
layer n :  1 4  / 2 5  -> layer n-1: 1 2 3 5
```
在上层会将这些已经排序了的元素进行按顺序合并。最终，所有的元素都会合并成一个有序的集合，这样排序就完成了。

至于怎么将两个有序的集合合并成一个更大的集合呢？我们只需要三步
**step1**
建立一个额外的数组用于暂时存储归并的结果
**step2**
从左往右逐一比较小集合的元素的大小，从小到到填到临时集合当中
**step3**
将有剩余元素的集合复制到临时数组当中
**step4**
将临时数组的内容复制到大的集合当中

其实，说到底这样就是两个有序数组合成一个大数组的算法

```cpp
vector<int> sortArray(vector<int>& nums) {
        sort(nums,0,nums.size());
        return nums;
    }

    void sort(vector<int>& num,int left,int right)
    {
        if(left + 1 < right)
        {
            int mid = left + (right - left) / 2;
            sort(num,left,mid);
            sort(num,mid,right);

            merge(num,left,mid,right);
        }
    }

    void merge(vector<int>& num,int left,int mid,int right)
    {
        int *arr = new int[right - left];
        int lstart = left,rstart = mid,p = 0;
        while(lstart < mid && rstart < right)
        {
            if(num[lstart] < num[rstart])
                arr[p++] = num[lstart++];
            else
                arr[p++] = num[rstart++];  
        }

        while(lstart < mid)
            arr[p++] = num[lstart++];

        while(rstart < right)
            arr[p++] = num[rstart++];


        for(int i = 0;i < right - left;i++)
            num[i + left] = arr[i];        
    }
```
由于并归排序需要将数组两两分组，最后再合并，因此时间复杂度为O(nlogn)，而每一次都需要一个辅助数组来辅助合并，因此空间复杂度为O(n)。并且，并归排序是稳定的排序算法
