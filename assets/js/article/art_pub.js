$(function () {
    const layer = layui.layer;
    const form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render();
            },
        });
    }
    // 1. 初始化图片裁剪器
    let $image = $('#image');

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    $('#setCover').on('click', function () {
        $('#cover').click();
    });
    $('#cover').on('change', function (e) {
        let files = e.target.files;
        if (files.length === 0) {
            return;
        }
        let newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    let artState = '已发布';
    $('#btnSave2').on('click', function () {
        artState = '草稿';
    });

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', artState);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            });
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '发布文章失败!');
                    return;
                }
                layer.msg('发布文章成功!');
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html';
            },
        });
    }
});
