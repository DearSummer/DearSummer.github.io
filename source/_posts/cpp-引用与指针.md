---
title: 'cpp:引用与指针'
abbrlink: 1987fc9d
date: 2019-10-22 15:46:10
tags:
 - cpp
---

引用和指针，到底有什么不同呢？

<!-- more -->

------

## 区别

在c++当中，引用是别名，已经初始化就无法更改，而指针则是指向某一区域的内存的地址，是可以修改的。

而在函数当中，形参的传递分为值传递，引用传递和指针传递。其中，指针传递和引用传递都是可以避免复制数值的时候产生的不必要的复制花销。也拥有可以直接改变传入的参数的值的效果。那么，他们之间到底有没有什么区别呢？

### 引用传递与指针传递

首先，为了测试，我们先写了如下的代码。
```cpp
int global = 100;
int &refGlobal = global;
int *ptrGlobal = &global;

void funcRef(int& ref)
{
	ref++;
}

void funcPtr(int *ptr)
{
	(*ptr)++;
}

int main()
{
	int a = 1;
	funcRef(a);
	funcRef(global);
	funcRef(refGlobal);

	funcPtr(&a);
	funcPtr(&global);
	return 0;
}

```

然后，再看看其中翻译过后的汇编代码。

```nasm
//funcRef
0000000000001135 <_Z7funcRefRi>:
    1135:	55                   	push   %rbp
    1136:	48 89 e5             	mov    %rsp,%rbp
    1139:	48 89 7d f8          	mov    %rdi,-0x8(%rbp)
    113d:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
    1141:	8b 00                	mov    (%rax),%eax
    1143:	8d 50 01             	lea    0x1(%rax),%edx
    1146:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
    114a:	89 10                	mov    %edx,(%rax)
    114c:	90                   	nop
    114d:	5d                   	pop    %rbp
    114e:	c3                   	retq   

//funcPtr
000000000000114f <_Z7funcPtrPi>:
    114f:	55                   	push   %rbp
    1150:	48 89 e5             	mov    %rsp,%rbp
    1153:	48 89 7d f8          	mov    %rdi,-0x8(%rbp)
    1157:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
    115b:	8b 00                	mov    (%rax),%eax
    115d:	8d 50 01             	lea    0x1(%rax),%edx
    1160:	48 8b 45 f8          	mov    -0x8(%rbp),%rax
    1164:	89 10                	mov    %edx,(%rax)
    1166:	90                   	nop
    1167:	5d                   	pop    %rbp
    1168:	c3                   	retq   

```

不难看出，他们的操作是一样的，从%rdi中取出函数传递的值，然后，保存在自己的栈帧中，一顿操作后，再放回（%rax)所记录的内存当中(也就是值原本所在的内存位置)

那么，指针和引用的存储形式是一样的吗？

### 指针与引用在汇编中的形式

```nasm
0000000000001169 <main>:
    1169:	55                   	push   %rbp
    116a:	48 89 e5             	mov    %rsp,%rbp
    116d:	48 83 ec 10          	sub    $0x10,%rsp
    1171:	64 48 8b 04 25 28 00 	mov    %fs:0x28,%rax
    1178:	00 00 
    117a:	48 89 45 f8          	mov    %rax,-0x8(%rbp)
    117e:	31 c0                	xor    %eax,%eax
    1180:	c7 45 f4 01 00 00 00 	movl   $0x1,-0xc(%rbp)
    1187:	48 8d 45 f4          	lea    -0xc(%rbp),%rax
    118b:	48 89 c7             	mov    %rax,%rdi
    118e:	e8 a2 ff ff ff       	callq  1135 <_Z7funcRefRi>
    1193:	48 8d 3d 76 2e 00 00 	lea    0x2e76(%rip),%rdi        # 4010 <global>  0x2e76 + 0x119a = 0x4010
    119a:	e8 96 ff ff ff       	callq  1135 <_Z7funcRefRi>
    119f:	48 8d 05 6a 2e 00 00 	lea    0x2e6a(%rip),%rax        # 4010 <global>  0x2e61 + 0x11a9 = 0x4010
    11a6:	48 89 c7             	mov    %rax,%rdi
    11a9:	e8 87 ff ff ff       	callq  1135 <_Z7funcRefRi>
    11ae:	48 8d 45 f4          	lea    -0xc(%rbp),%rax
    11b2:	48 89 c7             	mov    %rax,%rdi
    11b5:	e8 95 ff ff ff       	callq  114f <_Z7funcPtrPi>
    11ba:	48 8d 3d 4f 2e 00 00 	lea    0x2e4f(%rip),%rdi        # 4010 <global> 0x2e4f + 0x11c1 = 0x4010
    11c1:	e8 89 ff ff ff       	callq  114f <_Z7funcPtrPi>
    11c6:	b8 00 00 00 00       	mov    $0x0,%eax
    11cb:	48 8b 55 f8          	mov    -0x8(%rbp),%rdx
    11cf:	64 48 33 14 25 28 00 	xor    %fs:0x28,%rdx
    11d6:	00 00 
    11d8:	74 05                	je     11df <main+0x76>
    11da:	e8 51 fe ff ff       	callq  1030 <__stack_chk_fail@plt>
    11df:	c9                   	leaveq 
    11e0:	c3                   	retq   
    11e1:	66 2e 0f 1f 84 00 00 	nopw   %cs:0x0(%rax,%rax,1)
    11e8:	00 00 00 
    11eb:	0f 1f 44 00 00       	nopl   0x0(%rax,%rax,1)

```

