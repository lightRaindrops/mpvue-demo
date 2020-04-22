<template>
    <div class="exchangeRecord">
        <div class="group">
            <div class="fx item" v-for="item of items" :key="item.order_sn">
                <div class="img">
                    <img :src="item.pic" mode="widthFix">
                </div>
                <div class="fx1 txt">
                    <div class="t fx">
                        <div class="fx1 name">{{item.product_name}}</div>
                        <div class="pay">-{{item.total_amount}}算珠</div>
                    </div>
                    <div class="num">x{{item.buy_count}}</div>
                    <div class="time">兑换时间：{{item.order_time}}</div>
                </div>
            </div>
            <div v-if="items.length <= 0 && isOk" class="noData">暂无兑换记录</div>
        </div>
    </div>
</template>
<script>
import $ from '@/common'
let page = 0
let pageOk = true
export default {
    data() {
        return {
            items: [],
            isOk:false
        }
    },
    methods: {
        loadData() {
            if (pageOk) {
                let url = $.url('exchangeOrderList')
                let data = {
                    page
                }
                $.pp(url, data, res => {
                    let list = res.list
                    list.forEach(e => {
                        let p = e.product_name;
                        if (p.length > 12) {
                            e.product_name = p.slice(0, 12) + '...'
                        }
                    })
                    this.items = this.items.concat(list)
                    if (list.length > 0) {
                        page++
                    } else {
                        pageOk = false
                    }
                    this.isOk = true
                })
            }

        },
    },
    onLoad() {
        this.loadData()
    },
    onReachBottom() {
        this.loadData()
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
