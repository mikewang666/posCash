/**
 * 
 * @authors 左盐 (huabinglan@163.com)
 * @date    2015-09-18 11:23:08
 * @version $Id$
 */

var menu = new function() {
    var _self = this;
    var gui = require('nw.gui');
    /**
     * 添加顶部菜单
     * @return {[type]} [description]
     */
    _self.init = function() {
        _self.rightMenu();

        var menu = new gui.Menu({
            type: "menubar"
        });


        var taskSubmenu = new gui.Menu(); //声明一个任务的子菜单

        taskSubmenu.append( //任务菜单添加子菜单
            new gui.MenuItem({
                type: 'normal',
                label: "新建 Ctrl+N",
                key: "N",
                modifiers: "ctrl",
                click: function() {
                    eventPage.newTask();
                }
            })
        );

        menu.append( // 添加子菜单到菜单中
            new gui.MenuItem({
                label: "任务",
                submenu: taskSubmenu
            })
        );

        gui.Window.get().menu = menu; //window 注册菜单

        //禁止文件拖拽到页面中
        $(window).on('dragover', function(e) {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'none';
        });
        $(window).on('drop', function(e) {
            e.preventDefault();
        });
    }

    /**
     * 添加右键菜单
     * @return {[type]} [description]
     */
    _self.rightMenu = function() {
        var menu = new gui.Menu();

        var exetask = new gui.MenuItem({
            label: '执行任务',
            click: function() {
                eventPage.exeTask();
            }
        });
        menu.append(exetask);
        var separator = new gui.MenuItem({
            type: 'separator'
        }); //分割
        menu.append(separator);

        var newtask = new gui.MenuItem({
            label: '新建任务   Ctrl+N',
            click: function() {
                eventPage.newTask();
            }
        });
        menu.append(newtask);

        var edittask = new gui.MenuItem({
            label: '修改选中任务(M)',
            key: 'm',
            click: function() {
                eventPage.editTask();
            }
        });
        menu.append(edittask);

        var deltask = new gui.MenuItem({
            label: '删除选中任务(D)',
            key: 'd',
            click: function() {
                eventPage.delTask();
            }
        });
        menu.append(deltask);


        $(document).on('contextmenu', function(ev) {
            console.log('add rightMenu');
            ev.preventDefault();
            var target = $(ev.target); //获取到点击的元素
            //可用性判断 
            if (target.parents('#tasklist').length == 0) {
                edittask.enabled = false; //不可编辑
                deltask.enabled = false; //不可删除
                exetask.enabled = false; //不可执行
            } else {
                edittask.enabled = true; //不可编辑
                deltask.enabled = true; //不可删除
                exetask.enabled = true; //不可执行
            }
            $('body').data('rightmenu', target); //绑定点击元素到body上
            menu.popup(ev.originalEvent.x, ev.originalEvent.y);
            return false;
        });
    }
}
