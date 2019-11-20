---
title: manacher's algorithm
tags:
  - algorithm
  - leetcode
photos:
  - >-
    https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574248330532&di=afedbe9343a10a13582a24c7a1d0456a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201602%2F07%2F20160207220710_wAYv5.jpeg
abbrlink: 589b7415
date: 2019-11-20 16:19:29
---


>这是一个寻找回文子串的算法，时间复杂度为线性的。

<!-- more -->

------


首先，先介绍以下回文串，顾名思义，回文串就是一个无论正着读还是倒着读都是一模一样的串，比如"level","refer"这些。如果，我们使用暴力的方法来求一个字符串中最长回文串的话，那么，我们就需要对每一个子字符串都要进行回文的匹对，然后，对比所有的最后才能得知最长的那个在哪里。不过，既然都是回文了，那么，自然也可以从中心开始展开去寻找回文串到底在哪，但是，这又区分了偶数长度的回文串和奇数长度的回文串(偶数长度的回文串的中心点在两个中心字符中间)，就十分的麻烦，时间复杂度也是O(n^2)的

而这个算法，可以说是利用了巧妙的方式，去寻找回文串。

## 思路

这个算法的思路就是，为输入的字符串的首尾以及每个字符的中间都添加一个独一无二的符号(我们这里就设定为"#")

```
input:  "babad"
output: "#b#a#b#a#d#"
```

这样，每一个原串的字符都可以组成一个奇数长度的回文串了，这首先就是省略了偶数回文串匹配时候出现的麻烦的事了。

然后，第二件事情就是建立一个`len`数组，这个数组所作的唯一的事情就是记录每一个字符，以其为中心的最长的回文串的半径(就是从自身开始，数到最右边的回文字符的长度)。

```
input:  "babad"
output: "# b # a # b # a # d #"
len:     1,2,1,4,1,4,1,2,1,2,1,
```

解释一下，那就是比如第一个"#",他的回文串最长半径就是1，也就是只有他自己，然后b是2，因为他的最长回文串是"#b#"，因此，半径就是2了。

那么，只要找到`len`当中最长的数，自然就可以找到字符串当中最长的回文字符串了。这样，剩下的问题就只有一个了，那就是怎么去构建`len`数组了。

**构建len数组**

构建这个数组，首先我们需要知道两个东西，一个是`maxPos`，这个的意思就是，已经匹配到的最长的回文子串的最右边的位置,然后，另一个就是`centerPos`,这个的意义则是`maxPos`对应的子串的中心点的位置。

现在，让我们从左到右依次计算`len[i]`了

首先，我们现在面临了两种情况,第一种是`i < maxPos`，也就是说，当前的位置在已经找到了的回文串的里面。由于回文串是根据中心点对称的，因此，我们可以依靠`centerPos`这个点来找到`i`的对称点`j`,当然`i >= j`是一定的(这个之后解释),由于回文串是对称的那么我们就可以得知`len[j]`的大小，假如`len[j] < maxPos - i`也就是说明，`len[j]`的最大回文串是在已经匹配了的最长回文串当中的，由于回文串是中心对称的，因此`len[i] = len[j]`是成立的。

然后，假如`len[j] > maxPos - i`也就是说，回文串的大小应该是比已经找到的最大的回文串的长度还要远，因为，那已经超过了我们已经搜索的范围了，因此，我们自然不可能知道`len[i]`的长度，因此，这个时候我们就需要向外一个个匹对从而找到`len[i]`的长度了。

然后，第二个情况就是`i >= maxPos`了，这个时候，同样超出了我们的匹对范围了，因此需要向外不断的探索从而找到`len[i]`的大小。

最后，我们只需要遍历一遍字符串就可以找到最长的回文子串的位置了。

## 寻找最长回文子串

既然，已经有了思路和算法，那么寻找也不是难事了。

给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。
示例 1:
```
输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案。
```
示例 2：
```
输入: "cbbd"
输出: "bb"
```

```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        if(s.empty())
            return "";

	//init
        string temp;
        for(int i = 0;i < s.size();i++)
        {
            temp.append("#");
            temp += s[i];
        }
        temp.append("#");


        int *len = new int[temp.size()];
        memset(len,0,sizeof(int) * temp.size());

        int maxPos = 0,centerPos = 0,max = 0,pos = 0;;
        for(int i = 0;i < temp.size();i++)
        {
            if(maxPos > i)
                len[i] = min(maxPos - i,len[2 * centerPos - i]);
            else
                len[i] = 1;
	    
	    //注意边界检查
            while(i - len[i] >= 0 &&
                i + len[i] < temp.size() &&
                temp[i - len[i]] == temp[i + len[i]])
                len[i]++;

            if(len[i] + i > maxPos)
            {
                maxPos = len[i] + i;
                centerPos = i;
            }

	    //记录最长的位置
            if(len[i] > max)
            {
                max = len[i];
                pos = i;
            }
        }

	//还原原字符串的位置，并输出
        return s.substr((pos + 1) / 2 - len[pos] / 2,(len[pos] * 2 - 1) / 2);
    }

};
```


**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/longest-palindromic-substring
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



