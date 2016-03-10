/***
 * 会员后台弹窗调用
 */

var pizzaLayer = new function() {
	var _self = this;
	/**
	 * 弹出iframe弹窗
	 * @param width
	 * @param height
	 * @param title
	 * @param src
	 */
	_self.iframe = function(width, height, title, src, isparent) {
		var bodyWidth = $('html').width();
		$('html').css('overflow','hidden');
		var bodyWidthScrool = $('html').width();
		var scroolWidth = bodyWidthScrool - bodyWidth;
		$('html').css({'overflow':'hidden',"margin-right": scroolWidth});

		if(isparent) {
			parent.$.layer({
				type: 2,
				maxmin: false,
				shadeClose: false,
				title: title,
				border:[1,0.3,'#000'],
				shade: [0.6,'#000'],
				offset: ['150px',''],
				area: [width + 'px', height + 'px'],
				iframe: {src: src,scrolling:'auto'},
				success: function() {//隐藏父窗口滚动条

				},
				end: function() {
					$('html').removeAttr('style');
				}
			});
		}
		else {
			$.layer({
				type: 2,
				maxmin: false,
				shadeClose: false,
				title: title,
				border:[1,0.3,'#000'],
				shade: [0.6,'#000'],
				offset: ['150px',''],
				area: [width + 'px', height + 'px'],
				iframe: {src: src,scrolling:'auto'},
				success: function() {//隐藏父窗口滚动条

				},
				end: function() {
					$('html').removeAttr('style');
				}
			});
		}
	}

	/**
	 * 弹窗提示
	 * @param msg
	 * @param icon 1，3，5
	 * @param title
	 * @param fun
	 */
	_self.alert = function(msg, icon, title, fun) {
		icon = icon ? icon : 5;
		title = title ? title : '错误';
		if(fun) {
			layer.alert(msg, icon, title, fun);
		}
		else {
			layer.alert(msg, icon, title);
		}
	}
	/**
	 * 弹出小提示，弹出提示前关闭所有提示
	 * @param  {[type]} id    所依靠的元素，可以是jquery obj，'.class'，'#id'
	 * @param  {[type]} msg   显示的消息
	 * @param  {[type]} style 自定义附加样式
	 * @param  {[type]} time  自动关闭时间
	 * @param  {[type]} guide 停靠方向，默认在上方显示
	 * @return {[type]}       [description]
	 */
	_self.tips = function(id, options) {
		var defaults = {
			msg: $(id).attr('placeholder'),
			time: '60000',
			guide: 1,
			skin: ''
		};

		var options = $.extend(defaults, options);

		layer.tips(options.msg,  id, {
			skin:'layer-pizza-tip' + ' ' + options.skin,
			tips: options.guide,
			time: options.time,
			maxWidth: 1000,
			tipsMore: false//是否允许多个tips
		});
	}
	/**
	 * 提示消息
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	_self.msg = function(options) {
		var defaults = {
			time: 2000,
			msg: ''
		}

		var options = $.extend(defaults, options);
		if(options.id) {
			options.offset = $(options.id).offset().top + 50 + 'px';
		}
		layer.msg(options.msg, {
			time: options.time,
			offset: options.offset
		})

	}
	/**
	 * 点击出现弹窗
	 * @param obj 点击元素
	 * @param dropObj 下拉元素
	 * @param display 鼠标离开是否消失
	 */
	_self.tipForm = function(obj, dropObj, display) {
		$(obj).on('click', function() {
			var o = $(dropObj), op = $(obj).data('op'), opwhere = $(obj).data('opwhere');

			/*console.log(op);
			console.log(opwhere);
			console.log($(obj).html());
			if(op) {
				var opArr = op.split('&'),
					opWhereArr = op.split('/');
			  o.find('.input').each(function(i) {
					 $(this).attr('value',opArr[i].split('=')[1]);
				});
			}*/
			o.css({
				'display': 'block'
			}).focus();

			if(display) {
				o.on('blur', function() {
					o.css({
						'display': 'none'
					});
				});
			}
		});
	}
	/**
	 * 弹出复杂大提示
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	_self.detail = function(id) {
		//向页面添加弹出框
		if(!$('.tip-detail').length == 1) {
			$('body').append('<div style="position:absolute;"><div class="tip-detail"><i></i></div></div>');
		}
		var _this = $(id);
		var obj = $('.tip-detail');

		_this.hover(function() {
			var html = $(this).attr('placeholder') + '<i></i>';
			obj.html(html).css({'display':'block'});

			var left = $(this).offset().left + 'px';
			var top = $(this).offset().top - parseInt(obj.css('height')) - 15 + 'px';
			//console.log(left + '===' + top);
			obj.parent().css({'top': top, 'left': left});
		}, function() {
			obj.css({'display':'none'});
		});
	}
}
