/**
 * datatable的实现，使用方法参考demo
 * @Version 0.2
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-2 下午6:05
 */
function witchDataTable(id, options) {

	var _self = this;
	var defaults = {
		thead: {},//默认表头
		data: {},
		search: {
			'id': '#search',
			'input': '#input',
			'url': ''
		}
	}

	var options = $.extend(defaults, options);

	var _dom = $(id);
	_dom.data('line', 1);

	function init() {
		$.ajax({
			type: "post",
			url: options.data.url,
			dataType: 'json',
			success: function (msg) {

				var thead = '<thead><tr>';
				var theadOp = options.thead;
				for (var i = 0, _l = theadOp.length; i < _l; i++) {
					thead += '<th style="width:' + theadOp[i].width + '">' + theadOp[i].name + '</th>';
				}
				thead += '<th>&nbsp;</th></tr></thead>';

				var data = msg, line = _dom.data('line');
				thead += '<tbody>';
				for (var i = 0, dl = data.length; i < dl; i++) {
					var d = data[i];

					if (d['id'] === undefined) {
						break;
					}
					thead += '<tr id="' + d['id'] + '"><td>' + line + '</td>';
					for (var dk in d) {
						if (dk != 'id') {
							thead += '<td class="' + d[dk] + '">' + $.trim(dk) + '</td>';
						}
					}
					thead += '<td></td></tr>';
					_dom.data('line', ++line);

				}
				thead += '</tbody>';
				_dom.append(thead);
				_dom.find('th').each(function (i) {//添加表单验证规则
					if (theadOp[i]) {
						$(this).data('validate', theadOp[i].validate).data('edit', theadOp[i].edit);
					}
				});
				_self.addMenu();
				_self.editInput();
			}
		});
	}

	init();//运行初始化

	/**以下为search函数**/
	if (options.search) {//绑定search函数
		$(options.search.input).bind({
			keydown: function () {
				search();
			},
			keyup: function () {
				search()
			}
		});
	}

	function search() {
		var val = $.trim($(options.search.input).val());
		$('.search').each(function () {
			var o = $(this);
			if (o.text().indexOf(val) == -1) {
				o.parent().css('display', 'none');
			}
			else {
				o.parent().removeAttr('style');
			}
		});
	}

	/***右键菜单的方法***/
	_self.addMenu = function () {
		_dom.find('tbody > tr').unbind().bind('contextmenu',function (e) {
			var o = $(this);
			$(options.rmenu.id).data('obj',o).data('id', o.attr('id')).css({'left': e.pageX, 'top': e.pageY, 'display': 'block'}).focus().unbind().bind('blur', function () {
				$(this).css('display', 'none');
			});
			$('.trc').removeClass('trc');
			o.addClass('trc');
			return false;
		}).bind('click', function () {
				var o = $(this);
				$('.trc').removeClass('trc');
				o.addClass('trc');
				return false;
			});
	}
	_self.addMenu();

	_self.editInput = function () {
		/***td的编辑方法***/
		_dom.find('.edit').unbind().bind('dblclick', function () {
			if ($('.editinput').length > 0) {
				return;
			}
			var o = $(this);
			editTd(o);
		});
	}
	/***check****/
	//默认正则
	var validReg = {
		mail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮箱
		china: /^[\u0391-\uFFE5]+$/,//中文
		int: /^\d+$/,//数字
		qq: /^[1-9]*[1-9][0-9]*$/,//QQ号码
		phone: /^[1]([3]|[4]|[5]|[8])[0-9]{9}$/,//手机号码
		user: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, //验证用户名，长度在5~16之间，只能包含字符、数字和下划线
		post: /[1-9]d{5}(?!d)/,//邮编
		url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^\"\"])*$/,//url地址
		idcard: /^\d{15}(\d{2}[A-Za-z0-9])?$/, //身份证号
		ip: /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //IP
	};

	function editTd(o) {
		o.data('d', o.html());
		var input = $('<input type="text" value="' + o.html() + '" class="editinput" style="min-width:10px;"/>');
		o.empty().append(input);
		input.focus();
		o.unbind();
		input.bind('blur', function () {
			if (checkValidate(o.index(), input.val(), o)) {
				var oo = $(this);
				if (o.data('d') !== input.val()) {
					$.ajax({
						type: "post",
						url: options.update.url,
						data: "k=" + _dom.find('th:eq(' + o.index() + ')').data('edit') + "&v=" + input.val() + "&id=" + o.parent().attr('id'),
						success: function (msg) {
							oo.parent().html(oo.val());
							o.bind('dblclick', function () {
								editTd(o);
							});
						},
						error: function () {
							layer.alert("修改失败，请稍后重试");
						}
					});
				}
				else {
					oo.parent().html(oo.val());
					o.bind('dblclick', function () {
						editTd(o);
					});
				}
			}
		});
	}

	///验证数据有效性
	function checkValidate(i, val, o) {
		var validate = _dom.find('th:eq(' + i + ')').data('validate');
		var _isValid = true;
		if (!validate) {
			validate = {must: false};
		}
		if (validate.must || (!validate.must && val !== '')) {
			//正则的判断
			if (validate.reg) {
				if (typeof(validate.reg) == 'string') {
					if (!(validReg[validate.reg].test(val))) {
						_isValid = false;
					}
				}
				else {
					if (!(validate.reg.test(val))) {
						_isValid = false;
					}
				}
			}
		}
		if (!_isValid) {
			var u = $.layer({
				shade: [1], //不显示遮罩
				area: ['auto', 'auto'],
				dialog: {
					msg: '数据格式不正确，您是否放弃编辑？',
					btns: 2,
					type: 4,
					btn: ['继续', '放弃'],
					yes: function () {
						layer.close(u);
					},
					no: function () {
						o.empty().html(o.data('d'));
						o.bind('click', function () {
							editTd(o);
						});
						layer.close(u);
					}
				}
			});
		}
		return _isValid;
	}

	_self.editInput();
	/** add **/
	if (options.add) {
		$(options.add.id).bind('click', function () {
			$.layer({
				type: 2,
				shade: [0],
				fix: false,
				title: [options.add.name, true],
				iframe: {src: options.add.url},
				area: ['600px' , '300px'],
				close: function (index) {
					//layer.msg('您获得了子窗口标记：' + layer.getChildFrame('#name', index).val(),3,1);
					layer.close(index);
				}
			});
		});
	}

}