/**
 * --------------------------------------------------------
 * 各种动画显示以及可见元素的动画效果的实现，使用方法参考demo
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-3 下午4:58
 * --------------------------------------------------------
 */
;(function($) {

    $.fn.witchShow = function(options) {

        var defaults = {
            show:'',//fadeIn
            fly:'Bounce',//默认效果
            showSpeed:'fast',//默认显示速度
            flySpeed:'fast'
        }
        var options = $.extend(defaults, options);

        var _dom=this;

        function _show() {
            switch (options.show) {
                case 'fadeIn'://淡入
                    _dom.fadeIn(options.showSpeed,function(){_fly(options.fly);})
                    break;
                case 'slideDown'://从上往下伸长
                    _dom.slideDown(options.showSpeed,function(){_fly(options.fly);})
                    break;
                case 'down'://下滑
                    var _downTop=parseInt(_dom.css('top')),
                        _downHeight=_dom.height();
                    _dom.css({'top':-_downHeight+'px','display':'block','opacity':0});
                    _dom.animate({top:_downTop+'px','opacity':1},options.showSpeed,function(){_fly(options.fly);});
                    break;
                case 'clip'://从中间往两侧伸展
                    var _clipHeight=_dom.height(),
                        _clipTop=parseInt(_dom.css('top'));
                    _dom.css({'display':'block','opacity':0,'overflow':'hidden',top:_clipHeight/2+_clipTop,height:0});
                    _dom.animate({'top':_clipTop+'px','height':_clipHeight,'opacity':1},options.showSpeed,function() {
                        _fly(options.fly);
                    });
                    break;
                case 'right'://从左侧滑入
                    var _rightLeft=parseInt(_dom.css('left')),
                        _rightWidth=_dom.width();
                    _dom.css({'display':'block','opacity':0,'left':-(_rightLeft+_rightWidth)});
                    _dom.animate({'opacity':1,'left':_rightLeft},options.showSpeed,function() {
                        _fly(options.fly);
                    });
                    break;
                default ://默认
                    if(_dom.css('display')=='none') {
                       _dom.css('display','block');
                    }
                    _fly(options.fly);
                    break;
            }
        }
        //块的动画效果
        function _fly(){
            switch(options.fly) {
                case 'Bounce'://上下震动
                    var _bounceTop=_dom.position().top;
                    options.flySpeed=options.flySpeed=='fast' ? 50 :options.flySpeed;
                    for(var i=1;i<5;i++) {
                        _dom.animate({top:_bounceTop+2*(40-10*i)},options.flySpeed);
                        _dom.animate({top:_bounceTop-(40-10*i)},options.flySpeed);
                    }
                    break;
                case 'Shake'://左右震动
                    var _shakeLeft=_dom.position().left;
                    options.flySpeed=options.flySpeed=='fast' ? 50 :options.flySpeed;
                    for(var i=1;i<5;i++) {
                        _dom.animate({left:_shakeLeft-(40-10*i)},options.flySpeed);
                        _dom.animate({left:_shakeLeft+2*(40-10*i)},options.flySpeed);
                    }
                    break;
                case 'Pulsate'://闪烁
                    for(var i=1;i<3;i++) {
                        _dom.animate({'opacity':0},options.flySpeed);
                        _dom.animate({'opacity':1},options.flySpeed);
                    }
                    break;
                default :
                    break;
            }
        }
        //函数执行
        _show();
    };

})(jQuery);/**
 * TAB UI的实现，使用方法参考demo
 * @Version 0.2
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-2 下午6:05
 */
