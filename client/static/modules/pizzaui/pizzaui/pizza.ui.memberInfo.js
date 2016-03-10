/**
 * 
 * @authors lingirl (success99@126.com)
 * @date    2015-08-11 14:10:31
 * @version $Id$
 */


;(function($) {
	$.fn.memberInfo = function(options) {
		if(!$('.member-14300018')[0]) {
			$('body').append('<div style="position:absolute;"><div class="member-14300018"></div></div>');
		}

		var
		oAvatar = $(this),//触发事件的DOM对象
		obj = $('.member-14300018'),//信息卡片所在的DOM
		arrow,//卡片箭头的方向
		left, top,//定位用到的left与top
		cache,//缓存获取到的会员信息
		str;//内部使用的字符串
		//
		var defaults = {
			url: '/user/person/getdoc'
		};

		options = $.extend(defaults, options);

		oAvatar.hover(function() {
			var _parent = $('.member-14300018').parent();
			//用于判断信息卡片是在上方还是在下方显示
			var flag = Math.floor($(this).offset().top);
			left = Math.floor($(this).offset().left) + 'px';
			cache = $(this).data('dbMember');

			if(flag > 150) {
				top = flag - 170 + 'px';
				arrow = '<i class="arrow-1234"></i>';
			} else {
				top = flag + parseInt($(this).css('height')) + 10 + 'px';
				arrow = '<i class="arrow-4321"></i>';
			}

			// ajax 数据
			var data = 'id=' + $(this).attr('id') + '&nid=' + $(this).attr('nid');

			if( cache ) {
				str = arrow + '<span class="span-1">欧阳国华</span><span><em>/</em>总经理助理<br>账号：18638176787<br>俄罗斯（中国）李凯尔特医疗器械股份责任有限公司<br>广东-深圳<em>/</em>博士<em>/</em>0371-663221148</span><label>餐饮，火腿肠，面包，饮料机，厨房用品，厨房用</label>';
				obj.empty().append( str ).css({'display':'block'});
			} else {
				/*$.ajax({
					type: 'POST',
					url : options.url,
					data: data,
					dataType: 'JSON',
					success : function(msg) {
						$(this).data('dbMember', msg.data);
						str = arrow + '<i></i><span class="span-1">欧阳绝对</span><span><em>/</em>总经理助理<br>账号：18638176787<br>俄罗斯（中国）李凯尔特医疗器械股份责任有限公司<br>广东-深圳<em>/</em>博士<em>/</em>0371-663221148</span><label>餐饮，火腿肠，面包，饮料机，厨房用品，厨房用</label>';
						obj.empty().append( str ).css('display', 'block');
						_parent.css({'left': left, 'top': top});
					}
				});*/
				str = arrow + '<span class="span-1">欧阳 XX</span><span><em>/</em>总经理助理<br>账号：18638176787<br>俄罗斯（中国）李凯尔特医疗器械股份责任有限公司<br>广东-深圳<em>/</em>博士<em>/</em>0371-663221148</span><label>餐饮，火腿肠，面包，饮料机，厨房用品，厨房用</label>';
					obj.empty().append( str ).css({'display':'block'});
					_parent.css({'left': left, 'top': top});
			}
		}, function() {
			obj.css({'display':'none'});
		});
	}
})(jQuery);


                            
























