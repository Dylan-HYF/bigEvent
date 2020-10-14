// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image');
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
};

// 1.3 创建裁剪区域
$image.cropper(options);

$('#upload').on('click', function () {
    $('#file').click();
});
const layer = layui.layer;
// 为文件选择框绑定 change 事件
$('#file').on('change', function (e) {
    // 获取用户选择的文件
    const files = e.target.files;
    if (files.length === 0) {
        layer.msg('请选择图片!');
        return;
    }
    // 1. 拿到用户选择的文件
    const file = e.target.files[0];
    // 2. 将文件，转化为路径
    const imgURL = URL.createObjectURL(file);
    // 3. 重新初始化裁剪区域
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
});

$('#changeAvatar').on('click', function () {
    const dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100,
        })
        .toDataURL('image/png');

    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL,
        },
        success: function (res) {
            if (res.status !== 0) {
                layer.msg(res.message || '更换头像失败!');
                return;
            }
            layer.msg('更换头像成功!');
            window.parent.getUserInfo();
        },
    });
});
