/**
 * @authors lingirl (success99@126.com)
 * @date    2015-07-23 10:10:31
 * @description  城市选择
 * @version $Id$
 */


;(function($) {
	$.fn.pizzaArea = function(options) {
		var oUl, oInput = $(this),

		//保存选择的省份
		province,

		//城市选择是否满足规则
		isRight = [0, 0],

		//本地化存储，减少请求
		local_area/* = store.get('local_area') || {}*/,

		//内部随机数,匹配使用
		random = Math.ceil(Math.random()*(1e+10));

		var defaults = {
			//默认false, 城市中不包含"不限"
			//true -- 城市中包含"不限"
			type: true
		};

		options = $.extend( defaults, options );

		//初始化函数
		function init() {
			//getData();
			getFocus();
			getClick();
			getBlur();
		}

		/**
		 * 将 input 扩展为下面的形式
		 * 
		 * <div>
		 *     <input>
		 *     <ul></ul>
		 * </div>
		 * 
		 */
		function getWrap() {
			oInput.wrap('<div class="area-wrap-1234"></div>').after('<ul class="area-list" area="' + random + '"></ul>').attr('area', random);
			oUl = oInput.siblings('ul');
			init();
		}

		/**
		 * 手动输入城市
		 * 获取城市相关数据
		 * data: string
		 */
		function getData(data) {
			$.ajax({
				type: 'POST',
				url : options.ajaxUrl,
				data: 'data=' + data,
				dataType: 'JSON',
				success : function(msg) {
					var list = '';
					if($.isEmptyObject(msg)) {
						oUl.empty().append('<span style="line-height: 3em;">未找到这个城市！</span>')
					} else {
						for(var i in msg) {
							list += '<li area="' + i + '">' + msg[i] + '</li>';
						}
						oUl.empty().append(list).children('li').css({'width':'100%'});
						display(1);
					}
				}
			});
		}
		/**
		 * 本地化存储,数据格式为
		 * 
		 * {
		 *     name: '河南',
		 *     sub : {
		 *     		0: 郑州,
		 *     		1: 新乡,
		 *     		...
		 *     }
		 * }
		 * 
		 */
		function localStorage(data) {
			for(var k in data) {
				var arr = k.split('-');
				if(arr[1]) {
					local_area[arr[0]]['sub'][k] = data[k];
				} else {
					local_area[k] = {};
					local_area[k]['name'] = data[k];
					local_area[k]['sub'] = {};
				}
			}
			store.set('local_area', local_area);
		};
		/**
		 * 向城市列表所在的DOM添加城市数据
		 * mark为-1时,添加省份
		 * mark >= 0时,添加城市 
		 */
		function appendData(mark) {
			var data = store.get('local_area');
			var list = '';

			if(options.type) {
				list += '<li area="unlimited">不限</li>';
			}

			if(mark == -1) {
				for(var i in data) {
					list += '<li area="' + i + '">' + data[i]['name'] + '</li>';
				}
			} else {
				var empty = $.isEmptyObject(data[mark]['sub']);
				//本地未查询到数据时,向服务器请求
				if(empty) {
					$.ajax({
						type: 'POST',
						url : options.ajaxUrl,
						data: 'data=' + mark,
						dataType: 'JSON',
						success : function(msg) {
							localStorage(msg);
							appendData(mark);
						}
					});
				} else {
					var temp = data[mark]['sub']
					for(var j in temp) {
						list += '<li area="' + j + '">' + temp[j] + '</li>';
					}
				}
			}
			
			oUl.empty().append(list);
		};
		//城市列表所在DOM元素的显示与隐藏
		function display(dis) {
			if(dis) {
				//oUl.css({'display':'block'});
				oUl.fadeIn(200);
			} else {
				//oUl.css({'display':'none'});
				oUl.fadeOut(200);
			}
		};
		/**
		 * input 元素获得焦点
		 * 及键盘事件的绑定
		 */
		function getFocus() {
			var lastValue = ' ';
			oInput.on('keyup focus', function(e) {
				
				var inputValue = $.trim($(this).val());
				var flag = inputValue.indexOf('-') == -1;
				var unequal = inputValue != lastValue;
				//
				//如果输入框包含'-'及非汉字
				//则不进行搜索
				if(flag) {
					var chineseReg = /[^\u4E00-\u9FA5]/g;
					if(chineseReg.exec(inputValue)) {
						return;
					}
				}

				if(e.type == 'focus') {

					$('.area-list').css({'display':'none'});
					local_area = store.get('local_area');

					if(!local_area) {
						local_area = {};
						$.ajax({
							type: 'POST',
							url : options.ajaxUrl,
							data: 'data=9999',
							dataType: 'JSON',
							success : function(msg) {
								localStorage(msg);
								appendData(-1);
								display(1);
							}
						});
					} else {
						appendData(-1);
						display(1);
					}
				}
				
				if(e.type == 'keyup') {
					//
					if(e.keyCode == 37 || e.keyCode == 39 || inputValue.indexOf('不') > -1) {
						return;
					}
					//
					if(unequal) {
						isRight = [0, 0];
					}
					//
					if(!inputValue.length && e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
						appendData(-1);
						display(1);
					}
					//
					if(inputValue.length && flag && unequal && e.keyCode != 38 && e.keyCode != 40) {
						//服务器搜索
						getData(inputValue);
					}
				}
				//
				lastValue = inputValue;
				keyboard(e.keyCode);
			});
		};
		/**
		 * 省份和城市被点击后执行的事件
		 */
		function getClick() {
			//
			oUl.on('click', 'li', function() {
				var oLi = $(this);
				var str = oLi.attr('area');
				var text = oLi.text();
				//--`不限`被点击
				if(str == 'unlimited') {
					if(province) {
						oInput.val(province);
					} else {
						oInput.val(text);
					}
					display(0);
					province = null;
					isRight = [1, 1];
					return;
				}
				//--`河南-郑州`这种形式被点击
				var reg = /^c\d{10}/;
				if(reg.exec(str)) {
					oInput.val(text);
					display(0);
					isRight = [1, 1];
					return;
				}
				//省份被点击
				if(str.indexOf('-') == -1) {
					appendData(str);
					province = text;
					oInput.val(text);
					isRight = [1, 0];
				} else {
					//省份下的城市被点击
					oInput.val(province + '-' + text);
					display(0);
					province = null;
					isRight = [1, 1];
				}
			});
		};
		/**
		 * 键盘事件 上下键和回车键
		 * keycode 为键盘的编码
		 */
		function keyboard(keycode) {
			var cls = 'red';
			var checked = oUl.children('.' + cls);
			var idx = checked.index();

			var obj_li = oUl.children('li');
			var li_len = obj_li.length;
			
			if(keycode == 40) {// DOWN
				if(idx == -1) {
					obj_li.eq(0).addClass(cls);
				} else if(idx == li_len - 1) {
					checked.removeClass(cls);
					obj_li.eq(0).addClass(cls);
				} else {
					checked.removeClass(cls).next().addClass(cls);
				}
				//
			} else if(keycode == 38) { // UP
				if(idx == -1) {
					obj_li.eq(-1).addClass(cls);
				} else if(idx == 0) {
					checked.removeClass(cls);
					obj_li.eq(-1).addClass(cls);
				} else {
					checked.removeClass(cls).prev().addClass(cls);
				}
			} else if(keycode == 13) { // ENTER
				checked.click();
			}
		};

		function getBlur() {
			oInput.on('blur', function() {
				none();
			});
		}
		//不在列表区域点击
		//列表消失
		function none() {
			var eventSpace = 'click.chengshixuanze';
			$("body").off(eventSpace).on(eventSpace, function(event){
			    if($(event.target).attr('area')) {
			    	var target = event.target.nodeName.toLowerCase();
			    	if(target == 'input' && isRight[0] + isRight[1] != 2) {
			    		oInput.val('');
			    	}
			    	return;
			    }
			   	$('.area-list').css('display','none');
			   	if(isRight[0] + isRight[1] != 2) {
			   		oInput.val('');
			   	}
		    });
		};
		//
		getWrap();
	}
})(jQuery);


                            
























