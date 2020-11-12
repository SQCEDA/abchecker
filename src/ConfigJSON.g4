grammar ConfigJSON;

prog
    :   '工作路径(一些配置信息将存在这里)' workDir=NormalString BGNL
        '>配置已存在时可以只填工作路径并右键点加载配置' BGNL
        '图片信息' BGNL imageInformation=imageInformationBlock+
        '>图片信息填完后右键计算图片信息' BGNL
        'GDS路径' gdsPath=NormalString BGNL
        'KLayout路径' klayoutPath=NormalString BGNL
        'ABWidth' ABWidth=Number BGNL
        'ABHeight' ABHeight=Number BGNL
        '>右键点从GDS提取AB信息' BGNL
        '图片分支(暂时无效,锁定为1)' BGNL switchPosition=switchPositionBlock
        '切片导出路径' pictureOutputDir=NormalString BGNL
        '切图像素尺寸(暂时填200)' cutPixelSize=Number BGNL
        '切图并行数(填1.5*cpu核数取整)' cutParallel=Number BGNL
        '>右键点从图片切出AB' BGNL
        '切图展示尺寸(暂时填140)' viewPixelSize=Number BGNL
        '>右键点人工检查判断AB' BGNL
        '>右键点生成解决方案' BGNL
/* prog
menu:[['test','window.testFunction?testFunction(block):0'],['保存配置','window.saveConfig?saveConfig(block):0'],['加载配置','window.loadConfig?loadConfig(block):0'],['计算图片信息','window.calculateImageInformation?calculateImageInformation(block):0'],['从GDS提取AB信息','window.extractABFromGDS?extractABFromGDS(block):0'],['从图片切出AB','window.extractMainProcess?extractMainProcess(block):0'],['人工检查判断AB','window.openHumanCheck?openHumanCheck(block):0'],['生成解决方案','window.generateSolution?generateSolution(block):0'],]
*/
    ;

imageInformationBlock
    :   '目录(目录内不能包含照片外的文件和路径)' dir=NormalString BGNL
        '配置文件名(建议取目录的最后一级)' config=NormalString BGNL
        '坐标转换' BGNL positionTransfrom=positionTransfromBlock
    ;

positionTransfromBlock
    :   '转换参数' 'A' A=Number 'B' B=Number 'C' C=Number 'D' D=Number 'E' E=Number 'F' F=Number
    # transfromArgs
/* transfromArgs
default:['0','0','0','0','0','0']
*/
    |   '坐标组' BGNL
        '设计图坐标 x,y 单位纳米' BGNL
        '照片像素作标 m,n,p,q' BGNL
        'm,n 是第m列切片, 第n行切片' BGNL
        'p,q 是到左侧和顶部的像素数' BGNL
        '(注意顺序是 nmpq 而不是 nmpq )' BGNL
        positionPair=positionPairBlock+
    # positionPairs
    ;

positionPairBlock
    :   'n' n=Number 'm' m=Number 'p' p=Number 'q' q=Number '<->' 'x' x=Number 'y' y=Number 
/* positionPairBlock
default:['1','1','0','0','0','0']
*/
    ;

switchPositionBlock
    :   '使用 x,y 代表设计图内坐标, 按照分支进入指定图片' BGNL
        '0 代表不处理, 1~n 对应该编号的图片' BGNL
        switchPositionAction+
    ;

switchPositionAction
    :   '如果' condition=conditionExpr '则:' BGNL trueCase=switchPositionAction+ 
        '否则' BGNL falseCase=switchPositionAction+
    # ifAction
    |   '图片' pictureId=Int
    # returnAction
    ;

statExprSplit : '=== statement ^ === expression v ===' ;

conditionExpr
    :   a=conditionExpr op=OP_List b=conditionExpr
    # opConditionExpr
    |   a=NormalString
    # valueConditionExpr
/* valueConditionExpr
default : ['x >= 0']
*/
    ;

NormalString: ('asdsaw'+)*;
OP_List:    'and'|'or' ;

Int :   [0-9]+ ;
Number:   'asfvaswvr'* 'asdvaswvr'? ;
Bool:   'true'|'false' ;
Colour:   'asdfgdh'* ;
BGNL:   'asfvaswvr'? 'asdvaswvr'? ;

MeaningfulSplit : '=== meaningful ^ ===' ;

/* Insert_FunctionStart
var endBlocks=[
    "switchPositionBlock",
    "ifAction",
    "returnAction",
    "transfromArgs",
    "positionPairs",
]
endBlocks.forEach(blockname => {
    ConfigJSONBlocks[blockname].json.nextStatement=undefined
})

setTimeout(() => {
    window.blocklyInitDone?blocklyInitDone():0
}, 0)
*/