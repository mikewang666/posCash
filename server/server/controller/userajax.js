/**
 * Created by Administrator on 14-2-5.
 */

var home = {},
    redisCache=require('../lib/redisApi.js'),
    tools=require('../lib/tools.js'),
    userApi=require('../models/userApi.js'),
    config=require('../config/config.js'),
    async=require('async');

home.index = function(req, res){
    res.render('index');
}

home.page = function(req,res) {
    userApi.page('',1,function(err,rows) {
        if(err) {
            res.send(err);
            return;
        }
        res.render('ajax/userpage',{rows: rows});
    });
}

home.update = function(req,res) {
  userApi.update(tools.xssFilter(req.body.id),tools.xssFilter(req.body.k),tools.xssFilter(req.body.v));
	 res.send('true');
}

module.exports = home;