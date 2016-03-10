/**
 * 
 * @authors 左盐 (huabinglan@163.com)
 * @date    2015-09-11 16:55:26
 * @version $Id$
 */


var menunav = new function() {
	_self = this;
	_self.choose = function() {
		var href = document.location.href;
		var hrefArray = href.split('/');
		var type = hrefArray[3];
		var obj = $('#navmenu > li');
		switch(type) {
			case 'space': $(obj[1]).find('a').addClass('choose'); break;
			default: $(obj[0]).find('a').addClass('choose');
		}
	}
}

module.exports = menunav;