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

既然都说到写时复制,那么，我们完全可以使用之前所说的[RCPtr](https://dearsummer.github.io/posts/dbb7ef5e/#%E6%9B%B4%E5%A4%9A)去实现这个对于字符串的内存共享的功能。

## StringValue

立即行动，将String实现。

```cpp
    class String
    {
    public:
        String (const char *value);

        const char& operator[](int index) const;
        char& operator[](int index);

    private:

        struct StringValue: public RCObject
        {
            char* data;

            StringValue(const char *initValue);
            StringValue(const StringValue& rhs);
            void init(const char *initValue);
            ~StringValue();
        };

        

        RCPtr<StringValue> value;
    };
```

其中里面的StringValue就是用来缓存字符串的，而在外部使用了`RCPtr<StringValue>`确保了对字符串的内容的正确的缓存

```cpp

  void String::StringValue::init(const char* initValue)
    {
        data = new char[strlen(initValue) + 1];
        strcpy(data,initValue);
    }

    String::StringValue::StringValue(const char* initValue)
    {
        init(initValue);
    }

    String::StringValue::StringValue(const StringValue& rhs)
    {
        init(rhs.data);
    }

    String::StringValue::~StringValue()
    {
        delete[] data;
    }
```

当需要新的字符串类型的时候会生成新的`StringValue`，假如对于字符串的修改没有任何问题的话，那么，就会增加引用计数。不过，这里有一个问题，我们和`RCPtr`里面的设计是一样的，假设`const char& operator[](int i) const`为不改变字符串的方式而`char& operator[](int i)`为改变字符串的方式。但实际上，我们对于调用哪一个函数并不取决于是否会发生改变，而仅仅是因为类型匹配而已，假如发生了这种事情。
```cpp
String s = "hello";
std::cout << s[0] << std::endl;
s[1] = 'y';
```
我们可以认为，第三行的操作会影响到字符串而第二行的操作却没有。但是，我们调用的很可能是同一个`operator[]`，因为，这个并不取决于是否发生了改变。因此，我们需要一种方式去更加的准确的预测是否会引起字符串的改变的操作。

## CharProxy
我们需要一个代理类。代理类的作用其实只是为我们争取到时间，争取到我们确切的操作字符的时候我们才确认我们的操作到底是应该怎么去做。

```cpp
	struct CharProxy
        {
            CharProxy(String& s,int index);
            
            CharProxy& operator=(const CharProxy& ths);
            CharProxy& operator=(char c);

            operator char() const;

            char* operator&();
            const char *operator&() const;

        private:
            String& str;
            int charIndex;

            void makeCopy();
        };
```

首先，我们`String`返回的`operator[]`变成了`CharProxy`。那么，外界持有这个代理类的时候，当使用了赋值操作的时候，那么，就会触发`operator=`的操作，那么自然而然就会触发写时复制。而假如仅仅是使用这个字符，那么，自然就会隐式转换到char的类型,因为定义了`operator char()`方法。而这个时候就不会触发写时复制了。也就节省了以此内存拷贝的操作。

同样，因为我们使用了代理类，那么我们有一些操作就会和`char`的操作不一样。为了消除这种不一致的行为，我们就将一些操作给重载了，这里重载了取地址的运算。因为，其他运算可以通过对char的隐式转换而达成。值得一提的是，因为取了地址就有了潜在的修改的可能，因此，也需要进行写时复制。

```cpp
    class String
    {
    public:
        String (const char *value);
       
        struct CharProxy
        {
            CharProxy(String& s,int index);
            
            CharProxy& operator=(const CharProxy& ths);
            CharProxy& operator=(char c);

            operator char() const;

            char* operator&();
            const char *operator&() const;

        private:
            String& str;
            int charIndex;

            void makeCopy();
        };

        const String::CharProxy operator[](int index) const;
        String::CharProxy operator[](int index);

        friend std::ostream& operator<<(std::ostream& os,const String& str);

        friend class CharProxy;
    private:

        struct StringValue: public RCObject
        {
            char* data;

            StringValue(const char *initValue);
            StringValue(const StringValue& rhs);
            void init(const char *initValue);
            ~StringValue();
        };

        

        RCPtr<StringValue> value;
    };

    String::String(const char *initValue = "")
        :value(new StringValue(initValue)){}

    const String::CharProxy String::operator[](int index) const
    {
        return String::CharProxy(const_cast<String&>(*this),index);
    }

    String::CharProxy String::operator[](int index)
    {
        return String::CharProxy(*this,index);
    }

    String::CharProxy::CharProxy(String& s,int index)
        :str(s),charIndex(index){}
    
    String::CharProxy::operator char() const
    {
        return str.value->data[charIndex];
    }

    std::ostream& operator<<(std::ostream& os,const String& str)
    {
        os << str.value->data;
        return os;
    }

    const char *String::CharProxy::operator&() const
    {
        return &(str.value->data[charIndex]);
    }

    char * String::CharProxy::operator&()
    {
        makeCopy();
        str.value->markUnshareable();

        return &(str.value->data[charIndex]);
    }

    String::CharProxy& String::CharProxy::operator=(const String::CharProxy& rhs)
    {
        makeCopy();
        str.value->data[charIndex] = rhs.str.value->data[rhs.charIndex];
        return *this;
    }

    String::CharProxy& String::CharProxy::operator=(char c)
    {
        makeCopy();
        str.value->data[charIndex] = c;
        return *this;
    }

    void String::CharProxy::makeCopy()
    {
        if(str.value->isShared())
        {
            RCPtr<StringValue> rcptr(new StringValue(str.value->data));
            str.value = rcptr;
        }
    }

    void String::StringValue::init(const char* initValue)
    {
        data = new char[strlen(initValue) + 1];
        strcpy(data,initValue);
    }

    String::StringValue::StringValue(const char* initValue)
    {
        init(initValue);
    }

    String::StringValue::StringValue(const StringValue& rhs)
    {
        init(rhs.data);
    }

    String::StringValue::~StringValue()
    {
        delete[] data;
    }
```

使用代理类可以延缓我们的操作，直到真正在使用它的时候才进行操作。这符合了`lazy evaluation`的优化守则，因此，对于引用多而修改少的时刻会比较有优势。

> 参考书籍《more effective c++》 这是里面的String的实现方式
