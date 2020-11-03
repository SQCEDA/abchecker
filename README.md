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

## Todo

+ [ ] 查找和标记图片内坐标的手段  
  + [x] ~~加载并显示大图片~~ 切分后的图片,直接用画图工具看图片内像素
  + [ ] 图片像素坐标计算

+ [x] 标记每个设计图的区域要从哪个照片里找的约定格式 <- 目前不需要了, 拼接意义上是大图片

## LICENSE

由于深刻的使用了[KLayout](https://github.com/klayoutmatthias/klayout)
本项目按照 GPLv3 开源
