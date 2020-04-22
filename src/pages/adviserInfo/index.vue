<template>
    <div>
        <div class="basic" v-if="us.photo">
            <div class="top fx aifs">
                <div class="img">
                    <div class="photo">
                        <Nimg :src="us.photo" />
                    </div>
                    <div class="level">
                        <Nimg :src="`icons/guwen/c${us.adviserLevel}.png`" />
                    </div>
                </div>
                <div class="right fx1">
                    <div class="t fx">
                        <div class="name">{{us.name}}</div>
                        <div class="cpaType" v-if="us.cpaType != 0 && us.cpaType < 5">
                            <Nimg :src="`icons/guwen/t${us.cpaType}.png`" />
                        </div>
                        <div class="vip" v-if="us.vipCorporate">
                            <Nimg :src="`icons/vip/qy.png`" />
                        </div>
                        <div class="vip" v-else-if="us.vipPersonal">
                            <Nimg :src="`icons/vip/gr.png`" />
                        </div>
                        <div class="fx1"></div>
                        <div class="btn gz" :class="{on:isFollow}" @click="onToggleFollow">
                            <template v-if="isFollow">已关注</template>
                            <template v-else>关注</template>
                        </div>
                    </div>
                    <div class="m fx">
                        <span v-if="us.cpaType == 0">新用户</span>
                        <span v-else-if="us.cpaType == 1">中级会计师</span>
                        <span v-else-if="us.cpaType == 2">高级会计师</span>
                        <span v-else-if="us.cpaType == 3">注册会计师</span>
                        <span v-else-if="us.cpaType == 4">税务师</span>
                        <span>持证{{us.cpaTime}}年</span>
                        <span>{{us.location}}</span>
                    </div>
                    <div class="b fx" v-if="ser">{{ser.serviceName}}</div>
                    <div class="sc">
                        <span v-for="i in us.tags" :key="i">{{i}}</span>
                    </div>
                </div>
            </div>
            <div class="datas fx">
                <div class="item">
                    <div class="num">{{us.countAnswer}}</div>
                    <div class="txt">答题</div>
                </div>
                <div class="item">
                    <div class="num">{{us.fans}}</div>
                    <div class="txt">粉丝</div>
                </div>
                <div class="item">
                    <div class="num">{{us.score}}</div>
                    <div class="txt">评分</div>
                </div>
            </div>
        </div>
        <div class="tabs">
            <van-tabs
                swipeable
                animated
                swipe-threshold="4"
                line-width="18"
                sticky
                @change="onTabChange"
                :offsetTop="0"
            >
                <van-tab :title="'全部回答('+ansNum+')'">
                    <div class="allAnswer">
                        <div class="group" v-if="ansNum>0">
                            <div v-for="i in ansList" :key="i.answerId">
                                <div
                                    class="iitem"
                                    @click="go(i.rewardType!=3?'problemInfo?id='+i.questionId:'whoConsulted?id='+ i.answerId )"
                                >
                                    <div class="quesTitle fx aifs">
                                        <div
                                            class="fl jz fx"
                                            v-if="i.rewardType == 1 || i.rewardType == 3"
                                        >
                                            <div style="width:30rpx;height:30rpx;">
                                                <Nimg src="icons/xianjin.png" />
                                            </div>
                                            {{i.reward}}
                                        </div>
                                        <div class="fl jz fx" v-else-if="i.rewardType == 2">
                                            <div style="width:30rpx;height:30rpx;">
                                                <Nimg src="icons/suanzhu.png" />
                                            </div>
                                            {{i.reward}}
                                        </div>
                                        <div class="multiLineText fx1">{{i.title}}</div>
                                    </div>
                                    <div class="photos fx" v-if="i.photos&&i.photos.length>0">
                                        <img
                                            v-for="(ii,iindex) in i.photos"
                                            :key="iindex"
                                            :src="ii"
                                            mode="aspectFill"
                                        />
                                    </div>
                                    <div class="ans">
                                        <div class="hdz fx">
                                            <div class="fx1 fx">
                                                <img
                                                    :src="i.headUrl?i.headUrl:defaultFace"
                                                    class="face"
                                                    mode="aspectFit"
                                                />
                                                <div class="name">{{i.adviserName}}</div>
                                                <div class="zc">{{i.cpaTypeName}}</div>
                                                <div>回答：</div>
                                            </div>
                                            <div class="fx zan" v-if="i.rewardType!=3">
                                                <div class="num">{{i.zanNum}}</div>
                                                <div class="iconfont icon-dianzan1"></div>
                                            </div>
                                        </div>
                                        <div class="iinfo">
                                            <div class="multiLineText">{{i.intro}}</div>
                                            <div v-if="i.rewardType==3">
                                                <div
                                                    class="szck fx"
                                                    v-if="isIphone"
                                                    style="color:#2F82FF;"
                                                >
                                                    99算珠查看
                                                    <div
                                                        class="iconfont icon-jiantou- fx"
                                                        style="height:60rpx; font-size:50rpx; position:relative; top:4rpx;"
                                                    ></div>
                                                </div>
                                                <div class="fx" style="color:#2F82FF;" v-else>
                                                    1元查看
                                                    <div
                                                        class="iconfont icon-jiantou- fx"
                                                        style="height:60rpx; font-size:50rpx; position:relative; top:4rpx;"
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bot fx" v-if="i.rewardType!=3">
                                        <div class="fx1 left">
                                            {{i.visited}}浏览 ·
                                            <template
                                                v-if="i.answerCount"
                                            >{{i.answerCount}}</template>
                                            <template v-else>{{i.answer_count}}</template>回答
                                        </div>
                                    </div>
                                    <div class="bot fx" v-else>
                                        <div class="fx1 left">
                                            {{i.listenNum}}旁听 ·
                                            {{i.zanNum}}赞
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="noDataWrap" v-if="isLoaded">
                                <div class="fx jcc">
                                    <div class="noData" :style="noData"></div>
                                </div>
                                <div class="text">暂无相关数据</div>
                            </div>
                        </div>
                    </div>
                </van-tab>
                <van-tab :title="'用户评价('+commentNum+')'">
                    <div v-if="commentNum>0" class="userEvaluation">
                        <div
                            class="tab-filter fx DN"
                            :style="isFixed?'position:fixed; width:100%; box-shadow:0 5px 8px rgba(0,0,0,0.06); padding-bottom:30rpx; z-index:99; background:#fff; top:'+(mTop+mHeight+44)+'px':''"
                        >
                            <div class="item" :class="{on:commentLevel == 2}">全部</div>
                            <div class="item" :class="{on:commentLevel == 1}">好评</div>
                            <div class="item" :class="{on:commentLevel == 0}">差评</div>
                        </div>
                        <div class="group">
                            <div class="item" v-for="i in commentList" :key="i.id">
                                <div class="t fx">
                                    <div class="img" v-if="i.photo">
                                        <Nimg :src="i.photo" />
                                    </div>
                                    <div class="img" v-else>
                                        <Nimg src="defaultFace.png" />
                                    </div>
                                    <div class="name">{{i.name}}</div>
                                    <div class="fx1"></div>
                                    <div class="time">{{i.createdAt}}</div>
                                </div>
                                <div class="b multiLineText">{{i.intro}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="noDataWrap" v-if="isLoaded">
                            <div class="fx jcc">
                                <div class="noData" :style="noData"></div>
                            </div>
                            <div class="text">暂无相关数据</div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <div style="height:120rpx;"></div>
        <div class="bottom fx" :class="{isIphone10:isIphone10}">
            <div class="fx1">
                <div class="zxf">
                    咨询费：
                    <span>{{us.consultScorePay}}算珠/次</span>
                </div>
            </div>
            <div class="btn" @click="go(`tiwenNews?type=1&categoryId=${categoryId}&id=${adviserId}`)">咨询Ta</div>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'

export default {
    data() {
        return {
            isLoaded: false,
            adviserId: '',
            us: {},
            commentList: [],
            commentNum: 0,
            ansList: [],
            ansNum: 0,
            isFollow: false,
            currentPage: 1,
            ser: null,
            currentIndex: 0,
            praiseNum: 0,
            negativeNum: 0,
            commentLevel: 2,
            categoryId: ''
        }
    },
    computed: {
        noData() {
            return $.$bg("icons/noData.png")
        },
        isIphone() {
            return $.isIphone()
        },
        isIphone10() {
            return $.isIphoneX()
        }
    },
    methods: {
        go: $.$go,
        onToggleFollow() {
            let base = '/user/focus/adviser/'
            if (this.isFollow) {
                base = '/user/unfocus/adviser/'
            }
            $.$np(`${base}${this.adviserId}`).then(res => {
                if (!res.isError) {
                    this.isFollow = !this.isFollow
                }
            })
        },
        //获取顾问明细
        async usFunc() {
            let url = `/user/adviser/details/${this.adviserId}`
            let { userInfo, serviceInfo } = await $.$$np(url)
            if (typeof userInfo.tags == 'string') {
                userInfo.tags = userInfo.tags.split(',')
            }
            this.us = userInfo
            this.ser = serviceInfo
            this.isFollow = this.us.follow
        },
        //获取评价列表
        async commentsFunc() {
            try {
                let url = `/imconsult/comment/adviser/page?page=${this.currentPage}&pageSize=20`
                let data = {
                    adviserId: this.adviserId,
                    level: this.commentLevel
                }
                if (this.currentPage == 1) {
                    this.commentList = []
                }
                let { list, count } = await $.$np(url, data)
                if (Array.isArray(list)) {
                    list.forEach(ele => {
                        ele.createdAt = $.dateLong2String(ele.createdAt)
                    })
                    this.commentNum = count
                    this.commentList = this.commentList.concat(list)
                }

            } catch (error) {
                $.error(error)
            }

        },
        //获取答案列表
        async ansFunc() {
            try {
                let url = `/imconsult/question/adviserAnswerQuestionList/${this.adviserId}`
                let data = {
                    page: this.currentPage,
                    pageSize: 20
                }
                if (this.currentPage == 1) {
                    this.ansList = []
                }
                let { list, count } = await $.$$np(url, data)
                this.ansNum = count
                this.ansList = this.ansList.concat(list)
            } catch (error) {
                $.error(error)
            }

        },
        // 选项卡切换
        async onTabChange(e) {
            this.currentPage = 1
            this.currentIndex = e.mp.detail.index
            if (this.currentIndex == 0) {
                this.ansFunc()
            } else if (this.currentIndex == 1) {
                this.commentsFunc()
            }
        },
        async init() {
            this.currentPage = 1
            $.showLoading()
            this.usFunc()
            this.commentsFunc()
            this.ansFunc()
            setTimeout(() => {
                this.isLoaded = true
            }, 500)
            $.hideLoading()
        }
    },
    components: {
        Nimg
    },
    async onPullDownRefresh() {
        await this.init()
        wx.stopPullDownRefresh()
    },
    async onReachBottom() {
        if (this.currentPage < this.totalPage) {
            this.currentPage++
            if (this.currentIndex == 0) {
                this.ansFunc()
            } else if (this.currentIndex == 1) {
                this.commentsFunc()
            }
        }
    },
    onLoad(o) {
        this.adviserId = o.id
        if(o.categoryId) {
            this.categoryId = o.categoryId
        }
        this.init()
    }
}
</script>

<style lang="less">
@import "../../less/common.less";
@import "./main.less";
</style>
