<template>
    <div class="page">
        <div class="group">
            <div class="item" @click="go(i.link)" v-for="(i,index) in items" :key="index">
                <div class="img">
                    <Nimg :src="i.img" />
                </div>
                <div class="title">{{i.activityName}}</div>
                <div class="ms fx">
                    活动时间：{{i.startTime}}-{{i.endTime}}
                    <div class="fx1"></div>
                    {{i.participateNum}}人参与
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
            items: null,
            page: 1,
            pageSize: 30
        }
    },
    computed: {

    },
    components: {
        Nimg
    },
    methods: {
        go: $.$go,
        init() {
            $.$$np('/order/activity/center').then(res => {
                res.list.forEach(ele => {
                    ele.startTime = $.dateLong2String(ele.startTime)
                    ele.endTime = $.dateLong2String(ele.endTime)
                })
                this.items = res.list
            })
        }
    },
    onReachBottom() {

    },
    // created() {
    //     this.init()
    // },
    onLoad() {
        this.init()
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
