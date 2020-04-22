<template>
    <div id="app">
        <!--分享提示弹窗-->
        <van-popup class="share-tip-popup" :show="true" position="top"
        custom-style="border-radius:10px;z-index:999;width:80%;height:250px;margin-top:70px; ">
        <div class="title">
            <img src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLmxDtE2w0FHfcUuhWLicZDWMDzVVtPOoicicXhPY8hRXuTY3icp5c8jKXvrLIPDxeZjj4RcyaKFr0yAA/132"/>
            <span class="t1">（分享者名字）推荐您学习</span>
            <span class="close">X</span>
        </div>
        <div class="middle">
            <span class="t1">请问注册公司注册需要注意什么?</span>
            <span class="t2">内容内容内容内容内容内容内容内容内容内容内容内容内容</span>
        </div>
        <div class="bottom">
            <span class="t1">税务大咖为您解析！</span>
            <span class="t2">价值50元</span>
            <span class="t3">只要1元</span>
        </div>
    </van-popup>

    <!--分享底部-->
    <van-popup class="share-popup" :show="true" position="bottom" :overlay="false" custom-style="height:180px;">
        <div class="title">
            分享好友购买赚学费￥1
        </div>
        <div class="middle">
            <div class="t1">好友通过你的分享购买后，你赚学费￥1</div>
            <div class="t2">关注"财税问诊"小程序，可随时查看收益和体现</div>
        </div>
        <div class="bottom">
            <div class="t1"><img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin.png" /></div>
            <div class="t2">分享给朋友</div>
        </div>
    </van-popup>
</div>
</template>

<script>

import $ from '@/common'

export default {
    name: 'app',
    data() {
        return {
            isLoading: true,
            pageHeight: $.windowHeight,
            res: {},
            inviteCode: '',
        }
    },
    methods: {
        //

    },
    components: {},
    onLoad(o){
        let t = this;
        $.post($.url('userCenterData'), function (res) {
            t.inviteCode = res.data.inviteCode
        })
    },
    onShareAppMessage(res) {
        let t = this;
        $.log(t.inviteCode)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '财税有难题，就问CPA！',
            path: '/pages/index/main?inviteCode=' + t.inviteCode,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
