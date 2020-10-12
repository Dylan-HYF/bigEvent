const baseUrl = 'http://ajax.frontend.itheima.net';

$.ajaxPrefilter(function (options) {
    options.url = `${baseUrl}${options.url}`;
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            //请求头要写token,Authorization 批准,授权
            Authorization: localStorage.getItem('token') || '',
        };
    }
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清空token
            localStorage.removeItem('token');
            //跳转页面,禁止访问后台
            location.href = '/login.html';
        }
    };
});
