<template>
    <div class="pointRuleBox">
        <div class="ruleTip">
            <p class="text">活动时间：{{ruleDate}}</p>
            <p class="text">活动规则：</p>
            <p class="text" v-for="(rule,index) in ruleList" :key="index">{{rule}}</p>

        </div>
        <div class="dayPrizeBox">
            <div class="cont">
                <table>
                    <thead>
                        <tr>
                            <td>排名</td>
                            <td>奖品</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(prize,index) in rulePrize" :key="index">
                            <td>{{prize.name}}</td>
                            <td>{{prize.dec}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import $ from '@/common'

export default {
    name: 'pointRule',
    data() {
        return {
            ruleDate:'',
            ruleList:[],
            rulePrize:[]
        }
    },
    onLoad() {
        this.getRuleData()
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh()
    },
    methods: {
        getRuleData(){
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('getListeningShareActiveRule'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    console.log(res)
                    this.ruleDate = res.data.time
                    this.ruleList = res.data.rule
                    this.rulePrize = res.data.prize_list

                } else {
                    $.tip(res.msg)
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
