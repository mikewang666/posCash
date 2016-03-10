/**
 * 
 * @authors 左盐 (huabinglan@163.com)
 * @date    2015-09-01 10:04:09
 * @version $Id$
 */

var $ = require('jquery');
var pizzalayer = require('pizzalayer');

/**
 * 菜单消失事件
 * @param  {[type]} event) {               var o [description]
 * @return {[type]}        [description]
 */
$("body").off('click.space-nav-menu').on('click.space-nav-menu', function(event) {
    var o = $(event.target);
    var select = o.parents('.space-nav-menu');
    if(select.length == 0) {
    	 $('.space-nav-menu:visible').css('display', 'none'); //清除所有的可见菜单
    }
});
/**
 * 菜单悬停
 * @param  {[type]} ) {               var o [description]
 * @return {[type]}   [description]
 */
$('.spacenavright > a > span').mouseover(function() {
    var o = $(this);
    pizzalayer.tips(this, null, '', 0, 0);
    var tabs = o.attr('tabs');
    var tabsWidth = 342;     
    $('.space-nav-menu:visible').css('display', 'none'); //清除所有的可见菜单
    if (tabs) {
        var left = o.offset().left - $('.spacenavright').offset().left - tabsWidth + 30 + 22;
        $('.' + tabs).css({
            'display': 'block',
            'left': left
        });
    }
}).mouseout(function() {
    layer.closeAll('tips');
});
