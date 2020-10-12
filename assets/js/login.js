$(function () {
    const { form, layer } = layui; //这条代码相当于: const form = layui.form; const layer = layui.layer;
    //切换登录和注册界面
    $('#link_reg').on('click', function () {
        $('.login').hide();
        $('.reg').show();
    });
    $('#link_login').on('click', function () {
        $('.reg').hide();
        $('.login').show();
    });
    //注册页面密码验证
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            const pwd = $('.reg [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致!';
            }
        },
    });
    //提交注册表单
    $('#register').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            method: 'POST',
            data: {
                username: $('.reg [name = username]').val(),
                password: $('.reg [name = password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    //这里必须用res.status,要用状态码而不是整个res!
                    //layer.msg就是弹出窗口
                    layer.msg(res.message || '注册失败');
                    return;
                }
                layer.msg('注册成功,即将跳转到登录页面');
                //注册成功后转到登录页面
                $('#link_login').click();
            },
        });
    });
    //登录
    $('#log').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), //serialize方法获取表单信息
            success(res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '登录失败');
                    //必须写return,不然代码还会继续往下走
                    return;
                }
                layer.msg('登录成功');
                //保存一下token
                localStorage.setItem('token', res.token);
                //跳转页面
                location.href = '/index.html';
            },
        });
    });

    $('#log [name=password]').on('keyup', function (e) {
        if (e.keyCode == 13) {
            $(this).submit();
        }
    });
});
