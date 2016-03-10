/**
 * --------------------------------------------------------
 * 各种动画显示以及可见元素的动画效果的实现，使用方法参考demo
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-1-3 下午4:58
 * --------------------------------------------------------
 */
;(function($) {

    $.fn.pizzaShow = function(options) {

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

})(jQuery);