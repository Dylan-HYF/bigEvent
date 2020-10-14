$(function () {
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间!';
            }
        },
    });

    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '获取用户信息失败!');
                }
                // console.log(res.data);
                //layui的方法,获取表单数据
                form.val('form_userinfo', res.data);
            },
        });
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        //重新获取一下接口里的表单数据就可以实现重置
        initUserInfo();
    });
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '更新用户信息失败!');
                    return;
                }
                layer.msg('更新用户信息成功!');
                //调父页面的方法,重新渲染用户名和用户头像
                window.parent.getUserInfo();
            },
        });
    });
    $('.layui-input').on('keyup', function (e) {
        if (e.keyCode == 13) {
            $('.layui-form').submit();
        }
    });
});
