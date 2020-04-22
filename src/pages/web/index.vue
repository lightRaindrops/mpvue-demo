<template>
    <div class="web">
        <web-view v-if="src" :src="src" @load="onWebviewLoad"></web-view>
    </div>
</template>



<script>
import $ from '@/common'
let $pageSrc$
export default {
    data() {
        return {
            src: '',
            inviteCode: '',
            shareTitle: '',
            shareImg: '',
        }
    },
    methods: {
        refreshFunc() {
            //如果检测到isRefresh-强制刷新
            let url = $.getCurrentPageUrl()
            $.goSelf(url)
        },
        init() {
            if ($.isRefresh) {
                $.isRefresh = false
                this.refreshFunc()
                return
            }

            $.log(getCurrentPages())

            let session = $.getLocal('session')
            if ($.config.$session) {
                session = $.config.$session
            }
            let s = ''
            if (session) {
                if ($pageSrc$.includes('?')) {
                    s = '&session=' + session
                } else {
                    s = '?session=' + session
                }
            }

            let timeStamp = 0

            if ($pageSrc$.includes('h5/task_center')) {
                timeStamp = new Date().getTime()
            }

            if ($pageSrc$.includes('activity/knowledgeChallenge')) {
                this.src = ''
                setTimeout(() => {
                    this.src = $.$webBaseUrl + $pageSrc$ + s + '#wechat_redirect' + '_' + timeStamp
                }, 200)
                return
            }

            this.src = $.$webBaseUrl + $pageSrc$ + s + '#wechat_redirect' + '_' + timeStamp

            $.log(this.src)


        },
        onWebviewLoad(e) {
            $.hideLoading()
            $.np('isLogin').then(res => {
                $.log('isLogin', res.isLogin)
                let src = $pageSrc$
                if (!res.isLogin) {
                    $.log('去登录')
                    // wx.showModal({
                    //     title: '',
                    //     content: '您还没有登录',
                    //     showCancel: false,
                    //     confirmText: '去登录',
                    //     success(res) {
                    //         if (res.confirm) {
                    //             $.goSelf('../userLogin/main?key=web$' + src)
                    //         }
                    //     }
                    // })
                } else {
                    //设置邀请码
                    $.np('userCenterData').then(res => {
                        this.inviteCode = res.inviteCode
                        $.log('inviteCode', this.inviteCode)
                    })
                    // 设置分享标题和图片
                    // $.np('getShareLink', { type: 2 }).then(res => {
                    //     this.shareTitle = res.intro
                    //     this.shareImg = res.img
                    //     $.log(this.shareImg)
                    // })

                }
            })
        },
    },
    onLoad(o) {
        $.showLoading()
        $.log('触发onLoad')
        $pageSrc$ = o.src
        Object.keys(o).forEach((ele, index) => {
            if (index == 0) {
                return
            }

            if (index == 1) {
                $pageSrc$ += '?' + ele + '=' + o[ele]
            } else {
                $pageSrc$ += '&' + ele + '=' + o[ele]
            }
            $.log(index, $pageSrc$)
        })
        $.log('$pageSrc$', $pageSrc$)
    },
    onShow() {
        $.log('触发onShow')
        setTimeout(() => {
            this.init()
        }, 1)
    },
    // onShareAppMessage(res) {
    //     if (res.from === 'button') {
    //         // 来自页面内转发按钮
    //         //console.log(res.target)
    //     }
    //     let path = '/pages/index/main?inviteCode=' + this.inviteCode
    //     return {
    //         title: '财税有难题，就问CPA！',
    //         path: path,
    //         imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
    //         success: function (res) {
    //             //方法被废用
    //             // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

    //         }
    //     }
    // },
    onShareAppMessage(res) {
        let src = $pageSrc$
        let url = '/pages/index/main?inviteCode=' + this.inviteCode + '&LT=web' + '&src=' + src
        $.log('转发的url', url)
        $.isRefresh = true
        return {
            title: '财税问诊',
            path: url,
            // imageUrl: this.shareImg
        }
    }
}
</script>


