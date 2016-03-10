/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 下午3:05
 * To change this template use File | Settings | File Templates.
 */
var nodeApi = {},
    Node= require('./data/node.js'),
    md5 =require('../lib/tools').md5;

/*
 用户登录方法，返回callback(err,doc)
 */
nodeApi.page = function(pid,callback){
    Node.page(pid, function(err, docs){
        if(err) return callback(err);
         return callback(null,docs);
    })
}
/**
 * 创建节点
 * @param nodeInfo
 * @param callback
 */
nodeApi.insert=function(nodeInfo,callback){
    Node.insert(nodeInfo,function(err){
        return callback(err);
    })
}
/**
 * 获取节点属性
 * @param nodeid
 * @param callback
 */
nodeApi.get=function(nodeid,callback){
    Node.get(nodeid,function(err,doc){
        return callback(err,doc);
    })
}

/**
 * 更新节点
 * @param nodeInfo
 * @param callback
 */
nodeApi.edit=function(nodeid,nodeInfo,callback){
    Node.edit(nodeid,nodeInfo,function(err){
        if(err) return callback(err);
        return callback(null,true);
    })
}

module.exports = nodeApi;