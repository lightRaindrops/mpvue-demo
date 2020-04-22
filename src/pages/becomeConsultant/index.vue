<template>
    <div v-show="isLoaded">
        <div class="box">
            <div>
                <img :src="cwgwdtj" class="cwgwdtj" mode="aspectFit" />
            </div>
            <div>
                <img :src="zxqy" class="zxqy" mode="aspectFit" />
            </div>
            <div>
                <img :src="gwrzlc" class="gwrzlc" mode="aspectFit" />
            </div>
            <div>
                <button @click="next" open-type="redirect" class="cwgw" :style="btn"></button>
            </div>
        </div>
    </div>
</template>

<script>

import $ from '@/common'

export default {
    name: 'app',
    data() {
        return {
            isLoaded: false
        }
    },
    computed: {
        btn() {
            return $.$img("becomeConsultant/btn.png")
        },
        cwgwdtj() {
            return $.$img("becomeConsultant/cwgwdtj.png")
        },
        zxqy() {
            return $.$img("becomeConsultant/zxqy.png")
        },
        gwrzlc() {
            return $.$img("becomeConsultant/gwrzlc.png")
        },
        btn() {
            return $.$bg("becomeConsultant/btn.png")
        },
    },
    components: {
    },
    onLoad() {
        this.isLoaded = true
    },
    methods: {
        next() {
            Promise.all([
                $.np('isLogin'),
                $.np('userCenterData'),
            ]).then(arr => {
                let isLogin = arr[0].isLogin
                let isApplying = arr[1].isApplying
                let isAdviser = arr[1].isAdviser
                if (!isLogin) {
                    let url = '../userLogin/main?key=joinStep1'
                    $.go(url)
                } else {
                    if (isApplying) {
                        $.tip('您的入驻申请正在审核中...')
                    } else if (isAdviser) {
                        $.tip('您已经是顾问!')
                    } else {
                        $.go($.pageUrl('joinStep1'))
                    }
                }
            })
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
