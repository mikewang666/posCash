
var $ = jQuery = require('jquery');
require('pizzaui');
var tools = require('pizzatools');
var pizzaLayer = require('pizzalayer');

//
$('.avatar-tip').memberInfo();

$('.tip-what').focus(function(){
	pizzaLayer.tips(this, null);
}).blur(function() {
	//layer.closeAll('tips');
});

//$('.detail').tip4detail();
pizzaLayer.detail('.detail');



//
var m = '目前没有会员邀请您参加约会。或参加、退出您发起的约会';
var n = '参加<约会>是您拓宽人脉的真实、有效地途径之一！';
$('#zhanwei').prepend(tools.holdSpace(m, n));

//
$('#comment-wish').wordsTip({
	min: 10,
	max: 128
});

//
$('#city').pizzaSelect({});

//
$('#area-1').pizzaArea({
	ajaxUrl: '/index/get'
});

//
$('#area-2').pizzaArea({
	type: false,
	ajaxUrl: '/index/get'
});

//
$('#tab').pizzaTab();
$('#tab1').pizzaTab();
$('#tab2').pizzaTab();
$('#tab3').pizzaTab();
















