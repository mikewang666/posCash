/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-20
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */

/* 更新过单价 或 数量 后，自动更新金额*/
function updatePrice(obj) {
	var o = obj.parent();
	var price = parseFloat($.trim(o.find('.price').html()));
	var number = parseInt($.trim(o.find('.number').html()));
	var count = o.find('.count');
	var countNumber = price * number;
	count.html(countNumber);
	var jine = 0, countItem;
	$("#user").find('.count').each(function() {
		countItem = $.trim($(this).html());
		if(countItem == '') {
			jine += 0;
		}
		else {
			jine += parseFloat(countItem);
		}
	});
	$("#jine").html(jine);
}

/* 保存订单 */
/**
 * 保存订单
 * @param type 0保存，1保存新增
 */
function saveOrder(type) {
	var uid = $.trim($('#shouhuoren').data('uid'));
	var express = $.trim($('#express').val());
	var phone = $.trim($('#phone').val());
	if(!uid || express =='' && phone =='') {
		layer.alert('请填写完整收货人信息', 8);
		return;
	}
	var loadi = layer.load('正在添加订单…');
	var data = {
		uid: uid,
		express: express ,
		phone: phone,
		des: $.trim($('#des').val()),
		area: $.trim($('#area').val()),
		orderid: $.trim($('#orderid').html()),
		jine: $.trim($('#jine').html())
	};
	var goods = [];
	var i=0;
	$('#user > tbody').find('tr').each(function() {
		var tds = $(this).find('td');
		if($(tds[1]).html() == '') {
			return;
		}
		else {
			goods.push({'name': $.trim($(tds[1]).html())})
			//goods[i].name = $.trim($(tds[1]).html());
			goods[i].norms = $.trim($(tds[2]).html());
			goods[i].unit = $.trim($(tds[3]).html());
			goods[i].number = $.trim($(tds[4]).html());
			goods[i].sale = $.trim($(tds[5]).html());
			goods[i].count = $.trim($(tds[6]).html());
			goods[i].state = $.trim($(tds[7]).html());
			i++;
		}
	});
	data.goods = goods;
	$.ajax({
		type:'post',
		url: '/order/addorder/addorder',
		data: 'order=' + JSON.stringify(data),
		datatype:'json',
		success: function(msg) {
		   layer.close(loadi);
			layer.msg('添加成功',1,function() {
				if(type == 0) {
					document.location.href='/order/';
				}
				else {
					document.location.reload();
					$('#shouhuoren').val('');
					$('#express').val('')
					$('#phone').val('');
					$('#area').val('');
				}
			});
		}
	})
}


function updateOrder() {
	var uid = $.trim($('#shouhuoren').data('uid'));
	var express = $.trim($('#express').val());
	var phone = $.trim($('#phone').val());
	if(!uid || express =='' && phone =='') {
		layer.alert('请填写完整收货人信息', 8);
		return;
	}
	var loadi = layer.load('正在添加订单…');
	var data = {
		uid: uid,
		express: express ,
		phone: phone,
		des: $.trim($('#des').val()),
		area: $.trim($('#area').val()),
		orderid: $.trim($('#orderid').html()),
		jine: $.trim($('#jine').html())
	};
	var goods = [];
	var i=0;
	$('#user > tbody').find('tr').each(function() {
		var tds = $(this).find('td');
		if($(tds[1]).html() == '') {
			return;
		}
		else {
			goods.push({'name': $.trim($(tds[1]).html())})
			//goods[i].name = $.trim($(tds[1]).html());
			goods[i].norms = $.trim($(tds[2]).html());
			goods[i].unit = $.trim($(tds[3]).html());
			goods[i].number = $.trim($(tds[4]).html());
			goods[i].sale = $.trim($(tds[5]).html());
			goods[i].count = $.trim($(tds[6]).html());
			goods[i].state = $.trim($(tds[7]).html());
			i++;
		}
	});
	data.goods = goods;
	$.ajax({
		type:'post',
		url: '/order/addorder/editorder',
		data: 'order=' + JSON.stringify(data) + '&id='+ document.location.href.split('=')[1],
		datatype:'json',
		success: function(msg) {
			layer.close(loadi);
			layer.msg('更新成功',1,function() {
				//	document.location.href='/order/comping/';

			});
		}
	})
}