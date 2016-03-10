/**
 * --------------------------------------------------------
 * 功能描述
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-2-10 上午11:05
 * --------------------------------------------------------
 */
var customApi = {},
    Custom = require('./data/custom.js'),
    config = require('../config/config.js'),
    md5 = require('../lib/tools').md5;


customApi.insert = function(customInfo, callback) {
    Custom.insert(customInfo, function(err, id) {
        callback(err, id);
    })
}

customApi.page = function(kw, cp, mp, callback) {
        Custom.page(kw, cp, mp, function(err, rows) {
            callback(err, rows);
        });
    }
    /**
     * 更新用户密码
     * @type {document.password|connection.password|*|object.auth.password|password|config.password}
     */
customApi.update = function(id, key, value) {
    Custom.update(id, key, value);
}

customApi.count = function(kw, callback) {
    Custom.count(kw, function(err, count) {
        callback(err, count);
    });
}

customApi.getCustomByPhone = function(phone, callback) {
    Custom.getCustomByPhone(phone, function(err, doc) {
        callback(err, doc);
    });
}

customApi.getCustomByName = function(username, callback) {
    Custom.getCustomByName(username, callback);
}

customApi.addMoney = function(id, money, callback) {
    Custom.addMoney(id, money, callback);
}

module.exports = customApi;
