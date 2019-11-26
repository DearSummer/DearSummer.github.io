---
title: 'leetcode:Minimum Moves to Move a Box to Their Target Location'
tags:
  - leetcode
abbrlink: 98eb3162
date: 2019-11-25 22:05:56
---

The game is represented by a grid of size n*m, where each element is a wall, floor, or a box.

Your task is move the box 'B' to the target position 'T' under the following rules:

- Player is represented by character 'S' and can move up, down, left, right in the grid if it is a floor (empy cell).
- Floor is represented by character '.' that means free cell to walk.
- Wall is represented by character '#' that means obstacle  (impossible to walk there). 
- There is only one box 'B' and one target cell 'T' in the grid.
- The box can be moved to an adjacent free cell by standing next to the box and then moving in the direction of the box. This is a push.
- The player cannot walk through the box.

Return the minimum number of pushes to move the box to the target. If there is no way to reach the target, return -1.

<!-- more -->

------


推箱子，一个充满着童年回忆的游戏。

在这里，我们要使用一个算法去计算出推到目标位置的箱子所需要的最少步骤。让我们一步步推导到底应该如何去搜索才能得到正确的答案

- 首先，让我们先看看这个问题的最简单的形式，那就是没有人，箱子自己动的情况(不要求最短)。

这种情况，我们只需要使用BFS就可以找出一条路径了，而每一次BFS我们需要保存的是一个二元组`{PlyerX,PlayerY}`
- 然后，让我们来解决人推箱子的情况，那就是，人推箱子到目的地点的路经(不要求最短)

这个时候，其实也就是比一开始的时候要多了一个箱子的信息，那么我们同样可以使用BFS，不过，这一次我们需要保存的信息是一个四元组`{PlayerX,PlayerY,BoxX,BoxY}`

我们可以，同样以人为核心来进行移动，但是，当人移动到箱子的位置的时候，箱子也要往相同的方向移动一格。这样，我们就可以模拟出人推箱子的情况了。当然，箱子无法移动的时候，人也无法移动，也就是将箱子碰到墙壁的情况也加入到判断是否可移动的列表里了。
- 最后，让我们解决人推箱子，且箱子走到目的地所用最短步数

BFS有一个问题，那就是虽然能够找到一条通向终点的路径，但是却不能确保这条路径是最短的。因此，我们需要改良一下BFS的迭代方式。首先，让我们先看看，BFS是一条路走到头再开始回溯的，也就是说，在路径上或许已经走了另一条比较短的路了，但是，我也不会去改变我的方向。因此，我们要做的就是，为BFS每一次迭代出来的路径加一个权值。每一次都是从权值小的地方开始搜索，这样，就可以避免了很多无用的操作了(因为，无用的操作肯定会导致权值的上升)。这样，就可以保证能够搜索出最短的路径了

至于怎么做呢？一般来说，BFS使用`stack`来保存信息，在这里，我们使用`priority_queue`来保存信息，然后自己定义一个用于对比权值的仿函数传递进去。这样，每一次在优先队列堆顶的元素都是权值最小的元素，自然，就可以使用BFS的方法去遍历出最小的步数了

现在，我们为BFS所保存的信息增加了一个步数的权值，因此，每一次迭代需要保存的元素应该是一个五元组`{PlayerX,PlayerY,BoxX,BoxY,Step}`

```cpp
class Solution {
    //建立对比权值的仿函数
    struct cmp
    {
        bool operator()(const vector<int>&a,const vector<int>&b)
        {
            return a[4] > b[4];
        }
    };
public:
    int minPushBox(vector<vector<char>>& grid) {
        int s_x,s_y,b_x,b_y;
        int n = grid.size(),m = grid[0].size();
        for(int i = 0;i < grid.size();i++)
        {
            for(int j = 0;j < grid[i].size();j++)
            {
                if(grid[i][j] == 'S')
                {
                    s_x = i;
                    s_y = j;
                }

                if(grid[i][j] == 'B')
                {
                    b_x = i;
                    b_y = j;
                }
            }
        }

        priority_queue<vector<int>,vector<vector<int>>,cmp> que;
        //stack<vector<int>> que; 不使用栈而是使用优先队列保存信息
        set<vector<int>> visited;

        int dir_x[4] = {0,1,0,-1};
        int dir_y[4] = {1,0,-1,0};
        
        //{sX,sY,bX,bY,step} 保存一个五元组
        que.push({s_x,s_y,b_x,b_y,0});
        visited.insert({s_x,s_y,b_x,b_y});

        while(!que.empty())
        {
            auto v = que.top();
            que.pop();

            for(int i = 0;i < 4;i++)
            {
                vector<int> s_next = {v[0] + dir_x[i],v[1] + dir_y[i]};
                if(s_next[0] < 0 || s_next[0] >= n ||
                    s_next[1] < 0 || s_next[1] >= m || grid[s_next[0]][s_next[1]] == '#')
                    continue;

                int step = v[4];
                vector<int> b_next = {v[2],v[3]};
                if(s_next[0] == v[2] && s_next[1] == v[3])
                {
                    b_next[0] += dir_x[i];
                    b_next[1] += dir_y[i];
                    if(b_next[0] < 0 || b_next[0] >= n ||
                        b_next[1] < 0 || b_next[1] >= m ||
                        grid[b_next[0]][b_next[1]] == '#')
                        continue;
		    //成功推动箱子就步数加1
                    step++;
                }
                //到达目的地就返回步数
                if(grid[b_next[0]][b_next[1]] == 'T')
                    return step;
                //深度优先遍历
                if(visited.count({s_next[0],s_next[1],b_next[0],b_next[1]}) != 0)
                    continue;
                
                visited.insert({s_next[0],s_next[1],b_next[0],b_next[1]});
                que.push({s_next[0],s_next[1],b_next[0],b_next[1],step});
                
            }
        }


        return -1;

    }
};
```
如此如此，这般这般，我们就能够解出推箱子的路径最优解了



**来源：力扣（LeetCode）**
链接：https://leetcode-cn.com/problems/minimum-moves-to-move-a-box-to-their-target-location
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
