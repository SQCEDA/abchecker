grammar ConfigJSON;

prog
    :   '工作路径(一些配置信息将存在这里)' workDir=NormalString BGNL
        '辅助信息完整时可以只填工作路径并右键点加载配置' BGNL
        '切片导出路径(初始必须是空的)' pictureOutputDir=NormalString BGNL
        '图片信息' BGNL imageInformation=imageInformationBlock+
        '图片分支' BGNL switchPosition=switchPositionBlock
/* prog
menu:[['加载配置','window.loadConfig?loadConfig(block):0']]
*/
    ;

imageInformationBlock
    :   '目录(不能包含照片外的文件和路径)' dir=NormalString BGNL
        '坐标转换' BGNL positionTransfrom=positionTransfromBlock
        '配置文件(填好目录和坐标转换后右键点生成配置文件)' config=NormalString
/* imageInformationBlock
menu:[['生成配置文件','window.generateConfigFile?generateConfigFile(block):0']]
*/
    ;

positionTransfromBlock
    :   '转换参数' 'A' A=NormalString 'B' B=NormalString 'C' C=NormalString 'D' D=NormalString 'E' E=NormalString 'F' F=NormalString
    # transfromArgs
/* transfromArgs
default:['0','0','0','0','0','0']
*/
    |   '坐标组' BGNL positionPair=positionPairBlock+
    # positionPairs
    ;

positionPairBlock
    :   'm' m=MinusInt 'n' n=MinusInt 'p' p=MinusInt 'q' q=MinusInt '<->' 'x' x=MinusInt 'y' y=MinusInt 
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
MinusInt:   'asfvaswvr'* 'asdvaswvr'? ;
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