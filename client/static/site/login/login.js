var login = new function() {
    var _self = this;
    var gui = require('nw.gui');

    _self.init = function() {
            login();
            $('#password').on('keydown', function(event) {
                enterEvent(event);
            });
        }
        /**
         * 表单验证 + 登录事件
         * @return {[type]} [description]
         */
    function login() {
        $("#form1").pizzaValidate({
            'fields': {
                '#username': {
                    'must': true,
                    'minLength': 2,
                    'maxLength': 12,
                    'focusMsg': "请输入用户名",
                    'errMsg': '用户名不能为空或用户名必须在5-12个字符之间'
                },
                '#password': {
                    'must': true,
                    'minLength': 6,
                    'maxLength': 16,
                    'focusMsg': "请输入6-16位的密码",
                    'errMsg': '密码不能为空且密码须在6-16个字符之间'
                }
            },
            ajaxFun: function(data) {
                $.ajax({
                    url: config.server + '/user/login',
                    data: data,
                    success: function(msg) {
                        if (msg.state == 'true') {
                             tools.setCookie("username",msg.data.userName);
                             tools.setCookie("id",msg.data.id);
                             tools.setCookie("type",msg.data.type);
                             tools.setCookie("key",msg.data.key);
                            // tools.getCookie("name", function(c) {
                            //     console.log(c);
                            // });
                            var win = gui.Window.get();
                            win.maximize();
                            document.location.href = 'index.html';
                        } else {
                            pizzaLayer.msg({
                                id: '#password',
                                msg: '用户名或密码错误，请重新登录'
                            })
                        }
                    }
                });
            }
        });
    }
    /**
     * 添加回车事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function enterEvent(e) {
        var e = e || event;
        var keyNum = e.which || e.keyCode;
        if (keyNum == 13) {
            $('#submit').click();
                return false;
        }
    }
};
