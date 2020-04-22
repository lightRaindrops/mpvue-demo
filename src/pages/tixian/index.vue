<template>
    <div class="box">
        <template v-if="!isLoading">
            <div class="mainBox" :style="'height:'+pageHeight + 'px;'">
                <div class="box">
                    <div class="top" style="padding-bottom:0">
                        <div class="tl">提现金额</div>
                        <div
                            class="kuang"
                            style="padding-top:20px; padding-bottom:20px"
                            v-if="balance<50"
                        >
                            <input
                                class="number"
                                type="number"
                                v-model.number="txVal"
                                placeholder="最少提现金额为50元"
                            />
                            <span class="dw money">￥</span>
                        </div>
                        <div
                            class="kuang"
                            style="padding-top:20px"
                            v-else-if="balance<=500 && balance>=50"
                        >
                            <input
                                class="number"
                                type="number"
                                v-model.number="txVal"
                                :placeholder="'本次最多可提现'+balance+'元'"
                            />
                            <span class="dw money">￥</span>
                            <a class="all" @click="pushAll">全部</a>
                        </div>
                        <div class="kuang" style="padding-top:20px" v-else-if="balance>500">
                            <input
                                class="number"
                                type="number"
                                v-model.number="txVal"
                                :placeholder="'本次最多可提现'+500+'元'"
                            />
                            <span class="dw money">￥</span>
                            <a class="all" @click="pushAll">全部</a>
                        </div>
                    </div>
                </div>
                <div class="tips">
                    <button class="btn" @click="tixian" :disabled="isAble">提现</button>
                </div>
                <div class="tips">
                    <div class="tl">重要提醒：</div>
                    <p>
                        提现将会在5个工作日内转到您提供的提现账号
                        <br />每日最大提现金额为500元
                        <br />每笔提现收取1%的手续费
                        <br />如遇到提现不成功，请联系成功快车4001-76-86-96
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>


<script type="text/javascript">


import $ from '@/common'

export default {

    data() {
        return {
            res: {},
            balance: 0,
            pageHeight: $.windowHeight,
            txVal: '',
            zfbName: '',
            zfbAccount: '',
            uploadUrl: $.url('uploadFile'),
            faceSrc: '',
            isAble: false,
            isLoading: true
        }
    },
    watch: {
        txVal(val, oldVal) {
            let vv = Number(val)
            if (!isNaN(vv)) {
                if (vv > 500) {
                    this.txVal = oldVal
                    $.tip('每日最大提现金额为500元')
                }
            }

        }
    },
    computed: {},
    components: {},

    methods: {
        leftMoney() {
            $.np('leftMoney').then(res => {
                this.balance = Number(res.drawMoney)
                this.isLoading = false
            })
        },
        onInput(e) {
            this.txVal = Number(e.mp.detail.value)
        },
        tixian() {
            let self = this
            self.isAble = true
            let url = $.url("drawMoneyApply")
            if (self.txVal == '') {
                $.tip('请输入提现金额')
            } else if (Number(self.txVal) < 50) {
                $.tip('最小提现金额为50元')
            } else if (Number(self.txVal) > Number(self.balance)) {
                $.tip('超过最大可提现金额')
            } else {
                $.post(url, {
                    money: self.txVal,
                    zfb_name: self.zfbName,
                    zfb_account: self.zfbAccount,
                    wechat_qrcode: self.faceSrc
                }, function (res) {
                    if (res.success) {
                        self.txVal = ''
                        self.zfbName = ''
                        self.zfbAccount = ''
                        self.faceSrc = ''
                        self.leftMoney()
                        $.tip('提现申请中')
                    } else {
                        $.tip(res.msg)
                    }
                    $.log(res)
                })
            }
            self.isAble = false
        },
        pushAll(e) {
            if (this.balance > 500) {
                this.txVal = 500
            } else {
                this.txVal = this.balance
            }

        },
    },
    onLoad() {
        this.leftMoney()
    },
    onUnload() {
        $.isRefresh = true
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
