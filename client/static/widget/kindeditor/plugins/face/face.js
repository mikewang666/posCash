/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
*
* @author 乔祝垒 <huabinglan@163.com>
*******************************************************************************/
var ke_nface;
KindEditor.plugin('face', function(K) {
	var self = this, name = 'face',
		path = (self.facePath || self.pluginsPath + 'face/images/'),
		currentPageNum = 1;
	    self.clickToolbar(name, function() {
			$(".letter").remove();
		   var rows = 5, cols = 14, total = 70, startNum = 0,
			cells = rows * cols, pages = Math.ceil(total / cells),
			colsHalf = Math.floor(cols / 2),
			elements = [],
			menu = K.widget({
			    width:583,
				x:parseInt($("#mailsend").offset().left),
				y:parseInt($("#mailsend").offset().top)-225,
				z:101,
				centerLineMode:false,
				html:'<span class="iicon44" style="left:399px;"></span><span class="iicon18" onclick="hideFace();"></span><p class="face00"></p>',
				css:{
					background:'#ffffff'
				},
				cls:"face",
				shadowMode:true
			});
		function bindCellEvent(cell, j, num) {
			cell.mouseover(function() {
					clearTimeout(ke_nface);
					K(this).children().css("border","1px solid blue");
					if((num%14)<=7){
						$(".face00").html('<img src="'+path+num+'.gif" style="margin-top:24px;"/>').css({display:"block",left:429});
					}
					else{
						$(".face00").html('<img src="'+path+num+'.gif" style="margin-top:24px;"/>').css({display:"block",left:73});
					}
			});
			cell.mouseout(function() {
				K(this).children().removeAttr('style');
				ke_nface=setTimeout(function(){$(".face00").removeAttr("style");},1000);
			});
			cell.click(function(e) {
				self.insertHtml('<img src="' + path + num + '.gif" border="0" />');//.hideMenu().focus();
				editor.focus();
				e.stop();
				hideFace();
			});
		}
		function createEmoticonsTable(pageNum, parentDiv){
			var table = document.createElement('table');
			menu.div.append(table);
			table.className = 'facec';
			table.cellPadding = 0;
			table.cellSpacing = 0;
			table.border = 0;
			var num = (pageNum - 1) * cells + startNum;
			for (var i = 0; i < rows; i++) {
				var row = table.insertRow(i);
				for (var j = 0; j < cols; j++) {
					var cell = K(row.insertCell(j));
					bindCellEvent(cell, j, num);
					var span = K('<span class="faceb0 face'+num+'"></span>');
					cell.append(span);
					elements.push(cell);
					num++;
				}
			}
			$("body").bind("click",function(){$(".face").remove();$("body").unbind("click");})
		}
		createEmoticonsTable(currentPageNum);
		function removeEvent() {
			K.each(elements, function() {
				this.unbind();
			});
		}
	});
});
/********辅组函数************/
///隐藏表情窗口
function hideFace(){
	$(".face").remove();
	$("body").unbind("click");
}
