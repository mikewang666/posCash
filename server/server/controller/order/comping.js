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
//	//res.render('settingnav');
}

home.page = function(req, res) {
	var state = tools.xssFilter(req.query.state);
	orderApi.page(0,'', 1, state, function(err, rows) {
		if(err) {
			res.send(err);
			return;
		}
		res.render('ajax/compingpage',{rows: rows});
	});
}

/** 更改订单状态 **/
home.order = function(req, res) {
	var id = tools.xssFilter(req.body.id);
	var state = tools.xssFilter(req.body.state);
	orderApi.update(id, 'state',state);
	res.send('true');
}

home.getorder = function(req, res) {
	var id = tools.xssFilter(req.body.id);
	orderApi.get(id,function(err, doc) {
		res.send(doc);
	})
}

module.exports = home;
