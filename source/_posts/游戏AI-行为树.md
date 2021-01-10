---
title: 游戏AI-行为树
tags:
  - unity
  - game ai
abbrlink: cd3e3288
date: 2021-01-10 19:00:47
---

使用unity实现一个简单的行为树
<!-- more -->

------


## What Is Bahavior Tree
关于游戏的ai，使用行为树是一种比较简单的方式去操作ai行动逻辑的行为手段。

{% asset_img BT_Overview_Intro.png ue4中的行为树 %}

如上图所示，为ue4当中的行为树的表现方式，从根节点出发，自上而下，自左往右进行行为的判断或者操作，当节点的行为进行完毕的时候，就会返回true or false，并将控制权转移到父节点，父节点会根据子节点的执行的结果来判断下一步的执行。

在这一颗树当中，可以看作是一个没有终止条件的Loop，不断的从root节点开始，遍历着这棵树的节点，再由子节点内的内容条件来判断下一步的操作，在层层逻辑的递进之下，形成了ai的一套树形的行为模式。

## Tree Node
行为树由各个树节点组成，在我看来行为树的节点大致可以分为三类

### Composite Node

第一类,复杂节点，最主要的作用就是驱动行为树的运行模式，比如，顺序执行子节点，随机执行子节点，顺序执行子节点直到子节点返回失败等等逻辑操作，成为行为树的驱动中心

```csharp
    //顺序调度，直到子节点调用失败为止
    public class SequenceNode : CompositeNode
    {

        public override ProcessResult Process()
        {
            foreach (INode node in nodes)
            {
                ProcessResult result = node.Process();
                if (result == ProcessResult.Failed)
                    return ProcessResult.Failed;
                if (result == ProcessResult.Running)
                    return result;
            }

            return ProcessResult.Success;
        }
    }

    //顺序调度，直到子节点调用成功为止
    public class SelectorNode : CompositeNode
    {
        public override ProcessResult Process()
        {
            foreach(INode node in nodes)
            {
                ProcessResult result = node.Process();
                if (result == ProcessResult.Success)
                    return ProcessResult.Success;
                if (result == ProcessResult.Running)
                    return result;
            }
            return ProcessResult.Failed;
        }
    }
```
上面是两种比较典型的行为树节点，其实复杂节点作为行为树的逻辑驱动推断，可以根据ai的需求不断扩展，不过，个人感觉最终也是和程序运行一样，最终都是以`if`,`else`,`while`,`switch`的方式来进行逻辑的操控

### Action Node
第二类则是行为节点，在行为树当中，用于执行ai的操作的节点，包括不限于移动到某处，跳跃，是否离目标点距离x米之类的实际的行为判断与行为操作，在行为树当中是只能够作为叶子节点存在的节点。这种节点操作十分丰富，需要根据ai的实际操作需求来进行对应的行为节点的实现

```csharp
 public delegate ProcessResult ActionFunc(TreeContext context);

    //行动节点，不允许拥有子节点，为行为树最终需要进行指向的操作，行为树唯一允许成为子节点的节点
    public class ActionNode : BaseNode
    {
        public ActionNode()
        {
            maxChild = NodeChildLimit.NONE;
        }
        public override int NodeID { get; set; }

        public override INode Enter()
        {
            return null;
        }

        public override ProcessResult Process()
        {
            if (func != null)
            {
                ProcessResult result = func(this.context);
                if (result == ProcessResult.Running)
                    this.context.EnterSubtree(this);
                return result;
            }
                

            return ProcessResult.Failed;
        }

        public ActionFunc func { set; private get; }
    }
```
在我看来，应该是一种类似这样的结构，对于外部的行为需求，只需要外部传入一个行为func，之后就会在ActionNode当中进行操作与执行。

### Decorator Node
最后一类则是装饰节点，用于对节点的返回值进行修饰的操作的，比如取反。这类节点的具体用处就如同其名字一样。以便于我们更好的操作行为逻辑，就如同写代码会有出现
```py
if not has_key:
    do_something()
```
这种情况那样，更加方便去操作行为树的行为结构

```csharp
    //对执行结果取反
    public class OppositeNode : DecoratorNode
    {
        public override ProcessResult Process()
        {
            ProcessResult result = child.Process();
            if (result == ProcessResult.Success)
                return ProcessResult.Failed;
            else if (result == ProcessResult.Failed)
                return ProcessResult.Success;

            return result;
        }
    }
```

在这三类行为节点的驱动下，就可以简单的对这棵树进行逻辑上的操作了，不断根据复杂节点的驱动形式去驱动这棵树的行为，最终使得ai得到了我们想要操作的样子。

```csharp
    private void DoUpdate(INode node)
    {
        while (node != null)
        {
            node = node.Enter();
            if (node != null)
            {
                ProcessResult result = node.Process();
                if (result == ProcessResult.Running)
                {
                    break;
                }
                node = node.Leave();
            }

        }
    }
```
具体操作的逻辑大概也就是这样了。

## 行为树的驱动方式

按照我上面所写的驱动方式，大概就是行为树当中的Tick-Driven形式了，这是一种最简单的行为树的形式，这种形式需要不断的从行为树的根节点进行出发，在一个（或者几个）Tick的时间内重新执行一遍行为树，当ai的行为进入了比如移动到某处之类的需要长时间停留在某一个状态上的操作的时候，就有可能会出现不断遍历这颗行为树的情况（但是因为无论如何最终都会走到移动到某处这个节点上的）

因此，为了应对这种情况，就出现了一种Even-Driven形式的行为树了，这种行为树需要当事件到达的时候才会对行为树的节点进行下一步的操作，那么就可以避免当行为树在操作一个耗时的行为的时候却进行了无意义的行为树遍历所造成的资源的损耗的问题了

同时，这种结构也需要支持中断操作，就比如当当前行为树执行攻击玩家的操作的时候，玩家闪现跑路了，这个时候就需要中断这个行为了。需要在这个行为的基础之上需要重新唤醒整颗行为树，让其从当前节点（或者从root节点）开始继续进行后续逻辑的判断

在ue4当中就为其提供了`patrol`与`waitEvent`节点来进行相对应的操作

## 简单的行为树Demo

{% asset_img bt.gif %}

[简单的小框架](https://github.com/ShinyGX/BehaviorTreeDemo)