/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
*
* @author 乔祝垒 <huabinglan@163.com>
*******************************************************************************/
var ke_nface;
KindEditor.plugin('letter', function(K) {
	var self = this, name = 'letter',
		path = (self.facePath || self.pluginsPath + 'letter/images/'),
		currentPageNum = 1;
	    self.clickToolbar(name, function() {
		   var rows = 5, cols = 14, total = 70, startNum = 0,
			cells = rows * cols, pages = Math.ceil(total / cells),
			colsHalf = Math.floor(cols / 2),
			elements = [],
			menu1 = K.widget({
			    width:583,
				x:parseInt($("#mailsend").offset().left)+10,
				y:parseInt($("#mailsend").offset().top)-230,
				z:101,
				centerLineMode:false,
				html:'<span class="iicon44"></span><span class="iicon18" onclick="letterfun.hideLetter();"></span><p class="face00"></p>',
				css:{
					background:'#ffffff'
				},
				cls:"letter",
				shadowMode:true,
				beforeRemove : function() {
					removeEvent();
				}
			});
		function createLetterTable(){
			var eml ,i=letterArray.length,s='';
			  for(var j=0;j<i;j++){
				  if(j%8==0){
					s+='<ul>'
				  }
				  s+='<li onclick="letterfun.setEdit(this);" title="'+letterArray[j].title+'"><img src="'+letterArray[j].img+'" /><span>'+letterArray[j].table+'</span></li>';
				  if(j%8==7||j==i){
					s+='</ul>';
				  }
			  }
			elm=K('<div id="lettermainp"><div id="lettermain" style="margin-left:0px;">'+s+'</div></div>');
			menu1.div.append(elm);
			menu1.div.append(K('<div style="width:577px;height:26px;margin:0px 0px px 6px;border-top:1px solid #b9c7d3;clear:both;"><span class="iicon47"   onclick="letterScroll(2);"></span><span class="iicon46"></span><span class="iicon45" onclick="letterScroll(1);"></span></div>'));
		}
		createLetterTable();
		function removeEvent() {
			K.each(elements, function() {
				this.unbind();
			});
			$(".letter").remove();
			$(".face").remove();
			$("body").unbind("click");
		}
	});
});
/********辅组函数************/
var letterArray=[
    {
        "title": "不使用信纸",
        "img": "/images/letter/default/1.jpg",
        "table": "<table><tr><td></td></tr></table>"
    },
	{
		"title":"经典灰",
		"img":"/images/letter/default/1.jpg",
		"table":"<table><tr><td style=\"padding:37px 19px 37px 24px;line-height:24px;background-color:#e6e6e7;\"></td></tr><tr></tr></table>"
	},
    {
        "title": "青葱岁月",
        "img": "/images/letter/letter1/1.jpg",
        "table": "<table><tr><td></td></tr></table>"
    }
];

var letterfun=new function(){
	var _self=this;
	_self.letterScroll=function(from){//窗口滚动函数
		var oo=$("#lettermain");
		var oleft=parseInt(oo.css("margin-left").replace("px",""));
		if(from==1){
			if(oleft<=-1166){oleft=583};
			 $("#lettermain").css("margin-left",oleft-583);
		}
		else{
			if(oleft>=0){oleft= -1749;};
			 $("#lettermain").css("margin-left",oleft+583);	
		}
	}
	_self.setEdit=function(obj){//设置信纸
		var ss=$(editor.html()),ss1=$($(obj).children("span").html());
		var sc="";
		if(ss.find("td").length==0){
			sc=editor.html();
		}
		else{
			sc=ss.find("td").html();
		}
		var st=ss1.find("td").attr("style");
		var sssss='<table><tr><td style="'+st+'">'+sc+'</td></tr></table>';
		alert(sssss);
		editor.html(sssss);
	}
	_self.hideLetter=function(){//隐藏窗口
		$(".letter").remove();
	}
}