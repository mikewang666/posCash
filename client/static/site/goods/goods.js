var goods = new function() {
    var _self = this;
    _self.table;
    _self.init = function() {
        _self.setTable();
    }

    _self.setTable = function() {
        _self.tabl = new witchDataTable('#user', {
            thead: [{
                name: '行号',
                width: '30px'
            }, {
                name: '商品编码',
                width: '200px',
                edit: 'goodscode',
                validate: {
                    must: true
                }
            }, {
                name: '商品名称',
                width: '200px',
                edit: 'name',
                validate: {
                    must: true
                }
            }, {
                name: '规格',
                width: '200px',
                edit: 'norms',
                validate: {
                    must: true
                }
            }, {
                name: '单位',
                width: '50px',
                edit: 'unit',
                validate: {
                    must: true
                }
            }, {
                name: '进价',
                width: '100px',
                edit: 'jinhuoprice',
                validate: {
                    must: true,
                    reg: 'price'
                }
            }, {
                name: '代理价',
                width: '100px',
                edit: 'dailiprice',
                validate: {
                    must: true,
                    reg:'price'
                }
            }, {
                name: '会员价',
                width: '100px',
                edit: 'huiyuanprice',
                validate: {
                    must: true,
                    reg:'price'
                }
            }, {
                name: '零售价',
                width: '100px',
                edit: 'lingshouprice',
                validate: {
                    must: true,
                    reg:'price'
                }
            }, {
                name: '库存',
                width: '100px',
                edit: 'number',
                validate: {
                    must: true,
                    reg:'int'
                }
            }],
            data: {
                url: config.server + '/goods/page',
                cp: 1,
                mp: 30,
                data: ''
            },
            update: {
                url: config.server + '/goods/update'
            },
            search: {
                input: '#input'
            },
            add: {
                id: '#adduser',
                url: './iframe_addgoods.html',
                name: '添加新商品',
                width: '580px'
            },
            funo: "goods.table"
        });
    }
    /**
     * 添加新的商品
     * @return {[type]} [description]
     */
    _self.addGoods = function() {
        $("#form1").pizzaValidate({
            'fields': {
                '#name': {
                    'must': true,
                    'minLength': 2,
                    'maxLength': 30,
                    focusMsg: "请输入商品名",
                    errMsg: '商品名需2-30个字符'
                },
                '#norms': {
                    'must': true,
                    'minLength': 2,
                    'maxLength': 30,
                    focusMsg: "请输入商品规格",
                    errMsg: '商品规格需2-30个字符'
                },
                '#unit': {
                    'must': true,
                    'minLength': 2,
                    'maxLength': 30,
                    focusMsg: "请输入商品单位",
                    errMsg: '商品单位需2-30个字符'
                },
                '#jinhuoprice': {
                    'must': true,
                    'minLength': 1,
                    'maxLength': 5,
                    reg:'price',
                    focusMsg: "请输入进货价格",
                    errMsg: '进货价格必须是正整数或正浮点数'
                },
                '#dailiprice': {
                    'must': true,
                    'minLength': 1,
                    'maxLength': 5,
                    reg:'price',
                    focusMsg: "请输入代理价格",
                    errMsg: '代理价格必须是正整数或正浮点数'
                },
                '#huiyuanprice': {
                    'must': true,
                    'minLength': 1,
                    'maxLength': 5,
                    reg:'price',
                    focusMsg: "请输入会员价格",
                    errMsg: '会员价格必须是正整数或正浮点数'
                },
                '#lingshouprice': {
                    'must': true,
                    'minLength': 1,
                    'maxLength': 5,
                    reg:'price',
                    focusMsg: "请输入零售价格",
                    errMsg: '零售价格必须是正整数或正浮点数'
                },
                '#number': {
                    'must': true,
                    'minLength': 1,
                    'maxLength': 5,
                    reg: 'int',
                    focusMsg: "请输入商品数量",
                    errMsg: '商品数量必须为整数'
                },
                '#goodscode': {
                    'must': true,
                    'minLength': 3,
                    'maxLength': 40,
                    'url': config.server + '/goods/check',
                    focusMsg: "请输入商品编码",
                    compMsg: "该商品已经存在",
                    errMsg: '商品编码过长'
                }
            },
            ajaxFun: {
                url: config.server + '/goods/add',
                success: function(msg) {
                    if (msg.id) {
                        var index = parent.layer.getFrameIndex(window.name);
                        var dom = parent.$('#user'),
                            dombody = parent.$('#user > tbody');
                        var line = dom.data('line');
                        var tr = $('<tr><td>' + line + '</td><td class="edit">' + $('#goodscode').val() + '</td><td class="edit">' + $('#name').val() + '</td><td>'+$('#norms').val()+'</td><td>'+$('#unit').val()+'</td><td>'+$('#jinhuoprice').val()+'</td><td>'+$('#dailiprice').val()+'</td><td>'+$('#huiyuanprice').val()+'</td><td>'+$('#lingshouprice').val()+'</td><td>'+$('#number').val()+'</td><td></td></td></tr>');
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
