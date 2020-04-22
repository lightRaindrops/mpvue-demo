<template>
    <div class="wrap" :style="pageHeight">
        <div class="intro">
            <div class="line fx">
                <div class="name">购买项目：</div>
                <div>个人会员1年</div>
            </div>
            <div class="line fx">
                <div class="name">应付金额：</div>
                <div class="red">{{payNum}}元</div>
            </div>
        </div>
        <div class="recharge">
            <div class="title">支付方式：</div>
            <div class="group">
                <van-radio-group name="zffs" :value="zffsChecked">
                    <div class="fx item" @click="onZffsClick('1')">
                        <div class="iconfont icon-renminbicaiwuzhifu"></div>
                        <div class="fx1">
                            余额
                            <span class="cRed">{{leftMoney}}</span>元
                            <span v-if="!isBalanceEnough">（不足支付）</span>
                        </div>
                        <div v-if="isBalanceEnough">
                            <van-radio name="1" checked-color="#ff0000"></van-radio>
                        </div>
                        <div v-else>
                            <a class="btn cz" href="../recharge/main?type=pay">充值</a>
                        </div>
                    </div>
                    <div class="fx item" v-if="options.type !== 'online'" @click="onZffsClick('2')">
                        <div class="iconfont icon-weixinzhifu1"></div>
                        <div class="fx1">微信支付</div>
                        <van-radio name="2" checked-color="#ff0000"></van-radio>
                    </div>
                </van-radio-group>
            </div>
            <div class="tips">
                <ul>
                    <li>
                        <span></span>您将购买的商品为虚拟类内容服务，购买后不支持退订、转让、退换，请斟酌确认。
                    </li>
                </ul>
            </div>
        </div>
        <div class="next">
            <button
                :style="btn_next"
                class="btn"
                :disabled="isDisabled"
                @click="onNext"
            >支付{{payNum}}元</button>
        </div>
    </div>
</template>



<script type="text/javascript">
import $ from '@/common'
import { setTimeout } from 'timers';

function loadFunc(self, back) {

    getLeftMoney(self, back)

    //获取余额

    function getLeftMoney(self, back) {
        let url = $.url('leftMoney')
        $.pp(url, function (res) {
            self.leftMoney = res.money
            $.hideLoading()
            isBalanceEnough(self)
            if (back) {
                back()
            }
        })
    }

    //判断余额是否充足

    function isBalanceEnough(self) {

        if (self.leftMoney - self.payNum >= 0) {
            self.isBalanceEnough = true
        } else {
            self.isBalanceEnough = false
        }
    }

}

export default {
    data() {
        return {
            zffsChecked: '1',
            payNum: 128.00,
            zxType: '',
            isDisabled: false,
            options: {},
            leftMoney: 0,
            isBalanceEnough: true
        }
    },
    computed: {
        pageHeight() {
            let val = $.windowHeight
            return 'min-height:' + val + 'px'
        },
        btn_next() {
            return $.$bg('btn_next.png')
        },
    },
    methods: {
        onZffsClick(e) {
            this.zffsChecked = e
        },
        onNext() {
            let self = this

            let zffs = this.zffsChecked

            this.isDisabled = true

            setTimeout(() => {
                this.isDisabled = false
            }, 5000)


            let go = (pay_type) => {

                let wxPay = (res, back = $.noop) => {
                    let data = JSON.parse(res)
                    data.success = (res) => {
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function () {
                            back()
                        }, 2000)
                    }
                    data.fail = (res) => {
                        console.log(res)
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 2000
                        })
                        this.isDisabled = false
                    }
                    wx.requestPayment(data)
                }

                $.np('makeWechatMember', {
                    pay_type: pay_type,
                    type: 2
                }).then(res => {
                    $.log(res)

                    if (res.isError) {
                        this.isDisabled = false
                        return
                    }

                    let url = $.pageUrl('userCenter') + '?to=vip'
                    if (pay_type == 1) {
                        wxPay(res.rs, () => {
                            $.suc('支付成功')
                            setTimeout(() => {
                                $.reLaunch(url)
                            }, 500)
                        })
                    } else if (pay_type == 2) {
                        $.suc('支付成功')
                        setTimeout(() => {
                            $.reLaunch(url)
                        }, 500)
                    }

                })


            }

            let wxzfGo = () => {
                go(1)
            }

            let yezfGo = () => {
                if (this.isBalanceEnough) {
                    go(2)
                } else {
                    $.tip('余额不足，请充值')
                }
            }

            if (zffs === '1') {
                yezfGo()
            } else if (zffs === '2') {
                wxzfGo()
            }



        }
    },
    onLoad(o) {
        this.options = o
        if (o.type === 'online') {
            this.zxType = '在线咨询'
        } else {
            this.zxType = '图文咨询'
        }
        loadFunc(this)
    },
    onShow() {
        if ($.isRecharged) {
            $.isRecharged = false
            loadFunc(this)
        }

    }

}
</script>

<style lang="less">
@import "./main.less";
</style>
