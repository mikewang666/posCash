/**
 * 
 * @authors lingirl (success99@126.com)
 * @date    2015-08-10 14:10:31
 * @version $Id$
 */


;(function($) {
    $.fn.wordsTip = function(options) {
        var oInput = this;//输入框对应的DOM
        var oTip = $('#' + oInput[0].id + '-tip'); //提示信息所在的DOM元素
        oInput.attr('validate', "false");
        var defaults = {
            min: 1, //最少字数
            max: 4, //最大字数
            English: true //是否区分中英文，默认区分
        };
		options = $.extend(defaults, options);

        //默认的提示
        var html = '字数：<span style="color:red;">' + options.min + ' - ' + options.max + '</span>' + ' 个字';
        oTip.html(html);

        oInput.on('keydown keyup blur focus', function(e) {
            //
            var val = $.trim(oInput.val());

            //输入字数的长度
            var input_length = getStrLength(val);

            //剩余或者超出的字数
            var num = options.max - input_length;

            if (num >= 0) {
                //输入过程中的提示
                html = '目前您还可以输入<span style="color:red;"> ' + num + ' </span>个字';
                oInput.attr('validate', "true");
                oTip.html(html);
            } else {
                //超出限定字数的提示
                html = '目前您已超出<span style="color:red;"> ' + -1 * num + ' </span>个字';
                oInput.attr('validate', "false");
                oTip.html(html);
            }

            if (e.type == 'blur' && !input_length) {
                oTip.html('字数：<span style="color:red;">' + options.min + '-' + options.max + ' </span>' + '个字');
            }

            //判断字符的长度
            function getStrLength(str) {
                //console.log(typeof options.English);
                if (options.English) {
                    return Math.ceil(str.replace(/[^\x00-\xff]/g, "rr").length / 2);
                } else {
                    return str.length;
                }
            }
            //
        });
    }
})(jQuery);
