
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');//加载路由
var http = require('http');
var path = require('path');
var config=require('./config/config');//加载配置文件


var app = express();

// 开发环境
app.configure('development', function() {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

// 生产环境
app.configure('production', function() {
    app.use(express.compress());
    app.use(function(req, resp, next) {
        resp.removeHeader('X-Powered-By');
        next();
    });
});

// all environments
app.set('port', config.listenPort);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);//修改ejs模板扩展名为html
app.set('view engine', 'html');

app.use(express.favicon());
app.use(express.json());
app.use(express.cookieParser());//使用cookie
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(__dirname+ '/public',{maxAge:config.staticMaxAge}));//设置静态文件夹和静态缓存
//app.use(express.bodyParser({uploadDir:'./public/tmp'}));//设置上传临时目录//本程序暂不提供上传功能的封装

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

routes(app);
