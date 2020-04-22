<template>
    <div>
        <div class="tabs fx jcc">
            <div
                class="tab"
                :class="{'act':currentTab==index}"
                v-for="(i,index) in tabs"
                :key="i.id"
                @click="tab(index)"
            >
                <div class="fx jcc">
                    <div class="dian mr18" v-if="i.dian"></div>
                    {{i.text}}
                </div>
                <div class="short"></div>
            </div>
        </div>
        <div style="height:90rpx;"></div>
        <div>
            <div class="fx jcc" v-if="isLoading" style="padding:100rpx;">
                <van-loading></van-loading>
            </div>
            <div v-if="currentTab == 0">
                <div v-if="twwd[0]" class="list twwd">
                    <div
                        v-for="i in twwd"
                        :key="i.id"
                        class="item"
                        :class="{DN:i.question_type != 2}"
                    >
                        <div
                            @click="go((i.status == 3 || i.status == 0)?'':'../problemInfo/main?id='+i.id+'&source=my')"
                        >
                            <div class="bt fx aifs">
                                <div class="mr18 mt18" v-if="i.is_answer == 1 && i.status != 3">
                                    <div class="dian"></div>
                                </div>
                                <div>{{i.title}}</div>
                            </div>
                            <div class="bc fx">
                                <div class="fx1 fx left">
                                    {{i.created_at}}·
                                    <div class="fx">
                                        <div class="wz">{{i.answer_count}}回答</div>
                                    </div>
                                </div>
                                <div class="status" v-if="i.status == 0">未付款</div>
                                <div class="status fx red" v-else-if="i.status==1&&i.left_time>0">
                                    <fan-count-down :fantime="i.left_time"></fan-count-down>后关闭
                                </div>
                                <div class="status" v-else-if="i.status == 2">已解答</div>
                                <div class="status" v-else-if="i.status == 3">已失效</div>
                                <div
                                    class="status green"
                                    v-else-if="i.status == 4 || i.status == 5"
                                >已完成</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="!isAdviser&&!isLoading">
                        <div class="bsgwWrap">
                            <div class="fx jcc">
                                <div class="bsgw" :style="bsgw"></div>
                            </div>
                            <div class="text">您还不是顾问，赶快去认证成为顾问吧~</div>
                            <a href="../becomeConsultant/main" class="btn">去认证顾问</a>
                        </div>
                    </div>
                    <div v-else-if="!isLoading" class="noDataWrap">
                        <div class="fx jcc">
                            <div class="noData" :style="noData"></div>
                        </div>
                        <div class="text">暂无相关数据</div>
                    </div>
                </div>
            </div>
            <div v-else-if="currentTab == 1">
                <div v-if="wdtw[0]" class="list wdtw">
                    <div
                        @click="go((i.status == 3)?'../problemInfo/main?id='+i.id + '&source=expired':'../problemInfo/main?id='+i.id)"
                        v-for="i in wdtw"
                        class="item"
                        :class="{DN:i.question_type == 3}"
                        :key="i.id"
                    >
                        <div class="bt fx aifs">
                            <div class="mr18 mt18" v-if="i.is_notice==1">
                                <div class="dian"></div>
                            </div>
                            <div :class="{grey:i.status == 3}">{{i.title}}</div>
                        </div>
                        <div class="bc fx">
                            <div class="fx1 fx left">
                                {{i.created_at}}·
                                <div class="fx">
                                    <div class="wz">{{i.answer_count}}回答</div>
                                </div>
                            </div>
                            <!--免费问答-->
                            <span class="status" v-if="i.question_type==1">
                                <span v-if="i.status == 1" class="dhd red">待回答</span>
                                <span v-else-if="i.status == 4" class="dhd green">已完成</span>
                                <span v-else-if="i.status == 3" class="ygb">已失效</span>
                                <span v-else-if="i.status == 2" class="red">
                                    <span
                                        @click.stop="go('../problemInfo/main?id='+i.id)"
                                        class="red"
                                    >去采纳</span>
                                </span>
                            </span>
                            <!--图文咨询-->
                            <span class="status" v-if="i.question_type==2">
                                <span v-if="i.status == 1" class="dhd red">
                                    <template v-if="i.answer_count == 0">
                                        <span style="float:left">等待回答</span>
                                        <fan-count-down :fantime="i.left_time" style="float:left"></fan-count-down>后关闭
                                    </template>
                                    <template v-else>
                                        <span
                                            @click.stop="go('../problemInfo/main?id='+i.id)"
                                            class="red"
                                        >去采纳</span>
                                    </template>
                                </span>

                                <span v-else-if="i.status == 4">
                                    <span
                                        @click.stop="go('../problemInfo/main?id='+i.id)"
                                        class="red"
                                    >去评价</span>
                                </span>
                                <span v-else-if="i.status == 3" class="ygb">已失效</span>
                                <span v-else-if="i.status == 5" class="ygb green">已完成</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else-if="!isLoading" class="noDataWrap">
                    <div class="fx jcc">
                        <div class="noData" :style="noData"></div>
                    </div>
                    <div class="text">您还没有提问过任何问题呢~</div>
                    <div class="fx jcc">
                        <a href="../tiwenNew/main" class="btn DB">我也要提问</a>
                    </div>
                    <div class="fx jcc mt18">
                        <a href="../ptList_new/main" class="DB">查看精选问题</a>
                    </div>
                </div>
            </div>
            <div v-else-if="currentTab == 2">
                <div v-if="wdhd[0]" class="list wdhd">
                    <div
                        @click="go('../problemInfo/main?id='+i.question_id)"
                        v-for="i in wdhd"
                        :key="i.id"
                        class="item"
                        :class="{DN:i.question_type == 3}"
                    >
                        <div class="bt fx aifs">
                            <div class="mr18 mt18" v-if="i.is_adopt_notice == 1">
                                <div class="dian"></div>
                            </div>
                            <div>{{i.title}}</div>
                        </div>
                        <div class="bc fx">
                            <div class="fx1 fx left">
                                {{i.mintime}}
                                <!-- · -->
                                <!-- <div class="fx">
                                        <div class="wz red">您有1条追问</div>
                                </div>-->
                            </div>
                            <div class="status grey" v-if="i.answer_status == 1">已解答</div>
                            <div class="status orange" v-else-if="i.answer_status == 2">被采纳</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="!isLoading" class="noDataWrap">
                    <div class="fx jcc">
                        <div class="noData" :style="noData"></div>
                    </div>
                    <div class="text">您还没有回答过任何问题呢~</div>
                    <div class="fx jcc">
                        <a href="../ptList_new/main" class="btn DB">查看精选问题</a>
                    </div>
                </div>
            </div>
            <div v-else-if="currentTab == 3">
                <div v-if="wdpt[0]" class="list wdpt">
                    <div
                        v-for="(i,index) in wdpt"
                        :key="index"
                        @click="toWhoConsulted(i.id)"
                        class="item DB"
                    >
                        <div class="quesTitle cx">
                            <div class="fl jz">价值￥{{i.consult_pay}}</div>
                            {{i.question_title}}
                        </div>
                        <div class="ans">
                            <div class="hdz fx">
                                <div class="img">
                                    <img
                                        v-if="i.head_url"
                                        :src="i.head_url"
                                        class="face"
                                        mode="aspectFit"
                                    />
                                    <img v-else :src="defaultFace" class="face" mode="aspectFit" />
                                </div>
                                <div class="name">{{i.name}}</div>
                                <div class="zc">{{i.cpa_type}}</div>
                                <div>回答：</div>
                            </div>
                            <div class="iinfo">{{i.intro}}</div>
                        </div>
                        <div class="bot fx">
                            <div class="fx1 left">{{i.listen_num}}旁听 · {{i.zan}}赞同</div>
                            <div class="btn share DN" @click.stop="showShareBottom(i)">立即分享</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="!isLoading" class="noDataWrap">
                    <div class="fx jcc">
                        <div class="noData" :style="noData"></div>
                    </div>
                    <div class="text">您还没有旁听任何问题呢~</div>
                    <div class="fx jcc">
                        <a href="../ptList_new/main" class="btn DB">去旁听</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import $ from '@/common'

