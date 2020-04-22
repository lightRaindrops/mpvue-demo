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
                <div class="item" v-for="(i,index) in list" :key="index" @click="onItemClicked(i)">
                    <div class="label xin">
                        <Nimg src="icons/yhq/xin_1.png" />
                    </div>
                    <div class="label jjgq">
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
                                <div>￥</div>
                                <div class="num">400</div>
                            </div>
                            <div class="bot">满600可用</div>
                        </div>
                        <div class="ir fx1">
                            <div class="top cx">
                                <div
                                    class="type fl fx jcc"
                                    :class="'type_'+i.type"
                                >{{types[i.type].val}}</div>
                                <div class="name">购买会员卡满600元减400元</div>
                            </div>
                            <div class="mid fx">
                                <div class="fx1">有效期限：仅剩30天</div>
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
                            <div class="ichecked fx">
                                <div class="x icon" :class="{DN:i.isChecked}">
                                    <Nimg src="icons/checked.png" />
                                </div>
                                <div class="y icon" :class="{DN:!i.isChecked}">
                                    <Nimg src="icons/unchecked.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="moreInfo" :class="{DN:i.status=='down'}">
                        <div class="line">优惠码：NO.1912051IDUEJ</div>
                        <div class="line">限制类：仅可在会员购买中使用</div>
                        <div class="line">
                            优惠期间，用户选择购买年会员，立减400元。优惠力度之大，机会非常难得！
                            <br />可以点下方的去使用，前往会员中心，选择本券进行会员购买。
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnWrap fx">
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
            types: [
                { val: '全部', active: 0, page: 1 },
                { val: '会员卡券', active: 0, page: 1 },
                { val: '商品优惠券', active: 0, page: 1 },
                { val: '体验券', active: 0, page: 1 },
            ],
            list: [
                {
                    bg: ['#ECD2AD', '#C29C6B'],
                    status: 'down',
                    type: 1,
                    isChecked: true
                },
                {
                    bg: ['#60A3D8', '#6D7FE1'],
                    status: 'down',
                    type: 2,
                    isChecked: false
                },
                {
                    bg: ['#F0BD64', '#E1836D'],
                    status: 'down',
                    type: 3,
                    isChecked: true
                }
            ]
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
        onItemClicked(i) {
            i.isChecked = !i.isChecked
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
