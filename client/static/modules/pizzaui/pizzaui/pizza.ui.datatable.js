/**
 * datatable的实现，使用方法参考demo
 * @Version 0.2
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-2 下午6:05
 */
function witchDataTable(id, options) {

    var _self = this;
    var defaults = {
        thead: {}, //默认表头
        data: {
            url: '',
            data: '',
            cp: 1,
            mp: 30
        },
        search: {
            'id': '#search',
            'input': '#input',
            'url': ''
        }
    }

    var options = $.extend(defaults, options);

    var _dom = $(id);
    _dom.data('line', 1);
    /**
     * 获取列表方法
     * @return {[type]} [description]
     */
    _self.page = function(cp) {
            _dom.data('line', 1);
            if (cp) {
                options.data.cp = cp;
            }
            var val = $.trim($(options.search.input).val());
            $.ajax({
                type: "post",
                url: options.data.url,
                dataType: 'json',
                data: options.data.data + '&cp=' + options.data.cp + '&mp=' + options.data.mp + '&kw=' + val,
                success: function(msg) {
                    var thead = '<thead><tr>';
                    var theadOp = options.thead;
                    for (var i = 0, _l = theadOp.length; i < _l; i++) {
                        thead += '<th style="width:' + theadOp[i].width + '">' + theadOp[i].name + '</th>';
                    }
                    thead += '<th>&nbsp;</th></tr></thead>';

                    var data = msg.data,
                        line = _dom.data('line');
                    thead += '<tbody>';
                    console.log(data);
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
                    _dom.empty();
                    _dom.append(thead);
                    _dom.find('th').each(function(i) { //添加表单验证规则
                        if (theadOp[i]) {
                            $(this).data('validate', theadOp[i].validate).data('edit', theadOp[i].edit);
                        }
                    });
                    _dom.after(trunPage(msg.count)); //打印翻页
                    //_self.addMenu();
                    //_self.editInput();
                }
            });
        }
        /**
         * 翻页算法
         * @param  {[type]} count [description]
         * @return {[type]}       [description]
         */
    function trunPage(count) {
        var m = Math.ceil(count / options.data.mp); //count / options.data.mp; //总页数
        if (m == 1 || count == 0) {
            return '';
        }
        var s = '<div class="trunpage">';
        if (options.data.cp != 1) { //打印上一页
            s += '<a href="javascript::" onclick="' + options.funo + '.page(' + (options.data.cp - 1) + ')">上一页</a>';
            s += '<a href="javascript::" onclick="' + options.funo + '.page(1)">1</a>'; //第一页
        } else {
            s += '<span>1</span>'; //第一页
        }
        if (options.data.cp > 4 && m > 8) {
            s += '<em>…</em>';
        }

        if (options.data.cp < 5) {
            var x = m < 8 ? m : 8;
            for (var i = 2; i < x; i++) {
                if (options.data.cp == i) {

                    s += '<span>' + i + '</span>';
                } else {
                    s += '<a href="javascript::" onclick="' + options.funo + '.page(' + i + ')">' + i + '</a>';
                }
            }
        } else if (options.data.cp + 8 >= m) {
            var x = (m - 8);
            for (var i = x; i < m; i++) {
                if (options.data.cp != i) {
                    s += '<a href="javascript::" onclick="' + options.funo + '.page(' + i + ')">' + i + '</a>';
                } else {
                    s += '<span>' + i + '</span>';
                }
            }
        } else {
            var x = options.data.cp - 2;
            var l = options.data.cp + 2;
            for (var i = x; i <= l; i++) {
                if (options.data.cp != i) {
                    s += '<a href="javascript::" onclick="' + options.funo + '.page(' + i + ')">' + i + '</a>';
                } else {
                    s += '<span>' + i + '</span>';
                }
            }
        }

        if (options.data.cp < 4 && (m - 2) > options.data.cp) {
            s += '<em>…</em>';
        }

        if (options.data.cp != m) { //打印下一页
            s += '<a href="javascript::" onclick="' + options.funo + '.page(' + m + ')">' + m + '</a>'; //最后一页
            s += '<a href="javascript::" onclick="' + options.funo + '.page(' + (options.data.cp + 1) + ')">下一页</a>';
        } else {
            s += '<span>' + m + '</span>'; //最后一页
        }

        s += '</div>';
        $('.trunpage').remove();
        return s;
    }



    /**以下为search函数**/
    if (options.search) { //绑定search函数
        $(options.search.input).bind({
            keydown: function() {
                //init();
            },
            keyup: function() {
                init()
            }
        });
    }

    /***右键菜单的方法***/
    _self.addMenu = function() {
        _dom.off('contextmenu.tablerightmenu').on('contextmenu.tablerightmenu', 'tbody > tr',function(e) {
            var o = $(this);
            $(options.rmenu.id).data('obj', o).data('id', o.attr('id')).css({
                'left': e.pageX,
                'top': e.pageY,
                'display': 'block'
            }).focus().unbind().bind('blur', function() {
                $(this).css('display', 'none');
            });
            $('.trc').removeClass('trc');
            o.addClass('trc');
            return false;
        });

        _dom.off('click.trclick').on('click.trclick','tbody > tr', function() {
            var o = $(this);
            $('.trc').removeClass('trc');
            o.addClass('trc');
            return false;
        });
    }

    _self.editInput = function() {
            /***td的编辑方法***/
            _dom.off('dbclick.trdbclick').on('dblclick.trdbclick', '.edit',function() {
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
        mail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱
        china: /^[\u0391-\uFFE5]+$/, //中文
        int: /^\d+$/, //数字
        qq: /^[1-9]*[1-9][0-9]*$/, //QQ号码
        phone: /^[1]([3]|[4]|[5]|[8])[0-9]{9}$/, //手机号码
        user: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, //验证用户名，长度在5~16之间，只能包含字符、数字和下划线
        post: /[1-9]d{5}(?!d)/, //邮编
        url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^\"\"])*$/, //url地址
        idcard: /^\d{15}(\d{2}[A-Za-z0-9])?$/, //身份证号
        ip: /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g, //IP
        'price': /^(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.[0-9]+)$/ //正整数和正浮点数，包括0和
    };

    function editTd(o) {
        o.data('d', o.html());
        var input = $('<input type="text" value="' + o.html() + '" class="editinput" style="min-width:10px;"/>');
        o.empty().append(input);
        input.focus();
        o.unbind();
        input.bind('blur keydown', function(e) {
            var e = e || event;
            var keyNum = e.which || e.keyCode;
            if (keyNum != 13 && e.type == 'keydown') {
                return;
            }
            if (checkValidate(o.index(), input.val(), o)) {
                var oo = $(this);
                if (o.data('d') !== input.val()) {
                    $.ajax({
                        type: "post",
                        url: options.update.url,
                        data: "k=" + _dom.find('th:eq(' + o.index() + ')').data('edit') + "&v=" + input.val() + "&id=" + o.parent().attr('id'),
                        success: function(msg) {
                            oo.parent().html(oo.val());
                            pizzaLayer.msg({
                                id: o.parent(),
                                msg: '更新成功',
                                time: 1000
                            })
                            o.bind('dblclick', function() {
                                editTd(o);
                            });
                        },
                        error: function() {
                            layer.alert("修改失败，请稍后重试");
                        }
                    });
                } else {
                    oo.parent().html(oo.val());
                    o.bind('dblclick', function() {
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
            validate = {
                must: false
            };
        }
        if (validate.must || (!validate.must && val !== '')) {
            //正则的判断
            if (validate.reg) {
                if (typeof(validate.reg) == 'string') {
                    if (!(validReg[validate.reg].test(val))) {
                        _isValid = false;
                    }
                } else {
                    if (!(validate.reg.test(val))) {
                        _isValid = false;
                    }
                }
            }
        }
        if (!_isValid) {
            layer.confirm('数据格式不正确，您是否放弃编辑？', {
                btn: ['继续', '放弃'],
                btn1: function(index, layero) {
                    layer.close(index);
                },
                btn2: function(index, layero) {
                    o.empty().html(o.data('d'));
                    o.bind('click', function() {
                        editTd(o);
                    });
                    layer.close(index);
                }
            });
            // var u = layer({
            //     shade: [1], //不显示遮罩
            //     area: ['auto', 'auto'],
            //     dialog: {
            //         msg: '数据格式不正确，您是否放弃编辑？',
            //         btns: 2,
            //         type: 4,
            //         btn: ['继续', '放弃'],
            //         yes: function() {
            //             layer.close(u);
            //         },
            //         no: function() {
            //             o.empty().html(o.data('d'));
            //             o.bind('click', function() {
            //                 editTd(o);
            //             });
            //             layer.close(u);
            //         }
            //     }
            // });
        }
        return _isValid;
    }


    /** add **/
    if (options.add) {
        $(options.add.id).bind('click', function() {
            layer.open({
                type: 2,
                shade: 0.5,
                fix: false,
                title: [options.add.name, true],
                content: options.add.url,
                area: ['600px', options.add.width]
            });
        });
    }
    /**
     * 初始化方法
     * @return {[type]} [description]
     */
    function init() {
        _self.page();
        _self.addMenu();
        _self.editInput();
    }
    init(); //运行初始化
}
