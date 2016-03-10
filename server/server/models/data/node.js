/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-5
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */
//用户数据 mongodb 访问层
var Node= {};
var mongo = require('../../lib/mongo.js'),
    schema=mongo.mongoose.Schema;

var nodeSchema=new schema({//数据模型定义
    pid:String,
    nodeName:String,
    nodeImg:String,
    nodeDes:String
});

var node=mongo.mongoose.model('nodes',nodeSchema);//实际意义的数据模型


/*
    根据父节点获取所有子节点
 */
Node.page=function(pid,callback){
    var query={pid:'52a0229f940a31052813acb2'};
    var fields={};
    var options={
        sort:{_id:-1},
        limit:500
    };
    node.find(query,fields,options,function(err,docs){
        callback(err,docs);
    });
}

/**
 * 创建节点
 * @type {{colname: string, generr: string}}
 */
Node.insert=function(nodeInfo,callback){
    var instan=new node(nodeInfo);//根据模型创建实体
    instan.save(function(err){
        callback(err);
    });
}
/**
 * 获取节点属性
 * @param nodeid
 * @param callback
 */
Node.get=function(nodeid,callback){
    node.findById(nodeid,function(err,doc){
        callback(err,doc);
    })
}

Node.edit=function(nodeid,nodeInfo,callback){
    var query={_id:nodeid};
    var up={
        '$set':nodeInfo
    };
    var options={};

    node.update(query,up,options,function(err){
        callback(err);
    })
}
module.exports = Node;