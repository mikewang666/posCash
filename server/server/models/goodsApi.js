/**
 * --------------------------------------------------------
 * 功能描述
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-2-10 上午11:05
 * --------------------------------------------------------
 */
var goodApi = {},
	Goods= require('./data/goods.js'),
	userGood= require('./data/usergood.js'),
config=require('../config/config.js'),
	async=require('async');


goodApi.insert=function(goodsInfo,callback){
	Goods.insert(goodsInfo,function(err,doc){
		callback(err,doc);
	})
}

goodApi.page = function(kw,cp,mp,callback) {
	Goods.page(kw,cp,mp,function(err,rows) {
		callback(err,rows);
	});
}


goodApi.update = function(id,key,value) {
	Goods.update(id,key,value);
}

goodApi.del = function(id) {
	Goods.del(id);
}
goodApi.count = function(kw, callback) {
	Goods.count(kw, function(err, count) {
		callback(err, count);
	})
}

goodApi.getGoodByCode = function(goodscode, callback) {
	Goods.getGoodByCode(goodscode, function(err, doc) {
		callback(err, doc);
	});
}


module.exports = goodApi;
