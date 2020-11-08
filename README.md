# abchecker
airbridge检查器

## 流程

分成以下几步,  
标记每个设计图的区域要从哪个照片里找  
-描述的接口  
每个照片内部如何定位  
-查找和标记图片内坐标的手段(!难点)  
-套刻的手法  
解析所有图层2/0,判断并切图  
-切图的接口  
人工判断  
-前端界面  
-{完美/非完美/致命}三选一|{是/不是}标准ab二选一  
-图片左上角'非完美',右上角'致命',左下角'不是',右下角'注释'  
导出为解决方案  
-一个用来做减法的gds  

**更改**

切图时不旋转, 展示时旋转

## 坐标转换

设计图坐标 x,y 单位纳米

照片像素作标 m,n,p,q 
+ m,n 是第m列切片, 第n行切片
+ p,q 是到左侧和顶部的像素数
+ -> u,v = `m*width+p,n*height+q`

假设转换关系是

Ax+By+C=u  
Dx+Ey+F=v  

用最小二乘法计算出系数:

$$
m=\begin{bmatrix}
    x_1 & x_2 & x_3 & ... \\
    y_1 & y_2 & y_3 & ... \\
  \end{bmatrix}
,
n=\begin{bmatrix}
    u_1 & u_2 & u_3 & ... \\
    v_1 & v_2 & v_3 & ... \\
  \end{bmatrix}
$$

$$
k=\begin{bmatrix}
    A & B \\
    D & E \\
  \end{bmatrix}
,
b=\begin{bmatrix}
    C & 0  \\
    0 & F  \\
  \end{bmatrix} 
  \cdot
  \begin{bmatrix}
    1 & 1 & 1 & ...  \\
    1 & 1 & 1 & ...  \\
  \end{bmatrix}
$$

$$
L = \left\lVert k\cdot m+b-n \right\rVert _2^{\space \space 2}
$$

为了使 $L$ 取到最小

形如 $\frac{\partial L}{\partial A} = 0$ 的6个线性方程, 由 Crammer 法则解出 A~F

用 $\bar{pq}$ 代表 $(\Sigma p_i q_i)/n$, 
$\bar{p1}$ 代表 $(\Sigma p_i \cdot 1)/n$, 
$\bar{1q}$ 代表 $(\Sigma 1 \cdot q_i)/n$

$$
A=\begin{vmatrix}
    \bar{xu} & \bar{xy} & \bar{x1} \\ 
    \bar{yu} & \bar{yy} & \bar{y1} \\
    \bar{1u} & \bar{1y} & \bar{11} \\ 
  \end{vmatrix}
  /
  \begin{vmatrix}
    \bar{xx} & \bar{xy} & \bar{x1} \\ 
    \bar{yx} & \bar{yy} & \bar{y1} \\
    \bar{1x} & \bar{1y} & \bar{11} \\ 
  \end{vmatrix}
$$

$$
B=\begin{vmatrix}
    \bar{xx} & \bar{xu} & \bar{x1} \\ 
    \bar{yx} & \bar{yu} & \bar{y1} \\
    \bar{1x} & \bar{1u} & \bar{11} \\ 
  \end{vmatrix}
  /
  \begin{vmatrix}
    \bar{xx} & \bar{xy} & \bar{x1} \\ 
    \bar{yx} & \bar{yy} & \bar{y1} \\
    \bar{1x} & \bar{1y} & \bar{11} \\ 
  \end{vmatrix}
$$

$$
C=\begin{vmatrix}
    \bar{xx} & \bar{xy} & \bar{xu} \\ 
    \bar{yx} & \bar{yy} & \bar{yu} \\
    \bar{1x} & \bar{1y} & \bar{1u} \\ 
  \end{vmatrix}
  /
  \begin{vmatrix}
    \bar{xx} & \bar{xy} & \bar{x1} \\ 
    \bar{yx} & \bar{yy} & \bar{y1} \\
    \bar{1x} & \bar{1y} & \bar{11} \\ 
  \end{vmatrix}
$$

DEF同理,把$\bar{*u}$换成$\bar{*v}$

效果比想像的差很多, 套了8组点, 误差还是10微米的量级

## 图片处理后端

+ https://github.com/image-size/image-size  
npm install image-size  
MIT License  

+ https://github.com/aheckmann/gm  
npm install gm  
MIT License  

+ https://github.com/imagemagick/imagemagick  
https://imagemagick.org/download/binaries/ImageMagick-7.0.10-35-portable-Q16-x64.zip  
derived Apache 2.0 license  

gm的接口不是很友善, 考虑换到sharp  
sharp直接安装还失败了一次, 或者是先不在gm拼接在网页端完成拼接和旋转

+ https://github.com/lovell/sharp  
npm install sharp  
Apache License, Version 2.0  

## Todo

+ [ ] 给定mnpq来拼图切图的后端组件

+ [ ] 实现x,y到图片编号和像素坐标的组合, 图片编号不一致时报越界

+ [x] 从gds图转化出所有ab的位置和方向

+ [x] 给配置和坐标转化搭建后端

+ [x] 在页面上能缓存输入

+ [x] 查找和标记图片内坐标的手段  
  + [x] ~~加载并显示大图片~~ 切分后的图片,直接用画图工具看图片内像素
  + [x] 图片像素坐标计算的公式推导
  + [x] 描述坐标对和计算结果的接口
  + [ ] 更加方便互相计算坐标的手段

+ [x] 标记每个设计图的区域要从哪个照片里找的约定格式

## LICENSE

由于深刻的使用了[KLayout](https://github.com/klayoutmatthias/klayout)
本项目按照 GPLv3 开源
