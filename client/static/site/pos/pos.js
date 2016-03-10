var pos = new function() {
    var _self = this;

    _self.init = function() {
        $('#phone').keydown(function(e) { //绑定客户信息
            var e = e || event;
            var keyNum = e.which || e.keyCode;
            if (keyNum == 13) {
                _self.bindCustom(this);
            }
        }).focus(function() {
            pizzaLayer.tips(this, {
                time: 8000
            })
        }).focus();

        $('#goodcode').keydown(function(e) { //添加商品信息
            var e = e || event;
            var keyNum = e.which || e.keyCode;
            if (keyNum == 13) {
                _self.bindGoods(this);
            }
        });

        $('input[name="price"]').change(function() { //价位点击事件
            _self.changeChoosePrice(this);
        });


        _self.setTable();
    }

    /**
     * 自动获取会员信息
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    _self.bindCustom = function(obj) {
            var v = $.trim($(obj).val());
            if (v.length != 11) {
                pizzaLayer.msg({
                    id: '#phone',
                    msg: '手机号格式不合法'
                });
                return;
            }
            $.ajax({
                url: config.server + '/custom/getCustomByPhone',
                data: 'phone=' + v,
                success: function(msg) {
                    if (msg.state == 'true') {
                        $('#customid').val(msg.data.id);
                        $('#customname').val(msg.data.userName);
                        $('#custommoney').val(msg.data.money);
                        $('#score').val(msg.data.score);
                        $("input[name=price]:eq(1)").attr("checked", 'checked');
                    } else {
                        pizzaLayer.msg({
                            id: '#phone',
                            msg: '会员不存在'
                        });
                    }
                }
            })
        }
        /**
         * 添加商品
         * @return {[type]} [description]
         */
    _self.bindGoods = function(obj) {
            var v = $.trim($(obj).val());
            if (v.length == 0) {
                pizzaLayer.msg({
                    id: '#goodcode',
                    msg: '请输入商品编码'
                });
                return;
            }
            $.ajax({
                url: config.server + '/goods/getGoodByCode',
                data: 'goodscode=' + v,
                success: function(msg) {
                    if (msg.state == 'true') {
                        var tds = '';
                        var price = $('input[name="price"]:checked ').val();
                        $('#user > tbody > tr').each(function(index, element) {
                            tds = $(this).find('td');
                            if ($.trim($(tds[1]).html()) == '') { //找到空行
                                $(this).attr('id', new Date().getTime()).attr('relid', msg.data.id);
                                $(tds[1]).html(msg.data.name);
                                $(tds[2]).html(msg.data.norms);
                                $(tds[3]).html(msg.data.unit);
                                $(tds[4]).html(1);
                                $(tds[5]).data('price', msg.data).html(msg.data[price]);
                                $(tds[6]).html(msg.data[price]);
                                changeCountPrice();
                                if (parseInt($(tds[0]).html()) > 9) {
                                    $('#user > tbody').append('<tr><td>' + ($('#user > tbody > tr').length + 1) + '</td><td></td><td></td><td></td><td class="edit"></td><td></td><td></td><td></td></tr>');
                                }
                                $(obj).val('').focus();
                                return false;
                            }
                        });
                    } else {
                        pizzaLayer.msg({
                            id: '#goodcode',
                            msg: '商品不存在',
                            time: 2000
                        });
                    }
                }
            });
        }
        /**
         * 右键菜单切换价格
         * @return {[type]} [description]
         */
    _self.changePriceByRightMenu = function(obj, price) {
            var id = $(obj).parent().data("id");
            var v = $('input[name="price"]:checked ').val();
            var tds = $('#' + id).find('td');
            var td7 = $.trim($(tds[7]).html());
            //v == price && td7 != '赠品' || $.trim($(tds[1]).html()) == ''
            if ($.trim($(tds[1]).html()) == '') { //如果要改的价格和当前选择的价格一致，则return;
                $('#youmenu').css('display', 'none');
                return;
            }
            var dataPrice = $(tds[5]).data('price')[price];
            var number = parseInt($.trim($(tds[4]).html()));
            $(tds[5]).html(dataPrice); //单价
            $(tds[6]).html(tools.floatMul(parseFloat(dataPrice), number)); //总价格

            switch (price) {
                case 'huiyuanprice':
                    td7 = '使用会员价';
                    break;
                case "dailiprice":
                    td7 = '使用代理价';
                    break;
                case "lingshouprice":
                    td7 = '使用零售价';
                    break;
            }
            $(tds[7]).html(td7);
            changeCountPrice();
            $('#youmenu').css('display', 'none');
        }
        /**
         * 转为赠品
         * @return {[type]} [description]
         */
    _self.changeToSend = function(obj) {
            var id = $(obj).parent().data("id");
            var tds = $('#' + id).find('td');
            var td7 = $.trim($(tds[7]).html());
            if (td7 == '赠品' || $.trim($(tds[1]).html()) == '') { //如果要改的价格和当前选择的价格一致，则return;
                $('#youmenu').css('display', 'none');
                return;
            }
            $(tds[7]).html('赠品');
            var number = parseInt($.trim($(tds[4]).html()));
            $(tds[5]).html('0.0'); //单价
            $(tds[6]).html('0.0'); //总价格
            changeCountPrice();
            $('#youmenu').css('display', 'none');
        }
        /**
         * 删除商品状态
         * @return {[type]} [description]
         */
    _self.delGoodState = function(obj) {
            var id = $(obj).parent().data("id");
            var tds = $('#' + id).find('td');
            var td7 = $.trim($(tds[7]).html());
            if (td7 == '' || $.trim($(tds[1]).html()) == '') { //如果要改的价格和当前选择的价格一致，则return;
                $('#youmenu').css('display', 'none');
                return;
            }
            var v = $('input[name="price"]:checked ').val();
            $(tds[7]).html('');
            var dataPrice = $(tds[5]).data('price')[v];
            var number = parseInt($.trim($(tds[4]).html()));
            $(tds[5]).html(dataPrice); //单价
            $(tds[6]).html(tools.floatMul(parseFloat(dataPrice), number)); //总价格
            changeCountPrice();
            $('#youmenu').css('display', 'none');
        }
        /**
         * 切换价位，将会更新商品列表所有的单价
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
    _self.changeChoosePrice = function(obj) {
            var v = $(obj).val();
            var tds, td7;
            var number = 1;
            var dataPrice;
            $('#user > tbody > tr').each(function(index, element) {
                tds = $(this).find('td');
                td7 = $.trim($(tds[7]).html());
                if ($.trim($(tds[1]).html()) != '' && td7 == '') { //找到非空行和非赠品行
                    dataPrice = $(tds[5]).data('price')[v];
                    number = parseInt($.trim($(tds[4]).html()));
                    $(tds[5]).html(dataPrice); //单价
                    $(tds[6]).html(tools.floatMul(parseFloat(dataPrice), number)); //总价格
                }
            });
            changeCountPrice();
        }
        /**
         * [function description]
         * @return {[type]} [description]
         */
    _self.setTable = function() {
            var table = new witchDataTableOrder('#user', {
                thead: [{
                    name: '行号',
                    edit: '',
                    width: '30px'
                }, {
                    name: '商品名称',
                    width: '300px',
                    edit: ''
                }, {
                    name: '规格',
                    width: '100px',
                    edit: '',
                    col: 'norms'
                }, {
                    name: '单位',
                    width: '100px',
                    edit: ''
                }, {
                    name: '数量',
                    width: '100px',
                    edit: 'edit number',
                    validate: {
                        must: true
                    }
                }, {
                    name: '单价',
                    width: '100px',
                    edit: 'edit price',
                    validate: {
                        must: true
                    }
                }, {
                    name: "金额",
                    width: '100px',
                    edit: 'count',
                    validate: {
                        must: false
                    }
                }, {
                    name: "状态",
                    width: '100px',
                    edit: ''
                }],
                rmenu: {
                    id: '#youmenu'
                }
            });
        }
        /**
         * 修改某个商品的价格或数量
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
    _self.changeGoodPriceOrNumber = function(objtr, objtd) {
            var id = $(objtr).parent().attr("id"); //获取id
            var tds = $('#' + id).find('td');
            var td7 = $.trim($(tds[7]).html()); //商品状态 4,5
            var dataPrice = $.trim($(tds[5]).html()); //单价
            var number = parseInt($.trim($(tds[4]).html())); //数量
            $(tds[5]).html(dataPrice); //单价
            $(tds[6]).html(tools.floatMul(parseFloat(dataPrice), number)); //总价格
            changeCountPrice();
        }
        /**
         * 提交数据到服务器
         * @return {[type]} [description]
         */
    _self.printData = function() {
            var jiawei = $('input[name="price"]:checked ').val();
            var data = 'customid=' + $('#customid').val() + '&jiawei=' + jiawei + '&pay=' + $('input[name="pay"]:checked').val() + '&money=' + $.trim($('#money').val()) + '&realmoney=' + $.trim($('#realmoney').val()) + '&des=' + $.trim($('#des').val());

            var tds, tdsJson = {};
            var goods = []; //商品数据


            $('#user > tbody > tr').each(function(index, element) {
                tds = $(this).find('td');
                if ($.trim($(tds[1]).html()) != '') { //找到非空行
                    tdsJson = {};
                    tdsJson.id = $(this).attr('relid'); //id
                    tdsJson.number = parseInt($(tds[4]).html()); //数量
                    tdsJson.price = $(tds[6]).html(); //价格
                    //$(tds[6]).html(msg.data[price]);
                    goods.push(tdsJson);
                }
            });

            $.ajax({
                url: config.server + '/order/add',
                data: data + '&goods=' + JSON.stringify(goods),
                success: function(msg) {
                    layer.closeAll('loading');
                    if (msg.state == "true") {
                        layer.msg('订单已经提交', {
                            icon: 1,
                            time: 1500
                        });
                        setTimeout(function(){document.location.reload();},1600);
                    } else {
                        layer.msg('订单已经提交失败，请稍后重试', {
                            icon: 5,
                            time: 1000
                        });
                    }
                }
            });
        }
        /**
         * 更新总价格
         * @return {[type]} [description]
         */
    function changeCountPrice() {
        var tc = 0.0;
        var tds;
        $('#user > tbody > tr').each(function(index, element) {
            tds = $(this).find('td');
            if ($.trim($(tds[1]).html()) == '') { //找到空行
                return true;
            } else {
                tc = tools.floatAdd(parseFloat($(tds[6]).html()), tc);
            }
        });
        $('#money').val(tc);
        $('#realmoney').val(tc);
    }

}
