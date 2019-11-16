---
title: 'leetcode:ugly number III'
tags:
  - algorithm
  - leetcode
abbrlink: d658950c
date: 2019-11-16 11:55:30
---



Write a program to find the n-th ugly number.

Ugly numbers are positive integers which are divisible by a or b or c.

<!-- more -->

------

```
Example 1:

Input: n = 3, a = 2, b = 3, c = 5
Output: 4
Explanation: The ugly numbers are 2, 3, 4, 5, 6, 8, 9, 10... The 3rd is 4.
```

**解题思路**

对于这样的丑数，假设我们的目标数为tar，那么tar绝对是满足或被a整除，或被b整除，或被c整除，那么，其实他们的能被整除的count就有这样的关系

{% asset_img t.png%}

这就不难算出，某个数的count到底是多少了。
$$
count = tar/a+tar/b+tar/c-tar/ab-tar/ac-tar/bc+tar/abc
$$
这就可以使用二分查找来寻找目的数

```cpp
 int nthUglyNumber(int n, int a, int b, int c) {

        long ab = ((long)a * b) /__gcd(a,b);
        long ac = ((long)a * c) / __gcd(a,c);
        long bc = ((long)b * c) / __gcd(b,c);
        long abc = (ab * c) / __gcd((int)ab,c);

        int left = 0,right = INT_MAX;
        while(left < right)
        {
            long long mid = (long long)left + (right - left) / 2;
            long long count = mid / a + mid / b + mid / c - mid / ab - mid / ac - mid / bc + mid / abc;
            if(count < n) left = mid + 1;
            else right = mid;
        }

        return left;
    }
```



**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/ugly-number-iii
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
