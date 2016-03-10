/**
 * Created by Administrator on 14-2-5.
 */

var home = {},
    tools = require('../../lib/tools.js'),
    userApi = require('../../models/userApi.js'),
    config = require('../../config/config.js'),
    async = require('async');

home.login = function(req, res) {
        console.log('cookie=' + JSON.stringify(req.cookies));
        var username = tools.xssFilter(req.body.username);
        var password = tools.md5(tools.xssFilter(req.body.password));
        userApi.login(username, password, function(err, doc) {
            if (err || doc.length == 0) {
                console.log(err);
                console.log(doc);
                res.send(tools.msg.err);
                return;
            }
            doc = doc[0];
            var json = {
                "state": 　 "true",
                "data": {
                    id: doc.id,
                    userName: doc.userName,
                    type: doc.type,
                    key: tools.md5(doc.id + doc.type + config.keySalt)
                }
            };
            console.log(doc);
            console.log(json);
            // var options = {};
            // res.cookie('nickname', doc.userName, options);
            res.send(json);
        });
    }
    /**
     * 更新操作员密码
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
home.uppassword = function(req, res) {
        var id = parseInt(req.body.id);
        var password = tools.md5(tools.xssFilter(req.body.password));
        userApi.upPassword(id, password, function(err, doc) {
            res.send(tools.msg.right);
        });
    }
    /**
     * 更新某个字段
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
home.update = function(req, res) {
        var k = tools.xssFilter(req.body.k);
        var v = tools.xssFilter(req.body.v);
        var id = parseInt(req.body.id);
        userApi.update(id, k, v);
        res.send('true');
    }
    /**
     * 获取列表
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
home.page = function(req, res) {
        console.log('cookie=' + JSON.stringify(req.cookies));
        var kw = tools.xssFilter(req.body.kw);
        var cp = parseInt(req.body.cp);
        var mp = parseInt(req.body.mp);

        async.parallel([
            function(cb) {
                userApi.page(kw, cp, mp, cb)
            },
            function(cb) {
                userApi.count(kw, cb)
            }
        ], function(err, docs) {
            if (err) {
                res.send(tools.msg.err);
                console.log(err);
                return;
            }
            console.log(docs);
            res.render('ajax/userpage', {
                count: docs[1],
                rows: docs[0]
            });
        });
    }
    /**
     * 删除操作员
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
home.del = function(req, res) {
    var id = parseInt(req.body.id);
    userApi.del(id);
    res.send(tools.msg.right);
}

home.check = function(req, res) {
    var username = tools.xssFilter(req.body.username);
    userApi.checkUserName(username, function(err, doc) {
        if (doc.length == 0) {
            res.send(tools.msg.right);
            return;
        }
        res.send(tools.msg.err);
    });
}

home.add = function(req, res) {
    var username = tools.xssFilter(req.body.username);
    var password = tools.md5(tools.xssFilter(req.body.password));
    var phone = tools.xssFilter(req.body.phone);
    var userInfo = {
        userName: username,
        password: password,
        phone: phone,
        type: 1
    }
    userApi.insert(userInfo, function(err, id) {
        if (err) {
            res.send(tools.msg.err);
            return;
        }
        res.send({
            "id": id
        });
    });
}

module.exports = home;
