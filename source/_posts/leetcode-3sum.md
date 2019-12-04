---
title: 'leetcode:3sum'
tags:
  - leetcode
abbrlink: 80fb69f9
date: 2019-12-04 15:46:51
---

Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

*Note:*

The solution set must not contain duplicate triplets.


<!-- more -->

------

**Example:**
```
Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

三数之和，首先，让我们想想，两数之和是怎么做的。

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
        map<int,int> tarMap;
        vector<int> result;
        for(int i = 0;i < nums.size();i++)
        {
            if(tarMap.count(nums[i]) > 0)
            {
                result.push_back(tarMap[nums[i]]);
                result.push_back(i);             
                return result;
            }            
            tarMap[target - nums[i]] = i;
        }
        
        return result;
    }
```
使用了map，对于每一次的数都将其期望的数记录下来然后，当遍历到某数的时候，先找找有没有人需要这个数，如果有，那就组合成一个组合，不然，就将自己需求的搭档(数的大小)登记起来，方便后来人找搭档。

那么，我们可以从这个思路出发，先找到两数的组合，然后再根据两数的组合去寻找需求的第三个数。不过，这样的话就需要先找到两数之和的组合，再去寻找合适的第三个人，时间复杂度将会最起码变成O(n^2),因此，我们可以从数组本身去找找信息

既然时间复杂度都已经这么高了，我们对数组先进行一下排序也不是什么很慢的事情(sort也就O(nlogn)的时间复杂度)

在得到有序数组之后，我们就可以从数组本身当中去寻找线索了。

首先，还是两数之和的思路，那就是在确定一个数之后，发布其需求的剩下的数，那么，我们怎么去寻找剩下的数呢？首先，我们这个数组是有序的，也就是说`nums[left] < nums[right]`，那么，当我们确定了一个数`num[i]`之后，我们就要为其去寻找队友了。而我们的数组是有序的，也就是说我们可以从数组的一左一右去寻找目标
```cpp
int left = i + 1,right = nums.size() - 1;
int sum = nums[i] + nums[left] + nums[right];
if(sum < 0)
  left++;
else if(sum > 0);
  right--;
else
  //find it!!
```
那么，当`sum`比0大就说明负数的元素比较多了，需要向右调整，反之亦然。当然，即使是找到了这个组合也不能停止计算，因为还有可能有其他的组合的出现。

当然，还有一个问题就是，我们得出的结果不能有重复的元素，换句话说，假设输入的数组是`[-1,-1,2,3]`，选第一个-1作为`nums[i]`与选第二个作为`nums[i]`应该是等价的，因此需要跳过这个阶段。

还有一点就是，因为我们的和是0，而数组是从小到大排序的。因此，当`nums[i] > 0`的时候，也就没有再去计算下去的必要了。

```cpp
 vector<vector<int>> threeSum(vector<int>& nums) {
        if(nums.empty())
            return {};
        sort(nums.begin(),nums.end());
        vector<vector<int>> result;
        for(int i = 0;i < nums.size() - 1;i++)
        {
            if(nums[i] > 0)
                break;
            if(i != 0 && nums[i - 1] == nums[i])
                continue;

            int left = i + 1,right = nums.size() - 1;
            while(left < right)
            {
                int sum = nums[left] + nums[right] + nums[i];
                if(sum < 0)
                    left++;
                else if(sum > 0)
                    right--;
                else
                {
                    result.push_back({nums[left],nums[right],nums[i]});
                    while(left < right && nums[left] == nums[left + 1])
                        left++;
                    while(left < right && nums[right - 1] == nums[right])
                        right--;
                    
                    left++;
                    right--;
                }
                
            }
        }

        return result;
    }
```

对于四数之和，思路也是一样的

**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/3sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
