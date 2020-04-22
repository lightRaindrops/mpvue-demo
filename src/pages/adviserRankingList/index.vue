<template>
    <div>
        <div class="newTabs tabs" v-show="active>-1">
            <van-tabs
                swipeable
                animated
                swipe-threshold="4"
                line-width="18"
                :active="active"
                sticky
                @change="onTabChange"
                :offsetTop="0"
                nav-class="tab-top"
            >
                <van-tab :title="i.title" v-for="(i,ind) in tabs" :key="ind">
                    <section class="adviserRankingList">
                        <div class="tipInfo" v-if="i.scrollInfo&&i.scrollInfo.length>0">
                            <div class="time">上周获奖名单</div>
                            <div class="mj">
                                <swiper
                                    class="swiper_container"
                                    vertical="true"
                                    autoplay="true"
                                    circular="true"
                                    interval="2000"
                                >
                                    <swiper-item v-for="(item,index) in i.scrollInfo" :key="index">
                                        <span>上周{{item.name}}获得周任务榜奖励{{item.amount}}元</span>
                                    </swiper-item>
                                </swiper>
                            </div>
                        </div>

                        <div class="pxList">
                            <div class="item" v-if="i.myInfo&&i.myInfo.rownum>10">
                                <div class="xh"></div>
                                <div class="headImg">
                                    <img mode="widthFix" :src="i.myInfo.head_url" />
                                </div>
                                <div class="name">
                                    <div class="me">{{i.myInfo.name}}</div>
                                    <div class="sort">当前排名{{i.myInfo.rownum}}</div>
                                </div>
                                <div
                                    class="count"
                                >{{i.myInfo.amount || i.myInfo.answerer_num}}{{i.unit}}</div>
                            </div>

                            <div
                                class="item"
                                @click="go('adviserInfo?id='+item.id)"
                                v-for="(item,index) in i.list"
                                :key="index"
                            >
                                <div
                                    class="orderXh"
                                    :class="{'oneXh':index===0,'twoXh':index===1,'threeXh':index===2}"
                                    v-if="index<=2"
                                ></div>
                                <div class="orderXh" v-if="index>=3">{{index+1}}</div>
                                <div class="headImg">
                                    <img mode="widthFix" :src="item.head_url" />
                                </div>
                                <div class="name">
                                    <div class="order">{{item.name}}</div>
                                </div>
                                <div class="count">{{item.amount||item.answerer_num}}{{i.unit}}</div>
                            </div>
                        </div>
                    </section>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
export default {
    name: 'cwShareSort',
    data() {
        return {
            active: 0,
            tabs: [
                {
                    scrollInfo: [],//上面滚动的信息
                    list: [],//任务排行榜数据
                    myInfo: {},//自己的信息
                    title: '答题榜',
                    unit: '个解答'
                },
                {
                    scrollInfo: [],
                    list: [],
                    myInfo: {},
                    title: '采纳榜',
                    unit: '个采纳'
                },
            ]

        }
    },
    onLoad(o) {
        this.active = Number(o.key)
        this.init()
    },
    methods: {
        async init() {
            try {
                // $.showLoading()
                //设置标题
                {
                    let title = this.tabs[this.active].title
                    wx.setNavigationBarTitle({
                        title
                    })
                }

                let activeTab = this.tabs[this.active]
                let type = Number(this.active) + 1

                let res = await $.np('getAnswerList', { type: type })

                $.log('res', res)

                this.$set(activeTab, 'scrollInfo', res.period)
                this.$set(activeTab, 'myInfo', res.info)
                this.$set(activeTab, 'list', res.list)

                $.log(this.tabs)


                $.hideLoading()
            } catch (error) {
                $.error(error)
            }
        },
        go: $.$go,
        //切换列表
        onTabChange(e) {
            let index = e.mp.detail.name
            this.active = index
            $.log(this.active)
            this.init()
        },
    },
    onPullDownRefresh() {
        this.init().then(() => {
            wx.stopPullDownRefresh()
        })
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
