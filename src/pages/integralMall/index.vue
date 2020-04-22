<template>
    <div class="integralMall">
        <div class="title fx">
            <div class="fx1">
                物品
            </div>
            <a href="../exchangeRecord/main" style="font-weight:normal; font-size:28rpx; color:rgba(243,7,25,1);">兑换记录</a>
        </div>
        <div class="group fx">
            <div class="item" v-for="item in integralMall" :key="item.id">
                <div class="img">
                    <img :src="item.pic" mode="widthFix" />
                </div>
                <div class="bot">
                    <div class="bt">{{item.name}}</div>
                    <div class="scjg">市场价格 ¥{{item.market_price}}</div>
                    <div class="jfdh fx">
                        <div class="fx1 fx">
                            <img :src="szSrc" mode="widthFix" class="icon" alt />
                            <div class="point">{{item.point}}</div>
                        </div>
                        <button class="button" @click="go('pointsExchange?id=' + item.id)">兑换</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "./main.less";
</style>


<script>
import $ from '@/common'
export default {
    data() {
        return {
            integralMall: [],
        }
    },
    computed: {},
    methods: {
        go(str) {
            let arr = str.split('?')
            let url = $.pageUrl(arr[0])
            if (arr[1]) {
                url = url + '?' + arr[1]
            }
            $.go(url)
        },
    },
    components: {
    },
    onLoad() {
        $.np('getPointProductList', res => {
            this.integralMall = res.list
        })
    }
}
</script>


