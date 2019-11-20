---
title: 'leetcode:sudoku solver'
tags:
  - leetcode
abbrlink: b6eeaa30
date: 2019-11-18 21:41:17
---

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:

*Each of the digits 1-9 must occur exactly once in each row.*
*Each of the digits 1-9 must occur exactly once in each column.*
*Each of the the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.*
*Empty cells are indicated by the character '.'*

<!-- more -->

------

解数独是一件很有意思的事情，因为，我自己根本不知道应该怎么解QAQ

不过，使用代码的话就完全不一样了。因为，计算机可以穷举啊。

## 思路

其实，这个问题我感觉和搜索联通的路是一样的。我们不断向下一个点试探（填数字），当遇到不能前进的时候（数字不能再填了，不然会有重复）就回溯。因此，没有错了，`dfs`就是你。

有了思路就很简单了，当遇见一个已经填了的数字的时候，就下一个格子，当遇见可以填的格子的时候，就填1，然后下一个格子，假如下一个格子碰壁了，那么就回溯到这个格子，然后，这个格子改为2（也就是1到9一个个试辣），那么，当格子填满的时候，就不需要再填了。这也是，dfs结束的时候。

```cpp
class Solution {
    //记录是否以及填满格子了
    bool get = false;
    //用于判断这个格子可以填写哪些数字
    bool row[9][9] = {false},col[9][9] = {false},block[9][9] = {false};
public:
    void solveSudoku(vector<vector<char>>& board) {
	//先将以及填上去的数字记录了
        for(int i = 0;i < 9;i++)
        {
            for(int j = 0;j < 9;j++)
            {
                if(board[i][j] == '.')
                    continue;
                int index = 3 * (i / 3) + j / 3;
                int num = board[i][j] - '0';
                row[i][num - 1] = col[j][num - 1] = block[index][num - 1] = true;
            }       
        }

        dfs(0,0,board);
    }

    void dfs(int i,int j,vector<vector<char>>& board)
    {
	//填满了就结束了
        if(i == 9)
            get = true;

        if(get)
            return;

	//如果这个格子已经被填了就下一个格子
        if(board[i][j] != '.')
        {
            if(get)
                return;
            if(j == 8)
                dfs(i + 1,0,board);
            else
                dfs(i,j + 1,board);       
        }
        else
        {
	//从1到9的查找
        for(int num = 1;num <= 9;num++)
        {
            int index = 3 * (i / 3) + j / 3;
	    //可以填写就填写这个num
            if(!row[i][num - 1] && !col[j][num - 1] && !block[index][num - 1])
            {
                row[i][num - 1] = col[j][num  - 1] = block[index][num - 1] = true;
                board[i][j] = num + '0';

                if(j == 8)
                    dfs(i + 1,0,board);
                else
                    dfs(i,j + 1,board);

		//需要回溯了，自然要将填写的数字归还回去，从棋盘以及记录以及填写数字的row,col,block当中消除记录
                if(!get)
                {
                    row[i][num - 1] = col[j][num - 1] = block[index][num - 1] = false;
                    board[i][j] = '.';
                }
            }
        }
        }

    }
};
```



**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/sudoku-solver
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
