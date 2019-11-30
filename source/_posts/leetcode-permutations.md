---
title: 'leetcode:permutations'
tags:
  - leetcode
abbrlink: b2435380
date: 2019-11-30 21:05:42
---

Given a collection of numbers that might contain duplicates, return all possible unique permutations.

<!-- more -->

------

**Example:**
```
Input: [1,1,2]
Output:
[
  [1,1,2],
  [1,2,1],
  [2,1,1]
]
```

对于全排序，其实，就是对集合元素的所有的排列。那么，我们可以这样看，我们一个一个的将元素构建起来。首先，我们先构建全排序的开头的第一个字符。我们先看看有哪些不同的元素，`{1,2}`,没错，我们能够选择的元素只有两个(虽然集合是`{1,1,2}`，但是两个1其实是一样的，两个1互换位置对于排序来说没有影响)。那么，我们选择一个元素，比如，选择的是1，那么，我们接下来还能够选择的元素就只剩下`{1,2}`了。

我们现在再继续选，我们可以从不同的元素当中`{1,2}`当中随便选一个再去组合这个排序数组，比如这次选的是1，那么下一步，我们就只能选择2了。当我们选择了2之后，我们发现，我们现在的数组长度和集合元素是一样多的，因此，我们这个时候就能够输出一个排序数组了。

在我们构建完一个排序数组之后，我们就要进行回溯(为什么？那当让是因为我们还没有计算出所有的可能啊)。

我们现在已经构成的数组是`[1,1,2]`，因此，我们向上回退一步，将2还回去，然后，选择之前没有选择的2，然后继续刚才的步骤。

在使用这种方式不断的构建数组的过程，我们就可以得到这个集合的全排序了。

这个方法是不是很眼熟？没错，这就是深度优先的遍历方法。在每一次回溯的时候，都会将之前的变化归还回来，这种方式叫做还原现场，因此，这种算法就叫做深度优先+现场还原的解决方法了

当然，为了不构造因为重复元素而导致的相同的数组的问题，我们这里首先得先对元素进行加工，也就是将不同的元素区分出来，然后再在这的基础上记录相同元素的个数(免得最后构造出来的数组长度不对嘛)。在这里我选择使用`map<int,int> key->元素 value->个数`

```cpp
class Solution {
    map<int,int> map_;
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        for(int i : nums)
            ++map_[i];

        vector<vector<int>> output;
        vector<int> v;
        dfs(map_,0,nums.size(),v,output);
        return output;
    }

    void dfs(map<int,int>& map,int cur,int size,vector<int>& path,vector<vector<int>>& output)
    {
        if(cur == size)
        {
            output.push_back(path);
            return;
        }
        for(auto& v : map)
        {
            if(!v.second)
                continue;
            --v.second;
            path.push_back(v.first);
            dfs(map,cur + 1,size,path,output);
            path.pop_back();
            ++v.second;
        }
    }
};
```



**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/permutations-ii
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
