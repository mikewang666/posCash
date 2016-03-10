/**
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