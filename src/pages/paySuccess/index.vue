<template>
    <div class="paySuccessBox">
        <div class="bg" style="width:694rpx; height:351rpx;">
            <Nimg src="icons/paySuccessBg.png" />
        </div>
        <div class="main">
            <div class="status">
                <div class="fx jcc">
                    <div class="status" style="width:120rpx; height:120rpx;">
                        <Nimg src="icons/icon-success.png" />
                    </div>
                </div>
                <div class="txt">支付成功</div>
            </div>
            <div class="wrap">
                <div class="info">
                    <div class="line fx" v-for="(i,index) in info" :key="index">
                        <div class="k">{{i.key}}</div>
                        <div class="v">{{i.value}}</div>
                    </div>
                </div>
                <div class="button" @click="goVip">
                    <button class="fx jcc">返回会员中心</button>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
export default {
    data() {
        return {
            info: null
        }
    },
    components: {
        Nimg
    },
    methods: {
        goVip() {
            $.isGo = 'vip-h5'
            $.isRefresh = true
            wx.switchTab({
                url: '/pages/userCenter/main'
            })
        },
    },
    onLoad() {
        if ($.currentOrderInfo) {
            this.info = $.currentOrderInfo
            $.currentOrderInfo = null
        }
    },
    onUnload() {
        $.isRefresh = true
        $.isPtRefresh = true
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
