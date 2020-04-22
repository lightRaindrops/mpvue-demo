<template>
    <div>
        <div class="all">
            <div class="title fx">
                <div class="fx1 fx">
                    <picker
                        @change="onPickerChange"
                        range-key="txt"
                        :value="curTypeIndex"
                        :range="types"
                    >
                        <div class="type item fx" style="color:#f30719; font-weight:bold;">
                            {{types[curTypeIndex].txt}}
                            <div class="sjx icon">
                                <Nimg src="icons/sjx_down.png" />
                            </div>
                        </div>
                    </picker>
                    <div class="zhpx item fx" :class="{on:orderByFirst == 0}" @click="paixv(0)">推荐</div>
                    <div class="zhpx item fx" :class="{on:orderByFirst == 1}" @click="paixv(1)">评分</div>
                    <div class="zhpx item fx" :class="{on:orderByFirst == 2}" @click="paixv(2)">咨询量</div>
                </div>
                <div class="price item fx" @click="jgpx">
                    价格
                    <div class="icons">
                        <div class="sjx_up icon" v-show="jgpxVal == 'down'||jgpxVal == ''">
                            <Nimg src="icons/sjx_up.png" />
                        </div>
                        <div class="sjx_up icon" v-show="jgpxVal == 'up'">
                            <Nimg src="icons/sjx_up_on.png" />
                        </div>
                        <div class="line"></div>
                        <div class="sjx_down icon" v-show="jgpxVal == 'up'||jgpxVal == ''">
                            <Nimg src="icons/sjx_down.png" />
                        </div>
                        <div class="sjx_down icon" v-show="jgpxVal == 'down'">
                            <Nimg src="icons/sjx_down_on.png" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="fx jcc loadingWrap" v-if="isLoading">
                <van-loading></van-loading>
            </div>
            <div class="group" v-else>
                <div
                    class="item fx aifs"
                    v-for="(i,index) in list"
                    :key="index"
                    @click="go('adviserInfo?id='+i.adviserId)"
                >
                    <div class="img">
                        <div class="photo">
                            <Nimg :src="i.photo" />
                        </div>
                        <div class="level">
                            <Nimg :src="`icons/guwen/c${i.adviserLevel}.png`" />
                        </div>
                    </div>
                    <div class="txt fx1">
                        <div class="line fx">
                            <div class="name">{{i.adviserName}}</div>
                            <div class="cpaType" v-if="i.cpaType != 0 && i.cpaType < 5">
                                <Nimg :src="`icons/guwen/t${i.cpaType}.png`" />
                            </div>
                            <div class="vip" v-if="i.vipCorporate">
                                <Nimg :src="`icons/vip/qy.png`" />
                            </div>
                            <div class="vip" v-else-if="i.vipPersonal">
                                <Nimg :src="`icons/vip/gr.png`" />
                            </div>
                            <div class="fx1"></div>
                            <div class="price" v-if="i.consultPay">{{i.consultScorePay}}算珠</div>
                        </div>
                        <div class="swsName" v-if="i.serviceName">{{i.serviceName}}</div>
                        <div class="data">持证{{i.cpaTime}}年 | 回答{{i.countAnswer}} | 评分{{i.score}}</div>
                        <div class="fx">
                            <div class="fx sc">
                                <div class="bt">擅长:</div>
                                <div class="ny fx">
                                    <div class="i" v-for="(ii,q) in i.tags" :key="ii+q">{{ii}}</div>
                                </div>
                            </div>
                            <div class="fx1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import types from '@/data/types'

