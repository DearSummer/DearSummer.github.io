---
title: Unity 多选框的实现
tags:
  - Unity
abbrlink: 13ed8ac0
date: 2019-04-24 17:29:47
---

{% asset_img d.png %}

<!-- more -->

------

### 思路

框选难点在与如何知道在世界坐标系的可选择物体与用在屏幕上框选的方框的的位置的对比.

因此,可以选择将所有可选择物体的世界坐标转化为屏幕上的坐标,然后,再与屏幕上的方框的位置进行对比,既可以得出在方框内的所有物体了.

### 实现

首先,实现这个功能需要有三个步骤

#### 步骤一:确定多选框的位置

确定多选框的位置实现比较简单,就是利用鼠标点下的时候记录矩形的开始坐标,在鼠标抬起的时候记录矩形的结束坐标

在Update()当中可以轻松实现  

\```csharp

// Update is called once per frame  

void Update()  

{  

​    if (Input.GetMouseButtonDown(0))  

​    {  

​        mIsDrawRectangle = true;   //开始绘制多选框  

​        mStartPos = Input.mousePosition;  

​    }  

​    else if (Input.GetMouseButtonUp(0))  

​    {  

​        mIsDrawRectangle = false; //结束绘制多选框  

​        mEndPos = Input.mousePosition;  

​        //检查被选中的物体  

​        CheckSelection(mStartPos, mEndPos);  

​    }  

}

\```

#### 步骤二:框选框的实现

在Unity当中,在屏幕上的绘图可以利用OpenGL的函数来实现.

在OnPostRender()函数当中也可以很轻松的实现框框的绘制(由于只是对屏幕的绘制,因此比放在Update()当中更加适合)

\```csharp

private void OnPostRender()  

{  

​    if (mIsDrawRectangle)  

​    {  

​        //实时获取需要绘制的矩形的大小  

​        mEndPos = Input.mousePosition;  

​        GL.PushMatrix();  //将矩阵入栈  

​        //矩形框的颜色的材质  

​        if (rectMat == null)  

​        {  

​            return;  

​        }  

​        rectMat.SetPass(0);  

​        GL.LoadPixelMatrix();  

​        //绘制一个半透明的矩形  

​        DrawRect();  

​        //绘制矩形的边  

​        DrawLine();  

​        //完成绘制,将矩阵出栈  

​        GL.PopMatrix();  

​    }  

}  

 private void DrawLine()  

 {  

 //绘制线条的模式  

​    GL.Begin(GL.LINES);  

​    GL.Color(mRectColor);  

 //将每一个点都输入进去,然后进行线条的绘制  

​    GL.Vertex3(mStartPos.x, mStartPos.y, 0);  

​    GL.Vertex3(mEndPos.x, mStartPos.y, 0);  

​    GL.Vertex3(mEndPos.x, mStartPos.y, 0);  

​    GL.Vertex3(mEndPos.x, mEndPos.y, 0);  

​    GL.Vertex3(mEndPos.x, mEndPos.y, 0);  

​    GL.Vertex3(mStartPos.x, mEndPos.y, 0);  

​    GL.Vertex3(mStartPos.x, mEndPos.y, 0);  

​    GL.Vertex3(mStartPos.x, mStartPos.y, 0);  

​    GL.End();  

 }  

 private void DrawRect()  

 {  

 //绘制区域的模式  

​    GL.Begin(GL.QUADS);  

​    GL.Color(  

​    new Color(rectMat.color.r, rectMat.color.g,     rectMat.color.b, 0.1f));  

 //绘制的时候要按照一定的路线进行绘制  

​    GL.Vertex3(mStartPos.x, mStartPos.y, 0);  

​    GL.Vertex3(mEndPos.x, mStartPos.y, 0);  

​    GL.Vertex3(mEndPos.x, mEndPos.y, 0);  

​    GL.Vertex3(mStartPos.x, mEndPos.y, 0);  

​    GL.End();  

 }  

\```

#### 步骤三:将可选择的物体与多选框进行位置上的对比

将可选择物体的屏幕坐标与框框的大小进行对比即可

\```csharp

private void CheckSelection(Vector3 startPos, Vector3 endPos)  

{  

​    //p1为矩形x,y值的最小值  

​    //p2为矩形x,y值的最大值  

​    Vector3 p1 = Vector3.zero;  

​    Vector3 p2 = Vector3.zero;  

​    if (startPos.x > endPos.x)  

​    {  

​        p1.x = endPos.x;  

​        p2.x = startPos.x;  

​    }  

​    else  

​    {  

​        p1.x = startPos.x;  

​        p2.x = endPos.x;  

​    }  

​    if (startPos.y > endPos.y)  

​    {  

​        p1.y = endPos.y;  

​        p2.y = startPos.y;  

​    }  

​    else  

​    {  

​        p1.y = startPos.y;  

​        p2.y = endPos.y;  

​    }  

​    //寻找被选中的目标与没有被选中的目标  

​    foreach (var obj in characterList)  

​    {  

​        //物体的位置  

​        Vector3 location = Camera.main.WorldToScreenPoint(obj.transform.position);  

 //在方框内且没有被遮挡才可以被选中  

​        if (location.x < p1.x || location.x > p2.x || location.y < p1.y || location.y > p2.y  

 || location.z < Camera.main.nearClipPlane  

 || location.z > Camera.main.farClipPlane)  

​        {    

​            //没选中  

​            obj.GetComponent<MeshRenderer>().material.color = Color.blue;  

​        }  

​        else  

​        {  

​            //选中  

​            obj.GetComponent<MeshRenderer>().material.color = Color.red;  

​        }  

​    }  

}  

\```

从此就可以实现多选的效果了