这是main刚刚的代码的main函数。可以看出，无论是不是局部变量，还是全局变量，指针和引用的本质都是使用了相对应的内存地址而已。可以说，本质来说，引用和指针都是一个指针而已。

所以，引用和指针的区别确实只是体现在是否可以改变这一点上而已(或许还有指针用->，引用只需要.?)

其实，我们可以打开elf文件当中的符号表看看他们之间的关系
```nasm
    46: 0000000000004018     8 OBJECT  GLOBAL DEFAULT   24 ptrGlobal              // [24]=> .data
    47: 0000000000003dc0     8 OBJECT  GLOBAL DEFAULT   21 refGlobal              // [21]=> .data.rel.ro
    48: 0000000000001135    26 FUNC    GLOBAL DEFAULT   14 _Z7funcRefRi
    49: 0000000000000000     0 NOTYPE  WEAK   DEFAULT  UND _ITM_deregisterTMCloneTab
    50: 0000000000004000     0 NOTYPE  WEAK   DEFAULT   24 data_start
    51: 0000000000004020     0 NOTYPE  GLOBAL DEFAULT   24 _edata
    52: 0000000000001254     0 FUNC    GLOBAL HIDDEN    15 _fini
    53: 0000000000004010     4 OBJECT  GLOBAL DEFAULT   24 global                  // [24]=> .data
```

其实不难看出，指针和原本的global都是存在.data条目当中的，也就是存在在内存当中的。而引用refGlobal却只是在只读可重定位条目当中，本身是不占有任何内存空间的。

因此，他们之间的区别虽然在汇编代码当中没有比较明确的体现出来，但是，在内存的占用上却是比较确切的体现了出来。


因此，当我们修改一下代码
```cpp
int global = 100;
int &refGlobal = global;
int *ptrGlobal = &global;

void funcRef(int& ref)
{
	ref++;
}

void funcPtr(int *ptr)
{
	(*ptr)++;
}

int main()
{
	int a = 1;
	funcRef(a);
	funcRef(global);
	funcRef(refGlobal);
	
	//增加了这个，全局变量的指针
	funcPtr(ptrGlobal);
	funcPtr(&a);
	funcPtr(&global);
	return 0;
}

```

不难推测，传递到%rax当中的绝对是全局变量prtGlobal的值。
```nasm
0000000000001169 <main>:
    1169:	55                   	push   %rbp
    116a:	48 89 e5             	mov    %rsp,%rbp
    116d:	48 83 ec 10          	sub    $0x10,%rsp
    1171:	64 48 8b 04 25 28 00 	mov    %fs:0x28,%rax
    1178:	00 00 
    117a:	48 89 45 f8          	mov    %rax,-0x8(%rbp)
    117e:	31 c0                	xor    %eax,%eax
    1180:	c7 45 f4 01 00 00 00 	movl   $0x1,-0xc(%rbp)
    1187:	48 8d 45 f4          	lea    -0xc(%rbp),%rax
    118b:	48 89 c7             	mov    %rax,%rdi
    118e:	e8 a2 ff ff ff       	callq  1135 <_Z7funcRefRi>
    1193:	48 8d 3d 76 2e 00 00 	lea    0x2e76(%rip),%rdi        # 4010 <global>
    119a:	e8 96 ff ff ff       	callq  1135 <_Z7funcRefRi>
    119f:	48 8d 05 6a 2e 00 00 	lea    0x2e6a(%rip),%rax        # 4010 <global>
    11a6:	48 89 c7             	mov    %rax,%rdi
    11a9:	e8 87 ff ff ff       	callq  1135 <_Z7funcRefRi>
    11ae:	48 8b 05 63 2e 00 00 	mov    0x2e63(%rip),%rax        # 4018 <ptrGlobal>  0x2e63 + 0x11b5 = 0x4018
    11b5:	48 89 c7             	mov    %rax,%rdi
    11b8:	e8 92 ff ff ff       	callq  114f <_Z7funcPtrPi>
    11bd:	48 8d 45 f4          	lea    -0xc(%rbp),%rax
    11c1:	48 89 c7             	mov    %rax,%rdi
    11c4:	e8 86 ff ff ff       	callq  114f <_Z7funcPtrPi>
    11c9:	48 8d 3d 40 2e 00 00 	lea    0x2e40(%rip),%rdi        # 4010 <global>
    11d0:	e8 7a ff ff ff       	callq  114f <_Z7funcPtrPi>
    11d5:	b8 00 00 00 00       	mov    $0x0,%eax
    11da:	48 8b 55 f8          	mov    -0x8(%rbp),%rdx
    11de:	64 48 33 14 25 28 00 	xor    %fs:0x28,%rdx
    11e5:	00 00 
    11e7:	74 05                	je     11ee <main+0x85>
    11e9:	e8 42 fe ff ff       	callq  1030 <__stack_chk_fail@plt>
    11ee:	c9                   	leaveq 
    11ef:	c3                   	retq   

```

事实确实如此。

因此，也可以看出，只有引用和指针在全局变量（或者静态变量）的时候会出现不同，因为，这些都是可以出现在符号表当中的内容。
