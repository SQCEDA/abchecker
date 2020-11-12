# -*- coding: utf-8 -*-
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'sqc-painter'))
if 1:
    import pya
    import paintlib
import json
from math import atan2,pi,sqrt
noguitest=True

if noguitest:
    inputs=os.environ.get('abcheckpythoninput')
    argv=inputs.split(';')
    argi=0
    width = int(argv[argi]);argi+=1
    height = int(argv[argi]);argi+=1
    workDir = argv[argi].strip();argi+=1
else:
    width=8000
    height=28000
    workDir = os.environ.get('a')


if noguitest:
    layout, top = paintlib.IO.Start("gds") 
else:
    layout, top = paintlib.IO.Start("guiopen") 
layout.dbu = 0.001  # 设置单位长度为1nm
paintlib.IO.pointdistance = 1000  
paintlib.IO.SetWoringDir(__file__)

class g:
    ab=[]
    progress={}
    errorlist = []
    infolist = []

def generateSolution():
    with open(workDir+'/ab.json') as fid:
        g.ab=json.load(fid)
    with open(workDir+'/progress.json') as fid:
        g.progress=json.load(fid)

    for smark,slist in [['errorp',g.errorlist],['infop',g.infolist]]:
        for index,pv in g.progress.items():
            if pv.get('class')==smark:
                ab=g.ab[int(index)]
                slist.append([ab,pv,index])

    layer_error = layout.layer(2, 2)
    layer_warn = layout.layer(1, 1)

    for slayer,slist in [[layer_error,g.errorlist],[layer_warn,g.infolist]]:
        for ab,pv,index in slist:
            radius = sqrt(width**2+height**2)
            pts=paintlib.BasicPainter.arc(pya.DPoint(ab['x'],ab['y']),radius,3*4+1,0,360)
            hole=pya.DPolygon(pts)
            paintlib.BasicPainter.Draw(top,slayer,hole)


    if noguitest:
        paintlib.IO.Write(workDir+'/solution.gds') # 输出到文件中
    else:
        paintlib.IO.Show() # 输出到屏幕上

    print(f'''
    {len(g.ab)} AB total
    {len(g.progress.keys())} AB checked
    {len(g.errorlist)} error, {len(g.infolist)} comment:
    ''')
    for ab,pv,index in g.errorlist:
        print(ab)
    for ab,pv,index in g.infolist:
        print(pv['comment'],'\n   ',ab)
generateSolution()