;(function($) {

    $.fn.witchTab = function(options) {

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

})(jQuery);/**
 * --------------------------------------------------------
 * 表单验证插件
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-5 下午2:38
 * --------------------------------------------------------
 */
;(function($) {

    $.fn.witchValidate = function(options) {

        var defaults = {
            ajaxFunc:undefined//ajax提交函数
        }

        //默认正则
        var validReg={
            mail:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮箱
            china:/^[\u0391-\uFFE5]+$/,//中文
            int:/^\d+$/,//数字
            qq:/^[1-9]*[1-9][0-9]*$/,//QQ号码
            phone:/^[1]([3]|[4]|[5]|[8])[0-9]{9}$/,//手机号码
            user:/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, //验证用户名，长度在5~16之间，只能包含字符、数字和下划线
            post:/[1-9]d{5}(?!d)/,//邮编
            url:/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^\"\"])*$/,//url地址
            idcard:/^\d{15}(\d{2}[A-Za-z0-9])?$/, //身份证号
            ip:/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //IP
        };

        var options = $.extend(defaults, options);

        var _dom=this,
            _fields=options.fields;


        //验证元素事件初始化
        function initValid() {
            var i=0;
            for(var key in _fields) {
                var fieldValue=_fields[key],
                    _domValid=$(key);
                if(fieldValue.focusMsg&&fieldValue.errMsg) {//定义获取焦点时候的提示
                    _domValid.data('validate',fieldValue);
                    _domValid.focus(function() {
                        $.fn.witchValidate.addTips($(this),'focusMsg');
                    });
                    _domValid.blur(function() {
                         testValid($(this));//执行校验
                     });
                }
                i++;
            }
        }
        /** 进行校验
         *  @param:value 验证条件
         *  @obj 待校验的对象(jQuery)
         */
        function testValid(obj) {
            var value=obj.data('validate'),
                _must=value.must,
                _isValid=true;
            var _value=$.trim(obj.val());
            if(_must || (!_must&&_value!=='')) {
                //必须输入
                if(_value=='') {
                    $.fn.witchValidate.addTips(obj,'errMsg');
                    return;
                }
                if(value.comp) {
                    if(_value !== $.trim($(value.comp).val())) {
                        _isValid=false;
                        $.fn.witchValidate.addTips(obj,'compMsg');
                        return;
                    }
                }
                //大小的判断
                if(value.minLength||value.maxLength){
                    value.minLength=value.minLength==undefined ? 1 :value.minLength;
                    value.maxLength=value.maxLength==undefined ? 100000 :value.maxLength;
                    var _valueLen=_value.replace(/[^\x00-\xff]/g,"rr").length;
                    if(!(_valueLen>=value.minLength&&_valueLen<=value.maxLength)){
                        _isValid=false;
                        $.fn.witchValidate.addTips(obj,'errMsg');
                        return;
                    }
                }
                //正则的判断
                if(value.reg) {
                    if(typeof(value.reg)=='string') {
                        if(!(validReg[value.reg].test(_value))) {
                            _isValid=false;
                            $.fn.witchValidate.addTips(obj,'errMsg');
                            return;
                        }
                    }
                    else {
                        if(!(value.reg.test(_value))) {
                            _isValid=false;
                            $.fn.witchValidate.addTips(obj,'errMsg');
                            return;
                        }
                    }
                }
                //ajax校验
                if(value.url) {
                    obj.removeClass('witchajax').addClass('witchajax');
                   $.ajax({
                        type:"POST",
                        url:value.url,
                        data:obj.attr('name') + '=' + _value,
                        dataType:'json',
                        success:function(msg) {
                            if(msg.state!='true'){
                                $.fn.witchValidate.addTips(obj,'errMsg');

                            }
                            if(_isValid){
                                  $.fn.witchValidate.removeTips(obj);
                             }
                             obj.removeClass('witchajax');
                        },
                       error:function(){
                           $.fn.witchValidate.addTips(obj,'errMsg');
                       }
                    });
                }
            }
            if(_isValid) {
                $.fn.witchValidate.removeTips(obj);
            }
            return _isValid;
        }

        initValid();


            var submitDom=_dom.find(":submit");
            submitDom.bind('click',function() {
                return false;
            });
            submitDom.click(function() {
                var isValied=true,
                    _postData='';
                for(var key in _fields) {
                    var fieldValue=_fields[key],
                        _domValid=$(key);
                    _postData+=_domValid.attr('name') + '=' + _domValid.val() + '&';//合并提交的参数
                    if(fieldValue.focusMsg&&fieldValue.errMsg) {//定义获取焦点时候的提示
                        if(!testValid(_domValid)){//执行校验
                            isValied=false;
                        }
                    }
                }
                if(isValied) {
                    var timeout=setInterval(function() {
                            if(_dom.find('.witchajax').length===0){
                                clearInterval(timeout);
                                alert(typeof(options.ajaxFun));
                                if(typeof(options.ajaxFun)=='function') {
                                    options.ajaxFun();
                                }
                                else if(typeof(options.ajaxFun)=='object') {
                                    $.ajax({
                                        type:'POST',
                                        url:options.ajaxFun.url,
                                        data:_postData,
                                        success:options.ajaxFun.success,
                                        error:options.ajaxFun.error
                                    })
                                }
                                else {
                                    submitDom.unbind('click');
                                    submitDom.bind('click',function(){
                                        return true;
                                    });
                                    submitDom.click();
                                }
                            }
                      },50);
                }
            });

    };

    /**
     * 添加提示的方法
     * @param obj 表单元素的jQuery对象
     * @param type 提示信息的名称
     */
    $.fn.witchValidate.addTips=function(obj,type) {
        //清除已有提示
        $.fn.witchValidate.removeTips(obj);
        var _parent = obj.parent(),
            div = '<div id="' + obj.attr('id').replace('#', '') + '-validate" class="f-validatetips f-validatetips-right">' + obj.data('validate')[type] + '</div>';
        if(type.indexOf('focus')== -1) {
            div=div.replace('f-validatetips-right','f-validatetips-error');
        }
        _parent.append(div);
    }
    /**
     * 移除提示的方法
     * @param obj 表单元素的jQuery对象
     */
    $.fn.witchValidate.removeTips=function(obj) {
        //清除已有提示
        $('#'+obj.attr('id')+"-validate").fadeIn('fast',function() {
            this.remove();
        });
    }

})(jQuery);