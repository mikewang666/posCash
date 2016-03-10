/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 上午9:48
 * To change this template use File | Settings | File Templates.
 */

var Custom = {},
    config = require('../../config/config.js'),
    knex = require('knex')(config.sqlite);
/**
 * 创建新用户
 * @param customInfo
 * @param callback
 */
Custom.insert = function(customInfo, callback) {
    knex.insert(customInfo, 'id').into('custom').then(function(id) {
        callback(null, id);
    }).catch(function(err) {
        callback(err);
    });
}

/**
 * 修改字段
 * @param id  id
 * @param key 字段
 * @param value 字段的值
 */
Custom.update = function(id, key, value) {
    knex.raw('update custom set ' + key + ' = ? where id = ?', [value, id]).then(function(doc) {
        callback(null, doc);
    }).catch(function(err) {
        callback(err);
    });
}

/**
 * 删除用户
 * @param id 用户id
 */
Custom.del = function(id) {
        knex('custom').where('id', id).del().then(function() {

        });
    }
    /**
     * 获取用户列表
     * @param kw
     * @param cp
     * @param callback
     */
Custom.page = function(kw, cp, mp, callback) {
    var where = 'userName like ? or phone like ?';
    var whereArray = ['%' + kw + '%', '%' + kw + '%'];

    knex.select('*').from('custom').whereRaw(where, whereArray).orderBy('id', 'desc').limit(mp).offset((cp - 1) * mp).then(function(docs) {
        callback(null, docs);
    }).catch(function(err) {
        callback(err);
    });
}

Custom.count = function(kw, callback) {
        var where = 'userName like ? or phone like ?';
        var whereArray = ['%' + kw + '%', '%' + kw + '%'];
        knex('custom').count('id as count').whereRaw(where, whereArray).then(function(count) {
            callback(null, count[0].count);
        }).catch(function(err) {
            callback(err);
        });
    }

/**
 * 获取个人资料通过手机号
 * @param  {[type]}   phone    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Custom.getCustomByPhone = function(phone, callback) {
	knex.raw('select * from custom where phone = ?', [phone]).then(function(doc) {
		callback(null, doc);
	}).catch(function(err) {
		callback(err);
	});
}
/**
 * 充值
 * @param  {[type]} id    [description]
 * @param  {[type]} money [description]
 * @return {[type]}       [description]
 */
Custom.addMoney = function(id, money, callback) {
    knex.raw('update custom set money = money + ? where id = ?', [money, id]).then(function(doc) {
        Custom.getCustomById(id, function(err, doc) {
            callback(err, doc);
        })
    }).catch(function(err) {
        callback(err);
    });
}
/**
 * 获取个人资料通过手机号
 * @param  {[type]}   username [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Custom.getCustomByName = function(username, callback) {
	knex.raw('select * from custom where userName = ?', [username]).then(function(doc) {
		callback(null, doc);
	}).catch(function(err) {
		callback(err);
	});
}

Custom.getCustomById = function(id, callback) {
	knex.raw('select * from custom where id = ?', [id]).then(function(doc) {
		callback(null, doc);
	}).catch(function(err) {
		callback(err);
	});
}


module.exports = Custom;
