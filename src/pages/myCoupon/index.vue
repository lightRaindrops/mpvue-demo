<template>
    <div>
        <van-tabs
            animated
            swipe-threshold="4"
            line-width="18"
            z-index="4"
            :active="currentIndex"
            sticky
            @change="onTabChange"
            :offsetTop="0"
        >
            <van-tab v-for="(q,qIndex) in types" :key="qIndex" :title="q.val+'('+q.num+')'">
                <div class="tab-con">
                    <div class="list" v-if="list[qIndex]&&list[qIndex].length>0">
                        <div class="item" v-for="(i,index) in list[qIndex]" :key="index">
                            <div class="label xin" v-if="i.couponBaseInfoDto.cornerMark=='new'">
                                <Nimg src="icons/yhq/xin_1.png" />
                            </div>
                            <div
                                class="label jjgq"
                                v-else-if="i.couponBaseInfoDto.cornerMark=='expirationSoon'"
                            >
                                <Nimg src="icons/yhq/jjgq_1.png" />
                            </div>
                            <div class="fx" style="align-items:stretch">
                                <div
                                    class="il fx jcc"
                                    :style="'background: linear-gradient(-32deg,'+i.bg[0]+','+i.bg[1]+');'"
                                >
                                    <div class="circles">
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                        <div class="icir"></div>
                                    </div>
                                    <div class="top fx aife jcc">
                                        <div class="num">{{i.couponBaseInfoDto.bigTitle}}</div>
                                    </div>
                                    <div class="bot">{{i.couponBaseInfoDto.smallTitle}}</div>
                                </div>
                                <div class="ir fx1">
                                    <div class="top cx">
                                        <div
                                            class="type-img fl"
                                            v-if="i.couponBaseInfoDto.tagImgPath"
                                        >
                                            <img
                                                style="height:24rpx; margin-right:10rpx; margin-top:8rpx;"
                                                mode="heightFix"
                                                :src="i.couponBaseInfoDto.tagImgPath"
                                                alt="类型"
                                            />
                                        </div>
                                        <div
                                            class="type-img fl"
                                            v-if="i.couponBaseInfoDto.thresholdImgPath"
                                        >
                                            <img
                                                style="height:24rpx; margin-right:10rpx; margin-top:8rpx;"
                                                mode="heightFix"
                                                :src="i.couponBaseInfoDto.thresholdImgPath"
                                                alt="无门槛"
                                            />
                                        </div>
                                        <div class="name">{{i.couponBaseInfoDto.productName}}</div>
                                    </div>
                                    <div class="mid fx">
                                        <div
                                            class="fx1 fx"
                                            v-if="i.couponBaseInfoDto.useTimeType == 'fixed'"
                                        >
                                            <template
                                                v-if="i.couponBaseInfoDto.useTimeTypeFixed"
                                            >有效期限：{{i.couponBaseInfoDto.useTimeTypeFixed}}</template>
                                        </div>
                                        <div
                                            class="fx1 fx"
                                            v-else-if="i.couponBaseInfoDto.useTimeType == 'countDown'"
                                        >
                                            <template
                                                v-if="i.couponBaseInfoDto.useTimeTypeCountDown >0"
                                            >
                                                有效期限：
                                                <van-count-down
                                                    use-slot
                                                    @change="onCountDownChange($event,i)"
                                                    :time="i.couponBaseInfoDto.useTimeTypeCountDown"
                                                >
                                                    <text class="ti">{{ i.timeData.hours }} :</text>
                                                    <text class="ti">{{ i.timeData.minutes }} :</text>
                                                    <text class="ti">{{ i.timeData.seconds }}</text>
                                                </van-count-down>
                                            </template>
                                        </div>
                                        <div
                                            v-if="i.couponBaseInfoDto.status == 'obtained'"
                                            @click.stop="useNow(i)"
                                            class="btn fx jcc"
                                        >立即使用</div>
                                        <div
                                            v-else-if="i.couponBaseInfoDto.status == 'cantObtain'"
                                            class="btn fx jcc ljlq"
                                            @click.stop="collectNow(i)"
                                        >立即领取</div>
                                    </div>
                                    <div
                                        class="bot fx"
                                        @click="viewMore(i)"
                                        v-if="!['invalidate','used'].includes(i.couponBaseInfoDto.status)"
                                    >
                                        <div class="fx1"></div>
                                        <div class="txt">详细信息</div>
                                        <div class="icon" :class="{DN:i.status == 'down'}">
                                            <Nimg src="icons/up.png" />
                                        </div>
                                        <div class="icon" :class="{DN:i.status == 'up'}">
                                            <Nimg src="icons/down.png" />
                                        </div>
                                    </div>
                                    <div
                                        v-if="i.couponBaseInfoDto.status == 'invalidate'"
                                        class="ygq"
                                        style="width:101rpx;height:101rpx; position:absolute; bottom:10rpx; right:10rpx;"
                                    >
                                        <Nimg src="icons/yhq/ygq.png" />
                                    </div>
                                    <div
                                        v-if="i.couponBaseInfoDto.status == 'used'"
                                        class="ysy"
                                        style="width:101rpx;height:101rpx; position:absolute; bottom:10rpx; right:10rpx;"
                                    >
                                        <Nimg src="icons/yhq/ysy.png" />
                                    </div>
                                </div>
                            </div>
                            <div class="moreInfo" :class="{DN:i.status=='down'}">
                                <div
                                    class="line"
                                    v-if="i.couponDetailInfoDto.couponCode"
                                >优惠码：NO.{{i.couponDetailInfoDto.couponCode}}</div>
                                <div class="line" style="white-space:pre-wrap;">{{i.couponDetailInfoDto.remark||''}}</div>
                                <div
                                    class="btns fx jcc"
                                    v-if="i.couponDetailInfoDto.jumpLinkDtos&&i.couponDetailInfoDto.jumpLinkDtos.length>1"
                                >
                                    <div
                                        class="btn fx jcc"
                                        v-for="(btn,btnIndex) in i.couponDetailInfoDto.jumpLinkDtos"
                                        @click="onBtnClick(btn,i)"
                                        :key="btnIndex"
                                    >{{btn.name}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="tip">没有更多啦~</div>
                    </div>
                    <div class="noData" v-else-if="isLoaded">
                        <div class="img">
                            <Nimg src="icons/yhq/noData.png" />
                        </div>
                        <div class="txt">
                            <div class="t">一张优惠券都没有~</div>
                            <div class="b">不如让我们去领券中心看看吧</div>
                        </div>
                        <button class="go fx jcc" @click="goSelf('voucherCenter')">领券中心</button>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
        <div class="btnGo fx jcc" @click="goSelf('voucherCenter')">
            前往领券中心
            <div class="ms fx jcc">查看更多优惠券</div>
            <div class="arrow"></div>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
export default {
    data() {
        return {
            height: $.windowWidth / 750 * 280,
            types: [
            ],
            isLoaded: false,
            list: [],
            isChangeTab: false,
            currentIndex: 0,
        }
    },
    methods: {
        onTabChange(e) {
            $.log('tabChange')
            this.currentIndex = e.mp.detail.name
            this.isChangeTab = true
            this.datasFunc()
        },
        onBtnClick(btn, i) {
            this.useNow(i, () => {
                let link = btn.link.trim()
                $.go(link)
            })
        },
        goSelf: $.$goSelf,
        datasFunc() {
            let index = this.currentIndex
            let oldList = this.list[index] || []

            if (this.isChangeTab) {
                this.isChangeTab = false
                oldList = []
                this.$set(this.types[index], 'page', 1)
            }

            let url = '/marketing/coupon/my/info' + '?page=' + this.type.page
            let data = {
                couponTypeId: this.type.id
            }
            this.isLoaded = false
            $.$np(url, data).then(res => {
                let list = []
                if (Array.isArray(res.list)) {
                    res.list.forEach(ele => {
                        let item = Object.assign(ele, {
                            bg: ['#' + ele.couponBaseInfoDto.iconColorFrom, '#' + ele.couponBaseInfoDto.iconColorTo],
                            status: 'down',
                            timeData: {},
                            type: ele.couponBaseInfoDto.couponTypeId
                        })
                        list.push(item)
                    })
                }

                this.$set(this.list, index, list.concat(oldList))
                this.isLoaded = true
            })


        },
        onCountDownChange(e, i) {
            i.timeData = e.mp.detail
        },
        viewMore(i) {
            if (i.status == 'up') {
                i.status = 'down'
            } else {
                i.status = 'up'
            }
        },
        getSwiper() {
            const url = '/user/banner/getBannerByType/15'
            $.$ng(url).then(res => {
                this.swiper = res
            })
        },
        nextPage() {
            let page = this.type.page + 1
            this.$set(this.type, 'page', page)
            this.action = 1
            this.datasFunc()
        },
        getTypes() {
            let url = '/marketing/coupon/my/type'
            return $.$np(url).then(res => {
                this.types = []
                res.forEach(ele => {
                    let item = {
                        val: ele.name,
                        active: 0,
                        page: 1,
                    }
                    item = Object.assign(item, ele)
                    this.types.push(item)
                })
            })
        },
        useNow(i, back = $.noop) {
            let url = '/marketing/coupon/my/use'
            let data = {
                couponRecordId: i.couponBaseInfoDto.id
            }
            $.$np(url, data).then(res => {
                if (res.status == 'canUse') {
                    // $.tip('可使用')
                    if (Array.isArray(i.couponDetailInfoDto.jumpLinkDtos)) {
                        let len = i.couponDetailInfoDto.jumpLinkDtos.length
                        if (len == 1) {
                            $.go(i.couponDetailInfoDto.jumpLinkDtos[0].link.trim())
                        } else if (len > 1) {
                            i.status = 'down'
                            back()
                        }
                    }

                } else {
                    $.tip(res.cantUseReason[0])
                }
            })
        },
        collectNow(i) {
            let url = '/marketing/coupon/center/get'
            let data = {
                activityGiftId: i.couponBaseInfoDto.id
            }
            $.$np(url, data).then(res => {
                if (res.obtainStatus == 'obtainFail') {
                    $.tip(res.obtainFailReson)
                } else if (res.obtainStatus == 'obtainSuccess') {
                    $.tip('领取成功！\r\n感谢您的参与！')
                    this.$set(i.couponBaseInfoDto, 'status', 'obtained')
                }
            })
        },
        init() {
            this.getTypes().then(this.datasFunc)
        }
    },
    onReachBottom() {
        this.nextPage()
    },
    onLoad() {
        this.init()
    },
    async onPullDownRefresh() {
        this.isChangeTab = true
        await this.init()
        wx.stopPullDownRefresh()
    },
    computed: {
        type() {
            return this.types[this.currentIndex]
        },
    },
    components: {
        Nimg
    }
}
</script>

<style lang="less">
body {
    background: #f6f6f6;
}
</style>

<style lang="less" scoped>
.noData {
    padding-bottom: 100rpx;
    .img {
        width: 409rpx;
        height: 288rpx;
        margin: 0 auto;
        margin-top: 200rpx;
    }
    text-align: center;
    .txt {
        .t {
            color: #66666b;
            font-size: 32rpx;
            margin-top: 30rpx;
        }
        .b {
            color: #9d9ea6;
            font-size: 28rpx;
            margin-top: 10rpx;
        }
    }
    .go {
        width: 280rpx;
        height: 72rpx;
        line-height: 1;
        border: 2rpx solid rgba(211, 56, 28, 1);
        border-radius: 36rpx;
        margin: 0 auto;
        color: #d3381c;
        margin-top: 70rpx;
    }
}

.tip {
    margin-top: 30rpx;
    padding: 20rpx 0;
    text-align: center;
    color: #999;
}
.btnGo {
    width: 100%;
    position: fixed;
    height: 98rpx;
    z-index: 3;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    color: #333;
    font-size: 32rpx;
    .ms {
        position: absolute;
        width: 164rpx;
        height: 28rpx;
        top: 0;
        left: 50%;
        margin-left: -50rpx;
        font-size: 20rpx;
        line-height: 1;
        color: #fff;
        background: rgba(255, 102, 51, 1);
        border-radius: 14rpx;
    }
    .arrow {
        width: 0;
        height: 0;
        position: absolute;
        top: 25rpx;
        left: 50%;
        margin-left: 86rpx;
        border: 10rpx solid transparent;
        border-top-color: rgba(255, 102, 51, 1);
        position: absolute;
        content: "";
    }
}
.tab-con {
    padding-bottom: 100rpx;
}
.list {
    .item {
        background: #fff;
        width: 694rpx;
        box-shadow: 3rpx 0rpx 12rpx rgba(153, 153, 153, 0.1);
        border-radius: 8rpx;
        margin: 0 auto;
        margin-top: 30rpx;
        position: relative;
        .label {
            position: absolute;
            left: -2rpx;
            top: -2rpx;
            z-index: 2;
            &.jjgq {
                width: 89rpx;
                height: 89rpx;
            }
            &.xin {
                width: 43rpx;
                height: 43rpx;
            }
        }
        .moreInfo {
            background: #fff;
            line-height: 1.5;
            padding: 28rpx;
            font-size: 24rpx;
            color: #999;
            .line {
                padding: 5rpx 0;
            }
        }
        .il {
            width: 241rpx;
            font-size: 28rpx;
            position: relative;
            overflow: hidden;
            border-radius: 8rpx 0 0 8rpx;
            text-align: center;
            color: #fff;
            flex-direction: column;
            .top {
                line-height: 1;
                .num {
                    font-size: 48rpx;
                    font-weight: bold;
                    margin-left: 5rpx;
                }
            }
            .bot {
                margin-top: 15rpx;
            }
            .circles {
                position: absolute;
                left: -4rpx;
                top: 0;
                width: 8rpx;
                z-index: 1;
                .icir {
                    width: 8rpx;
                    height: 8rpx;
                    background: #f6f6f6;
                    margin-top: 5rpx;
                    border-radius: 50%;
                }
            }
        }
        .ir {
            padding-left: 20rpx;
            padding-right: 28rpx;
            .top {
                padding-top: 20rpx;
                .type {
                    background: #c29c6b;
                    margin-right: 10rpx;
                    font-size: 20rpx;
                    line-height: 1;
                    color: #fff;
                    padding: 0 10rpx;
                    height: 38rpx;
                    border-radius: 100rpx;
                    &.type_1 {
                        background: #c29c6b;
                    }
                    &.type_2 {
                        background: #5193d5;
                    }
                    &.type_3 {
                        background: #e2886c;
                    }
                }
                .name {
                    font-size: 24rpx;
                    font-weight: bold;
                    line-height: 1.6em;
                    color: #333;
                }
            }
            .mid {
                font-size: 20rpx;
                padding-bottom: 20rpx;
                padding-top: 20rpx;
                color: #333;
                .ti {
                    font-size: 20rpx;
                }
                .btn {
                    width: 116rpx;
                    height: 38rpx;
                    line-height: 1;
                    background: rgba(255, 255, 255, 1);
                    border: 2rpx solid rgba(211, 56, 28, 1);
                    border-radius: 18rpx;
                    color: #d3381c;
                }
            }
            .bot {
                height: 46rpx;
                border-top: 2rpx dashed #e8e8e8;
                color: #999999;
                font-size: 20rpx;
                line-height: 1;
                .icon {
                    width: 24rpx;
                    margin-left: 10rpx;
                    height: 24rpx;
                }
            }
        }
    }
}
</style>
