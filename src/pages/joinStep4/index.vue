<template>
    <div v-show="isLoaded">
        <div style="padding-bottom:100rpx;">
            <div v-if="isPass">
                <img :src="pass" class="pass" mode="aspectFit" />
            </div>
            <div v-else>
                <img :src="ok" class="ok" mode="aspectFit" />
            </div>
            <choujiang></choujiang>
            <div @click="toAnswer" class="btnRed">去答题赚钱</div>
            <div class="lxkf">
                <button open-type="contact" class="blue">联系客服</button>
            </div>
        </div>
    </div>
</template>

<script>

import $ from '@/common'
import choujiang from '@/components/choujiang'

export default {
    name: 'app',
    data() {
        return {
            isLoaded: false,
            isLink: false,
            isPass: false
        }
    },
    computed: {
        winHeight() {
            return $.winHeight
        },
        pass() {
            return $.$img("joinStep4/pass.png")
        },
        ok() {
            return $.$img("joinStep4/ok.png")
        },

    },
    components: {
        choujiang
    },
    onLoad() {
        $.showLoading()
        $.np('userCenterData').then(res => {
            $.hideLoading()
            this.isLoaded = true
            this.isPass = res.isAdviser
        })


    },
    onUnload() {
        $.log('456')
        if (!this.isLink) {
            wx.switchTab({
                url:'../userCenter/main'
            })
        }
        // this.isLink = false
    },
    methods: {
        toAnswer() {
            this.isLink = true
            $.goSelf('../meAnswer/main')
        }
    },
    onPullDownRefresh() {

    },
}
</script>

<style lang="less" scoped>
@import "../../less/common.less";
@import "./main.less";
</style>
