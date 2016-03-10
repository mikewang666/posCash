/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 上午9:48
 * To change this template use File | Settings | File Templates.
 */

var userGood={},
	async =  require('async'),
	sqlite3=require('sqlite3').verbose(),
	db=new sqlite3.Database('data.sqlite');

/**
 * 更新用户商品价格记录
 * @param uid
 * @param goodsInfo
 */
userGood.insert = function(uid,goodsInfo){
	/*db.serialize(function() {
		db.run("INSERT into [usergood] (uid,name,unit,sale,norms) values ("+uid+",'"+goodsInfo.name+"','"+goodsInfo.unit+"',"+goodsInfo.sale+",'"+goodsInfo.norms+"')");
	});*/

	async.waterfall([
		function(cb) {
			db.get('SELECT * FROM [usergood] where uid=? and name=? and unit=? and norms=? ',[uid, goodsInfo.name, goodsInfo.unit, goodsInfo.norms],function(err,doc) {
				cb(err,doc);
			});
		},
		function(doc, cb) {
			if(doc) {//记录存在
				if(doc.sale != goodsInfo.sale) { //价格发生变化,则更新记录
					db.run("update usergood set sale=? where id = ?",[goodsInfo.sale, doc.id]);
				}
			}
			else { //添加记录
				db.run("INSERT into [usergood] (uid,name,unit,sale,norms) values ("+uid+",'"+goodsInfo.name+"','"+goodsInfo.unit+"',"+goodsInfo.sale+",'"+goodsInfo.norms+"')");
			}
		}
	],function(err, results) {

	});

}

/**
 * 修改字段
 * @param id  id
 * @param key 字段
 * @param value 字段的值
 */
userGood.update = function(id, key, value) {
	db.run("update goods set "+key+" = ? where id = ?",[value,id]);
}


userGood.pageName = function(name, uid, callback) {
	db.all("SELECT * FROM [usergood] where name like '%"+name+"%' and uid ="+uid+" ",function(err,doc) {
		callback(err,doc);
	});
}

userGood.getByName = function(name, uid, callback) {
	db.all('SELECT * FROM [usergood] where name=?  and uid=?',[name,uid],function(err,doc) {
		callback(err,doc);
	});
}


module.exports = userGood;