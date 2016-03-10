/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 上午9:48
 * To change this template use File | Settings | File Templates.
 */

var User = {},
    config = require('../../config/config.js'),
    knex = require('knex')(config.sqlite);

/**
 * 用户登录
 * @param  {[type]}   username [description]
 * @param  {[type]}   password [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
User.login = function(username, password, callback) {
        knex.raw('select * from user where userName = ? and password = ?', [username, password]).then(function(doc) {
            callback(null, doc);
        }).catch(function(err) {
            callback(err);
        });
    }
    /**
     * 创建新用户
     * @param userInfo
     * @param callback
     */
User.insert = function(userInfo, callback) {
    knex.insert(userInfo,'id').into('user').then(function(id) {
        callback(null, id);
    }).catch(function(err) {
        callback(err);
    });
}

/**
 * 修改某个用户密码
 * @param id  用户id
 * @param password 用户密码
 */
User.upPassword = function(id, password, callback) {
    knex.raw('update user set password = ? where id = ?', [password, id]).then(function(doc) {
        callback(null, doc);
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
User.update = function(id, key, value) {
    knex.raw('update user set ' + key + ' = ? where id = ?', [value, id]).then(function(doc) {
        //callback(null, doc);
        console.log(doc);
    }).catch(function(err) {
        //callback(err);
        console.log(err);
    });
}


/**
 * 删除用户
 * @param id 用户id
 */
User.del = function(id) {
        knex('user').where('id', id).del().then(function() {

        });
    }
    /**
     * 获取用户列表
     * @param kw
     * @param cp
     * @param callback
     */
User.page = function(kw, cp, mp, callback) {
        knex.select('*').from('user').whereRaw("username like ? And id != 1", ['%' + kw + '%']).orderBy('id', 'desc').limit(mp).offset((cp - 1) * mp).then(function(docs) {
            callback(null, docs);
        }).catch(function(err) {
            callback(err);
        });
    }
    /**
     * 获取总条数
     * @param  {[type]}   kw       [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
User.count = function(kw, callback) {
        knex('user').count('id as count').whereRaw("username like ? ", ['%' + kw + '%']).then(function(count) {
            console.log(count[0].count);
            callback(null, count[0].count);
        }).catch(function(err) {
            callback(err);
        });
    }
    /**
     * 获取用户名是否被占用
     * @return {[type]} [description]
     */
User.checkUserName = function(username, callback) {
        knex.raw('select * from user where userName = ?', [username]).then(function(doc) {
            callback(null, doc);
        }).catch(function(err) {
            callback(err);
        });
    }
    /*
     获取某个用户的注册信息
     需要提供参数 userId
     */
User.findone = function(userId, callback) {
    knex.raw('select * from user where id = ?', [userId]).then(function(doc) {
        callback(null, doc);
    }).catch(function(err) {
        callback(err);
    });
}

module.exports = User;
