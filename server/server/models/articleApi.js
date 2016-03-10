/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-6
 * Time: 上午10:05
 * To change this template use File | Settings | File Templates.
 */
var articleApi = {},
    Article= require('./data/article.js'),
    md5 =require('../lib/tools').md5;


/**
 * 创建节点
 * @param articleJson
 * @param callback
 */
articleApi.insert=function(articleJson,callback){
    Article.insert(articleJson,function(err,doc){
        if(err) return callback(err);
        return callback(null,doc);
    })
}
/**
 * 更新文章
 * @param articleInfo
 * @param callback
 */
articleApi.update=function(articleInfo,aid,callback){
    Article.update(articleInfo,aid,function(err,istrue){
        if(err) return callback(err);
        return callback(null,istrue);
    })
}

articleApi.page = function(queryDom,sortDom,mp,callback){
    Article.page(queryDom,sortDom,mp, function(err, docs){
        if(err) return callback(err);
        return callback(null,docs);
    })
}

/**
 * 删除文章
 * @param query
 * @param callback
 */
articleApi.del=function(query,callback){
    Article.del(query,function(err){
        return callback(err);
    });
}

module.exports = articleApi;