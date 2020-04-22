<template>
    <div>
        <div class="buyCard">
            <div class="info">
                <div class="payInfo" v-if="card">
                    <div class="line fx">
                        <div class="fx1 k">购买项目</div>
                        <div class="v">{{card.name}}</div>
                    </div>
                    <div class="line fx">
                        <div class="fx1 k">支付金额</div>
                        <div class="v">
                            <div class="price">￥{{card.discount}}</div>
                        </div>
                    </div>
                </div>
                <div class="payType">
                    <van-radio-group :value="payType">
                        <div
                            class="item fx"
                            :class="{on:payType=='1'}"
                            @click="onPayTypeChange('1')"
                        >
                            余额
                            <span class="ye">￥{{money}}</span>
                            <span class="yebz" v-if="!isEnough">（余额不足）</span>
                            <div class="fx1"></div>
                            <van-radio checked-color="#f9d69e" name="1"></van-radio>
                        </div>
                        <div
                            class="item fx"
                            :class="{on:payType=='2'}"
                            @click="onPayTypeChange('2')"
                        >
                            <div class="icon wxzf">
                                <Nimg src="icons/icon_weixinzhifu.png" />
                            </div>
                            <span>微信支付</span>
                            <div class="fx1"></div>
                            <van-radio checked-color="#f9d69e" name="2"></van-radio>
                        </div>
                    </van-radio-group>
                </div>
            </div>
            <button
                class="payNow"
                @click="next"
                :class="{disabled:isDisabled}"
                :disabled="isDisabled"
            >确认支付</button>
        </div>
        <div class="tip">
            购买须知
            <br />成功快车个人会员卡为服务类产品，一经售出不予退还
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import BN from '@/utils/number.pro'
export default {
    data() {
        return {
            payType: '1',
            card: null,
            cardId: null,
            isDisabled: true,
            money: 0,
            isEnough: true
        }
    },
    watch: {

    },
    components: {
        Nimg
    },
    methods: {
        next() {
            this.isDisabled = true
            if (this.payType == '2') {
                let url = `/order/membercoupon/createMpTicketOrder/${this.cardId}`
                let self = this
                $.$$np(url).then(wxData => {
                    if (wxData.timeStamp) {
                        wx.requestPayment({
                            timeStamp: wxData.timeStamp,
                            nonceStr: wxData.nonceStr,
                            package: wxData.packageValue,
                            signType: wxData.signType,
                            paySign: wxData.paySign,
                            success(res) {
                                let pageUrl = $.pageUrl('paySuccess') + '?name=' + self.card.name
                                $.goSelf(pageUrl)
                            },
                            fail(res) {
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    }
                    setTimeout(() => {
                        this.isDisabled = false
                    }, 1000)

                }).then(() => {
                    setTimeout(() => {
                        this.isDisabled = false
                    }, 1000)
                })
            } else if (this.payType == '1') {
                let url = `/order/balancebead/payByBalanceAndBead`
                let data = {
                    businessId: this.cardId,
                    businessType: 9,
                    payType: 3,
                    totalTee: this.card.discount
                }
                $.$np(url, data).then(res => {
                    if (res.success) {
                        let pageUrl = $.pageUrl('paySuccess') + '?name=' + this.card.name
                        $.goSelf(pageUrl)
                    }
                }).then(() => {
                    setTimeout(() => {
                        this.isDisabled = false
                    }, 1000)
                })
            }
            setTimeout(() => {
                this.isDisabled = false
            }, 5000)

        },
        checkEnough() {
            this.isEnough = this.money > this.card.discount
            if (this.payType == '1') {
                this.isDisabled = !this.isEnough
            } else {
                this.isDisabled = false
            }
        },
        init() {
            //获取余额
            let getMoney = () => {
                let url = '/order/userProperty/getMoney'
                $.$$np(url).then(res => {
                    this.money = BN(res.money).plus(res.undrawMoney)
                    this.checkEnough()
                })
            }

            //获取卡券信息
            {
                let url = `/user/vip/details/cardTicket/${this.cardId}`
                $.$$np(url).then(res => {
                    this.card = res
                }).then(getMoney)
            }


        },
        onPayTypeChange(e) {
            this.payType = '' + e
            this.checkEnough()
        }
    },
    // created() {
    //     let o = {
    //         id: '2'
    //     }
    //     this.cardId = o.id
    //     this.init()
    // },
    onLoad(o) {
        this.cardId = Number(o.id)
        this.init()
    },
}
</script>

<style lang="less">
@import "./main.less";
</style>
