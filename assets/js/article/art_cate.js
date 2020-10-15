$(function () {
    initArtCateList();
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res);
                //遍历数据渲染表格
                $('tbody').html(htmlStr);
            },
        });
    }
    const layer = layui.layer;
    const form = layui.form;
    //添加文章类别
    let indexAdd = null; //预先保存弹出层的索引，方便进行关闭
    $('#addCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    });
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            //把添加的数据传上去
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '添加分类失败!');
                    return;
                }
                initArtCateList();
                layer.msg('添加分类成功!');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            },
        });
    });
    //修改文章类别
    let indexEdit = null; //预先保存弹出层的索引，方便进行关闭
    //通过事件委派的形式，为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        let ID = $(this).attr('data-ID');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + ID,
            success: function (res) {
                form.val('form-edit', res.data);
            },
        });
    });
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '更新文章类别失败!');
                    return;
                }
                layer.close(indexEdit);
                layer.msg('更新文章类别成功!');
                initArtCateList();
            },
        });
    });

    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-ID');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg(res.message || '删除文章类别失败!');
                        return;
                    }
                    layer.msg('删除文章类别成功!');
                    layer.close(index);
                    initArtCateList();
                },
            });
        });
    });
});
