---
title: 'leetcode:game of life'
tags:
  - leetcode
abbrlink: b0b083f0
date: 2019-11-26 17:19:24
---

According to the Wikipedia's article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."

Given a board with m by n cells, each cell has an initial state live (1) or dead (0). Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):

- Any live cell with fewer than two live neighbors dies, as if caused by under-population.
- Any live cell with two or three live neighbors lives on to the next generation.
- Any live cell with more than three live neighbors dies, as if by over-population..
- Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

Write a function to compute the next state (after one update) of the board given its current state. The next state is created by applying the above rules simultaneously to every cell in the current state, where births and deaths occur simultaneously.


<!-- more -->

------

**Follow up:**

- Could you solve it in-place? Remember that the board needs to be updated at the same time: You cannot update some cells first and then use their updated values to update other cells.
- In this question, we represent the board using a 2D array. In principle, the board is infinite, which would cause problems when the active area encroaches the border of the array. How would you address these problems?


生命游戏，这也是一个很有意思的游戏，在经过大量的迭代之后，里面的生命就会展现出各种各样有趣的形状出来，在数学上，这个规则所对应的参数属于一种叫做“混沌的边界”的状态，多一个和少一个都不能实现这样的效果。另外，这个游戏是图灵完备的，也就是说计算机能够做的事情，这个游戏都能实现。

回到问题本身，生命游戏本身的算法很简单，就是对每一个细胞都进行遍历，查找其邻居存活细胞的数量，然后，根据数量和当前细胞的状态(存活/死亡)来确定下一代这个细胞的状态(存活/死亡/复活)。由于进入下一世代是在一瞬间的，因此，在每一次更新世代的时候，都要小心的保存现场，使其不要被已经确认状态的细胞所影响。

而进阶挑战就是不使用额外的空间来记录这些额外的信息。

首先，我们可以知道，所有的细胞只有两个状态(生存/死亡)，因此，我们可以利用int的高位来存储这些细胞的下一代的状态的信息

```cpp
    enum CeilState
    {
        ALIVE = 2
    };
```

第二位用来记录是否存活，若下一世代存活则标记为1，否则就标记为0。这样的话，当我们需要读取所记录的标记时，只需要`(board[i][j] >> 1) == 1`就可以判断这个细胞在下一世代的状态，而只需要`(board[i][j] & 0x1) == 1`就可以判断这个细胞在这一世代的状态

因此，一个不消耗额外空间的算法实现了

```cpp
class Solution {
    enum CeilState
    {
        ALIVE = 2
    };
public:
    void gameOfLife(vector<vector<int>>& board) {
        if(board.empty())
            return;

        int m = board.size();
        int n = board[0].size();
        for(int i = 0;i < m;i++)
        {
            for(int j = 0;j < n;j++)
            {
                if((board[i][j] & 0x1) == 1)
                {
                    int alive_ceil_count = 0;
                    for(int x = -1;x <= 1;x++)
                    {
                        for(int y = -1;y <=1;y++)
                        {
                            if(i + x < 0 || i + x >= m ||
                                j + y < 0 || j + y >= n || 
                                (x == 0 && y == 0))
                                continue;
                            if((board[i+x][j+y] & 0x1) == 1)
                                alive_ceil_count++;
                        }
                    }
                    if(alive_ceil_count < 2 ||  alive_ceil_count > 3);
                    else
                        board[i][j] |= CeilState::ALIVE;
                    

                }
                else
                {
                    int alive_ceil_count = 0;
                    for(int x = -1;x <= 1;x++)
                    {
                        for(int y = -1;y <=1;y++)
                        {
                            if(i + x < 0 || i + x >= m ||
                                j + y < 0 || j + y >= n || 
                                (x== 0 && y == 0))
                                continue;
                            if((board[i+x][j+y] & 0x1) == 1)
                                alive_ceil_count++;
                        }
                    }
                    if(alive_ceil_count != 3);
                    else
                        board[i][j] |= CeilState::ALIVE;
                }
            }
        }

        for(int i = 0;i < m;i++)
        {
            for(int j = 0;j < n;j++)
            {
                if((board[i][j] >> 1) == 1)
                    board[i][j] = 1;
                else
                    board[i][j] = 0;
            }
        }
    }
};
```


**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/game-of-life
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
