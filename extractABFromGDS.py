# -*- coding: utf-8 -*-
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'sqc-painter'))
if 1:
    import pya
    import paintlib
import json
from math import atan2,pi
noguitest=True

if noguitest:
    inputs=os.environ.get('abcheckpythoninput')
    argv=inputs.split(';')
    argi=0
    width = int(argv[argi]);argi+=1
    height = int(argv[argi]);argi+=1
    filename = argv[argi].strip();argi+=1
    outputfile = argv[argi].strip();argi+=1
else:
    width=8000
    height=28000
    filename = 'abc.gds'
    outputfile = ''

if noguitest:
    layout, top = paintlib.IO.Start("gds") 
else:
    layout, top = paintlib.IO.Start("guiopen") 
layout.dbu = 0.001  # 设置单位长度为1nm
paintlib.IO.pointdistance = 1000  
paintlib.IO.SetWoringDir(__file__)

if noguitest:
    painter=paintlib.TransfilePainter(filename=filename)
    painter.DrawGds(top,'sourcefile',pya.DCplxTrans())

def extractABFromGDS(sourceLayerList=[(2,0)]):
    output = []
    layers = paintlib.Collision.getLayers(layerList=sourceLayerList, layermod='in')
    for layer in layers:
        it=paintlib.IO.top.begin_shapes_rec(layer)
        while not it.at_end():
            shape_=it.shape()
            area_=shape_.area()
            
            if width*height*0.98 < area_ < width*height*1.02:
                # return shape_
                r=dict(
                    x=shape_.bbox().center().x,
                    y=shape_.bbox().center().y,
                )
                for a in shape_.dsimple_polygon.each_edge():
                    if height-10<a.length()/layout.dbu<height+10:
                        angle=atan2(a.dy(),a.dx())
                        if angle<0:
                            angle+=pi
                        r['angle']=angle
                        break
                output.append(r)
            else:
                # shape_.delete()
                pass
            it.next()
    return output

aboutput=extractABFromGDS()
if noguitest:
    with open(outputfile,'w',encoding='utf8') as fid:
        json.dump(aboutput,fid,indent=1)
    print(len(aboutput))
else:
    print(len(aboutput),'\n',aboutput[0:5])