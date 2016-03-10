var header = new function() {
    var _self = this;
    _self.init = function() {
        $('.sysicon-m').parent().mouseenter(function() {
            pizzaLayer.tips($(this));
        }).mouseleave(function() {
            layer.closeAll('tips');
        })
    }
}
