---
title: 'leetcode:find the duplicate number'
tags:
  - algorithm
  - leetcode
abbrlink: a02b6857
date: 2019-10-29 23:26:48
---

Given an array nums containing n + 1 integers where each integer is between 1 and n (inclusive), prove that at least one duplicate number must exist. Assume that there is only one duplicate number, find the duplicate one.

<!-- more -->

------

**Example 1:**

```
Input: [1,3,4,2,2]
Output: 2
```

**Example 2:**

```
Input: [3,1,3,4,2]
Output: 3
```

**Note:**

1.You must not modify the array (assume the array is read only).
2.You must use only constant, O(1) extra space.
3.Your runtime complexity should be less than O(n^2).
4.There is only one duplicate number in the array, but it could be repeated more than once.

# 解法 1，二分查找

## 解题思路

这道题从最直观上来看，或许是和二分查找是没有任何关系的，因为，给定的数组是一个乱序的数组，二分查找是没有办法从乱序的数组中找到答案的。

但是，有一点，给了我们可以使用二分查找的方式。那就是，数组一共有n+1项，而数组元素则是1-n之间。

根据抽屉原理不难看出，必有一个重复的项在数组里面。那么，我们自然可以换种方式去寻找答案。

既然，给定的数字是有范围的，那么，我们自然可以从n/2开始寻找。

有一点是比较重要的，那就是，你选择了中间的那个数字的时候，假如，比他小的数字中存在重复项，那么，小于等于这个数字的数的总数应该是大于大于这个数的总数的。反之亦然。

因此我们就可以利用这种方式去构建我们的二分查找

```cpp
 int findDuplicate(vector<int>& nums) {
     	//数字是1-n之间的
        int left = 1,right = nums.size()-1;
        int r_count=0,l_count=0;
     
        while(left < right)
        {
            //选出中间的数
            int mid=left+(right-left)/ 2;
            
            //找到比这个数大的数和比这个数小的数的总数
            for(int i=0;i<nums.size();i++){
                //要注意的一点是要限定对比的空间
                //因为当mid进行左移或者右移的时候，被抛弃的区间是不应该来影响计数的
                if(nums[i] > mid && nums[i] <= right) 
                    r_count++;
                else if(nums[i] <= mid && nums[i] >= left) 
                    l_count++;
            }
            if(r_count < l_count) 
                right=mid;
            else 
                left=mid + 1;
            
            r_count=0;
            l_count=0;
        }
     
     	//此时left = right，也就是结果
        return left;
    }
```



在这里使用了他所提供的模板二，使用模板二的原因就是在于，模板二可以使得右指针一直保留在被重复的数当中，这样也可以避免n的奇偶带来的判断的差别。

## 思考

其实这道题挺有意思的。因为，本身一个乱序的数组是不支持二分查找的。但是，当发现了这个题目暗藏的数据区间的信息之后，这个数据区间又可以看作是一个有序的数组，然后找到我想要的数的形式了。

最重要的，还是要开放思维，不要被乱序的数组所局限到。

# 解法二 循环链表

## 解题思路

其实这个方法算是一个比较巧妙的方法。

还是从题目出发，n+1长的数组当中包含1-n的数字。那么，我们是不是可以将这个数组看作是一个循环链表？

比如`nums[0] = 1`指的是，下一项为`num[1]`，那么，数字必然小于n的数组是不可能越界的。而必有重复项则说明，这个链表是比成环的。那么，不就能够将这个问题简化为，寻找循环链表的循环处的问题了呢？

相比二分查找的**O(nlogn)**的时间复杂度，这样的时间复杂度显然更低**O(n)**,而且，即使是使用了额外空间，使用hashmap来解决这个题目的问题，时间复杂度也不会变得更低。

```cpp
int findDuplicate(vector<int>& nums) 
{
	//使用快慢指针寻找环的位置
        int fast = 0,slow = 0;          
        fast = nums[nums[fast]];
        slow = nums[slow];
        while(nums[fast] != nums[slow])
        {
            fast = nums[nums[fast]];
            slow = nums[slow];
        }
        
	//改为两个慢指针寻找交汇点
        slow = 0;
        while(nums[fast] != nums[slow])
        {
            fast = nums[fast];
            slow = nums[slow];
        }
        
        return nums[slow];
    }
```

## 思考

所以说，这个题目限定了数字大小的区间真的太好了。能够用很多奇怪的方法实现这个问题。

顺便一提，这个方法在leetcode中叫做弗洛伊德的兔子和乌龟

**题目来源**

力扣（LeetCode）
链接：https://leetcode-cn.com/problems/find-the-duplicate-number
