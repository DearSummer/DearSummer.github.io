---
title: Implementing a distance vector routing algorithm
tags:
  - computer network
abbrlink: '5318243'
date: 2019-12-05 20:20:51
---

[Computer Networking:A Top-Down approach chapter 4 lab](http://media.pearsoncmg.com/aw/aw_kurose_network_3/labs/lab6/lab6.html)

<!-- more -->

------

这次的实验是要实现一个分布式异步距离向量算法。在实验当中提供了`node0,node1,node2,node3`来模拟3个节点的dv路由算法的寻路机制

# Distance Vector Routing Algorithm

首先，我们先看看距离向量算法的思想。在这个算法当中，最核心的思想就是，当我们从节点x到节点y选一条最短的路径，那么，我们首先就要选择离节点y最近的节点z，假设我们已经知道了节点x->z的最短的路径，那么，x->y的最短路径就是x->z->y。然后，我们的问题就变成了寻找x->z的最短路径。按照这个思路递归下去，我们就可以只根据邻居节点的距离向量表就可以得知x->y的最短的距离，从而能够沿着最短的路从x->y进行行走了。

根据这个思想，我们不难得知，对于一个节点x，他只需要知道自己节点的距离向量(链路cost)，以及邻居节点的距离向量(链路cost)就可以得知整个链路的所有节点的最短距离了。

因此，这个算法是分布式的算法。他只需要从邻居得到数据，然后修改自己的数据，假如修改了自己的距离向量表就向邻居通告自己修改了，直到没有消息能够再传递为止。这个算法也是异步的，因此，他不要求所有节点都一起计算。同时他也是可以自我停止的，当所有节点都找到了最小cost的链路之后，整个网络当中就再无信息交流，从而算法也停止了。

对于dv算法，我们维护以下的信息
- 对于每一个邻居v,从x到直接相连的邻居v的费用为`c(x,v)`
- 对于节点x的距离向量$ D_x=[D_x(y):y\in N] $
- 对于节点x的每一个邻居v的距离向量都有$ D_v=[D_v(y):y\in N] $

同时对于距离向量的计算方式有$D_x(y)=min_v{c(x,v) + D_v(y)}$

看上去似乎有点抽象，我们就实际出发，从代码实现来看吧。由于四个node的实现其实是基本一样的，因此这里就只以`node0`为例子

首先就是初始化距离向量表

```c
void rtinit0() 
{
  for(int i = 0;i < 4;i++)
    for(int j = 0;j < 4;j++)
      dt0.costs[i][j] = __MAX_COST__;

  dt0.costs[0][0] = 0;
  dt0.costs[0][1] = 1;
  dt0.costs[0][2] = 3;
  dt0.costs[0][3] = 7;

  for(int i = 0;i < 4;i++)
  {
    if(dt0.costs[0][i] == 0 || dt0.costs[0][i] == __MAX_COST__)
      continue;
    struct rtpkt pkt;
    pkt.destid = i;
    pkt.sourceid = 0;
    memcpy(pkt.mincost,dt0.costs[0],sizeof(int) * 4);
    tolayer2(pkt);
  }

  if(TRACE >= 1)
    printdt0(&dt0);
}
```

所有不通的路都设为最大的cost，然后，为所有邻居的cost都标记上(这个cost是题目给定的)，然后，由于自己的距离向量表得到了更改，因此，向自己的所有邻居都通告。

之后，初始化就完成了。然后是迭代的操作

```c
void rtupdate0(rcvdpkt)
  struct rtpkt *rcvdpkt;
{
  if(rcvdpkt->destid != 0)
    return;

  memcpy(dt0.costs[rcvdpkt->sourceid],rcvdpkt->mincost,sizeof(int) * 4);
  int hasChange = 0;
  for(int i = 0;i < 4;i++)
  {
    if(dt0.costs[0][rcvdpkt->sourceid] + dt0.costs[rcvdpkt->sourceid][i] <  dt0.costs[0][i])
    {
      hasChange = 1;
      dt0.costs[0][i] = dt0.costs[0][rcvdpkt->sourceid] + dt0.costs[rcvdpkt->sourceid][i];
    }
  }

  if(hasChange)
  {
      for(int i = 0;i < 4;i++)
      {
        if(dt0.costs[0][i] == 0 || dt0.costs[0][i] == __MAX_COST__)
          continue;
        struct rtpkt pkt;
        pkt.destid = i;
        pkt.sourceid = 0;
        memcpy(pkt.mincost,dt0.costs[0],sizeof(int) * 4);
        tolayer2(pkt);
      }
  }
  if(TRACE >= 1)
    printdt0(&dt0);
}
```

然后，就是我们一旦接收到邻居传来的距离向量表的通告，我们就要为我们的距离向量表更新内容了。首先，我们先保存下来邻居的信息，然后，我们试图计算从我们自己的节点到所有其他节点的费用,根据之前的公式我们可以直到，我们的思路就是，比较当前节点到目的节点与当前节点先到邻居节点再到目的节点的路线谁费用比较低，假如，先走邻居节点比直接到达的费用要低，我们就更新我们的距离向量表，并通告所有的邻居

这样一来一去，一来一去的，直到再也没有收到邻居的来信，就说明所有节点都已经收敛到最低费用的情况了。

这个算法的思想和实现都比较简单，但是会有一个问题，那就是这个算法会陷入无穷计数问题(count to infinty)。比如，节点x->y的费用从1上升到了1000，那么，在这个算法当中，就只能在两个节点之间不断向上试探才能够慢慢收敛到正确的费用上去，这样，大大的耗费了网络的资源。虽然，两个节点之间的无穷计数问题可以由毒性逆转来解决，但是多个节点的话，这个问题也依旧没有解决

现在，回到实验，我们可以看看所有的节点的距离向量表的表现形式

```
                via     
   D0 |    1     2    3 
  ----|-----------------
     1|    0     1     3
dest 2|    1     0     2
     3|    3     2     0

             via   
   D1 |    0     2 
  ----|-----------
     0|    0     2
dest 2|    2     0
     3|  1000   1000

                via
   D2 |    0     1    3 
  ----|-----------------
     0|    0     1     4
dest 1|    1     0     3
     3|    4     3     0

             via     
   D3 |    0     2 
  ----|-----------
     0|    0     2
dest 1|  1000   1000
     2|    2     0
```

在实验当中，d1与d3不是邻居，自然是不会有其距离向量表信息保存下来的，但是，他们之间依然能够找到它们之间的最短链路
```
(0,0):0 (0,1):1 (0,2):2 (0,3):4 
(1,0):1 (1,1):0 (1,2):1 (1,3):3 
(2,0):2 (2,1):1 (2,2):0 (2,3):2 
(3,0):4 (3,1):3 (3,2):2 (3,3):0 
```



