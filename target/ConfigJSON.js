// Generated from ConfigJSON.g4 by antlr-blockly

var grammarFile="grammar ConfigJSON;\r\n\r\nprog\r\n    :   '图片信息' BGNL imageInformation=imageInformationBlock+\r\n        '图片分支' BGNL switchPosition=switchPositionBlock\r\n    ;\r\n\r\nimageInformationBlock\r\n    :   '目录' dir=NormalString BGNL\r\n        '配置文件(填好目录后右键菜单点生成配置文件)' config=NormalString\r\n/* imageInformationBlock\r\nmenu:[['生成配置文件','alert(\"生成配置文件-功能尚未实现\")']]\r\n*/\r\n    ;\r\n\r\nswitchPositionBlock\r\n    :   '使用 x,y 代表设计图内坐标, 按照分支进入指定图片' BGNL\r\n        '0 代表不处理, 1~n 对应该编号的图片' BGNL\r\n        switchPositionAction+\r\n    ;\r\n\r\nswitchPositionAction\r\n    :   '如果' condition=conditionExpr '则:' BGNL trueCase=switchPositionAction+ \r\n        '否则' BGNL falseCase=switchPositionAction+\r\n    # ifAction\r\n    |   '图片' pictureId=Int\r\n    # returnAction\r\n    ;\r\n\r\nstatExprSplit : '=== statement ^ === expression v ===' ;\r\n\r\nconditionExpr\r\n    :   a=conditionExpr op=OP_List b=conditionExpr\r\n    # opConditionExpr\r\n    |   a=NormalString\r\n    # valueConditionExpr\r\n/* valueConditionExpr\r\ndefault : ['x >= 0']\r\n*/\r\n    ;\r\n\r\nNormalString: ('asdsaw'+)*;\r\nOP_List:    'and'|'or' ;\r\n\r\nInt :   [0-9]+ ;\r\nBool:   'true'|'false' ;\r\nColour:   'asdfgdh'* ;\r\nBGNL:   'asfvaswvr'? 'asdvaswvr'? ;\r\n\r\nMeaningfulSplit : '=== meaningful ^ ===' ;\r\n\r\n/* Insert_FunctionStart\r\nConfigJSONBlocks.switchPositionBlock.json.nextStatement=undefined;\r\nConfigJSONBlocks.ifAction.json.nextStatement=undefined;\r\nConfigJSONBlocks.returnAction.json.nextStatement=undefined;\r\n\r\nsetTimeout(() => {\r\n    window.blocklyInitDone?blocklyInitDone():0\r\n}, 0);\r\n*/";
var option={"type":"option","defaultGenerating":"JSON","blocklyRuntime":{"type":"blocklyRuntimeStatement","path":"antlr-blockly/","files":"blockly_compressed.js, blocks_compressed.js, javascript_compressed.js, zh-hans.js"},"blocklyDiv":{"type":"fixedSizeBlocklyDiv","id":"blocklyDiv","height":"550px","width":"1000px"},"toolbox":{"type":"toolboxDefault","id":"toolbox","gap":5},"codeArea":{"type":"codeAreaStatement","output":"function(err,data){window.setBlocklyOutput?setBlocklyOutput(err,data):document.getElementById('codeArea').innerText=err?String(err):data}"},"target":{"type":"keepGrammar"}};
option.target.type="independentFile";
var converter = Converter.withOption(grammarFile,option);
var script = document.createElement('script');
script.innerHTML = converter.js.text();
document.body.appendChild(script);
