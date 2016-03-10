var custom = new function() {
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
                name: '姓名',
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
            }, {
                name: '余额',
                width: '120px',
                edit: 'money',
                validate: {
                    must: true
                }
            }, {
                name: '积分',
                width: '120px',
                edit: 'score',
                validate: {
                    must: true,
                    reg: 'int'
                }
            }, {
                name: '最后交易时间',
                width: '150px',
                edit: 'activetime',
                validate: {
                    must: true
                }
            }],
            data: {
                url: config.server + '/custom/page',
                data: '',
                cp: 1,
                mp: 30
            },
            update: {
                url: config.server + '/custom/update'
            },
            search: {
                id: '#search',
                input: '#input'
            },
            add: {
                id: '#adduser',
                url: './iframe_addCustom.html',
                name: '添加会员',
                width: '400px'
            },
            rmenu: {
                id: '#youmenu'
            },
            funo: "custom.table"
        });
    }

    _self.addCustom = function() {
        $("#form1").pizzaValidate({
            'fields': {
                '#username': {
                    'must': true,
                    'minLength': 3,
                    'maxLength': 12,
                    focusMsg: "请输入用户名",
                    errMsg: '用户名不能为空或用户名必须在3-12个字符之间'
                },
                '#phone': {
                    'must': true,
                    'url': config.server + '/custom/check',
                    reg: 'phone',
                    compMsg: "该手机号已经存在",
                    focusMsg: "请输入您的手机号码",
                    errMsg: '手机号码格式不合法'
                }
            },
            ajaxFun: {
                url: config.server + '/custom/add',
                success: function(msg) {
                    if (msg.id) {
                        var index = parent.layer.getFrameIndex(window.name);
                        var dom = parent.$('#user'),
                            dombody = parent.$('#user > tbody');
                        var line = dom.data('line');
                        var tr = $('<tr><td>' + line + '</td><td>' + $('#username').val() + '</td><td>' + $('#phone').val() + '</td><td>0</td><td>0</td><td>' + tools.formatTime("yyyy-MM-dd hh:mm:ss") + '</td><td></td></td></tr>');
                        tr.data('id', msg.id);
                        dombody.append(tr);
                        dom.data('line', (line + 1));
                        parent.layer.close(index); //再执行关闭
                    }
                }
            }
        });
    }

    _self.addMoneyIframe = function(obj) {
        layer.open({
            type: 2,
            title: '充值',
            shadeClose: true,
            shade: 0.5,
            area: ['380px', '250px'],
            content: './iframe_addCUstomMoney.html?id=' + $(obj).parent().data("id") //iframe的url
        });
    }

    _self.addMoney = function() {
        $("#form1").pizzaValidate({
            'fields': {
                '#money': {
                    'must': true,
                    'minLength': 1,
                    'maxLength': 16,
                    'reg': 'int',
                    'focusMsg': "请输入金额",
                    'errMsg': '金额必须是正整数'
                }
            },
            ajaxFun: function(data) {
                var id = tools.getPara("id");
                data = data + '&id=' + id;
                $.ajax({
                    url: config.server + '/custom/addmoney',
                    data: data,
                    success: function(msg) {
                        if (msg.state == 'true') {
                            layer.msg('充值成功', {
                                time: 1000,
                                type: 1
                            }, function() {
                                parent.$('#' + id).find('td').eq(3).html(msg.money);
                                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                parent.layer.close(index); //再执行关闭
                            });
                        } else {
                            pizzaLayer.msg({
                                id: '#money',
                                msg: '充值失败，请稍后重试'
                            });
                        }
                    }
                });
            }
        });
    }
}
