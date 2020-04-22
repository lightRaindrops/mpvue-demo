<template>
    <div>
        <div class="couponPopup">
            <div class="title fx">
                <div class="fx1">优惠券</div>
                <div class="close fx" @click="onClose">
                    <div class="wb">暂不使用</div>
                    <div style="width:28rpx; height:28rpx;">
                        <Nimg src="icons/close.png" />
                    </div>
                </div>
            </div>
            <div class="list">
                <div
                    class="item"
                    v-for="(i,index) in list"
                    :key="index"
                    @click="onItemClicked(i)"
                    :class="{canNotUse:!i.canUse}"
                >
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
                                <div class="type-img fl">
                                    <img
                                        style="height:24rpx; margin-right:10rpx; margin-top:8rpx;"
                                        mode="heightFix"
                                        :src="i.couponBaseInfoDto.tagImgPath"
                                        alt="类型"
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
                                    <template v-if="i.couponBaseInfoDto.useTimeTypeCountDown >0">
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
                            </div>
                            <div class="bot fx" @click.stop="viewMore(i)">
                                <div class="fx1"></div>
                                <div class="txt">详细信息</div>
                                <div class="icon" :class="{DN:i.status == 'down'}">
                                    <Nimg src="icons/up.png" />
                                </div>
                                <div class="icon" :class="{DN:i.status == 'up'}">
                                    <Nimg src="icons/down.png" />
                                </div>
                            </div>
                            <div class="ichecked fx" v-if="i.canUse">
                                <div class="x icon" :class="{DN:!i.isChecked}">
                                    <Nimg src="icons/checked.png" />
                                </div>
                                <div class="y icon" :class="{DN:i.isChecked}">
                                    <Nimg src="icons/unchecked.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="moreInfo" :class="{DN:i.status=='down'}" v-if="i.couponDetailInfo">
                        <div class="line">优惠码：NO.{{i.couponDetailInfo.couponCode||''}}</div>
                        <div class="line" style="white-space:pre-wrap;">{{i.couponDetailInfoDto.remark||''}}</div>
                    </div>
                </div>
            </div>
            <div class="btnWrap fx" @click="onConfirm">
                <button>确定</button>
            </div>
        </div>
    </div>
</template>

<script>
import Nimg from '@/components/Nimg.vue'
export default {
    data() {
        return {
        }
    },
    props: {
        options: {
            type: Object,
            default: {
                list: []
            }
        }
    },
    computed: {
        list() {
            return this.options.list
        }
    },
    components: {
        Nimg
    },
    methods: {
        viewMore(i) {
            if (i.status == 'up') {
                i.status = 'down'
            } else {
                i.status = 'up'
            }
        },
        onCountDownChange(e, i) {
            i.timeData = e.mp.detail
        },
        onConfirm() {
            let reductionIds = []
            let arrChecked = this.list.filter(ele => ele.isChecked)
            arrChecked.forEach(ele => {
                if (ele.couponBaseInfoDto) {
                    if (ele.couponBaseInfoDto.id) {
                        reductionIds.push({
                            id: ele.couponBaseInfoDto.id
                        })
                    }
                }
            })
            this.$emit('onConfirm', reductionIds)
        },
        onItemClicked(i) {
            if (i.canUse) {
                i.isChecked = !i.isChecked
                if (i.isChecked) {
                    i.couponMutexes.forEach(ele => {
                        let index = this.list.findIndex(item => item.couponBaseInfoDto.id == ele.couponRecordId)
                        this.list[index].isChecked = false
                    })
                }
            }
        },
        onClose() {
            this.$emit('onClose')
        }
    },
}
</script>

<style lang="less">
.couponPopup {
    background: #fff;
    height: 926rpx;
    border-radius: 16rpx 16rpx 0rpx 0rpx;
    .title {
        height: 92rpx;
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        padding: 0 30rpx;
        .close {
            font-weight: normal;
            padding: 15rpx 0;
            color: #666;
            line-height: 1;
            .wb {
                margin-right: 10rpx;
            }
        }
    }
    .btnWrap {
        background: #fff;
        height: 100rpx;
        button {
            margin: 0 auto;
            display: block;
            color: #fff;
            width: 694rpx;
            height: 72rpx;
            line-height: 72rpx;
            background: linear-gradient(
                125deg,
                rgba(255, 51, 51, 1),
                rgba(255, 102, 51, 1)
            );
            border-radius: 36rpx;
        }
    }
    .list {
        height: 740rpx;
        padding-bottom: 30rpx;
        overflow: auto;
        background: #f3f3f3;
        .item {
            background: #fff;
            width: 694rpx;
            box-shadow: 3rpx 0rpx 12rpx rgba(153, 153, 153, 0.1);
            border-radius: 8rpx;
            margin: 0 auto;
            margin-top: 30rpx;
            position: relative;
            &.canNotUse {
                opacity: 0.5;
            }
            .ichecked {
                position: absolute;
                right: 30rpx;
                top: 50%;
                margin-top: -36rpx;
                .icon {
                    width: 32rpx;
                    height: 32rpx;
                }
            }
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
                position: relative;
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
                    border: 0;
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
}
</style>
