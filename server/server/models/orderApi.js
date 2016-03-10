/**
 * --------------------------------------------------------
 * 功能描述
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-2-10 上午11:05
 * --------------------------------------------------------
 */
var orderApi = {},
    Order = require('./data/order.js'),
    config = require('../config/config.js');


orderApi.insert = function(orderInfo, callback) {
    Order.insert(orderInfo, function(err, doc) {
        callback(err, doc);
    });
}

orderApi.page = function(operatorId, customId, timeStart, timeEnd, cp, mp, state, callback) {
    Order.page(operatorId, customId, timeStart, timeEnd, cp, mp, state, callback);
}

orderApi.count = function(operatorId, customId, timeStart, timeEnd, state, callback) {
        Order.count(operatorId, customId, timeStart, timeEnd, state, callback);
}

module.exports = orderApi;
