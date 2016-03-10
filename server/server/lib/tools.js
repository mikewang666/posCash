var tools = {},
    crypto = require('crypto'),
    fs = require('fs'),
    xss = require('xss'),
    path = require('path'),
    config = require('../config/config.js');

/*************************************************************
 * 校验相关的操作
 * @param str
 * @returns {boolean}
 */
tools.checkEmail = function(str) {
    var reg = /^\w+((-|\.)\w+)*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return reg.test(str);
}

/**
 * 校验数据类型合法性
 * @type {{}}
 */
tools.check_data = {}
    /**
     * 数据是否为整型
     * @param d  待校验值
     * @param defint  默认值
     * @returns {*}
     */
tools.check_data.check_int = function(d, defint) {
    if (parseInt(d) != d) return defint;
    return d;
}
tools.check_data.check_len = function(d, exlen) {
    if (d.length != exlen) return false;
    return true;
}
tools.check_data.check_maxlen = function(d, maxlen) {
        if (d.length > maxlen) return false;
        return true;
    }
    /****************************************************************************
     * 工具相关的操作
     */

/**
 * Return md5 hash of the given string and optional encoding,
 * defaulting to hex.
 *
 *     utils.md5('wahoo');
 *     // => "e493298061761236c96b02ea6aa8a2ad"
 *
 * @param {String} str
 * @param {String} encoding
 * @return {String}
 * @api public
 */
tools.md5 = function(str, encoding) {
        return crypto
            .createHash('md5')
            .update(str + config.md5Salt)
            .digest(encoding || 'hex');
    }
    /**
     * 获取字符串长度，区分中英文
     * @param str
     * @returns {Number}
     */
tools.getCharLen = function(str) {
        return str.replace(/[^\x00-\xff]/g, "rr").length;
    }
    /**
     * 截取字符串
     * @param s
     * @param l   长度
     * @param st   补充的结尾字符
     * @returns {*}
     */
tools.subStr = function(s, l, st) {
        var T = false;
        if (tools.getCharLen(s) > l) {
            st = st ? st : '';
            l -= tools.getCharLen(st);
            var S = escape(s);
            var M = S.length;
            var r = '';
            var C = 0;
            for (var i = 0; i < M; i++) {
                if (C < l) {
                    var t = S.charAt(i);
                    if (t == '%') {
                        t = S.charAt(i + 1);
                        if (t == 'u') {
                            r += S.substring(i, i + 6);
                            C += 2;
                            i += 5;
                        } else {
                            r += S.substring(i, i + 3);
                            C++;
                            i += 2;
                        }
                    } else {
                        r += t;
                        C++;
                    }
                } else {
                    T = true;
                    break;
                }
            }
        }
        return T ? unescape(r) + st : s;
    }
    /**
     * 计算时间差，返回秒数
     * @param time1
     * @param time2
     * @returns {number}
     */
tools.subTime = function(time1, time2) {
        var t1 = new Date(time1),
            t2;
        if (time2 == undefined) {
            t2 = new Date(); //当前时间
        } else {
            t2 = new Date(time2);
        }
        return (t2.getTime() - t1.getTime()) / 1000; //时间差的秒数
    }
    /**
     * 从ObjectId中获取时间
     * 生成格式:2013-12-14 10:58:35
     * @param ObjectId
     * @returns {string}
     */
tools.getObjectIdTime = function(ObjectId) {
        var time = parseInt(ObjectId.substring(0, 8), 16);
        var now = new Date(time * 1000);
        return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    }
    /**
     * 格式化时间
     * @param format
     * @returns {string}
     */
tools.fdate = function(format) {
    var format = typeof format === 'undefined' ? false : format.toLowerCase(),
        now = new Date(),
        time = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    if (format === 'y-m-d h:m:s') {
        time += ' ' + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    }
    return time;
};
/**
 * 过滤xss攻击代码
 * 属性参考：https://github.com/leizongmin/js-xss
 * @param str
 */
tools.xssFilter = function(str, movehtml) {
        str = xss(str);
        if (movehtml) {
            str = tools.htmlToString(str);
        }
        return str;
    }
    /**
     * html和sql字符过滤
     * @param text
     * @returns {XML}
     */
tools.htmlToString = function(text) {
        text = text.replace(/&/g, "&amp;");
        text = text.replace(/"/g, "&quot;");
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        text = text.replace(/'/g, "&#146;");
        text = text.replace(/$/g, "");
        return text;
    }
    /**
     * 转义json关键词
     * @param str
     * @returns {XML}
     */
tools.jsonFilter = function(str) {
        str = str.replace(/\\/g, "\\\\");
        str = str.replace(/\b/g, "\\\b");
        str = str.replace(/\t/g, "\\\t");
        str = str.replace(/\n/g, "\\\n");
        str = str.replace(/\f/g, "\\\f");
        str = str.replace(/\r/g, "\\\r");
        str = str.replace(/"/g, "\"");
        return str;
    }
    /**
     * 清除文本中的html代码
     * @param str
     * @returns {XML}
     */
tools.removeHtml = function(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str.value = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    return str;
}

/**
 * 判断是否为CSRF攻击
 * method：对请求方式的校验
 */
tools.checkCSRF = function(req, method) {
    var reqMethod = req.method;
    if (reqMethod != method) {
        return false;
    }
    var reffer = req.headers.referer,
        csrf = req.cookies.csrf;
    if (!reffer) {
        reffer = config.webDomain;
    }
    if (reffer.indexOf(config.webDomain) > -1 && csrf === '387205c31b2') { //带域名并且包含csrf参数
        return true;
    }
    return false;
}

/**
 * 除法运算，算得精确结果
 * @method function
 * @param  {[type]} arg1 [description]
 * @param  {[type]} arg2 [description]
 * @return {[type]}      [description]
 */
tools.accDiv = function(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {}
        with(Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }
    /**
     * 浮点数相乘
     * @param  {[type]} arg1 [description]
     * @param  {[type]} arg2 [description]
     * @return {[type]}      [description]
     */
tools.floatMul = function(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

tools.msg = {};
tools.msg.err = '{"state":"false"}';
tools.msg.right = '{"state":"true"}';

module.exports = tools;
