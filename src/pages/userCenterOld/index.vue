<template>
    <div v-if="isLoaded">
        <div class="bg">
            <img :src="userCenterTopBg" style="width:100%;" alt mode="widthFix" />
        </div>
        <div class="main">
            <a
                :href="isLogin?'../feedback/main':'../userLogin/main?key=userCenter'"
                class="feedbackBtn fx"
                hover-class="none"
            >
                <div class="img">
                    <Nimg src="icons/feedback.png" />
                </div>意见反馈
            </a>
            <div class="top">
                <a href="../userLogin/main?key=userCenter" class="one fx" v-if="!isLogin">
                    <div class="img">
                        <img :src="defaultFace" style="width:100%;" alt mode="widthFix" />
                    </div>
                    <div class="txt">注册/登录</div>
                </a>
                <div v-else-if="userData" class="one fx" @click="toSetPage">
                    <div class="img">
                        <img :src="userData.photo" style="width:100%;" alt mode="widthFix" />
                    </div>
                    <div
                        v-if="us.memberType == 'personal_member' || us.memberType == 'corporate_member'"
                    >
                        <div class="txt name fx">
                            {{userData.name}}
                            <div class="vip">VIP</div>
                            <div
                                v-if="!isIphone && us.memberType != 'corporate_member'"
                                @click.stop="go('webVip?src=h5/vip')"
                                class="xvfei"
                                hover-active="none"
                            >续费</div>
                        </div>
                        <div class="level">L{{us.level}}</div>
                    </div>
                    <div v-else-if="us.memberType == ''">
                        <div class="txt name fx">
                            {{userData.name}}
                            <div
                                v-if="!isIphone"
                                @click.stop="go('webVip?src=h5/vip')"
                                class="xvfei"
                                hover-active="none"
                            >开通会员</div>
                        </div>
                        <div class="level">L{{us.level}}</div>
                    </div>
                </div>
                <div class="two fx">
                    <div class="fx1 left fx">
                        <a
                            :href="isLogin?'../recharge/main':'../userLogin/main?key=userCenter'"
                            class="item fx1"
                            hover-class="none"
                        >
                            <div class="num">{{balance}}</div>
                            <div class="txt">钱包</div>
                        </a>

                        <a
                            :href="isLogin?'../countingBeads/main':'../userLogin/main?key=userCenter'"
                            class="item fx1"
                            hover-class="none"
                        >
                            <div class="num" v-if="us.score">{{us.score}}</div>
                            <div class="num" v-else>0</div>
                            <div class="txt">算珠</div>
                        </a>
                    </div>
                    <div class="bd"></div>
                    <a
                        :href="isLogin?'../web/main?src=h5/task_center':'../userLogin/main?key=userCenter'"
                        class="right"
                        :class="{on:us.is_sign == 1}"
                        hover-class="none"
                    >
                        <div class="img">
                            <img :src="sign" style="width:100%;" alt mode="widthFix" />
                        </div>
                        <div v-if="us.is_sign == 1" class="txt">已签到</div>
                        <div v-else class="txt">签到领算珠</div>
                    </a>
                </div>
            </div>
            <div class="boxGrey">
                <div class="quick fx">
                    <a
                        :href="isLogin?'../problemManagement/main?key=0':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="twwd" alt mode="aspectFit" />
                            <template v-if="us.questionMeCount>0">
                                <span
                                    class="xys"
                                    v-if="us.questionMeCount<10"
                                >{{us.questionMeCount}}</span>
                                <span class="dys" v-else>{{us.questionMeCount}}</span>
                            </template>
                        </div>
                        <div class="txt">提问我的</div>
                    </a>
                    <a
                        :href="isLogin?'../problemManagement/main?key=1':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="wdtw" alt mode="aspectFit" />
                            <template v-if="us.questionCount>0">
                                <span class="xys" v-if="us.questionCount<10">{{us.questionCount}}</span>
                                <span class="dys" v-else>{{us.questionCount}}</span>
                            </template>
                        </div>
                        <div class="txt">我的提问</div>
                    </a>
                    <a
                        :href="isLogin?'../problemManagement/main?key=2':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="whdd" alt mode="aspectFit" />
                            <template v-if="us.answerAdoptCount>0">
                                <span
                                    class="xys"
                                    v-if="us.answerAdoptCount<10"
                                >{{us.answerAdoptCount}}</span>
                                <span class="dys" v-else>{{us.answerAdoptCount}}</span>
                            </template>
                        </div>
                        <div class="txt">我回答的</div>
                    </a>
                    <a
                        :href="isLogin?'../problemManagement/main?key=3':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="wdpt" alt mode="aspectFit" />
                        </div>
                        <div class="txt">我的旁听</div>
                    </a>
                </div>
                <div class="rzgw fx" v-if="!us.isAdviser&&isLogin">
                    <!--显示申请按钮 -->
                    <template v-if="us.isApplying==false && us.isExamine == 0">
                        <div class="fx1 fx">
                            <div class="bt">认证成为顾问</div>
                            <div class="ms">答题赚佣金</div>
                        </div>
                        <a
                            :href="isLogin?'../becomeConsultant/main':'../userLogin/main?key=userCenter'"
                            class="btn"
                        >立即认证</a>
                    </template>
                    <!-- 显示审核中 -->
                    <template v-else-if="us.isExamine==0&&us.isApplying==true">
                        <div class="fx1 fx">
                            <div class="bt">认证成为顾问</div>
                            <div class="ms">资料已经成功提交，审核中...</div>
                        </div>
                    </template>
                    <!--失败显示申请按钮 -->
                    <template v-else-if="us.isExamine==2">
                        <div class="fx1 fx">
                            <div class="bt">认证成为顾问</div>
                            <div class="ms">审核被驳回...</div>
                        </div>
                        <a
                            :href="isLogin?'../joinStep1/main':'../userLogin/main?key=userCenter'"
                            class="btn"
                        >修改资料</a>
                    </template>
                </div>
                <div
                    class="rzgw fx"
                    v-else-if="us.lotteryNum>0 && us.lotteryRecordNum==0 && step>0"
                >
                    <div class="fx1 fx">
                        <div class="bt">认证成为顾问</div>
                        <div class="ms">审核已通过</div>
                    </div>
                    <a
                        :href="isLogin?'../joinStep4/main':'../userLogin/main?key=userCenter'"
                        class="btn"
                    >立即抽奖</a>
                </div>
                <div class="swiper wrap">
                    <div class="inner">
                        <div class="loadingWrap" v-show="isLoading">
                            <van-loading size="15px" />
                            <span class="txt">正在加载</span>
                        </div>
                        <swiper
                            :indicator-dots="true"
                            :autoplay="true"
                            :interval="5000"
                            :duration="400"
                            :circular="true"
                            :style="{height:128+'rpx'}"
                            indicator-active-color="#fff"
                            indicator-color="rgba(255, 255, 255, .3)"
                        >
                            <swiper-item v-for="(item, index) in swiper" :key="index">
                                <a :href="item.url">
                                    <img
                                        class="img"
                                        :src="item.src"
                                        :style="{width:'690rpx',height:'128rpx'}"
                                    />
                                </a>
                            </swiper-item>
                        </swiper>
                    </div>
                </div>
                <div class="menus fx">
                    <a href="../webVip/main?src=h5/vip" class="item" hover-class="none">
                        <div class="icon">
                            <img :src="hyzx" alt mode="aspectFit" />
                            <span class="ustag01"></span>
                        </div>
                        <div class="txt">会员中心</div>
                    </a>
                    <a
                        class="item"
                        :href="isLogin?'../web/main?src=h5/task_center':'../userLogin/main?key=userCenter'"
                        hover-class="none"
                    >
                        <div class="icon">
                            <img :src="rwzx" alt mode="aspectFit" />
                        </div>
                        <div class="txt">任务中心</div>
                    </a>
                    <a
                        class="item DN"
                        hover-class="none"
                        :href="isLogin?'../cwShare/main':'../userLogin/main?key=userCenter'"
                    >
                        <div class="icon">
                            <img :src="fxcb" alt mode="aspectFit" />
                            <span class="ustag02"></span>
                        </div>
                        <div class="txt">分享冲榜</div>
                    </a>
                    <a
                        :href="isLogin?'../web/main?src=h5/sz_mall/index':'../userLogin/main?key=userCenter'"
                        class="item"
                        hover-class="none"
                    >
                        <div class="icon">
                            <img :src="szsc" alt mode="aspectFit" />
                        </div>
                        <div class="txt">算珠商城</div>
                    </a>
                    <a
                        :href="isLogin?'../inviteFriend/main':'../userLogin/main?key=userCenter'"
                        class="item"
                        hover-class="none"
                    >
                        <div class="icon">
                            <img :src="yqhy" alt mode="aspectFit" />
                        </div>
                        <div class="txt">邀请好友</div>
                    </a>
                    <a
                        :href="isLogin?'../inviteConsultants/main':'../userLogin/main?key=userCenter'"
                        class="item"
                        hover-class="none"
                    >
                        <div class="icon">
                            <img :src="yqgw" alt mode="aspectFit" />
                            <span class="ustag03"></span>
                        </div>
                        <div class="txt">邀请顾问</div>
                    </a>
                    <a
                        :href="isLogin?'../activityCenter/main':'../userLogin/main?key=userCenter'"
                        class="item"
                        hover-class="none"
                    >
                        <div class="icon">
                            <img :src="hdzx" alt mode="aspectFit" />
                        </div>
                        <div class="txt">活动中心</div>
                    </a>
                </div>
                <div class="list">
                    <a
                        :href="isLogin?i.url:'../userLogin/main?key=userCenter'"
                        class="item fx"
                        v-for="(i,index) in quickList"
                        :key="index"
                        hover-class="none"
                    >
                        <div class="icon fx">
                            <img :src="i.image" alt mode="aspectFit" />
                        </div>
                        <div class="txt">{{i.name}}</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                    <button
                        class="item fx"
                        style="text-align:left; border-radius:0;"
                        open-type="contact"
                    >
                        <div class="icon fx">
                            <img :src="lxkf" alt mode="aspectFit" />
                        </div>
                        <div class="txt">联系客服</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </button>
                    <a
                        :href="isLogin?'../setting/main?isAdviser='+us.isAdviser:'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="icon fx">
                            <img :src="sz" alt mode="aspectFit" />
                        </div>
                        <div class="txt">设置</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <compFooter value="4" />
    </div>
