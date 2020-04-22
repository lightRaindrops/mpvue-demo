<template>
    <div class="wrap" :style="pageHeight">
        <div class="info">
            <div class="top" v-if="info.name">
                <div class="title">购买{{info.name}}的咨询服务</div>
                <div class="mx">
                    <div class="line">
                        支付费用：
                        <span>{{info.consultScorePay}}算珠</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="zffs">
            <div class="title">支付方式</div>
            <div class="group">
                <van-radio-group name="zffs" :value="zffsChecked">
                    <div class="fx item" @click="onZffsClick('1')">
                        <div class="fx1">
                            <span style="margin-right:10rpx;">余额</span>
                            <span class="cRed">{{score}}</span>算珠
                            <span v-if="!isBalanceEnough">（不足支付）</span>
                        </div>
                        <div v-if="isBalanceEnough">
                            <van-radio name="1" checked-color="#ff0000"></van-radio>
                        </div>
                        <div v-else>
                            <a class="btn cz" href="../taskCenter/main">去赚算珠</a>
                        </div>
                    </div>
                </van-radio-group>
            </div>
            <div class="tips">
                <div class="fx aifs line">
                    <div class="circle"></div>
                    <div class="wb fx1">你将购买的商品为虚拟内容服务，购买后不支持退订、转 让、退换，请斟酌确认。</div>
                </div>
                <div class="fx aifs line">
                    <div class="circle"></div>
                    <div class="wb fx1">购买后请留意顾问的回答，可以在“我的提问“中查看。</div>
                </div>
            </div>
        </div>
        <div class="next">
            <button
                :style="btn_next"
                :disabled="disabled"
                class="btn"
                @click="onNext"
            >{{info.consultScorePay}}算珠 确认提交</button>
        </div>
    </div>
</template>



<script type="text/javascript">
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import BN from '@/utils/number.pro'
export default {
    data() {
        return {
            zffsChecked: '1',
            amount: 0,
            pay_type: 3,
            options: {},
            info: {},
            leftMoney: 0,
            score: 0,
            disabled: false,
            isBalanceEnough: true
        }
    },
    components: {
        Nimg
    },
    computed: {
        pageHeight() {
            return `min-height:${$.windowHeight}px`
        },
        isIphone() {
            return $.isIphone()
        },
        btn_next() {
            return $.$bg('btn_next.png')
        },
    },
    methods: {
        init() {
            let getScore, getPayInfo
            //获取剩余算珠
            {
                let url = '/user/info/relevant'
                getScore = $.$$np(url).then(res => {
                    this.score = res.score
                })
            }
            //获取支付信息
            {
                let url = `/user/adviser/details/${this.options.id}`
                getPayInfo = $.$$np(url).then(res => {
                    this.info = res.userInfo
                })
            }

            Promise.all([getScore, getPayInfo]).then(() => {
                //判断余额是否充足
                this.isBalanceEnough = BN(this.score).mins(this.info.consultScorePay) >= 0
            })
        },
        go: $.$go,
        onZffsClick(e) {
            this.zffsChecked = e
            if (e == 2) {
                this.pay_type = 1
            } else if (e == 1) {
                this.pay_type = 3
            }
        },
        onNext() {
            let data = $.getLocal('one-by-one-data')
            console.log(data)
            let realData = {
                questionType: data.question_type,
                adviserId: data.adviser,
                imgPath: data.files,
                title: data.title,
                type: data.type,
                isAnonymous: 0,
            }

            //锁定按钮
            this.disabled = true
            $.showLoading()

            setTimeout(() => {
                this.disabled = false
                $.hideLoading()
            }, 5000)


            if (data.reward && data.reward > 0) {
                let url = '/imconsult/question/createQuestion'
                $.$np(url, realData).then(res => {
                    return res.questionId
                }).then(id => {
                    let url = '/order/balancebead/payByBalanceAndBead'
                    let data = {
                        businessId: id,
                        businessType: 2,
                        payType: 4,
                        totalTee: this.info.consultScorePay
                    }
                    $.$np(url, data).then(res => {
                        this.disabled = false
                        $.hideLoading()
                        if (!res.isError) {
                            let pageUrl = $.pageUrl('problemInfo') + '?id=' + id + '&new=1'
                            $.goSelf(pageUrl)
                        }
                    })
                })
            }

        }
    },
    onLoad(o) {
        this.options = o
        this.init()
    },
    onShow() {
    }

}
</script>

<style lang="less">
@import "./main.less";
</style>
