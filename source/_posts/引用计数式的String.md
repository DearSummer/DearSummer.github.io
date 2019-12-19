---
title: 引用计数式的String
tags:
  - c++
abbrlink: '93e26237'
date: 2019-12-18 21:16:07
---

与std::string不一样的string

<!-- more -->

------

在std::string当中，虽然提供了很多string的操作，但是，在内存上它的本质也只是一个`vector<char>`而已，对于以下的状态
```cpp
std::string str1 = "hello world";
std::string str2 = str1;
```
在实际上是两段完全不同的内存。但是，假如我们变成这样
```cpp
str5 = str4 = str3 = str2 = str1;
```
那岂不是对于一个相同的字符串却申请了五段的内存。这其实是一种浪费。我们完全可以只用一段内存，而其他的strn只需要持有那段内存的指针就可以了。这样，我们就可以减少内存的消耗了。同时，为了防止有人一不小心就将这段内存给销毁，因此，我们可以拿一个计数器去记录一共有多少人在同时持有这段内存。一旦有人`delete strn`了，就将计数器减一，直到计数器为零的时候才将这段内存给销毁。

```cpp

String::~String()
{
	removeReferenceCount();
	if(referenceCount == 0)
		delete[] data;
	
}
```
大概就是着种感觉吧。这种技术就称之为**引用计数**

不过，现在还有一个问题，那就是既然是多人同时持有一个内存块，那么就会导致一个问题，那就是比如`strn[0] = 'y'`那么，所有人都会受到波及。这明显不是我们想要看到的，因此，我们为了防止这种现象，当需要修改这个`strn`的时候，我们先将内存块复制一份，然后，`strn`独自持有这一份的内存。那么，它无论怎么去修改它自己的字符串都不是问题了。

这也是和String的初衷是一样的，那就是不会改变原有的使用方式，每一个str在用户看来都是独立的，即使内存是映射到同一个区域
```cpp
//const是不会被改变的
const char& String::operator[](int index)const
{
	return data[index];
}

//假设所有使用非const版本的operator[]都是会修改字符串的
char& String::operator[](int index)
{
	makeCopy();
	return data[index];
}
```
大概的思路就是这样的。这种技术就叫做**写时复制**，在操作系统的进程与子进程之间的内存映射也是用到了这种技术哦。

既然大致的思路都已经思考出来了，我们就考虑实现吧。

## RCObject
既然是要用到了引用计数，那么我们为这个引用计数设计一个类吧

```cpp
    class RCObject
    {
        public:

        void addReference();
        void removeReference();
        void markUnshareable();

        bool isShareable() const;
        bool isShared() const;

        protected:

        RCObject();
        RCObject(const RCObject& rhs);
        RCObject& operator=(const RCObject& rhs);
        virtual ~RCObject() = 0;

        private:

        int refCount;
        bool shareable;

    };
```

由于要引用计数，refCount是必不可少的，同时为了记录这块内存是不是可共享的，我们也需要shareable来记录

```cpp
    RCObject::RCObject()
        :refCount(0),shareable(true)
    {}

    RCObject::RCObject(const RCObject& rhs)
        :refCount(0),shareable(true)
    {}

    RCObject& RCObject::operator=(const RCObject& rhs)
    {
        return *this;
    }

    RCObject::~RCObject(){}

    void RCObject::addReference(){++refCount;}
    void RCObject::removeReference(){if(--refCount == 0) delete this;}
    void RCObject::markUnshareable(){shareable = false;}

    bool RCObject::isShareable() const { return shareable;}
    bool RCObject::isShared() const {return refCount > 1;}
```

