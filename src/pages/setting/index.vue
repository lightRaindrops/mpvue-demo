<template>
    <div>
        <div class="box" :style="pageHeight">
            <div class="insetShadow"></div>
            <a class="item fx" hidden :href="'../company/main'">
                <img :src="info" class="icon" mode="aspectFit" />
                <span class="fx1 txt">关于我们</span>
                <span class="iconfont icon-jiantou-"></span>
            </a>
            <a class="item fx" href="../personalInfo/main">
                <img :src="info" class="icon" mode="aspectFit" />
                <span class="fx1 txt">修改个人资料</span>
                <span class="iconfont icon-jiantou-"></span>
            </a>
            <a class="item fx" :href="'../setServiceMoney/main'" v-if="isAdviser">
                <img :src="edit" class="icon" mode="aspectFit" />
                <span class="fx1 txt">修改服务金额</span>
                <span class="iconfont icon-jiantou-"></span>
            </a>
            <div class="group">
                <a class="item fx signOut" @click="logOut">
                    <span class="fx1 txt">退出登录</span>
                </a>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import $ from '@/common'

export default {

    data() {
        return {
            isAdviser: false,
            uploadUrl: $.url('uploadFile'),
            faceSrc: 'https://static.cgkc.com/miniprogram/mini/qing/img/defaultFace.png',
        }
    },
    computed: {
        pageHeight: function () {
            let val = $.windowHeight
            return 'min-height:' + val + 'px'
        },
        info() {
            return $.$img('icons/info.png')
        },
        edit() {
            return $.$img('icons/edit.png')
        },
    },
    methods: {
        logOut() {
            wx.showModal({
                content: '您要退出登录吗？',
                cancelText: '取消',
                success(res) {
                    if (res.confirm) {
                        $.showLoading('请稍候')
                        $.np('logout').then(res => {
                            //清除本地local
                            wx.clearStorage()
                            $.setLocal('isNewUser', 'no')
                            $.hideLoading()
                            setTimeout(() => {
                                wx.switchTab({
                                    url: $.pageUrl('userCenter')
                                })
                            }, 10)
                        })
                    }
                }
            })
        },
    },
    onLoad(o) {
        this.isAdviser = o.isAdviser === 'true'
    },
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
