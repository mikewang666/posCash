/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-6
 * Time: 上午9:41
 * To change this template use File | Settings | File Templates.
 */

//用户数据 mongodb 访问层
 var Article= { };

var mongo = require('../../lib/mongo.js'),
    schema=mongo.mongoose.Schema;

var articleSchema=new schema({//数据模型定义
    nodeid:String,
    source:String,
    count:Number,
    link:String,
    state:Number,
    title:String,
    tag:String,
    timg:String,
    brief:String,
    content:String,
    subby:Number,
    subuser:String,
    comment:Number
});

var article=mongo.mongoose.model('articles',articleSchema);//实际意义的数据模型



/**
 * 创建文章
 * @type {{colname: string, generr: string}}
 */
Article.insert=function(articleJson,callback){
    var instan=new article(articleJson);
    instan.save(function(err,doc){
        callback(err,doc);
    })
}
/**
 * 更新文章
 * @param articleInfo
 * @param callback
 */
Article.update=function(articleInfo,aid,callback){
    var query={_id:aid};
    var up={
        '$set': articleInfo

    };
    var options={};

    article.update(query,up,options,function(err){
        callback(err);
    })
}
/**
 * 获取文章
 * @param queryDom
 * @param sortDom
 * @param mp
 * @param callback
 */
Article.page=function(queryDom,sortDom,mp,callback){
    var query=queryDom;
    var fields={};
    var options={
        sort:sortDom,
        limit:mp
    };
    article.find(query,fields,options,function(err,docs){
        callback(err,docs);
    });
}
/**
 * 删除文章
 * @param query
 * @param callback
 */
Article.del=function(query,callback){
    article.remove(query,function(err){
        callback(err);
    });
}
module.exports = Article;