/**
 * 数据库操作
 * @authors 左盐 (huabinglan@163.com)
 * @date    2015-09-17 16:23:55
 * @version $Id$
 */

var linvodb = new function () {
	var _self = this;
	var LinvoDB = require('linvodb3');
	LinvoDB.defaults.store = {
		db: require("medeadown")
	};
	LinvoDB.dbPath = process.cwd();

	var Doc = new LinvoDB("doc", {});

	_self.insert = function (json) {
		Doc.insert(json, function (err, newDoc) {
			if (err) {
				console.log(err);
				return;
			}
			console.log(newDoc._id);
		})
	}

	_self.get = function (query, callback) {
		Doc.findOne(query, function (err, doc) {
			callback(err, doc);
		})
	}

	_self.update = function (query, update, option, callback) {
		Doc.update(query, update, option, function (err, numReplaced, newDoc) {
			callback(err, numReplaced, newDoc);
		});
	}

	_self.page = function (query, callback) {
		Doc.find(query, function (err, docs) {
			callback(err, docs);
		});
	}

	_self.remove = function (query, options, callback) {
		Doc.remove(query, {
			multi: true
		}, function (err, num) {
			callback(err, mum);
		});
	}
}

