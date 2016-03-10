/**
 * Author: lingirl (success99@126.com)
 * Date: 2015-08-26 10:23
 * Des : 使用localStorage实现本地化缓存
 */

(function(w, ls) {

	// window下挂载 store 属性
	w.store = {};

	// 不支持 localStorage 的话，返回 null
	if(!ls) {
		return null;
	}

	// 获取缓存
	store.get = function(key) {
		var s = ls.getItem(key);
		try {
			s = JSON.parse(s);
		} catch (e) {
			s = s !== undefined ? s : null;
		};
		return s;
	};

	// 设置缓存
	store.set = function(key, value) {
		//console.log(this.get(key));
		if(this.get(key) !== null) {
			this.remove(key);
		}
		if(typeof value == 'object') {
			ls.setItem(key, JSON.stringify(value));
		} else {
			ls.setItem(key, value);
		}
	};

	// 删除缓存
	store.remove = function(key) {
		ls.removeItem(key);
	};

	// 清除缓存
	store.clear = function() {
		ls.clear();
	};

	// 缓存数据的条数
	store.length = ls.length;

	//获取当前缓存数据的大小
	store.getSize = function() {
		var str = '';
		for(var j = 0; j < ls.length; j++) {
			str += ls[j];
		}
		str.replace(/[^\x00-\xff]/ig, 'aa');
		return Math.ceil(str.length / 1024) + 'K';
	};

})(window, window.localStorage);