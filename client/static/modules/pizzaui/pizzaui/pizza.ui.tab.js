/**
 * TAB UI的实现，使用方法参考demo
 * @Version 0.2
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-2 下午6:05
 */
;(function($) {

    $.fn.pizzaTab = function(options) {

        var defaults = {
            activeClass:"f-tab-active",//默认标题选中样式
            contentClass:'f-tab-c',//默认正文区样式
            ajaxUrl:undefined,//通过ajax加载内容，此为ajax获取数据的地址，暂不支持JSONP，提交方法为POST//默认为不通过ajax
            loaddingClass:'f-tab-loadding'
        }

        var options = $.extend(defaults, options);

        //私有函数，ajax执行函数
        function _ajaxData(li,divCon) {
                if( $.trim(divCon.html()) == '') {
                    var loadd=$('<div class="'+options.loaddingClass+'"></div>');
                    divCon.append(loadd);
                    $.ajax({//请求数据
                        type:"POST",
                        url:options.ajaxUrl,
                        data:li.attr('param'),
                        success:function(msg) {
                            loadd.remove();
                            divCon.html(msg);
                        }
                    });
                }
        }

        //事件绑定
        var li=this.find('ul:first').find('li'),
            lia=li.find('a');
        lia.click(function() {
            var liac=$(this),
                lic=liac.parent(),
                liclass=lic.attr('class');
            if(liclass==undefined||liclass.indexOf(options.activeClass) == -1) {
                li.removeClass(options.activeClass);
                lic.addClass(options.activeClass);
                var div=$(liac.attr('href'));
                div.siblings('.'+options.contentClass).css('display','none');
                div.css('display','block');
                if(options.ajaxUrl) {
                    _ajaxData(lic,div);
                }
            }
            return false;
        });

        //当需要ajax请求并且第一项为空时，默认加载执行ajax加载第一项的内容
        if(options.ajaxUrl) {
            var firstLi=this.find('ul:first').find('.' + options.activeClass),
                firstDiv=$(firstLi.find('a').attr('href'));
            _ajaxData(firstLi,firstDiv);
        }
    };

})(jQuery);