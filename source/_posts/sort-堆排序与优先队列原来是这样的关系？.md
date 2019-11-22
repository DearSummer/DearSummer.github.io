---
title: 'sort:堆排序与优先队列原来是这样的关系？'
abbrlink: e3e8096
date: 2019-11-22 18:45:57
tags:
 - algorithm
 - sort
photos:
 - https://www.monstersandcritics.com/wp-content/uploads/2018/09/Angels-Of-Death-Season-2-release-date-confirmed-Satsuriku-no-Tenshi-special-episodes-13-through-16-to-end-the-games-story.jpg
---

堆排序，优先队列，算法本质上都是一样的。

<!-- more -->

------

## 二叉堆

没错，无论是堆排序还是优先队列，使用的都是二叉堆。

二叉堆其实就是一颗完全二叉树，同时二叉堆也分为两种

- 最大堆
- 最小堆

最大堆说的就是，任何一个父节点的大小都是比子结点要大的。最小堆则是恰恰相反，任何一个父节点都要比子结点要小。

举个例子
```
  1
 2 3
4 5    
```

这就是最小堆☝

因为最大堆和最小堆的特点，决定了他们的堆顶元素一定是堆中最大的或者是最小的元素。

那么问题来了，我们应该怎么去构建一个堆呢?

对于一个二叉堆来说，应该是有三种操作
- 插入节点
- 删除节点
- 构建二叉堆

那么我们就一个个说明怎么操作的。

### 插入节点

对于一个节点的插入，我们会将其插入到二叉堆的尾部，也就是最后一个元素的后面。因为，我们不知道这个节点的具体应该是属于二叉堆当中的哪个位置，因此，我们需要不断的与其父节点进行对比。我们以最大堆为例，那就是假如插入节点比父节点大的时候，就和父节点交换位置，直到插入节点再也没有父节点或者说插入节点的父节点比插入节点大的时候才停止。我们将这个操作称之为上浮。
```cpp
while parentNode exist && newNode > parentNode
      swap(newNode,parentNode)
```

### 删除节点

当我们删除一个节点，其实并不是说删除任意一个节点，而是移除堆顶节点(pop)。没错，这个操作其实是和插入操作完全相反的，插入是向尾部，而移除是堆顶。当我们移除了堆顶元素的时候，我们这个时候选择最后一个节点作为新的堆顶元素，当然，这个新的节点一定是不合规矩的，就以最大堆为例，这个节点一定不是最大的。因此，我们就需要对堆进行调整，对这个节点进行下沉

首先，我们先找到这个节点的子节点，然后对两个节点进行对比，选择出其中最大的那个节点，假如目标节点比最大子节点小，就和最大子节点交换位置，这个操作一直到没有子节点或者是最大子节点都比自己小为止，这样，就可以使得这个目标节点回到正确的位置，而堆也恢复了原本的性质

至于为什么不是随便选一个节点，那当然是因为最后一个节点一定是没有叶子节点的，移动他没有什么代价。

```cpp
remove topNode;
move lastNode to top;

while lastNode lchild exist
   if lastNode has rchild and rchild > lchild
      targetChild = rchild
   if targetChild < lastNode
      break
   else
      swap lastNode,targetChild
```

### 构建二叉堆

一个二叉堆一开始当然是无序的🌶

因此，一开始我们就要构建一个二叉堆。构建这样一个堆，我们可以使用自底向上的方法去实现。首先，我们先从最后一个父节点开始构建，假如，这个父节点比最大的子节点小，那么父节点就需要下沉，这个下沉和删除节点的算法一样(因为是和最大的子节点替换，那么子节点一定就是符合二叉堆规矩的节点了)。然后，我们再去找上一个父节点，就这样，从最后一个父节点不断下沉，直到根节点，这样，一个二叉堆就构建起来了

