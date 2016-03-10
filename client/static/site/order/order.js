var order = new function() {
    var _self = this;
    _self.table = '';

    _self.init = function() {
        _self.setTable();
    }

    _self.setTable = function() {
        _self.table = new witchDataTable('#user', {
            thead: [{
                name: '行号',
                width: '40px'
            }, {
                name: '交易编码',
                width: '140px'
            }, {
                name: '会员',
                width: '120px'
            }, {
                name: '金额',
                width: '70px'
            }, {
                name: '实收金额',
                width: '70px'
            }, {
                name: '状态',
                width: '50px'
            }, {
                name: '操作员',
                width: '120px'
            }, {
                name: '交易时间',
                width: '200px'
            }, {
                name: '描述',
                width: '350px'
            }],
            data: {
                url: config.server + '/order/page',
                data: 'customid=-1&operatorid=-1&state=-1&timestart=&timend=',
                cp: 1,
                mp: 30
            },
            update: {
                url: config.server + '/order/update'
            },
            search: {
                id: '#search',
                input: '#input'
            },
            add: {
                id: '#adduser',
                url: './iframe_addOperator.html',
                name: '添加用户',
                width: '400px'
            },
            rmenu: {
                id: '#youmenu'
            },
            funo: "order.table"
        });

    }
}
