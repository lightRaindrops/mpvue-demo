<template>
    <div>
        <div class="buyVip">
            <div class="title fx jcc">
                <div class="icon">
                    <Nimg src="icons/icon_huiyuan.png" />
                </div>
                <div class="txt">
                    成功快车
                    <template v-if="currentTip=='personal_member'">个人</template>
                    <template v-else-if="currentTip=='corporate_member'">企业</template>
                    会员卡
                </div>
            </div>
            <van-radio-group :value="vipType" class="items vipType fx fww">
                <div
                    class="item fx aifs"
                    :class="{on:vipType==i.id,isDisabled:i.isDisabled}"
                    @click="!i.isDisabled?onVipTypeChange(i.id):no"
                    v-for="i in vipTypeList"
                    :key="i.id"
                >
                    <div class="il">
                        <div class="t" v-if="!i.isDisabled">{{i.memberName}}</div>
                        <div class="t" v-else>首月会员仅限首次充值</div>
                        <div class="b fx">
                            <div class="aa">￥{{i.marketAmount}}</div>
                            <div class="bb DN">￥{{i.amount}}</div>
                        </div>
                    </div>
                    <div class="radio" v-if="!i.isDisabled">
                        <van-radio checked-color="#2c2c2c" :name="''+i.id"></van-radio>
                    </div>
                </div>
            </van-radio-group>
            <div class="info">
                <div class="bt">购买项目</div>
                <div class="ny">
                    <div class="bg">
                        <Nimg v-if="currentTip=='personal_member'" src="icons/ka/gr.png" />
                        <Nimg v-if="currentTip=='corporate_member'" src="icons/ka/qy.png" />
                    </div>
                </div>
                <div class="payInfo" v-if="currentVipType">
                    <div class="line fx">
                        <div class="name fx1">会员价</div>
                        <div class="value fx">
                            <div class="aa">{{currentVipType.marketAmount}}</div>
                            <div class="bb DN">￥{{currentVipType.amount}}</div>
                        </div>
                    </div>
                    <div class="line DN fx">
                        <div class="name fx1">优惠券</div>
                        <div class="value fx">
                            <div class="aa">{{currentVipType.amount-currentVipType.marketAmount}}</div>
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
        </div>
        <div class="fixedBottomCopy"></div>
        <div class="fixedBottom">
            <div class="tip">
                购买须知
                <br />成功快车
                <template v-if="currentTip=='personal_member'">个人</template>
                <template v-else-if="currentTip=='corporate_member'">企业</template>会员卡为服务类产品，一经售出不予退还
            </div>
            <div class="payWrap fx" v-if="currentVipType">
                <div class="price fx1">￥{{currentVipType.amount}}</div>
                <button
                    class="payNow"
                    @click="next"
                    :class="{disabled:isDisabled}"
                    :disabled="isDisabled"
                >确认支付</button>
            </div>
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
            vipType: '1',
            payType: '1',
            currentTip: '',
            isDisabled: true,
            money: 0,
            vipTypeList: [],
            currentVipType: null,
            isEnough: true
        }
    },
    components: {
        Nimg
    },
    methods: {
        no() {
        },
        next() {
            if (!this.vipType) {
                $.tip('请选择购买的套餐')
                return
            }
            this.isDisabled = true
            let memberId = this.vipType
            if (this.payType == '2') {
                let self = this
                let url = `/order/membercoupon/createMpOrder/${memberId}`
                $.$$np(url).then(wxData => {
                    if (wxData.timeStamp) {
                        wx.requestPayment({
                            timeStamp: wxData.timeStamp,
                            nonceStr: wxData.nonceStr,
                            package: wxData.packageValue,
                            signType: wxData.signType,
                            paySign: wxData.paySign,
                            success(res) {
                                let pageUrl = $.pageUrl('paySuccess') + '?name=' + self.currentVipType.memberName + '&tip=' + self.currentTip
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

                }).then(() => {
                    setTimeout(() => {
                        this.isDisabled = false
                    }, 1000)
                })
            } else if (this.payType == '1') {
                let url = `/order/balancebead/payByBalanceAndBead`
                let data = {
                    businessId: memberId,
                    businessType: 8,
                    payType: 3,
                    totalTee: this.currentVipType.amount
                }
                $.$np(url, data).then(res => {
                    if (res.success) {
                        let pageUrl = $.pageUrl('paySuccess') + '?name=' + this.currentVipType.memberName + '&tip=' + this.currentTip
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
            this.isEnough = this.money > this.currentVipType.amount
            if (this.payType == '1') {
                this.isDisabled = !this.isEnough
            } else {
                this.isDisabled = false
            }
        },
        init() {

            // 获取余额

            let getMoney = () => {
                let url = '/order/userProperty/getMoney'
                $.$$np(url).then(res => {
                    this.money = BN(res.money).plus(res.undrawMoney)
                    this.checkEnough()
                })
            }

            //获取会员套餐
            {
                let url = '/user/member/types'
                $.$$np(url).then(res => {
                    this.vipTypeList = res.filter(ele => ele.tip == this.currentTip)
                    this.currentVipType = res.filter(ele => ele.id == this.vipType)[0]
                }).then(getMoney)
            }


        },
        onVipTypeChange(e) {
            this.vipType = '' + e
            this.currentVipType = this.vipTypeList.filter(ele => ele.id == this.vipType)[0]
            this.checkEnough()
        },
        onPayTypeChange(e) {
            this.payType = '' + e
            this.checkEnough()
        }
    },
    // created() {
    //     let o = {
    //         tip: 'personal_member',
    //         vipType: '3'
    //     }
    //     this.currentTip = o.tip
    //     this.vipType = o.vipType
    //     this.init()
    // },
    onLoad(o) {
        this.currentTip = o.tip
        this.vipType = o.vipType
        this.init()
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