export default {
    data() {
        return {
            currentPage: 1,
            //是否综合排序
            isZhpx: true,
            jgpxVal: '',
            totalPage: 1,
            orderBy: 0,
            orderByFirst: 0,
            productTypeName: '',
            list: [],
            types: [{
                src: '',
                txt: '全部'
            },].concat(types),
            curTypeIndex: 0,
            isLoading: true,
            isWaiting: false
        }
    },
    props: {
        curType: {
            type: String,
            default: ''
        }
    },
    computed: {

    },
    methods: {
        go: $.$go,
        onPickerChange(e) {
            let v = e.mp.detail.value
            this.curTypeIndex = v
            this.productTypeName = this.types[v].txt
            this.datasFunc()
        },
        //综合排序
        paixv(n) {
            this.currentPage = 1
            this.orderByFirst = n
            this.isZhpx = true
            this.jgpxVal = ''
            this.datasFunc()
        },
        // 价格排序
        jgpx() {
            this.currentPage = 1
            this.orderByFirst = 4
            this.isZhpx = false

            if (this.orderBy == 0) {
                this.orderBy = 1
                this.jgpxVal = 'up'
            } else {
                this.orderBy = 0
                this.jgpxVal = 'down'
            }


            this.datasFunc()
        },
        async datasFunc() {
            try {
                let page = this.currentPage
                let url = '/user/adviser/recommendation?page=' + page + '&pageSize=20'
                let orderByFirst = this.orderByFirst
                let orderBy = this.orderBy
                let productTypeName = this.productTypeName

                if (productTypeName == '全部') {
                    productTypeName = ''
                }

                let data = {
                    orderBy: orderBy,
                    orderByFirst: orderByFirst,
                    productTypeName: productTypeName
                }

                this.isWaiting = true
                let { list, totalPage } = await $.$np(url, data)
                this.isWaiting = false


                list.forEach(ele => {
                    try {
                        if (ele.tags) {
                            let tags = ele.tags.split(',')
                            ele.tags = tags.filter(e => e !== '无')
                        }
                    } catch (e) {
                        $.error(e)
                    }
                })
                if (this.currentPage == 1) {
                    this.list = []
                }
                this.list = this.list.concat(list)
                this.totalPage = totalPage

                this.isLoading = false

            } catch (error) {
                $.error(error)
            }
        },
        nextPage() {
            if (this.isWaiting) {
                return
            }
            if (this.currentPage < this.totalPage) {
                this.currentPage++
                this.datasFunc()
            }
        },
    },
    components: {
        Nimg,
    },
    onReachBottom() {
        this.nextPage()
    },
    onLoad() {
        this.productTypeName = this.curType
        {
            let v = this.types.findIndex(ele => ele.txt == this.curType)
            $.log('vv', this.curType)
            if (v != -1) {
                this.curTypeIndex = v
            }

        }

        this.datasFunc()
    },
}
</script>

<style lang="less" scoped>
.all {
    border-top: 20rpx solid #f2f2f2;

    .title {
        background: #fff;
        padding: 0 30rpx;
        font-size: 32rpx;
        border-bottom: 1rpx solid #e5e5e5;

        .item {
            height: 114rpx;
            text-align: center;

            .icon {
                width: 16rpx;
                height: 10rpx;
                margin-left: 12rpx;
            }

            .level {
                position: absolute;
                z-index: 2;
                width: 44rpx;
                height: 26rpx;
                right: 0;
                bottom: 0;
            }

            &.on {
                color: #f30719;
            }

            &.type {
                margin-right: 70rpx;
            }

            &.zhpx {
                margin-right: 40rpx;
            }

            &.price {
                .line {
                    margin-top: 2rpx;
                    margin-bottom: 2rpx;
                }
            }
        }
    }

    .group {
        padding: 0 30rpx;

        .item {
            border-bottom: 1rpx solid #ededed;
            padding: 46rpx 0;

            .img {
                position: relative;

                .photo {
                    width: 126rpx;
                    height: 126rpx;
                    overflow: hidden;
                    border-radius: 50%;
                    border: 1px solid #f0f0f0;
                }
            }

            .level {
                position: absolute;
                z-index: 2;
                width: 44rpx;
                height: 26rpx;
                right: 0;
                bottom: 0;
            }

            .cpaType,
            .vip {
                margin-left: 12rpx;
                width: 58rpx;
                height: 28rpx;
            }

            &:last-child {
                border: 0;
            }

            .img {
                position: relative;

                .face {
                    width: 108rpx;
                    height: 108rpx;
                    border-radius: 50%;
                    border: 1px solid #f0f0f0;
                    overflow: hidden;
                }

                .c1 {
                    width: 72rpx;
                    height: 30rpx;
                    position: absolute;
                    left: 18rpx;
                    bottom: -8rpx;
                }
            }

            .txt {
                margin-left: 24rpx;

                .name {
                    font-size: 32rpx;
                    color: #333333;
                }

                .type {
                    width: 77rpx;
                    height: 28rpx;
                    margin-left: 10rpx;
                }

                .icon.vv {
                    width: 28rpx;
                    height: 28rpx;
                    margin-left: 10rpx;
                }

                .price {
                    color: #f30719;
                    font-size: 32rpx;
                    margin-right: 10rpx;
                }

                .vipPrice {
                    font-size: 20rpx;
                    color: #ff7c00;
                    background: #fff5eb;
                    border: 1rpx solid #ffddbc;
                    text-align: center;
                    min-width: 103rpx;
                    padding-left: 10rpx;
                    padding-right: 10rpx;
                    height: 36rpx;
                    border-radius: 5rpx;
                    font-size: 20rpx;
                }

                .swsName {
                    color: #666666;
                    margin-top: 26rpx;
                }

                .data {
                    color: #999;
                    font-size: 24rpx;
                    margin-top: 26rpx;
                }

                .sc {
                    border-radius: 0 10rpx 10rpx 0;
                    margin-top: 25rpx;
                    border: 1rpx solid #ededed;

                    .bt {
                        background: #ededed;
                        height: 40rpx;
                        line-height: 40rpx;
                        text-align: center;
                        width: 68rpx;
                    }

                    .ny {
                        color: #999;

                        .i {
                            border-right: 1rpx solid #e5e5e5;
                            padding: 0 13rpx;

                            &:last-child {
                                border: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
