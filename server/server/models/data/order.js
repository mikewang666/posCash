/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 上午9:48
 * To change this template use File | Settings | File Templates.
 */

var Order = {},
    config = require('../../config/config.js'),
    knex = require('knex')(config.sqlite),
    Promise = require('bluebird');
/**
 * 创建新订单
 * @param orderInfo
 * @param callback
 */
Order.insert = function(orderInfo, callback) {
    knex.transaction(function(trx) {
        knex.insert(orderInfo, 'id').into('order').transacting(trx).then(function(ids) {
            return Promise.map(JSON.parse(orderInfo.goods), function(good) {
                return knex("goods").where('id', good.id).decrement('number', good.number).transacting(trx);
            }).then(trx.commit).catch(trx.rollback);
        });
    }).then(function(inserts) {
        console.log(inserts.length + ' new books saved.');
        callback(null, inserts);
    }).catch(function(err) {
        console.log(err);
        callback(err);
    });
}

//     var goods = orderInfo.goods;
//     var goodsLength = goods.length;
//     /** 更新用户商品销售记录 **/
//     for (var i = 0; i < goodsLength; i++) {
//         if (goods[i].state == '') {
//             userGood.insert(orderInfo.uid, goods[i]);
//         }
//     }
// }
//
// /**
//  * 修改字段
//  * @param id  id
//  * @param key 字段
//  * @param value 字段的值
//  */
// Order.update = function(id, key, value, callback) {
//     knex.raw('update [order] set ' + key + ' = ? where id = ?', [value, id]).then(function(doc) {
//         callback(null, doc);
//     }).catch(function(err) {
//         callback(err);
//     });
//
// }

/**
 * 获取订单列表
 * @param kw
 * @param cp
 * @param state
 * @param callback
 */
Order.page = function(operatorId, customId, timeStart, timeEnd, cp, mp, state, callback) {
    var where = ' a.customId = b.id and a.operatorId = c.id ';
    var whereArray = [];
    if (operatorId != -1) { //筛选操作员
        where += ' operatorId = ? ';
        whereArray.push(operatorId);
    }
    if (customId != -1) { //筛选会员
        where += ' and customId = ? ';
        whereArray.push(customId);
    }
    if (timeStart != '' && timeEnd != '') { //筛选时间
        where += ' and time between ? and ? ';
        whereArray.push(timeStart);
        whereArray.push(timeEnd);
    }
    if (state != -1) {
        where += ' and state = ? ';
        whereArray.push(state);
    }
    var order = ' order by a.id desc';
    whereArray.push(mp);
    whereArray.push((cp - 1) * mp);
    var s = knex.raw("select a.*,b.username as customName,c.username as operaName from [order] as a, custom as b, user as c where" + where + order +
        ' limit ? offset ?', whereArray).toString();
    console.log(s);
    knex.raw("select a.*,b.username as customName,c.username as operaName from [order] as a, custom as b, user as c where" + where + order +
        ' limit ? offset ?', whereArray).then(function(docs) {
        callback(null, docs);
    }).catch(function(err) {
        callback('asd' + err);
    })
}

/**
 * 获取订单列表
 * @param kw
 * @param cp
 * @param state
 * @param callback
 */
Order.count = function(operatorId, customId, timeStart, timeEnd, state, callback) {
    var where = ' a.customId = b.id and a.operatorId = c.id ';
    var whereArray = [];
    if (operatorId != -1) { //筛选操作员
        where += ' operatorId = ? ';
        whereArray.push(operatorId);
    }
    if (customId != -1) { //筛选会员
        where += ' and customId = ? ';
        whereArray.push(customId);
    }
    if (timeStart != '' && timeEnd != '') { //筛选时间
        where += ' and time between ? and ? ';
        whereArray.push(timeStart);
        whereArray.push(timeEnd);
    }
    if (state != -1) {
        where += ' and state = ? ';
        whereArray.push(state);
    }
    var order = '';
    var s = knex.raw("select count(a.id) as count from [order] as a, custom as b, user as c where" + where, whereArray).toString();
    console.log(s);
    knex.raw("select count(a.id) as count from [order] as a, custom as b, user as c where" + where, whereArray).then(function(count) {
        callback(null, count[0].count);
    }).catch(function(err) {
        callback(err);
    })
}

// /** 获取订单 **/
// Order.get = function(id, callback) {
//     db.all('SELECT A.*,B.user FROM [order] as A,[custom] as B where A.uid=B.id and A.id=? ', [id], function(err, doc) {
//         callback(err, doc);
//     });
// }


module.exports = Order;
