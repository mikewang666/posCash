var operator = new function() {
    var _self = this;
    _self.table = '';
    _self.init = function() {
        _self.setTable();
    }

    _self.setTable = function() {
            _self.table = new witchDataTable('#user', {
                thead: [{
                    name: '行号',
                    width: '40px'
                }, {
                    name: '职员姓名',
                    width: '140px',
                    edit: 'userName',
                    validate: {
                        must: true
                    }
                }, {
                    name: '手机号',
                    width: '120px',
                    edit: 'phone',
                    validate: {
                        must: true,
                        reg: 'phone'
                    }
                }],
                data: {
                    url: config.server + '/user/page',
                    data: '',
                    cp: 1,
                    mp: 30
                },
                update: {
                    url: config.server + '/user/update'
                },
                search: {
                    id: '#search',
                    input: '#input'
                },
                add: {
                    id: '#adduser',
                    url: './iframe_addOperator.html',
                    name: '添加用户',
                    width: '400px'
                },
                rmenu: {
                    id: '#youmenu'
                },
                funo: "operator.table"
            });

        }
        /**
         * 修改操作员密码的弹窗
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
    _self.updatePwd = function(obj) {
            layer.open({
                type: 2,
                title: '更新密码',
                shadeClose: true,
                shade: 0.5,
                area: ['380px', '250px'],
                content: './iframe_editOperatorPassword.html?id=' + $(obj).parent().data("id") //iframe的url
            });
        }
        /**
         * 删除操作员
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
    _self.del = function(obj) {
            layer.confirm('确定要删除该操作员吗？', function(index) {
                var id = $(obj).parent().data("id");
                $.ajax({
                    url: config.server + '/user/del',
                    data: "id=" + id,
                    success: function(msg) {
                        if (msg.state == "true") {
                            $("#" + id).remove();
                        }
                    }
                })
                layer.close(index);
            });
        }
        /**
         * 修改密码操作
         * @return {[type]} [description]
         */
    _self.updatePassword = function() {
            $("#form1").pizzaValidate({
                'fields': {
                    '#password': {
                        'must': true,
                        'minLength': 8,
                        'maxLength': 16,
                        'reg': /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
                        'focusMsg': "请输入8-16位的密码",
                        'errMsg': '密码必须同时含有字母和数字并且至少8位'
                    }
                },
                ajaxFun: function(data) {
                    var id = tools.getPara("id");
                    data = data + '&id=' + id;
                    $.ajax({
                        url: config.server + '/user/uppassword',
                        data: data,
                        success: function(msg) {
                            if (msg.state == 'false') {
                                pizzaLayer.msg({
                                    id: '#password',
                                    msg: '用户名或密码错误，请重新登录'
                                })
                            } else {
                                layer.msg('更新成功', {
                                    time: 1000,
                                    type: 1
                                }, function() {
                                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                    parent.layer.close(index); //再执行关闭
                                });
                            }
                        }
                    });
                }
            });
        }
        /**
         * 添加新的操作员
         * @return {[type]} [description]
         */
    _self.addOperator = function() {
        $("#form1").pizzaValidate({
            'fields': {
                '#username': {
                    'must': true,
                    'minLength': 3,
                    'maxLength': 12,
                    'url': config.server + '/user/check',
                    focusMsg: "请输入用户名",
                    compMsg: "该用户已经存在",
                    errMsg: '用户名不能为空或用户名必须在3-12个字符之间'
                },
                '#phone': {
                    'must': true,
                    reg: 'phone',
                    focusMsg: "请输入您的手机号码",
                    errMsg: '手机号码格式不合法'
                },
                '#password': {
                    'must': true,
                    'minLength': 8,
                    'maxLength': 16,
                    'reg': /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
                    'focusMsg': "请输入8-16位的密码",
                    'errMsg': '密码必须同时含有字母和数字并且至少8位'
                }
            },
            ajaxFun: {
                url: config.server + '/user/add',
                success: function(msg) {
                    if (msg.id) {
                        var index = parent.layer.getFrameIndex(window.name);
                        var dom = parent.$('#user'),
                            dombody = parent.$('#user > tbody');
                        var line = dom.data('line');
                        var tr = $('<tr><td>' + line + '</td><td class="edit">' + $('#username').val() + '</td><td class="edit">' + $('#phone').val() + '</td><td></td></td></tr>');
                        tr.data('id', msg.id);
                        dombody.append(tr);
                        dom.data('line', (line + 1));
                        parent.layer.close(index); //再执行关闭
                    }
                }
            }
        });
    }
}
