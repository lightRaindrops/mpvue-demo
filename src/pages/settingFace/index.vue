<template style="background:red;">
    <div>
        <div class="box" :style="pageHeight">
            <div class="group">
                <a class="item fx" @click="uploadTap('faceSrc')">
                    <span class="fx1 txt">上传头像</span>
                    <span class="iconfont icon-jiantou-"></span>
                </a>
            </div>

            <div class="group">
                <a class="item fx" :href="'../setIntro/main'">
                    <span class="fx1 txt">签名</span>
                    <span class="iconfont icon-jiantou-"></span>
                </a>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import $ from '@/common'

import compFooter from "@/components/compFooter.vue"


export default {

    data() {
        return {
            isAdviser: false,
            uploadUrl: $.url('uploadFile'),
            faceSrc: $.imgOnline + 'img/defaultFace.png',
            formData: {
                'session': $.getLocal('session')
            },
        }
    },
    computed: {
        pageHeight: function () {
            let val = $.windowHeight
            return 'min-height:' + val + 'px'
        }
    },
    methods: {
        logOut() {
            wx.showModal({
                content: '您要退出登录吗？',
                cancelText: '取消',
                success(res) {
                    if (res.confirm) {
                        let url = $.url('logout')
                        $.pp(url, function () {
                            //清除本地local
                            $.removeLocal('inviteCode')
                            $.goSelf($.pageUrl('index'))
                        })
                    }
                }
            })
        },
        uploadTap(t) {
            let self = this
            self.activeUpload = t

            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    const src = res.tempFilePaths[0]
                    //  获取裁剪图片资源后，给data添加src属性及其值
                    //$.log(src)
                    let url
                    if (self.activeUpload == 'faceSrc') {
                        url = $.pageUrl('FanfaceUpload') + '?imgUrl=' + src + '&type=' + t
                    } else {
                        url = $.pageUrl('FanidCardUpload') + '?imgUrl=' + src + '&type=' + t
                    }
                    $.go(url)

                }
            })
        },
    },
    onLoad() {
        let t = this
        $.post($.url('userCenterData'), function (res) {
            if (res.success) {
                t.isAdviser = res.data['isAdviser']
            } else {
                $.tip(res.msg)
            }
        })
    },

    onShow() {
        if ($.FanUploadCurrent === 'faceSrc') {
            let self = this

            // 您刚上传了头像
            wx.showLoading({
                title: '上传中'
            })
            self.faceSrc = $.faceSrc
            wx.uploadFile({
                url: self.uploadUrl,
                filePath: self.faceSrc,
                name: 'file',
                formData: self.formData,
                success(res) {
                    const data = JSON.parse(res.data)
                    if (data.success) {
                        $.hideLoading()
                        let src = data.data.src
                        //上传头像
                        $.post($.url('uploadUserInfoV1'), { avatarUrl: data.data.src }, function (res) {
                            $.tip('修改成功')
                        })
                        //                    self.$set(self.FD, 'head_url', src)
                    } else {
                        $.tip(data.msg)
                    }
                }
            })
        }


        $.FanUploadCurrent = ''

    }

}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
