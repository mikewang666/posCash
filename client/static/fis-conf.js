fis.config.set('livereload.port', 8133);
//tell fis that `.ejs` is a js file
fis.config.set('roadmap.ext.ejs', 'js');
//tell fis that parse `.ejs` file by using `fis-parser-ejs` plugin
fis.config.set('modules.parser.ejs', 'ejs');
//set options if you need
//@see https://github.com/visionmedia/ejs#options
fis.config.set('settings.parser.ejs', {
    open: '<%',
    close: '%>'
});
//使用simple插件，自动应用pack的资源引用
fis.config.set('modules.postpackager', 'simple');
//开始autoCombine可以将零散资源进行自动打包
fis.config.set('settings.postpackager.simple.autoCombine', true);
//开启autoReflow使得在关闭autoCombine的情况下，依然会优化脚本与样式资源引用位置
fis.config.set('settings.postpackager.simple.autoReflow', true);
fis.config.set('settings.postpackager.simple.output', 'pkg/mcren_${hash}');

fis.config.merge({
    pack: {
        'pkg/base.js': ['/modules/jquery/*.js',  '/modules/pizzalayer/*.js', '/modules/pizzatools/*.js'],
        'pkg/kindeditor.js': ['/widget/kindeditor/kindeditor-min.js'],
        'modules/layer/layer.js':['/modules/layer/*.js']
    }
});

fis.config.merge({
    statics: '/public',
    modules: {
        postprocessor: {
            js: "jswrapper, require-async",
            html: "require-async"
        },
        postpackager: ['autoload', 'simple'],
        lint: {
            js: 'jshint'
        }
    },
    roadmap: {
        ext: {

        },
        path: [{
            reg: /^\/modules\/layer\/(skin|extend)\/.*\.(js|css|png|gif)$/i,
            useHash: false,
            useCompile: false,
            isMod: false,
            release: '${statics}/$&',
            url: '..${statics}$&'

        },{
            reg: /^\/widget\/kindeditor\/(lang|plugins|themes)\/.*\.(js|css|png|gif)$/i,
            useHash: false,
            isMod: false,
            release: '${statics}/$&',
            url: '..${statics}$&'

        }, {
            reg: /^\/lib\/(.*)\.(js)$/i,
            isMod: false,
            release: '$&',
            url: '../lib/$1'
        }, {
            reg: /^\/font\/(.*)$/i,
            isMod: false,
            release: '${statics}/$&',
            url: '..${statics}/font/$1'
        }, {
            reg: /^\/views\/(.*)$/i,
            useCache: false,
            release: '/views/$1'
        }, {
            //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
            //直接引用为var $ = require('jquery');
            reg: /^\/modules\/([^\/]+)\/(.*)\.(js)$/i,
            //是组件化的，会被jswrapper包装
            //isMod: true,
            //id为文件夹名
            id: '$1',
            release: '${statics}/$&',
            url: '..${statics}$0'
        }, {
            //组件化的webpart的js
            reg: /^\/(widget|site)\/(.*)\.(js)$/i,
            //isMod: true,
            id: '$2',
            release: '${statics}/$&',
            url: '..${statics}$&'
        }, {
            //modules目录下的其他脚本文件
            reg: /^\/modules\/(.*)\.(js)$/i,
            //是组件化的，会被jswrapper包装
            //isMod: true,
            //id是去掉modules和.js后缀中间的部分
            id: '$1',
            release: '${statics}/$&',
            url: '..${statics}/modules/$1'
        }, {
            //组件化的webpart的html
            reg: /^\/widget\/(.*)\.(html)/i,
            release: false
        }, {
            //组件化的webpart的css
            reg: /^\/(widget|site)\/(.*)\.(css|png|jpg)/i,
            release: '${statics}/$&',
            useSprite: true,
            url: '..${statics}$&'
        }, {
            //其他css文件
            reg: /^(.*)\.(css|less)$/i,
            release: '${statics}/$&',
            url: '..${statics}$&'
        }, {
            //前端模板
            reg: '**.ejs',
            //当做类js文件处理，可以识别__inline, __uri等资源定位标识
            isJsLike: true,
            //只是内嵌，不用发布
            release: false
        }, {
            reg: "map.js",
            release: "${statics}/"
        }, {
            reg: /.*\.(html|jsp|tpl|vm|htm|asp|aspx|php)$/,
            useCache: false,
            release: '$&',
            url: "..${statics}$&"
        }, {
            reg: "**",
            release: '${statics}/$&',
            url: '..${statics}$&'
        }]
    },
    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        },
        lint: {
            jshint: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                node: true
            }
        }
    }
});

fis.config.merge({
    roadmap: {
        //所有静态资源文件都使用 http://s1.example.com 或者 http://s2.example.com 作为域名
        domain: 'http://static1.example.com, http://s2.example.com'
    }
});


fis.config.merge({
    project: {
        exclude: /.docx|.bak$|.bat$|.md$|.rar$$|^\/less\/*|.less$|^\/modules\/pizzaui\/pizzaui\/*/i
    } //排除压缩包，文档，和bak文件
});
