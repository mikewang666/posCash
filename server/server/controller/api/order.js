var home = {},
    tools = require('../../lib/tools.js'),
    orderApi = require('../../models/orderApi.js'),
    config = require('../../config/config.js'),
    objectid = require('objectid'),
    async = require('async');

home.page = function(req, res) {
    var customId = parseInt(tools.xssFilter(req.body.customid));
    var operatorId = parseInt(tools.xssFilter(req.body.operatorid));
    var timeStart = tools.xssFilter(req.body.timestart);
    var timeEnd = tools.xssFilter(req.body.timeend);
    var cp = parseInt(req.body.cp);
    var mp = parseInt(req.body.mp);
    var state = parseInt(req.body.state);
    async.parallel([
        function(cb) {orderApi.page(operatorId, customId, timeStart, timeEnd, cp, mp, state, cb)},
        function(cb) {orderApi.count(operatorId, customId, timeStart, timeEnd,  state, cb)}
    ], function(err, docs) {
        if (err) {
            res.send(tools.msg.err);
            console.log(err);
            return;
        }
        console.log(docs);
        res.render('ajax/orderpage.html', {
            count: docs[1],
            rows: docs[0],
            tools:tools
        });
    });
}

//添加订单
home.add = function(req, res) {
    var customid = req.body.customid;
    var orderid = '';
    var des = tools.xssFilter(req.body.des);
    var money = tools.floatMul(parseFloat(req.body.money),100);
    var state = 0;
    var time = 0;
    var realmoney = tools.floatMul(parseFloat(req.body.realmoney),100);
    var operatorid = 0;
    var goods = req.body.goods;

    console.log(goods);

    orderApi.insert({
        customid: customid,
        des: des,
        money: money,
        state: 0,
        realMoney: realmoney,
        operatorId: 1,
        goods: goods,
        orderid: objectid() + ''
    }, function(err, docs) {
        if(err != null) {
            console.log(err);
            res.send(tools.msg.err);
            return;
        }
        res.send(tools.msg.right);
    });
}

module.exports = home;
