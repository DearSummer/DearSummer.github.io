---
title: 实现一个@property
date: 2021-01-03 18:36:19
tags: 
    -Python
---

{% asset_img property.bmp property %}

<!-- more -->

------

正如一开始的图片所示，@property是一件十分之方便的工具，正如c#里面的get与set的语法糖似的，可以帮助我们快速的实现对象的约束，而不需要为其建立麻烦的getter与setter方法。

那么这个@property是一种怎么样的实现方式呢？

从语法上可以推测其实这是一种方法装饰器，本质上就是对这个方法进行一次加工与包装，使得其能够符合我们的使用意愿去进行操作。但是，其实@property还有一种操作方式那就是

```
class Object(object):
    def __init__(self):
        self.x = property(self.__getter,self.__setter,self.__deleter)

    def __getter(self):
        return self._x

    def __setter(self, value):
        self._x = value

    def __deleter(self):
        del self._x
```

在为property对象分别写入了get，set，del方法之后，x也同样拥有了以上的属性，可以看出，虽然@property利用了装饰器的语法，但是实际上内部的操作并不是如同装饰器一般对函数进行包装的。

## @property的实现原理

从Python源码来看property的基本结构就是get，set，del三个方法和对应这三个方法的成员变量
```
//property包含了get，set，del三个方法
typedef struct {
    PyObject_HEAD
    PyObject *prop_get;
    PyObject *prop_set;
    PyObject *prop_del;
    PyObject *prop_doc;
    int getter_doc;
} propertyobject;

//成员变量
static PyMemberDef property_members[] = {
    {"fget", T_OBJECT, offsetof(propertyobject, prop_get), READONLY},
    {"fset", T_OBJECT, offsetof(propertyobject, prop_set), READONLY},
    {"fdel", T_OBJECT, offsetof(propertyobject, prop_del), READONLY},
    {"__doc__",  T_OBJECT, offsetof(propertyobject, prop_doc), READONLY},
    {0}
};

//成员函数
static PyMethodDef property_methods[] = {
    {"getter", property_getter, METH_O, getter_doc},
    {"setter", property_setter, METH_O, setter_doc},
    {"deleter", property_deleter, METH_O, deleter_doc},
    {0}
};
```
然后，根据初始化方法可以看出需要输入get，set，del三个方法的函数指针（默认为None），然后会根据fget，fset，fdel所指向的函数作为改对象的__get__,__set__,__del__方法
```
static int
property_init(PyObject *self, PyObject *args, PyObject *kwds)
{
    PyObject *get = NULL, *set = NULL, *del = NULL, *doc = NULL;
    static char *kwlist[] = {"fget", "fset", "fdel", "doc", 0};
    propertyobject *prop = (propertyobject *)self;

    if (!PyArg_ParseTupleAndKeywords(args, kwds, "|OOOO:property",
                                     kwlist, &get, &set, &del, &doc))
        return -1;

    if (get == Py_None)
        get = NULL;
    if (set == Py_None)
        set = NULL;
    if (del == Py_None)
        del = NULL;

    Py_XINCREF(get);
    Py_XINCREF(set);
    Py_XINCREF(del);
    Py_XINCREF(doc);

    prop->prop_get = get;
    prop->prop_set = set;
    prop->prop_del = del;
    prop->prop_doc = doc;
    prop->getter_doc = 0;

    /* if no docstring given and the getter has one, use that one */
    if ((doc == NULL || doc == Py_None) && get != NULL) {
        PyObject *get_doc = PyObject_GetAttrString(get, "__doc__");
        if (get_doc) {
            if (Py_TYPE(self) == &PyProperty_Type) {
                Py_XSETREF(prop->prop_doc, get_doc);
            }
            else {
                /* If this is a property subclass, put __doc__
                in dict of the subclass instance instead,
                otherwise it gets shadowed by __doc__ in the
                class's dict. */
                int err = PyObject_SetAttrString(self, "__doc__", get_doc);
                Py_DECREF(get_doc);
                if (err < 0)
                    return -1;
            }
            prop->getter_doc = 1;
        }
        else if (PyErr_ExceptionMatches(PyExc_Exception)) {
            PyErr_Clear();
        }
        else {
            return -1;
        }
    }

    return 0;
}
```
而@property当中的getter，setter，deleter方法则是建立了一个Copy了一个新的@property对象给对应的函数
```
// getter方法
static PyObject *
property_getter(PyObject *self, PyObject *getter)
{
    return property_copy(self, getter, NULL, NULL);
}

// setter方法
static PyObject *
property_setter(PyObject *self, PyObject *setter)
{
    return property_copy(self, NULL, setter, NULL);
}

// deleter方法
static PyObject *
property_deleter(PyObject *self, PyObject *deleter)
{
    return property_copy(self, NULL, NULL, deleter);
}
```
## @property的Python实现
根据源码的实现可以在python层实现一个@property系统
```
class PyProperty(object):
	def __init__(self, field_get=None, field_set=None, field_del=None):
		self.field_get_func = field_get
		self.field_set_func = field_set
		self.field_del_func = field_del


	def __set__(self, instance, value):
		if self.field_set_func is None:
			raise AttributeError('setter not exist')
		return self.field_set_func(instance, value)

	def __get__(self, instance, type=None):
		if self.field_get_func is None:
			raise AttributeError('getter not exist')
		return self.field_get_func(instance)

	def __delete__(self, instance):
		if self.field_del_func is None:
			raise AttributeError('deleteter not exist')
		return self.field_del_func(instance)

	def getter(self, get_method):
		return PyProperty(get_method ,self.field_set_func, self.field_del_func)

	def setter(self, set_method):
		return PyProperty(self.field_get_func ,set_method, self.field_del_func)

	def deleteter(self, del_method):
		return PyProperty(self.field_get_func ,self.field_set_func, del_method)
```
在@property里的getter，setter，deleter方法的实质上就是使用装饰的函数重写为了对应对象的__get__,__set__,__delete__方法从而达到了包装属性的神奇的效果，也完成了函数->成员变量的包装的变化。