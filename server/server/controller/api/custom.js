/**
 * --------------------------------------------------------
 * 功能描述
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-2-10 上午11:08
 * --------------------------------------------------------
 */
var home = {},
    tools = require('../../lib/tools.js'),
    customApi = require('../../models/customApi.js'),
    config = require('../../config/config.js'),
    async = require('async');



home.page = function(req, res) {
	var kw = tools.xssFilter(req.body.kw);
	var cp = parseInt(req.body.cp);
	var mp = parseInt(req.body.mp);

	async.parallel([
		function(cb) {
			customApi.page(kw, cp, mp, cb)
		},
		function(cb) {
			customApi.count(kw, cb)
		}
	], function(err, docs) {
		if (err) {
			res.send(tools.msg.err);
			return;
		}
		res.render('ajax/custompage.html', {
			count: docs[1],
			rows: docs[0]
		});
	});
}

home.update = function(req, res) {
	var k = tools.xssFilter(req.body.k);
	var v = tools.xssFilter(req.body.v);
	var id = parseInt(req.body.id);
	customApi.update(id, k, v);
	res.send('true');
}


home.add = function(req, res) {
    var username = tools.xssFilter(req.body.username);
    var phone = tools.xssFilter(req.body.phone);
    var CustomInfo = {
        userName:username,
        phone:phone,
        score: 0,
        money:0
    };
    customApi.insert(CustomInfo, function(err, id) {
        if (err) {
            res.send(tools.msg.err);
            return;
        }
        res.send({
            "id": id
        });
    });
}

home.getCustomByName = function(req, res) {
    var username = tools.xssFilter(req.body.username);
    customApi.getCustomByName(username, function(err, doc) {
        if (err) {
            res.send(tools.msg.err);
            return;
        }
        res.send(doc);
    });
}

home.getCustomByPhone = function(req, res) {
    var phone = tools.xssFilter(req.body.phone);
    customApi.getCustomByPhone(phone, function(err, doc) {
        if (err || doc.length == 0) {
            res.send(tools.msg.err);
            return;
        }
        var json = {
            "state": "true",
            data: {
                id: doc[0].id,
                userName: doc[0].userName,
                money: doc[0].money,
                score: doc[0].score,
            }
        };
        res.send(json);
    });
}

home.check = function(req, res) {
    var phone = tools.xssFilter(req.body.phone);
    customApi.getCustomByPhone(phone, function(err, doc) {
        if (err || doc.length == 0) {
            res.send(tools.msg.right);
            return;
        }
        res.send(tools.msg.err);
    });
}
//充值
home.addmoney = function(req, res) {
    var id = parseInt(tools.xssFilter(req.body.id));
    var money = parseInt(tools.xssFilter(req.body.money));
    if(money > 0) {
        customApi.addMoney(id, money, function(err, doc) {
            if (err) {
                res.send(tools.msg.err);
                return;
            }
            var json = {
                "state":"true",
                "money": doc[0].money
            };
            //console.log(json);
            res.send(json);
        });
    }
    else {
        res.send(tools.msg.err);
    }
}

module.exports = home;
