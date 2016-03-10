
var home = {},
    tools = require('../lib/tools.js'),
    userApi = require('../models/userApi.js'),
    config = require('../config/config.js'),
		objectid = require('objectid'),
    async = require('async');

home.index = function(req, res){
    res.render('ordernav');
}

home.addorder = function(req, res) {
	res.render('addorder',{'title': '新增订单','objid': objectid().toString().toUpperCase()});
}

home.order = function(req, res) {
	res.render('order');
}

home.comping = function(req ,res) {
	res.render('comping');
}

home.editorder = function(req, res) {
	res.render('editorder');
}


module.exports = home; 