/**
 * 整站翻页样式
 * @authors lingirl (success99@126.com)
 * @date    2015-09-08 16:06:29
 */

var $ = jQuery = require('jquery');

var turnpage = function(json) {

    var _this = this;

    var defaults = {
        name: '', // 函数执行体，<函数名.方法>的形式
        sum: 0, // 总的数据条数
        mp: 10, // 默认每页显示多少条
        tp: 0 // 总的翻页数
    };

    defaults = $.extend(defaults, json);

    // 首页、上一页、下一页，翻页模式
    _this.hud = function(cp, total) {

        if (total) {
            defaults.sum = parseInt(total);
        }

        var str = '', // 用于拼接 html 字符串
            _tp = Math.ceil(defaults.sum / defaults.mp);

        var clk = {
            // home 、up、down -- 分别对应首页、上一页、下一页的点击事件
            h: ' onclick="' + defaults.name + '(1);"',
            u: ' onclick="' + defaults.name + '(' + (cp - 1) + ');"',
            d: ' onclick="' + defaults.name + '(' + (cp + 1) + ');"'
        };

        var a = '<div class="clearfix turnpage turnpage-hud"><span class="btn btn-primary"',
            b = '>首页</span><span class="btn btn-primary"',
            c = '>上一页</span><span class="btn btn-primary"',
            d = '>下一页</span></div>';

        if (cp <= 1) {
            //console.log(11);
            str = a + b + c + clk.d + d;
        }

        if (cp >= _tp && cp != 1) {
            //console.log(22);
            str = a + clk.h + b + clk.u + c + d;
        }

        if (1 < cp && cp < _tp) {
            //console.log(33);
            str = a + clk.h + b + clk.u + c + clk.d + d;
        }

        return str;

    };

    // 标准翻页模式，包含首页、上下页、末页、及数字分页
    _this.huden = function(cp, total) {

        var a = '<div class="turnpage turnpage-std"><span class="btn btn-primary"',
            b = '>首页</span><span class="btn btn-primary marginleft"',
            c = '>上一页</span>',
            d = '<span class="btn btn-primary"',
            e = '>下一页</span><span class="btn btn-primary marginleft"',
            f = '>末页</span>';
        var g = '<em>...</em>';

        var str_home_up = '', // 包含首页、上一页的 html 字符串
            str_down_end = ''; // 包含下一页、末页的 html 字符串

        if (total) {
            defaults.sum = parseInt(total);
        }

        var str = '', // 用于拼接 html 字符串
            _tp = Math.ceil(defaults.sum / defaults.mp);

        var clk = {
            // home 、up、down、end -- 分别对应首页、上一页、下一页、末叶的点击事件
            h: ' onclick="' + defaults.name + '(1);"',
            u: ' onclick="' + defaults.name + '(' + (cp - 1) + ');"',
            d: ' onclick="' + defaults.name + '(' + (cp + 1) + ');"',
            e: ' onclick="' + defaults.name + '(' + _tp + ');"'
        };

        if (cp == 1 && _tp == 1) {
            //console.log('a');
            str_home_up = a + b + c;
            str_down_end = d + e + f;
        } else if (cp == 1) {
            //console.log('b');
            str_home_up = a + b + c;
            str_down_end = d + clk.d + e + clk.e + f;
        } else if (cp == _tp) {
            //console.log('c');
            str_home_up = a + clk.h + b + clk.u + c;
            str_down_end = d + e + f;
        } else {
            //console.log('d');
            str_home_up = a + clk.h + b + clk.u + c;
            str_down_end = d + clk.d + e + clk.e + f;
        }

        // 总页数小于10
        if (_tp < 10) {
            for (var i = 1; i <= _tp; i++) {
                if (cp == i) {
                    str += '<i class="choice">' + i + '</i>';
                } else {
                    str += '<i' + ' onclick="' + defaults.name + '(' + i + ');"' + '>' + i + '</i>';
                }
            }

            return str_home_up + str + str_down_end;
        }

        // 总页数大于10
        if (_tp >= 10) {

            if (cp <= 6) {

                for (var i = 1; i < 8; i++) {
                    if (cp == i) {
                        str += '<i class="choice">' + i + '</i>';
                    } else {
                        str += '<i onclick="' + defaults.name + '(' + i + ');">' + i + '</i>';
                    }
                }

                str = str + g + '<i' + ' onclick="' + defaults.name + '(' + _tp + ');"' + '>' + _tp + '</i>';

            } else if (cp > _tp - 6) {

                for (var i = _tp - 6; i <= _tp; i++) {
                    if (cp == i) {
                        str += '<i class="choice">' + i + '</i>';
                    } else {
                        str += '<i' + ' onclick="' + defaults.name + '(' + i + ');"' + '>' + i + '</i>';
                    }
                }

                str = '<i onclick="' + defaults.name + '(1);">1</i>' + g + str;

            } else {

                for (var i = cp - 2; i <= cp + 2; i++) {
                    if (cp == i) {
                        str += '<i class="choice">' + i + '</i>';
                    } else {
                        str += '<i' + ' onclick="' + defaults.name + '(' + i + ');"' + '>' + i + '</i>';
                    }
                }

                str = '<i onclick="' + defaults.name + '(1);">1</i>' + g + str + g + '<i onclick="' + defaults.name + '(' + _tp + ');">' + _tp + '</i>';

            }

            return str_home_up + str + str_down_end;
        }
    };
};

module.exports = turnpage;
