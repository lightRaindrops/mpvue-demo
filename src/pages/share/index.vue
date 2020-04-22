<template>
    <div class="share">
        <div class="btns">
            <button open-type="share" @click="back">{{btnTxt}}</button>
        </div>
        <div class="bg">
            <img :src="bg" class="img" mode="widthFix" />
        </div>
    </div>
</template>



<script>
import $ from '@/common'
export default {
    data() {
        return {
            bg: '',
            btnTxt: '',
            inviteCode: '',
            options: {},
            shareTitle: '',
            shareImg: ''
        }
    },
    computed: {
    },
    components: {
    },
    methods: {
        back: $.back
    },
    onLoad(o) {
        this.options = o

        $.np('isLogin').then(res => {
            $.log('isLogin', res.isLogin)
            let src = this.options.src
            if (!res.isLogin) {
                $.log('去登录')
                wx.showModal({
                    title: '',
                    content: '您还没有登录',
                    showCancel: false,
                    confirmText: '去登录',
                    success(res) {
                        if (res.confirm) {
                            $.goSelf('../userLogin/main?key=web$' + src)
                        }
                    }
                })
            } else {
                //设置邀请码
                $.np('userCenterData').then(res => {
                    this.inviteCode = res.inviteCode
                    $.log('inviteCode', this.inviteCode)
                })
                // 设置分享标题和图片
                $.np('getShareLink', { type: 2 }).then(res => {
                    this.shareTitle = res.intro
                    this.shareImg = res.img
                    $.log(this.shareImg)
                })

                //设置分享页背景图和按钮文字
                $.np('getShareLink', { type: 1 }).then(res => {
                    this.bg = res.img
                    this.btnTxt = res.intro
                })

            }
        })

        setTimeout(() => {
            $.hideLoading()
        }, 5000)
    },
    onUnload(){
        $.isRefresh = true
    },
    onShareAppMessage(res) {
        let src = this.options.src
        let inviteCode = this.inviteCode
        let url = '/pages/index/main?inviteCode=' + inviteCode + '&LT=web' + '&src=' + src
        return {
            title: this.shareTitle,
            path: url,
            imageUrl: this.shareImg
        }
    }
}
</script>

<style lang="less">
.share {
    .bg {
        position: fixed;
        width: 100%;
        z-index: 1;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .btns {
        position: fixed;
        padding: 200rpx;
        button {
            height: 80rpx;
            line-height: 80rpx;
            margin-top: 20rpx;
            font-size: 32rpx;
            border-radius: 200rpx;
            background: linear-gradient(to bottom, #ffeccb, #fdc379);
            color: #eb2438;
        }
        z-index: 2;
        width: 100%;
        top: 820rpx;
    }
}
</style>


