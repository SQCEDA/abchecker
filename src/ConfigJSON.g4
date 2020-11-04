grammar ConfigJSON;

prog
    :   '图片信息' BGNL imageInformation=imageInformationBlock+
        '图片分支' BGNL switchPosition=switchPositionBlock
    ;

imageInformationBlock
    :   '目录' dir=NormalString BGNL
        '配置文件(填好目录后右键菜单点生成配置文件)' config=NormalString
/* imageInformationBlock
menu:[['生成配置文件','alert("生成配置文件-功能尚未实现")']]
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
Bool:   'true'|'false' ;
Colour:   'asdfgdh'* ;
BGNL:   'asfvaswvr'? 'asdvaswvr'? ;

MeaningfulSplit : '=== meaningful ^ ===' ;

/* Insert_FunctionStart
ConfigJSONBlocks.switchPositionBlock.json.nextStatement=undefined;
ConfigJSONBlocks.ifAction.json.nextStatement=undefined;
ConfigJSONBlocks.returnAction.json.nextStatement=undefined;

setTimeout(() => {
    window.blocklyInitDone?blocklyInitDone():0
}, 0);
*/