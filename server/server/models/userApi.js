/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 上午9:49
 * To change this template use File | Settings | File Templates.
 */
/*
 *根据session检查是否登录，3个参数，req,res,callback;
 *callback的返回值作为本函数的返回值
 */
var userApi = {},
    User = require('./data/user.js'),
    config = require('../config/config.js'),
    md5 = require('../lib/tools').md5;


/*
    检查是否登录
    未登录则跳转到首页
    登录则返回uid
 */
userApi.isLogin = function(req, res) {
    var uid = req.cookies.id,
        username = req.cookies.username;
    return new Array(uid, username);
}

userApi.login = function(username, password, callback) {
        User.login(username, password, function(err, doc) {
            callback(err, doc);
        });
    }


userApi.insert = function(userInfo, callback) {
    User.insert(userInfo, function(err, doc) {
        callback(err, doc);
    })
}

userApi.page = function(kw, cp, mp, callback) {
    User.page(kw, cp, mp, function(err, rows) {
        callback(err, rows);
    });
}

userApi.count = function(kw, callback) {
        User.count(kw, function(err, count) {
            callback(err, count);
        });
    }
    /**
     * 更新用户密码
     * @type {document.password|connection.password|*|object.auth.password|password|config.password}
     */
userApi.upPassword = function(id, password, callback) {
    User.upPassword(id, password, function(err, doc) {
        callback(err, doc);
    });
}

userApi.update = function(id, key, value) {
    User.update(id, key, value);
}

userApi.del = function(id) {
    User.del(id);
}

userApi.checkUserName = function(userName, callback) {
    User.checkUserName(userName, function(err, doc) {
        callback(err, doc);
    })
}

module.exports = userApi;