export default {
    name: 'app',
    data() {
        return {
            tabs: [{ text: '提问我的', dian: false, id: 'tab1' }, { text: '我的咨询', dian: false, id: 'tab2' }, { text: '我的回答', dian: false, id: 'tab3' }, { text: '我的旁听', dian: false, id: 'tab4' }],
            isAdviser: false,
            page: 0,
            twwd: [],
            wdtw: [],
            currentTab: 0,
            wdhd: [],
            wdpt: [],
            scrollTopx: 0,
            scrollTopy: 0,
            lock: false,
            isOnload: false,
            isLoading: true
        }
    },
    computed: {
        defaultFace() {
            return $.$img("defaultFace.png")
        },
        noData() {
            return $.$bg("icons/noData.png")
        },
        bsgw() {
            return $.$bg("problemManagement/bsgw.png")
        },
    },
    onLoad(o) {
        this.currentTab = o.key
        this.isOnload = true
        $.np('isLogin').then(res => {
            if (!res.isLogin) {
                let url = $.pageUrl('userCenter') + '?to=userLogin'
                $.reLaunch(url)
            } else {
                $.np('userCenterData').then(res => {
                    this.isAdviser = res.isAdviser
                })

                this.init()

            }
        })
    },
    onHide() {
        this.isOnload = false
    },
    onShow() {
        if (!this.isOnload) {
            if ($.isPingLunSuccess == true || $.isRefresh == true || $.isProblemManagementRefresh) {
                $.isRefresh = false
                $.isProblemManagementRefresh = false
                $.isPingLunSuccess = false
                this.init()
            }
        }
    },
    onPullDownRefresh() {
        this.init().then(() => {
            wx.stopPullDownRefresh()
        })
    },
    onReachBottom() {
        this.nextPage()
    },

    methods: {
        toWhoConsulted(id) {
            wx.navigateTo({
                url: '../whoConsulted/main?id=' + id
            })
        },
        share() {

        },
        tab(index) {
            this.currentTab = index
            this.init()
            $.goTop()
        },
        go(url) {
            if (url) {
                $.go(url)
            }
        },
        getList(url) {
            let data = { page: this.page }
            if (url == 'listenList') {
                data.is_pay = 1
            }
            return $.np(url, data).then(res => {
                let list = res.list
                return list
            })
        },
        async init() {
            this.page = 0
            this.lock = false
            this.isLoading = true
            await this.nextPage()
            this.isLoading = false
        },
        nextPage() {
            let s
            let g
            let t = this.currentTab
            if (t == 0) {
                s = 'myReceiveQuestion'
                g = 'twwd'
            } else if (t == 1) {
                s = 'myQuestions'
                g = 'wdtw'
            } else if (t == 2) {
                s = 'myAnswers'
                g = 'wdhd'
            } else if (t == 3) {
                s = 'listenList'
                g = 'wdpt'
            }

            if (this.lock) {
                return
            }

            return this.getList(s).then(list => {
                if (list.length > 0) {
                    if (this.page == 0) {
                        this[g] = list
                    } else {
                        this[g] = this[g].concat(list)
                    }

                    if (list.length == 20) {
                        this.page++
                    } else {
                        this.lock = true
                    }
                } else {
                    this[g] = []
                    this.lock = true
                }

            })

        }
    },

}
</script>

<style lang="less">
@import "../../less/common.less";
@import "./main.less";
</style>
