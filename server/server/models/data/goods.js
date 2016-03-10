/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 上午9:48
 * To change this template use File | Settings | File Templates.
 */

var Goods = {},
    config = require('../../config/config.js'),
    knex = require('knex')(config.sqlite);

/**
 * 创建新商品
 * @param goodsInfo
 * @param callback
 */
Goods.insert = function(goodsInfo, callback) {
    knex.insert(goodsInfo, 'id').into('goods').then(function(id) {
        callback(null, id);
    }).catch(function(err) {
        callback(err)
    });
}

/**
 * 修改字段
 * @param id  id
 * @param key 字段
 * @param value 字段的值
 */
Goods.update = function(id, key, value) {
    knex.raw('update goods set ' + key + ' = ? where id = ?', [value, id]).then(function(doc) {
        //callback(null, doc);
        console.log(doc);
    }).catch(function(err) {
        //callback(err);
        console.log(err);
    });
}

/**
 * 删除用户
 * @param id 用户id//
 */
Goods.del = function(id) {
        knex('goods').where('id', id).del().then(function() {

        });
    }
    /**
     * 获取用户列表
     * @param kw
     * @param cp
     * @param callback
     */
Goods.page = function(kw, cp, mp, callback) {
    var where = 'name like ? or goodscode like ?';
    var whereArray = ['%' + kw + '%', '%' + kw + '%'];

    knex.select('*').from('goods').whereRaw(where, whereArray).orderBy('id', 'desc').limit(mp).offset((cp - 1) * mp).then(function(docs) {
        callback(null, docs);
    }).catch(function(err) {
        callback(err);
    });
}
/**
 * 根据条件获取总条数
 * @param  {[type]}   kw       [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Goods.count = function(kw, callback) {
	var where = 'name like ? or goodscode like ?';
	var whereArray = ['%' + kw + '%', '%' + kw + '%'];

	knex('goods').count('id as count').whereRaw(where, whereArray).then(function(count) {
		callback(null, count[0].count);
	}).catch(function(err) {
		callback(err);
	});
}

/**
 * 根据商品编码获取商品
 * @param  {[type]}   goodscode [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
Goods.getGoodByCode = function(goodscode, callback) {
    knex.raw('select * from goods where goodscode = ?', [goodscode]).then(function(doc) {
        callback(null, doc);
    }).catch(function(err) {
        callback(err);
    });
}



module.exports = Goods;
