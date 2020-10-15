$(function () {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;
    //定义查询的参数对象,请求数据的时候需要将这个对象提交到服务器
    template.defaults.imports.dateformat = function (date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    };

    function padZero(n) {
        //一定要写return!!!这是返回值,不返回没效果
        return n < 10 ? '0' + n : n;
    }
    let q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态
    };
    initTable();
    initCate();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '获取数据失败!');
                    return;
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            },
        });
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '获取分类数据失败!');
                    return;
                }
                let htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            },
        });
    }
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });
    function renderPage(total) {
        laypage.render({
            elem: 'pageNum', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                //把first传进来
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(obj);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                }
            },
        });
    }

    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        let len = $('.btn-delete').length;
        // console.log(len);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg(res.message || '删除文章失败!');
                        return;
                    }
                    layer.msg('删除文章成功!');
                    if (len === 1) {
                        // 页码值最小必须是 1,页码值是1的时候就不能减了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                },
            });

            layer.close(index);
        });
    });
});
