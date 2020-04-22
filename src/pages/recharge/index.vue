<template>
    <div class="box">
        <div class="mainBox">
            <div class="banlance">
                <div class="t fx">
                    <a href="../mingxi/main" hover-class="none" class="viewMore">查看明细</a>
                </div>
                <div class="fx b">
                    <div class="czje fx1 fx jcc item">
                        <div class="center">
                            <div class="bt">不可提现金额（元）</div>
                            <div class="price">{{balance[0]}}</div>
                        </div>
                    </div>
                    <div class="ktxje fx1 fx jcc item">
                        <div class="center">
                            <div class="bt">可提现金额（元）</div>
                            <div class="price">{{balance[1]}}</div>
                            <a href="../tixian/main" class="btn tx">提现</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="cz">
                <div class="group fx">
                    <div
                        class="item"
                        v-for="(item,index) in rechargeList"
                        :class="{'active':index===active}"
                        :key="item.id"
                        @click="changeItem(index)"
                    >
                        <div class="t">{{item.title}}</div>
                        <div class="b" v-if="item.intro">{{item.intro}}</div>
                    </div>
                </div>
                <div @click="recharge()" class="button">充值</div>
            </div>-->
            <div class="tx">
                <div class="title">重要提醒：</div>
                <div class="info">如遇到提现不成功，请联系成功快车4001-76-86-96</div>
                <div class="info">可提现金额是通过任务、答题以及平台活动赚取的金额</div>
                <div class="info">充值的金额不可提现</div>
            </div>
        </div>
    </div>
</template>



<script type="text/javascript">


import $ from '@/common'
export default {

    data() {
        return {
            isLoading: true,
            res: {},
            balance: [],
            rechargeList: [],
            active: 0,
            options: {}
        }
    },
    computed: {

    },
    components: {},

    methods: {
        changeItem(index) {
            this.active = index
        },
        init() {
            //充值列表
            $.np('rechargeList').then(res=>{
                this.rechargeList = res
            })
            //余额
            $.np('leftMoney').then(res=>{
                this.balance = [res.undrawMoney, res.drawMoney]
            })
        },
        recharge() {
            let self = this
            let money = this.rechargeList[this.active].pay
            if (money <= 0) {
                return
            }
            $.post($.url('makeRechargeOrder'), { "amount": money }, function (res) {
                if (res.success) {
                    var data = res.data.rs
                    var data = JSON.parse(data)
                    data.success = (res) => {
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                        })

                        //充值成功后回调
                        loadFunc(self)

                        let url = $.pageUrl('myAccount')

                        setTimeout(function () {
                            if (self.options.type == 'pay') {
                                $.back()

                            } else {
                                $.go(url)
                            }
                        }, 2000)


                    }
                    data.fail = (res) => {
                        console.log(res)
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    wx.requestPayment(data)
                }
                else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        },


    },
    onLoad(o) {
        this.options = o
        this.init()
    },
    onShow() {
        if ($.isRefresh) {
            $.isRefresh = false
            this.init()
        }
    },
    onUnload() {
        //充值完毕
        $.isRecharged = true
    },
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