</template>

<style lang="less">
@import "../../less/common.less";
@import "./main.less";
</style>

<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import compFooter from '@/components/compFooter.vue'

export default {
    data() {
        return {
            us: {},
            step: -1,
            isLogin: false,
            isLoaded: false,
            isIphone: $.isIphone(),
            swiper: [],
            balance: 0,
            quickList: []
        }
    },
    computed: {
        userData() {
            let v = {}
            if (this.us.userData) {
                v = this.us.userData
            }
            return v
        },
        userCenterTopBg() {
            return $.$img('userCenterTopBg.png')
        },
        defaultFace() {
            return $.$img('defaultFace.png')
        },
        arrow() {
            return $.$img('icons/arrow.png')
        },
        sign() {
            return $.$img('icons/sign.png')
        },
        twwd() {
            return $.$img('icons/twwd.png')
        },
        wdtw() {
            return $.$img('icons/wdtw.png')
        },
        whdd() {
            return $.$img('icons/whdd.png')
        },
        wdgz() {
            return $.$img('icons/wdgz.png')
        },
        wdpt() {
            return $.$img('icons/wdpt.png')
        },
        hyzx() {
            return $.$img('icons/menu/hyzx.png')
        },
        rwzx() {
            return $.$img('icons/menu/rwzx.png')
        },
        fxcb() {
            return $.$img('icons/menu/fxcb.png')
        },
        szsc() {
            return $.$img('icons/menu/szsc.png')
        },
        yqhy() {
            return $.$img('icons/menu/yqhy.png')
        },
        yqgw() {
            return $.$img('icons/menu/yqgw.png')
        },
        pthd() {
            return $.$img('icons/menu/pthd.png')
        },
        hdzx() {
            return $.$img('icons/menu/hdzx.png')
        },
        yjfk() {
            return $.$img('icons/yjfk.png')
        },
        sz() {
            return $.$img('icons/sz.png')
        },
        jfgl() {
            return $.$img('jfgl.png')
        },
        lxkf() {
            return $.$img('icons/lxkf.png')
        },

    },
    components: {
        compFooter, Nimg
    },
    methods: {
        go: $.$go,
        async init() {
            let loginSuc = () => {
                this.isLogin = true
                $.isIndexRefresh = true
                Promise.all([
                    $.np('userCenterData'),
                    $.np('leftMoneyOne'),
                ]).then(arr => {
                    this.us = arr[0]
                    this.balance = arr[1].money
                })
            }

            let loginFail = () => {
                this.us = {}
                this.balance = 0
                this.isLogin = false
            }

            //获取评分banner
            $.np('getBanner').then(res => {
                this.swiper = res
            })

            //获取quickList
            $.np('getSmallList', { type: 2 }).then(res => {
                if (!res.isError) {
                    this.quickList = res
                }
            })

            $.isLogin(loginSuc, loginFail)



        },
        toSetPage() {
            $.go('../personalInfo/main')
        },
    },
    onLoad(o) {
    },
    onShow() {
        wx.hideTabBar()

        $.isRefresh = false

        this.isLoaded = true
        $.showLoading()
        this.init().then(res => {
            $.hideLoading()
        })

        if ($.isGo == 'vip-h5') {
            $.isGo = ''
            $.go('/pages/webVip/main?src=h5/vip')
        }
    },
    onPullDownRefresh() {
        this.init().then(() => {
            wx.stopPullDownRefresh()
        })
    }
}
</script>


