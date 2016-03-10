    fis.config.merge({
        roadmap : {	
            path : [
                {
                      reg : /^\/public(\/.*)$/,
				      url : '$1'
                }
            ]

        }
    });

fis.config.merge({
    roadmap : {
        //所有静态资源文件都使用 http://s1.example.com 或者 http://s2.example.com 作为域名
        domain : 'http://static1.example.com, http://s2.example.com'
    }
});

fis.config.merge({
    modules : {
        optimizer : {
           // html : 'html-minifier'//添加对html的压缩 //暂时插件不可用
        }
    }
});

fis.config.merge({
    project : { exclude : /.bat|.docx|.bak$|.rar$$|^\/public\/plug\/*/i }//排除压缩包，文档，和bak文件
});