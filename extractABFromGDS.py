# -*- coding: utf-8 -*-
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'sqc-painter'))
if 1:
    import pya
    import paintlib
filename = sys.argv[1]

layout, top = paintlib.IO.Start("gds") 
layout.dbu = 0.001  # 设置单位长度为1nm
paintlib.IO.pointdistance = 1000  
paintlib.IO.SetWoringDir(__file__)

painter=paintlib.TransfilePainter(filename=filename)
painter.DrawGds(top,'sourcefile',pya.DCplxTrans())

def extractABFromGDS(sourceLayerList=[(2,0)]):
    layers = paintlib.Collision.getLayers(layerList=sourceLayerList, layermod='in')
    for layer in layers:
        it=paintlib.IO.top.begin_shapes_rec(layer)
        while not it.at_end():
            shape_=it.shape()
            area_=shape_.area()
            std=8*28*1000*1000
            if std*0.98 < area_ < std*1.02:
                pass
            else:
                # shape_.delete()
                pass
            it.next()
extractABFromGDS()