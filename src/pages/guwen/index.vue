<template>
    <div>
        <div class="guwen">
            <MiniTop></MiniTop>
            <div class="bang">
                <div class="fx jcc loadingWrap" v-if="isLoading">
                    <van-loading></van-loading>
                </div>
                <div v-else>
                    <div class="title fx">
                        <h3 class="fx1">周排行榜</h3>
                        <div class="rules fx" @click="go('adviserRankingRules')">
                            规则
                            <div class="arrow">
                                <Nimg src="icons/arrow.png"></Nimg>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div
                            class="item"
                            @click="go('adviserRankingList?key=0')"
                            v-if="questions.info"
                        >
                            <div class="tt fx">
                                答题榜NO.1
                                <div class="fx1"></div>
                                <swiper
                                    class="swiper_container"
                                    vertical="true"
                                    autoplay="true"
                                    circular="true"
                                    interval="2000"
                                >
                                    <swiper-item
                                        v-for="(item,index) in questions.list"
                                        :key="index"
                                    >
                                        <span>上周{{item.name}}获得每周答题榜奖励{{item.amount}}元</span>
                                    </swiper-item>
                                </swiper>
                            </div>
                            <div class="bb fx">
                                <div class="fx1 fx">
                                    <div class="img" v-if="questions.info.head_url">
                                        <Nimg :src="questions.info.head_url" />
                                    </div>
                                    <div class="img" v-else>
                                        <Nimg src="defaultFace.png" />
                                    </div>
                                    <div class="wb">
                                        <div class="name fx">
                                            {{questions.info.name}}
                                            <div class="cpaType">
                                                <Nimg
                                                    :src="`icons/guwen/t${questions.info.cpa_type}.png`"
                                                />
                                            </div>
                                        </div>
                                        <div class="ms">
                                            已帮助
                                            <span>{{questions.info.answerer_num}}</span>人解决了问题
                                        </div>
                                    </div>
                                </div>
                                <button
                                    class="btn gz"
                                    :loading="questions.info.isButtonLoading"
                                    :class="{on:questions.info.is_adviser}"
                                    @click.stop="onToggleFollow('questions')"
                                >
                                    <template v-if="questions.info.is_adviser">已关注</template>
                                    <template v-else>关注</template>
                                </button>
                            </div>
                        </div>
                        <div class="item" @click="go('adviserRankingList?key=1')" v-if="adopt.info">
                            <div class="tt fx">
                                采纳榜NO.1
                                <div class="fx1"></div>
                                <swiper
                                    class="swiper_container"
                                    vertical="true"
                                    autoplay="true"
                                    circular="true"
                                    interval="2000"
                                >
                                    <swiper-item v-for="(item,index) in adopt.list" :key="index">
                                        <span>上周{{item.name}}获得每周采纳榜奖励{{item.amount}}元</span>
                                    </swiper-item>
                                </swiper>
                            </div>
                            <div class="bb fx">
                                <div class="fx1 fx">
                                    <div class="img" v-if="adopt.info.head_url">
                                        <Nimg :src="adopt.info.head_url" />
                                    </div>
                                    <div class="img" v-else>
                                        <Nimg src="defaultFace.png" />
                                    </div>
                                    <div class="wb">
                                        <div class="name fx">
                                            {{adopt.info.name}}
                                            <div class="cpaType">
                                                <Nimg
                                                    :src="`icons/guwen/t${adopt.info.cpa_type}.png`"
                                                />
                                            </div>
                                        </div>
                                        <div class="ms">
                                            TA的回答已被
                                            <span>{{adopt.info.answerer_num}}</span>人采纳
                                        </div>
                                    </div>
                                </div>
                                <button
                                    class="btn gz"
                                    :loading="adopt.info.isButtonLoading"
                                    :class="{on:adopt.info.is_adviser}"
                                    @click.stop="onToggleFollow('adopt')"
                                >
                                    <template v-if="adopt.info.is_adviser">已关注</template>
                                    <template v-else>关注</template>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdviserLists :filterTop='120'></AdviserLists>
        </div>
        <compFooter value="3" />
    </div>
</template>




<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import MiniTop from '@/components/MiniTop.vue'
import AdviserLists from '@/components/AdviserLists.vue'
import compFooter from '@/components/compFooter.vue'

let myInviteCode = ''

export default {
    data() {
        return {
            isLoading: true,
            //采纳榜
            adopt: {},
            //收入榜
            income: {},
            // 回答榜
            questions: {},
        }
    },
    computed: {

    },
    onShow() {
        wx.hideTabBar()
    },
    methods: {
        go: $.$go,
        onToggleFollow(type) {
            let obj = $.clone(this[type])
            let info = obj.info
            let id = info.id
            let base = '/user/focus/adviser/'
            if (info.is_adviser) {
                base = '/user/unfocus/adviser/'
            }
            info.isButtonLoading = true
            this[type] = $.clone(obj)
            $.$np(`${base}${id}`).then(res => {
                info.isButtonLoading = false
                if (!res.isError) {
                    info.is_adviser = !info.is_adviser
                }
                this[type] = $.clone(obj)
                this.paihangbang()
            })
        },
        //周排行榜第一名
        async paihangbang() {
            try {
                let { adopt, income, questions } = await $.np('getAnswerListOne')
                let listFilter = (list) => {
                    list.forEach(ele => {
                        if (ele.name) {
                            if (ele.name.length > 6) {
                                ele.name = ele.name.substring(0, 6) + '...'
                            }
                        }
                    })
                }
                if (adopt.list) {
                    listFilter(adopt.list)
                }
                if (questions.list) {
                    listFilter(questions.list)
                }
                this.adopt = adopt
                // this.income = income
                this.questions = questions
                this.isLoading = false


            } catch (error) {
                $.error(error)
            }


        },
        async init() {
            this.paihangbang()
        }
    },
    components: {
        Nimg, compFooter, MiniTop, AdviserLists
    },
    onLoad() {
        $.isLogin(() => {
            //读取自己的邀请码
            let url = 'userCenterData'
            $.np(url).then(res => {
                myInviteCode = res.inviteCode
                $.log('我自己的邀请码' + myInviteCode)
            })
        })
        this.init()
    },
    async onPullDownRefresh() {
        await this.init()
        wx.stopPullDownRefresh()
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        let path = '/pages/index/main?inviteCode=' + myInviteCode
        return {
            title: '财税有难题，就问CPA！',
            path: path,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },
}
</script>

<style lang="less">
@import "./main.less";
</style>
