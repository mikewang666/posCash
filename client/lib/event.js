/**
 * 整站事件执行体
 * @return {[type]} [description]
 */
var eventPage = new function () {
    var _self = this;
    var gui = require('nw.gui');
    /**
     * 新建任务
     * @return {[type]} [description]
     */
    _self.newTask = function () {
            gui.Window.open('../site/addtask/addtask.html', {
                position: 'center',
                width: 300,
                height: 300,
                focus: true
            });
        }
        /**
         * 编辑选中的任务
         * @return {[type]} [description]
         */
    _self.editTask = function (id) {
            console.log('选中的元素' + $('body').data('rightmenu').html());
            gui.Window.open('https://www.baidu.com', {
                position: 'center',
                width: 300,
                height: 300,
                focus: true
            });
        }
        /**
         * 删除选中任务
         * @return {[type]} [description]
         */
    _self.delTask = function () {
            alert('删除');
        }
        /**
         * 执行选中任务
         * @return {[type]} [description]
         */
    _self.exeTask = function () {
        alert('执行');
    }
}