```cpp
for node = last node which has leaf node to root
   while node lchild exist
   if node has rchild and rchild > lchild
      targetChild = rchild
   if targetChild < node
      break
   else
      swap node,targetChild
```

其实总结起来，二叉堆的算法只有下沉和上浮两种，加入了新节点上浮，构建堆和删除节点就下沉

不过，二叉堆虽然是看作一个完全二叉树，但是，他和一般的树又完全不同，他使用的是树组的形式来存储数据，就是说，他只是一颗逻辑上的完全二叉树，根据完全二叉树的节点的运算我们就可以知道，左孩子与右孩子与父节点的下标关系`lchild = parent*2 + 1,rchild = parent*2 + 2`


让我们具体来实现一下下沉与上浮以及构建树的算法。

```cpp

    void buildheap(vector<int>& nums)
    {
        for(int i = nums.size() / 2;i >= 0;i--)
        {
            sink(nums,i,nums.size());
        }
    }

    void raise(vector<int>& arr,int len)
    {
      int child = len - 1;
      int parent = (child - 1) / 2;
      int temp = arr[child];
      while(parent > 0 && arr[parent] > temp)
      {
          arr[child] = arr[parent];
          child = parent;
          parent = (parent - 1) / 2;
      }

      arr[child] = temp;
    }

    void sink(vector<int>& arr,int parent,int len)
    {
        int temp = arr[parent];
        int child = 2 * parent + 1;
        while(child < len)
        {
            int rchild = child + 1;
            if(rchild < len && arr[child] < arr[rchild])
                child = rchild;

            if(temp > arr[child])
                break;

            arr[parent] = arr[child];
            parent = child;
            child = child * 2 + 1;
        }


        arr[parent] = temp;

    }
```

## 堆排序

然后，我们进入我们的第一个正题(?)

既然我们知道了二叉堆有这么一个奇妙的特点，那么我们为什么不利用他来构建一个排序算法呢？毕竟二叉堆的建立以及恢复的时间复杂度只是O(logn)

其实是可以的，假如我们想要建立一个升序排序的数组，那么，我们完全首先先对数组`len=N`建立一个最大堆，那么这个时候`num[0]`的元素就是最大的元素了，然后，我们将其与数组最后一个元素交换`swap(num[0],num[N-1]`

是不是很熟悉？这个就是删除的操作要进行的事。

那么接下来只需要对堆顶元素进行下沉就完事了，而且，由于第一个元素已经脱离了堆，因此堆的长度就只剩下`len=N-l`，那么以此类推，我们将所有的最大的元素都向堆的末尾交换(如同删除堆顶元素)，那么，最后堆完全被删除之后，剩下的数组不就是有序的嘛。

这个操作因为每一次都要进行下沉操作，一共进行N次，所以时间复杂度为O(nlogn)和快速排序一样的。但是，有一点不同的就是，快速排序的最差时间复杂度是O(n^2),而这个即使是最差的情况也是O(nlogn)

不过，由于这个算法是原地排序的因此是不需要像快速排序一样耗费额外的空间，只需要O(1)的空间复杂度就可以了

```cpp
    vector<int> sortArray(vector<int>& nums) {
        buildheap(nums);
        
        for(int i = nums.size() - 1;i > 0;i--)
        {
           swap(nums[i],nums[0]);
           sink(nums,0,i);
        }

        return nums;
    }
```

## 优先队列

首先，我们先看看队列是啥？没错，队列就是一个先进先出的数据结构，那么优先队列是啥呢？优先队列则是最大(小)的永远是先出的。是不是，这又是二叉堆的操作

没错，实际上优先队列就是一个二叉堆，当push了一个新节点的时候，就是二叉堆的加入新节点，他会将新节点调整到堆合适的位置去，然后当pop元素的时候，就是删除一个堆顶元素，然后就是使用二叉堆的删除操作。

所以，所谓的优先队列其实就是维护着一个最大或者最小堆，然后进行队列的操作。

