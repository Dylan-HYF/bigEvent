$(function () {
    getUserInfo();
    const layer = layui.layer;
    $('#btnLogOut').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html';
            // 关闭 confirm 询问框
            layer.close(index);
        });
    });
});
//获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     //请求头要写token,Authorization 批准,授权
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function (res) {
            if (res.status !== 0) {
                layui.layer.msg(res.message || '获取用户信息失败!');
                return;
            }
            renderAvatar(res.data);
        },
    });
}

function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    if (user.user_pic) {
        //渲染头像图片
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
