/**
 * --------------------------------------------------------
 * 商品设定
 * @Version 0.1
 * @Author: 左盐(huabinglan@163.com)
 * @Date: 14-4-11 下午3:46
 * --------------------------------------------------------
 */

var home = {},
    tools = require('../../lib/tools.js'),
    goodsApi = require('../../models/goodsApi.js'),
    config = require('../../config/config.js'),
    async = require('async');

home.index = function(req, res) {
    //res.render('settingnav');
}

home.page = function(req, res) {
    var kw = tools.xssFilter(req.body.kw);
    var cp = parseInt(req.body.cp);
    var mp = parseInt(req.body.mp);
    async.parallel([
        function(cb) {
            goodsApi.page(kw, cp, mp, cb)
        },
        function(cb) {
            goodsApi.count(kw, cb)
        }
    ], function(err, docs) {
        if (err) {
            console.log(err);
            res.send(tools.msg.err);
            return;
        }
        res.render('ajax/goodspage', {
            count: docs[1],
            rows: docs[0],
            tools: tools
        });
    });
}


home.add = function(req, res) {
    var goodsInfo = {
        name: tools.xssFilter(req.body.name), //商品名称
        norms: tools.xssFilter(req.body.norms), //商品规则200ml
        unit: tools.xssFilter(req.body.unit), //商品单位
        jinhuoprice: tools.floatMul(parseFloat(tools.xssFilter(req.body.jinhuoprice)), 100), //进货价格
        number: parseInt(tools.xssFilter(req.body.number)), //商品库存数量
        dailiprice: tools.floatMul(parseFloat(tools.xssFilter(req.body.dailiprice)),100), //代理价格
        goodscode: tools.xssFilter(req.body.goodscode), //商品编码
        huiyuanprice: tools.floatMul(parseFloat(tools.xssFilter(req.body.huiyuanprice)),100), //会员价格
        lingshouprice: tools.floatMul(parseFloat(tools.xssFilter(req.body.lingshouprice)),100) //零售价格
    };
    goodsApi.insert(goodsInfo, function(err, id) {
        if (err) {
            res.send(err);
            return;
        }
        res.send({
            "id": id
        });
    });
}

home.update = function(req, res) {
    var k = tools.xssFilter(req.body.k);
    var v = tools.xssFilter(req.body.v);
    var id = parseInt(req.body.id);
    if(k.indexOf('price') > -1) {
        v = tools.floatMul(parseFloat(v),100);
    }
    goodsApi.update(id, k, v);
    res.send('true');
}

home.check = function(req, res) {
    var code = tools.xssFilter(req.body.goodscode);
    goodsApi.getGoodByCode(code, function(err, doc) {
        if(err || doc.length == 0) {
            res.send(tools.msg.right);
            return;
        }
        res.send(tools.msg.err);
    });
}
//根据
home.getGoodByCode = function(req, res) {
    var code = tools.xssFilter(req.body.goodscode);
    goodsApi.getGoodByCode(code, function(err, doc) {
        if(err || doc.length == 0) {
            res.send(tools.msg.err);
            return;
        }
        var json = {
            "state": "true",
            data: {
                id: doc[0].id,
                name: doc[0].name,
                norms: doc[0].norms,
                unit: doc[0].unit,
                jinhuoprice: tools.accDiv(doc[0].jinhuoprice,100),
                dailiprice: tools.accDiv(doc[0].dailiprice,100),
                goodscode: doc[0].goodscode,
                huiyuanprice: tools.accDiv(doc[0].huiyuanprice,100),
                lingshouprice: tools.accDiv(doc[0].lingshouprice,100)
            }
        }
        res.send(json);
    });
}

module.exports = home;
