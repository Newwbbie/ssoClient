let token;
// 读本地存储
if(localStorage.getItem("token") != undefined) {
    token = localStorage.getItem("token");
}

// ajax请求封装
function mAjax(data, url, type, success) {
    $.ajax({
        url: url,
        type: type,
        headers: { token: token },
        contentType: "application/json;charset=utf-8;",
        data: JSON.stringify(data),
        success: success,
        error: function() {
            window.parent.layui.layer.msg('登录过期，即将返回登录页面', function () {
                window.location = 'page/login-1.html';
            });
        }
    });
}

// table请求封装
function mTable(dom, url, token, data, cols) {
    layui.table.render({
        elem: dom
        ,url: url
        ,method: 'POST'
        ,headers: { token: token }
        ,request: { pageName: 'pageNum', limitName: 'pageSize' }
        ,contentType: "application/json;charset=utf-8;"
        ,where: data
        ,id: 'idTest'
        ,cols: cols
        ,page: true
        ,skin: 'line'
        ,response: {
            statusCode: true //规定成功的状态码，默认：0
        }
        ,parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
            if(res.errorCode == 'U002') {
                window.parent.layui.layer.msg('登录过期，即将返回登录页面', function () {
                    window.location = 'page/login-1.html';
                });
                return;
            }
            return {
                "code": res.success,
                "count": res.data.count, //解析数据长度
                "data": res.data.data //解析数据列表
            };
        }
    });
}

// layui的table获取选中数据
function getOneRow() {
    const checkStatus = layui.table.checkStatus('idTest');
    if(checkStatus.data.length != 1) {
        layui.layer.msg('请选择一条数据');
    } else {
        return checkStatus.data[0];
    }
}