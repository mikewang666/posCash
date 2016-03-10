/**
 * 上传文件和删除文件
 * @param  {[type]} doc [description]
 * @return {[type]}     [description]
 */
var sshSync = function (doc) {
    var _self = this;
    _self.doc = doc;
    _self.count = 0;
    _self.nowCount = 0;
    _self.q = {};
    _self.delArray = [];

    var async = require('async');

    /*var detail = {
        host: '192.168.1.134',
        username: 'root',
        password: '665178202693',
        port: 22
    };*/
    var detail = doc.detail;
    var SSH = require('simple-ssh'); //自由执行执行linux命令
    /*    var ssh = new SSH({
            host: detail.host,
            user: detail.username,
            pass: detail.password,
            port: detail.port,
            agent: process.env.SSH_AUTH_SOCK,
            agentForward: true
        });*/

    var scp = require('scp2'); //scp文件上传下载操作
    scp.defaults({
        port: detail.port,
        host: detail.host,
        username: detail.username,
        password: detail.password
    });
    /**
     * 执行队列
     * @return {[type]} [description]
     */
    _self.queue = function () {
            _self.q = async.queue(function (task, callback) {
                //console.log('worker is processing task: ', task.name);
                task.run(callback);
            }, 1); //并发数为1，即所有函数依次执行。如果scp可以支持多线程，则修改此参数

            // 如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
            _self.q.saturated = function () {
                //console.log('all workers to be used');
            }

            // 当最后一个任务交给worker时，将调用该函数
            _self.q.empty = function () {
                //console.log('end no more tasks wating');

            }

            // 当所有任务都执行完以后，将调用该函数
            _self.q.drain = function () {
                console.log('all tasks have been processed');

                _self.remove(null);

                _self.count = _self.nowCount = 0;
                linvodb.update({
                    "_id": doc._id
                }, {
                    $set: {
                        'time': new Date().getTime()
                    }
                }, {
                    "upsert": true
                }, function (err, num, newDoc) {

                });
            }
        }
        /**
         * 拷贝文件
         * @param  {[type]}   filePath 拷贝的文件路径
         * @param  {[type]}   stats    文件属性
         * @param  {Function} cb       回调方法
         * @return {[type]}            [description]
         */
    _self.copy = function (filePath, stats, cb) {
            var fileCtime = new Date(stats.ctime).getTime();
            linvodb.get({
                'name': _self.doc.name
            }, function (err, docs) {
                if (_self.doc.time && _self.doc.time > fileCtime) {
                    console.log('没有执行');
                    cb(null);
                    return;
                }
                scp.upload(filePath, getRemotPath(filePath), function (err) {
                    _self.nowCount++;
                    console.log('进度--' + _self.nowCount + '/' + _self.count);
                    console.log('err=' + err);
                    cb(err);

                });
            });
        }
        /**
         * 删除远程文件
         * @param  {[type]}   filePath [description]
         * @param  {Function} cb       [description]
         * @return {[type]}            [description]
         */
    _self.remove = function (filePath, cb) {
            // console.log(filePath + ' rm -rf ' + '"' + getRemotPath(filePath) + '"');
            console.log('["' + _self.delArray.join('@').replace(/@/g, '" "') + '"]');
            console.log(_self.delArray.length);
            if (_self.delArray.length == 0) {
                return;
            }
            var ssh = new SSH({
                host: detail.host,
                user: detail.username,
                pass: detail.password,
                port: detail.port
            });
            var l = _self.delArray.length;
            var sh = 'rm -rf ' + '"' + _self.delArray.join("@").replace(/@/g, '" "') + '"';
            _self.delArray.splice(0, _self.delArray.length);
            ssh.exec(sh, {
                err: function (stderr) {
                    console.log('remove err:' + stderr);
                    cb(stderr);
                },
                exit: function () {
                    console.log('excu del');
                }
            }).start();
        }
        /**
         * 转换成远程目录中的路径
         * @param  {[type]} filePath [description]
         * @return {[type]}          [description]
         */
    function getRemotPath(filePath) {
        return _self.doc.target + '/' + filePath.replace(_self.doc.path, '').replace(/\\/g, '/').replace(/\/\//g, '/');
    }

    _self.queue();

}
