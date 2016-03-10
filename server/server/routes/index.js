
/*
 * 整站路由
 * 此方法接管所有非静态请求
 */

var config=require('../config/config.js'),
    tools=require('../lib/tools.js');

module.exports=function(app){
	app.all('*', function (req, res) {
		try {
			var upath = req.path,
				urlpath = upath.split('/');

			console.log(upath);
			if (upath.indexOf('.') > -1 || urlpath.length > 5 || upath.indexOf('//') > -1) {
				res.send('error', {'error': '这是一个错误地址'});
				return;
			}

			var len = urlpath.length;
			if(urlpath[len - 1] == '') {
				urlpath.pop();
				if(len < 4){
					len = urlpath.push('index');
				}
			}
			if(len === 2) {
				urlpath = ['',urlpath.pop(),'index'];
			}

			var last=urlpath.pop();
			//console.log('end:' + '../controller'+ urlpath.join('/') +'.js' + ' ' + last);
			require('../controller' + urlpath.join('/') + ".js")[last](req, res);
		}
		catch (err) {
            console.log(err);
			res.send('error', {'error': err.toString()});
		}
	});
}
