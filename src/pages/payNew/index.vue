<template>
    <div class="payNew" v-if="initOne && initTwo">
        <div class="top">
            <div class="line fx">
                <div class="fx1 k">商品名称：</div>
                <div class="v">{{memberName}}</div>
            </div>
            <div class="line fx">
                <div class="fx1 k">商品数量：</div>
                <div class="v">{{productData.productNum}}</div>
            </div>
            <div class="line fx">
                <div class="fx1 k">商品单价：</div>
                <div class="v">￥{{productData.singleAmountMoney}}</div>
            </div>
        </div>
        <div class="mid">
            <div class="line fx">
                <div class="fx1 k">应付金额：</div>
                <div class="v">￥{{productData.totalAmountMoney}}</div>
            </div>
            <div class="line fx yhq aifs" v-if="couponPopupOptions.list.length>0">
                <div class="k">优惠券：</div>
                <div class="fx1" style="height:70rpx;" @click="isShowCoupon = true"></div>
                <div class="v" @click="isShowCoupon = true">
                    <div class="t">-￥{{productData.reduceAmountMoney}}</div>
                    <div class="ky fx">
                        共{{canUseNum}}张可用
                        <div class="arrow ml_10">
                            <Nimg src="icons/arrow.png" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="line fx yhq aifs" v-else>
                <div class="k">优惠券：</div>
                <div class="fx1" style="height:70rpx;"></div>
                <div class="v">
                    <div class="t">-￥{{productData.reduceAmountMoney}}</div>
                    <div class="ky fx">
                        无可用优惠券
                    </div>
                </div>
            </div>
            <div class="line fx">
                <div class="fx1 k">实付金额：</div>
                <div class="v">￥{{productData.realAmountMoney}}</div>
            </div>
        </div>
        <div class="bot">
            <div class="payType">
                <van-radio-group :value="payType">
                    <div class="item fx" :class="{on:payType=='1'}" @click="onPayTypeChange('1')">
                        <div class="icon wxzf">
                            <Nimg src="icons/icon-wxzf.png" />
                        </div>
                        <span>微信支付</span>
                        <div class="fx1"></div>
                        <van-radio checked-color="#d43516" name="1"></van-radio>
                    </div>
                    <div class="item fx" :class="{on:payType=='2'}" @click="onPayTypeChange('2')">
                        余额:
                        <span class="ye">￥{{money}}</span>
                        <span class="yebz" v-if="!isEnough">（余额不足）</span>
                        <div class="fx1"></div>
                        <van-radio checked-color="#d43516" name="2"></van-radio>
                    </div>
                </van-radio-group>
            </div>
        </div>
        <div class="next">
            <button @click="next" :disabled="isDisabled" class="fx jcc">立即支付</button>
        </div>
        <!-- 优惠券 -->
        <van-popup
            class="popup"
            :show="isShowCoupon"
            position="bottom"
            custom-style="background:none"
        >
            <couponPopup
                :options="couponPopupOptions"
                @onClose="isShowCoupon = false"
                @onConfirm="onCouponConfirm"
            ></couponPopup>
        </van-popup>
    </div>
</template>

