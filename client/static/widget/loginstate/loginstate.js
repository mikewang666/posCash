/**
 *
 * @authors 左盐 (huabinglan@163.com)
 * @date    2015-08-31 17:15:30
 * @version $Id$
 */



var loginState = new function() {
    var _self = this;
    var config = require('../config/config.js');
    /**
     * 打印登录状态
     * @return {[type]} [description]
     */
    _self.init = function() {
            tools.getCookie('username', function(value) {
                var s = '';
                if (value == '0') { //未登录
                    s = '';
                } else {
                    s = '<a href="/space">'+value+'</a> | <a href="javascript:void(0);" onclick="loginState.loginout();">退出</a>';
                }
                $('.loginstate').html(s);
            });
        }
        /**
         * 退出登录
         * @return {[type]} [description]
         */
    _self.loginout = function() {
        tools.removeCookie('username');
        tools.removeCookie('id');
        tools.removeCookie('type');
        tools.removeCookie('key');
        //file:///F:/nodejs/posCash/client/views/login.html
        document.location.href = document.location.href.split('/views/')[0] + '/views/login.html';
    }
}
