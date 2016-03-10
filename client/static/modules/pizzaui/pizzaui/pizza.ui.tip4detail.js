/**
 * 
 * @authors lingirl (success99@126.com)
 * @date    2015-08-11 14:10:31
 * @version $Id$
 */


;(function($) {
	$.fn.tip4detail = function() {
		//向页面添加弹出框
		if(!$('#tip-36526349')[0]) {
			$('body').append('<div style="position:absolute;"><div class="tip-36526349"><i></i></div></div>');
		}
		var _this = $(this);
		var obj = $('.tip-36526349');

		_this.hover(function() {
			var html = $(this).attr('data-explain') + '<i></i>';
			obj.empty().append(html).css({'display':'block'});

			var left = $(this).offset().left + 'px';
			var top = $(this).offset().top - parseInt(obj.css('height')) - 15 + 'px';
			//console.log(left + '===' + top);
			obj.parent().css({'top': top, 'left': left});
		}, function() {
			obj.css({'display':'none'});
		});
	}
})(jQuery);