<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import couponPopup from '@/components/couponPopup.vue'
import BN from '@/utils/number.pro'
export default {
    data() {
        return {
            payType: '1',
            reductionIds: [],
            memberName: '',
            money: 0,
            isShowCoupon: false,
            initOne: false,
            initTwo: false,
            vipType: '',
            isEnough: true,
            productType: '',
            canUseNum: 0,
            isDisabled: true,
            productData: {},
            couponPopupOptions: {
                list: []
            }
        }
    },
    components: {
        Nimg, couponPopup
    },
    methods: {
        next() {
            let type = this.payType
            let payTypeCode = 0
            let url = '/order/unifiedOrder' + '#header=form'
            let deviceType = '' //设备类型
            if ($.isIphone()) {
                deviceType = 'ios'
            } else {
                deviceType = 'android'
            }

            if (type == '1') {
                $.log('微信支付')
                payTypeCode = 9
            } else if (type == '2') {
                $.log('余额支付')
                payTypeCode = 3
            }

            let data = {
                productType: this.productType,
                payType: payTypeCode,
                sourceType: 'wechat_applet',
                deviceType: deviceType,
                productAndReductionInfos: [{
                    productId: this.vipType
                }],
                reductionIds: this.reductionIds
            }

            data = {
                info: JSON.stringify(data)
            }

            this.isDisabled = true
            $.showLoading('请稍候')

            $.$np(url, data).then(res => {
                if (res.isError) {
                    return
                }
                let orderNo = res.parentOrderNo
                //查询订单状态
                const queryState = () => {
                    let myInterval
                    const go = () => {
                        let url = `/order/orderStatus/${orderNo}`
                        $.$$np(url).then(res => {
                            $.log(res)
                            if (res.orderStatus == 'paid') {
                                clearInterval(myInterval)
                                if (res.params) {
                                    $.currentOrderInfo = res.params
                                    let pageUrl = $.pageUrl('paySuccess')
                                    $.goSelf(pageUrl)
                                }

                            }
                        })
                    }
                    myInterval = setInterval(go, 1000)
                }

                if (res.payInfo && type == '1') {
                    wx.requestPayment({
                        timeStamp: res.payInfo.timeStamp,
                        nonceStr: res.payInfo.nonceStr,
                        package: res.payInfo.packageValue,
                        signType: res.payInfo.signType,
                        paySign: res.payInfo.paySign,
                        success(res) {
                            $.log(res)
                            queryState()
                        },
                        fail(res) {
                            $.log(res)
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                } else if (type == '2') {
                    queryState()
                }

            }).then(() => {
                setTimeout(() => {
                    this.isDisabled = false
                    $.hideLoading()
                }, 1500)
            })



        },
        onCouponConfirm(reductionIds) {
            this.isShowCoupon = false
            this.reductionIds = reductionIds
            let url = '/order/unifiedOrder/prepareCal' + '#header=form'
            let data = {
                info: JSON.stringify({
                    productType: this.productType,
                    productAndReductionInfos: [{
                        productId: this.vipType
                    }],
                    reductionIds: reductionIds
                })
            }
            $.$np(url, data).then(res => {
                this.productData = res
                this.checkEnough()
            })
        },
        checkEnough() {
            this.isEnough = this.money > this.productData.realAmountMoney || this.money == this.productData.realAmountMoney
            if (this.payType == '2') {
                this.isDisabled = !this.isEnough
            } else {
                this.isDisabled = false
            }
        },
        onPayTypeChange(e) {
            this.payType = '' + e
            this.checkEnough()
        },
        init() {
            // 获取余额
            const getMoney = new Promise((resolve, reject) => {
                let url = '/order/userProperty/getMoney'
                $.$$np(url).then(res => {
                    if (res.isError) {
                        wx.showToast({
                            title: '系统繁忙，请稍后重试',
                            duration: 2000
                        })
                    } else {
                        this.money = BN(res.money).plus(res.undrawMoney)
                        this.initOne = true
                        resolve()
                    }
                })
            })
            //获取订单信息
            const getOrderInfo = new Promise((resolve, reject) => {
                let url = '/order/unifiedOrder/prepareCal' + '#header=form'
                let data = {
                    productType: this.productType,
                    productAndReductionInfos: [{
                        productId: this.vipType
                    }]
                }
                data = {
                    info: JSON.stringify(data)
                }
                $.$np(url, data).then(res => {
                    if (res.isError) {
                        wx.showToast({
                            title: '系统繁忙，请稍后重试',
                            duration: 2000
                        })
                        return
                    } else {
                        this.initTwo = true
                        this.productData = res
                        resolve()
                    }
                })
            })
            //获取优惠券列表
            const getCouponList = new Promise((resolve, reject) => {
                let url = '/marketing/coupon/preOrder'
                let data = {
                    productId: this.vipType,
                    productNum: 1,
                    productType: this.productType
                }
                $.$np(url, data).then(res => {
                    this.canUseNum = res.canUseNum
                    resolve(res.useCouponResults || [])
                })
            })

            Promise.all([getMoney, getOrderInfo]).then(this.checkEnough)
            //优惠券参数
            getCouponList.then(list => {
                list.forEach(ele => {
                    ele = Object.assign(ele, {
                        bg: ['#' + ele.couponBaseInfoDto.iconColorFrom, '#' + ele.couponBaseInfoDto.iconColorTo],
                        status: 'down',
                        timeData: {},
                        type: ele.couponBaseInfoDto.couponTypeId,
                        isChecked: false
                    })
                })
                $.log('list', list)
                this.couponPopupOptions = {
                    list: list
                }
            })

        },
    },
    onLoad(o) {
        console.log(o)
        //商品id
        this.vipType = o.vipType
        //商品类型
        this.productType = o.productType
        //商品名称
        this.memberName = o.memberName
        this.init()
    }
}
</script>

<style lang="less">
.payNew {
    padding: 30rpx;
    font-size: 28rpx;

    .red {
        color: #d3381c;
    }

    .line {
        padding: 10rpx 0;

        .k {
            color: #666;
        }
        &.yhq {
            line-height: 1;
            .t {
                color: #d3381c;
                padding-bottom: 10rpx;
            }
            .v {
                text-align: right;
                color: #999;
            }
        }
    }

    .mid {
        border-top: 1px solid #e6e6e6;
        margin-top: 48rpx;
        padding-top: 48rpx;
    }

    .payType {
        margin-top: 36rpx;

        .item {
            padding-top: 27rpx;

            .icon.wxzf {
                width: 55rpx;
                height: 52rpx;
                margin-right: 20rpx;
            }

            .ye,
            .yebz {
                margin-left: 28rpx;
            }

            .yebz {
                color: #ff0000;
            }
        }
    }

    .arrow {
        width: 15rpx;
        height: 26rpx;
    }
    .ml_10 {
        margin-left: 10rpx;
    }

    .next {
        button {
            margin: 0 auto;
            width: 690rpx;
            height: 72rpx;
            background: rgba(211, 56, 28, 1);
            border-radius: 35rpx;
            color: #fff;
            text-align: center;
        }
    }
}

.couponPopup {
    background: #fff;
    height: 926rpx;
    border-radius: 16rpx 16rpx 0rpx 0rpx;
}
</style>
