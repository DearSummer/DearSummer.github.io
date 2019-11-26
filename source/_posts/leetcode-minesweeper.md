---
title: 'leetcode:minesweeper'
tags:
  - leetcode
abbrlink: 1205e6ea
date: 2019-11-26 20:16:18
---

Let's play the minesweeper game ([online game](http://minesweeperonline.com/))!

You are given a 2D char matrix representing the game board. 'M' represents an unrevealed mine, 'E' represents an unrevealed empty square, 'B' represents a revealed blank square that has no adjacent (above, below, left, right, and all 4 diagonals) mines, digit ('1' to '8') represents how many mines are adjacent to this revealed square, and finally 'X' represents a revealed mine.

Now given the next click position (row and column indices) among all the unrevealed squares ('M' or 'E'), return the board after revealing this position according to the following rules:

- If a mine ('M') is revealed, then the game is over - change it to 'X'.
- If an empty square ('E') with no adjacent mines is revealed, then change it to revealed blank ('B') and all of its adjacent unrevealed squares should be revealed recursively.
- If an empty square ('E') with at least one adjacent mine is revealed, then change it to a digit ('1' to '8') representing the number of adjacent mines.

Return the board when no more squares will be revealed.


<!-- more -->

------


扫雷的规则，其实同样是dfs/bfs的事。唯一有问题的地方就是，他仅仅是没有地雷的点会递归的展开，一旦附近有地雷就不会展开了，因此，`mine_num > 0`的点就不用加入到搜索队列里了。

```cpp
vector<vector<char>> updateBoard(vector<vector<char>>& board, vector<int>& click) {
        if(board[click[0]][click[1]] == 'M')
        {
            board[click[0]][click[1]] = 'X';
            return board;
        }

        int dir_x[8] = {0,1,0,-1,1,1,-1,-1};
        int dir_y[8] = {1,0,-1,0,1,-1,-1,1};

        int m = board.size();
        int n = board[0].size();

        set<vector<int>> visited;
        stack<vector<int>> s;
        s.push(click);
        while(!s.empty())
        {
            vector<int> cur = s.top();
            s.pop();

            int mine = 0;
            for(int i = 0;i < 8;i++)
            {
                if(cur[0] + dir_x[i] < 0 || cur[0] + dir_x[i] >= m ||
                    cur[1] + dir_y[i] < 0 || cur[1] + dir_y[i] >= n)
                    continue;

                if(board[cur[0] + dir_x[i]][cur[1] + dir_y[i]] == 'M')
                    mine++;
            }

            if(mine == 0)
            {
                board[cur[0]][cur[1]] = 'B';
                for(int i = 0;i < 8;i++)
                {
                    if(cur[0] + dir_x[i] < 0 || cur[0] + dir_x[i] >= m ||
                        cur[1] + dir_y[i] < 0 || cur[1] + dir_y[i] >= n)
                        continue;

                    else if(board[cur[0] + dir_x[i]][cur[1] + dir_y[i]] == 'E' && 
                        visited.count({cur[0] + dir_x[i],cur[1] + dir_y[i]}) == 0)
                    {
                        s.push({cur[0] + dir_x[i],cur[1] + dir_y[i]});
                    }
                }
            }
            else
                board[cur[0]][cur[1]] = mine + '0';

        }

        return board;
    }
```

不过，说起来，无论是推箱子，解数独还是这个扫雷运用的都是bfs/dfs欸。果然是个很厉害的搜索算法

**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/minesweeper
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
