module.exports = {
  //自定义配置
  //通用配置
  //运行环境配置

  //web属性配置
  listenPort: 3030, //监听端口
  uploadFolder: '/tmp/upload', //文件上传的临时目录
  postLimit: 1024 * 1024 * 100, //限制上传的postbody大小，单位byte
  webTitle: '左盐的node', //网站标题
  staticMaxAge: 604800000, //静态文件的缓存周期，建议设置为7天，单位毫秒
  md5Salt: 'HJhad98.)d', //供后端加密使用的盐
  keySalt: 'AHdo&^d',//供前端加密使用的盐
  loginTimes: 3, //登录次数，超出则锁定
  lockUserTime: 1800, //锁定时间，单位秒
  webDomain: '192.168.1.202:3000', //网站主域名，用于判断Referer
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: "data.sqlite"
    },
    pool: {
      min: 0,
      max: 7
    }
  }
}
