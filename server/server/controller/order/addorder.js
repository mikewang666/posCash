/**
 * --------------------------------------------------------
 * 商品设定
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-4-11 下午3:46
 * --------------------------------------------------------
 */

var home = {},
	tools=require('../../lib/tools.js'),
	goodsApi=require('../../models/goodsApi.js'),
	orderApi=require('../../models/orderApi.js'),
	config=require('../../config/config.js'),
	customApi = require('../../models/customApi.js'),
	async=require('async');

home.index = function(req, res){
	//res.render('settingnav');
}

home.pageuser = function(req, res) {
	customApi.page(tools.xssFilter(req.body.val), 1, function(err, rows) {
		if(err) {
			res.send(err);
			return;
		}
		res.send(rows);
	});
}
//
home.getuser = function(req,res) {
	var uname = tools.xssFilter(req.body.name);
	uname = '0000';
	customApi.get(uname, function(err,doc) {
		if(err) {
			res.send({'err':err});
		}
		res.send(doc);
	});
}

home.pagegoods = function(req,res) {
	var val = tools.xssFilter(req.body.val);
	 goodsApi.pageName(val, 0, function(err, doc) {
		 if(err) {
			 res.send('错误');
		 }
		 var s ='[';
		 for(var d in doc) {
			 s += '{ "name":"' + doc[d].name + '"},';
		 }
		 s = s.substring(0, s.length - 1);
		 s += ']';
		 res.send(s);
	 });
}

home.getgood = function(req,res) {
	var val = tools.xssFilter(req.body.val);
	var uid = tools.xssFilter(req.body.uid);
	if(uid == 'undefined') {
		uid = 0;
	}
	goodsApi.getByName(val, uid, function(err,doc) {
		if(err) {
			res.send(err);
		}
		var array =doc[0].concat(doc[1]);
		res.send(array);
	});
}


home.addorder = function(req, res) {
	var orderInfo =JSON.parse(tools.xssFilter(req.body.order));
	orderApi.insert(orderInfo, function(err,doc) {
		if(err) {
			res.send(err);//
			return;
		}
		res.send(doc);
	});
}
home.editorder = function(req, res) {
	var orderInfo =JSON.parse(tools.xssFilter(req.body.order));
	var uid = tools.xssFilter(req.body.id);
	orderApi.updateAll(uid,orderInfo);
	res.send('true');

}

module.exports = home;
