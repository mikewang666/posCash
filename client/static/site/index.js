/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-09-16 23:56:15
 * @version $Id$
 */

var sync = new function() {
    var _self = this;
    _self.changeTime = '';
    var async = require('async');
    var fs = require('fs-extra');
    var chokidar = require('chokidar');

    var fileSync = {}; //empty json

    _self.init = function() {
        //<test>
        //_self.removeTask('4s4Et1uncfi1gcTf');
        //_self.removeTask('s0JUdfpmGFoZCqU5');
        //</test>

      /*  var src = "F:\\nodejs\\posCash\\";
        var outsrc = "/data/host/posCash";

        linvodb.update({
            'name': 'pos同步'
        }, {
            $set: {
                "path": src,
                "target": outsrc,
                "type": "sftp",
                "detail": {
                  host:'192.168.1.108',
                  username:'root',
                  password:'huabinglan@@227',
                  port:22
                },
                "execu": "实时",
                "time": new Date().getTime()
            }
        }, {
            upsert: true
        }, function (err, num) {

        });*/

        _self.pageTask();
    };

    _self.pageTask = function() {
        linvodb.page({}, function(err, docs) {
            var s = '<table>';
            s += '<tr>';
            s += '<td>id</td>';
            s += '<td>任务名称</td>'; //标题
            s += '<td>本地路径</td>'; //本地路径
            s += '<td>目标路径</td>'; //目标路径
            s += '<td>传输类型</td>'; //传输类型
            //s += '<td>详细配置</td>'; // 详细配置
            s += '<td>最后执行时间</td>'; // 最后执行事件
            s += '<td>执行方式</td>'; // 执行方式
            s += '</tr>';
            docs.forEach(function(doc, index) {
                s += '<tr>';
                s += '<td>' + doc._id + '</td>';
                s += '<td>' + doc.name + '</td>'; //标题
                s += '<td>' + doc.path + '</td>'; //本地路径
                s += '<td>' + doc.target + '</td>'; //目标路径
                s += '<td>' + doc.type + '</td>'; //传输类型
                // s += '<td>' + JSON.stringify(doc.detail) + '</td>'; // 详细配置
                s += '<td>' + _self.fromtTime(doc.time) + '</td>'; // 最后执行事件
                s += '<td>' + doc.execu + '</td>'; // 执行方式
                s += '</tr>';
                if (doc.type == 'sftp') {
                    _self.addWatch(doc.path, doc.target, doc);
                }
            });
            s += '</table>';
            $('#tasklist').html(s);
            $('#tasklist').on('click', 'tr', function(event) {
                $('.trchoose').removeClass('trchoose');
                $(this).addClass('trchoose');
            });
        });
    }

    _self.caseAddWatch = function(filePath, stats, doc, actionType) {
        var instand = fileSync[doc._id.toString()];
        if (instand) {

        } else {
            switch (doc.type) {
                case "path": //本地同步
                    //instand = fileSync[doc._id] = new
                    break;
                case "sftp": //sftp协议同步
                    instand = fileSync[doc._id.toString()] = new sshSync(doc);
                    break;
            }

        }
        switch (doc.type) {
            case "path":
                _self.array.push(function(cb) {
                    sync.copy(filePath, src, outsrc, stats);
                });
                break;
            case "sftp":
                switch (actionType) {
                    case 'add':
                        instand.q.push({
                            name: filePath,
                            run: function(cb) {
                                instand.copy(filePath, stats, cb);
                            }
                        });
                        break;
                    case 'remove':
                        instand.delArray.push(doc.target + '/' + filePath.replace(doc.path, '').replace(/\\/g, '/').replace(/\/\//g, '/'));
                        instand.q.push({
                            name: filePath + 'remove',
                            run: function(cb) {
                                cb(null);
                            }
                        })

                        break;
                }
                break;
        }
        instand.count = instand.count + 1;

    }

    /**type, detail, ignored
     * 监控事件处理函数
     * @param {[type]} src [description]
     */
    _self.addWatch = function(src, outsrc, doc) {
            var watcher = chokidar.watch(src, {
                ignored: /node_modules|\.git|\.bat/,
                persistent: true
            });

            watcher
                .on('add', function(path, stats) {
                    console.log('File', path, 'has been added');
                    _self.caseAddWatch(path, stats, doc, 'add');
                })
                .on('change', function(path, stats) {
                    console.log('File', path, 'has been changed');
                    _self.caseAddWatch(path, stats, doc, 'add');
                })
                .on('unlink', function(path, stats) {
                    //console.log('File', path, 'has been removed');
                    //_self.remove(path, src, outsrc);
                    _self.caseAddWatch(path, null, doc, 'remove');
                })
                // More events.
                .on('addDir', function(path) {
                    console.log('Directory', path, 'has been added');
                    //_self.copy(path, src, outsrc);
                })
                .on('unlinkDir', function(path) {
                    console.log('Directory', path, 'has been removed');
                    //_self.remove(path, src, outsrc);
                    _self.caseAddWatch(path, null, doc, 'remove');
                })
                .on('error', function(error) {
                    console.log('Error happened', error);
                })
                .on('ready', function() {
                    readyed = true;
                    console.log('Initial scan complete. Ready for changes.');
                    _self.changeTime = new Date().getTime();
                    linvodb.update({
                        "name": doc.name
                    }, {
                        $set: {
                            'time': _self.changeTime
                        }
                    }, {
                        "upsert": true
                    }, function(err, num, newDoc) {

                    });
                });
        }
        /**
         * 同步文件
         * @param  {[type]} filePath [description]
         * @param  {[type]} outsrc   [description]
         * @return {[type]}          [description]
         */
    _self.copy = function(filePath, src, outsrc, stats) {
            var fileCtime = new Date(stats.ctime).getTime();
            linvodb.get({
                'name': 'test'
            }, function(err, docs) {
                console.log(docs);
                console.log('1time=' + docs.time + '   =' + _self.fromtTime(docs.time));
                console.log('ctime=' + fileCtime + '   =' + _self.fromtTime(fileCtime));
                if (docs.time && docs.time > fileCtime) {
                    console.log('没有执行');
                    return;
                }
                fs.copy(filePath, outsrc + filePath.replace(src, ''), {
                    clobber: true
                }, function(err) {
                    if (err) {
                        console.log('path:' + err);
                        return;
                    }
                });
            });
        }
        /**
         * 删除文件或者目录
         * @param  {[type]} filePath [description]
         * @param  {[type]} src      [description]
         * @param  {[type]} outsrc   [description]
         * @return {[type]}          [description]
         */
    _self.remove = function(filePath, src, outsrc) {
            fs.remove(outsrc + filePath.replace(src, ''), function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
        /**
         * 拷贝文件到sftp服务器中
         * @param  {[type]} filePath [description]
         * @param  {[type]} src      [description]
         * @param  {[type]} outsrc   [description]
         * @return {[type]}          [description]
         */
    _self.copySftp = function(filePath, src, outsrc, stats, cb) {

            ssh.exec('scp ' + filePath + ' 192.168.1.105:' + filePath.replace(src, ''), {
                err: function(stderr) {
                    console.log(stderr);
                    //cb(stderr);
                },
                out: function(stdout) {
                    console.log(stdout);
                }
            }).start();

            ssh.exec('cd /data/host/ \n  mkdir test1', {
                out: function(stdout) {
                    console.log(stdout);
                }
            }).start();
        }
        /**
         * 转换为标准时间格式
         * @param  {[type]} time [description]
         * @return {[type]}      [description]
         */
    _self.fromtTime = function(time) {
            var date = new Date(time);
            var seperator = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            return date.getYear() + 1900 + seperator + month + seperator + strDate + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        }
        /**
         * 删除任务
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
    _self.removeTask = function(id) {
        linvodb.remove({
            '_id': id
        }, {}, function(err, num) {
            $('#' + id).remove();
        })
    }
}
