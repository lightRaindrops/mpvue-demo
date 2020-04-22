<template>
    <div class="score-detail">
        <div class="item" v-for="(item,index) in items" :key="index">
            <div class="fx">
                <div class="left fx1">
                    <div class="t1">{{item.reason}}</div>
                    <div class="t2">{{item.created_at}}</div>
                </div>
                <div class="right">
                    <span class="t3">
                        <span v-if="item.amount>0">+</span>
                        {{item.amount}}
                    </span>
                </div>
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
            items: [],
            pageNumber: 0,
            isLastPage: false
        }
    },
    components: {
    },
    methods: {
        getItems() {
            let { pageNumber, items } = this
            let url = $.url('coinHistory')
            $.pp(url, {
                currency_type: 2,
                page: pageNumber
            }, (res) => {
                this.items = items.concat(res.list)
                if (res.list.length > 0) {
                    this.pageNumber++
                } else {
                    this.isLastPage = true
                }
            })
        }
    },
    onLoad() {
        this.getItems()
    },
    onUnload(){
        this.pageNumber = 0
    },
    onReachBottom() {
        if (!this.isLastPage) {
            this.getItems()
        }

    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
