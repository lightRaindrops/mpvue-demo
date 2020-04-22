<template>
    <div v-if="isLoaded">
        <div class="bg">
            <img :src="userCenterBg" alt mode="aspectFit" />
        </div>
        <div class="main">
            <a
                :href="isLogin?'../feedback/main':'../userLogin/main?key=userCenter'"
                class="feedbackBtn fx"
                hover-class="none"
            >
                <div class="img"></div>意见反馈
            </a>
            <div class="top">
                <a href="../userLogin/main?key=userCenter" class="one fx" v-if="!isLogin">
                    <div class="img">
                        <img
                            :src="defaultFace"
                            class="Face"
                            style="width:100%;"
                            alt
                            mode="aspectFit"
                        />
                    </div>
                    <div class="txt">注册/登录</div>
                </a>
                <div v-else-if="us" class="one fx" @click="toSetPage">
                    <div class="img">
                        <img
                            :src="us.photo"
                            style="width:100%;"
                            class="userPhoto"
                            alt
                            mode="aspectFill"
                        />
                        <img v-if="isLogin && levelIcon" :src="levelIcon" class="level" />
                    </div>
                    <div class="user">
                        <div class="txt name">
                            <span>{{us.name}}</span>
                            <div class="vip">
                                <img v-if="us.vipPersonal" :src="gr" alt />
                                <img v-if="us.vipCorporate" :src="qy" alt />
                            </div>
                        </div>
                        <!-- <div class="level">L{{us.level}}</div> -->
                        <div v-if="us.followAdviserNum || us.fans" class="person">
                            <span
                                v-if="us.followAdviserNum && us.followAdviserNum>0"
                            >关注 {{us.followAdviserNum}}</span>
                            <span v-if="us.fans && isAdviser">粉丝 {{us.fans}}</span>
                        </div>
                    </div>
                </div>

                <div class="account fx" v-if="isLogin">
                    <a
                        :href="isLogin?'../web/main?src=h5/task_center':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <img :src="suanzhu" alt mode="widthFix" />
                        <div v-if="us.score && us.signStatus == 1" class="txt">{{us.score}}算珠</div>
                        <div v-if="us.signStatus == 0" class="txt">签到</div>
                    </a>
                </div>

                <div class="vip-center">
                    <a href="../webVip/main?src=h5/vip" class="item" hover-class="none">
                        <img :src="vipCenter" alt mode="aspectFit" />
                    </a>
                </div>

                <div class="quick fx">
                    <a
                        :href="isLogin?'../problemManagement/main?key=1':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="wdzx" alt mode="aspectFit" />
                            <template v-if="us.questionUnreadCount&&us.questionUnreadCount>0">
                                <span class="msg-count"></span>
                                <!-- <span class="msg-count">{{us.questionUnreadCount>99?'99+':us.questionUnreadCount}}</span> -->
                            </template>
                        </div>
                        <div class="txt">我的咨询</div>
                    </a>
                    <a
                        :href="isLogin?'../problemManagement/main?key=2':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="wdhd" alt mode="aspectFit" />
                            <template v-if="us.adviserUnreadCount&&us.adviserUnreadCount>0">
                                <span class="msg-count"></span>
                                <!-- <span class="msg-count">{{us.adviserUnreadCount>99?'99+':us.adviserUnreadCount}}</span> -->
                            </template>
                        </div>
                        <div class="txt">我的回答</div>
                    </a>

                    <a
                        :href="isLogin?'../web/main?src=h5/downapp':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="wdkc" alt mode="aspectFit" />
                        </div>
                        <div class="txt">我的课程</div>
                    </a>

                    <a
                        :href="isLogin?'../web/main?src=h5/job_yh/sendCollect':'../userLogin/main?key=userCenter'"
                        class="item"
                    >
                        <div class="img">
                            <img :src="wdqz" alt mode="aspectFit" />
                        </div>
                        <div class="txt">我的求职</div>
                    </a>
                </div>
                <div
                    class="invite"
                    v-if="isLogin && us.invitationUnreadCount&& us.invitationUnreadCount>0"
                >
                    <a
                        :href="isLogin?'../problemManagement/main?key=0':'../userLogin/main?key=userCenter'"
                        class="item fx"
                    >
                        <div class="left fx">
                            <img :src="tip" alt mode="aspectFit" />
                            <span>收到 {{us.invitationUnreadCount}} 条邀请</span>
                        </div>
                        <div class="right">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                </div>
            </div>
            <div class="boxGrey">
                <div class="list">
                    <a
                        :href="isLogin?'../recharge/main':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">我的钱包</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                    <a
                        :href="isLogin?'../myCoupon/main':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">我的优惠券</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                    <a
                        :href="isLogin?'../voucherCenter/main':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">领券中心</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                </div>
                <div class="list">
                    <a
                        :href="isLogin?'../inviteFriend/main':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">邀请好友</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                    <a
                        :href="isLogin?'../inviteConsultants/main':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">邀请顾问</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                </div>

                <div class="list">
                    <a
                        :href="isLogin?'../web/main?src=h5/sz_mall/index':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">
                            算珠商城
                            <!-- <img :src="o" alt mode="aspectFit" /> -->
                        </div>

                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>

                    <a
                        :href="isLogin?'../activityCenter/main':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">活动中心</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                    <a
                        :href="isLogin?'../web/main?src=h5/vip/cardCenter':'../userLogin/main?key=userCenter'"
                        class="item fx"
                        hover-class="none"
                    >
                        <div class="txt">会员福利</div>
                        <div class="arrow">
                            <img :src="arrow" alt mode="aspectFit" />
                        </div>
                    </a>
                </div>

                <div class="list">
                    <template
                        v-if="userData.isApplying==false && userData.isExamine == 0 && isLogin"
                    >
                        <a
                            :href="isLogin?'../becomeConsultant/main':'../userLogin/main?key=userCenter'"
                            class="item fx"
                            hover-class="none"
                        >
                            <div class="txt">顾问入驻</div>
                            <div class="arrow">
                                <span class="state">立即认证</span>
                                <img :src="arrow" alt mode="aspectFit" />
                            </div>
                        </a>
                    </template>
                    <!-- 显示审核中 -->
                    <template
                        v-else-if="userData.isExamine==0 && userData.isApplying==true && isLogin "
                    >
                        <a href="javascript:;" class="item fx" hover-class="none">
                            <div class="txt">顾问入驻</div>
                            <div class="arrow">
                                <span class="state">审核中</span>
                                <img :src="arrow" alt mode="aspectFit" />
                            </div>
                        </a>
                    </template>
                    <!-- 失败显示申请按钮 -->
                    <template v-else-if="userData.isExamine==2 && isLogin">
                        <a
                            :href="isLogin?'../joinStep1/main':'../userLogin/main?key=userCenter'"
                            class="item fx"
                            hover-class="none"
                        >
                            <div class="txt">顾问入驻</div>
                            <div class="arrow">
                                <span class="state">审核未通过</span>
                                <img :src="arrow" alt mode="aspectFit" />
                            </div>
                        </a>
                    </template>

                    <!-- 抽奖 -->
                    <template v-else-if="userData.lotteryNum>0 && userData.isAdviser && isLogin">
                        <a
                            :href="isLogin?'../joinStep4/main':'../userLogin/main?key=userCenter'"
                            class="item fx"
                            hover-class="none"
                        >
                            <div class="txt">顾问入驻</div>
                            <div class="arrow">
                                <span class="state">立即抽奖</span>
                                <img :src="arrow" alt mode="aspectFit" />
                            </div>
                        </a>
                    </template>
                    <!-- </div> -->
                </div>

                <div class="list">
                    <button
                        class="item fx"
                        style="text-align:left; border-radius:0;"
                        open-type="contact"
                    >
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
            quickList: [],
            levelIcon: false,
            userData: {},
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
        defaultFace() {
            return $.$img('defaultFace.png')
        },
        arrow() {
            return $.$img('icons/arrow.png')
        },
        gr() {
            return $.$img('icons/vip/gr.png')
        },
        qy() {
            return $.$img('icons/vip/qy.png')
        },
        userCenterBg() {
            return $.$img('userCenterBg.png')
        },
        wdzx() {
            return $.$img('icons/NewCenter/wdzx.png')
        },
        wdhd() {
            return $.$img('icons/NewCenter/wdhd.png')
        },
        wdkc() {
            return $.$img('icons/NewCenter/wdkc.png')
        },
        wdqz() {
            return $.$img('icons/NewCenter/wdqz.png')
        },
        vipCenter() {
            return $.$img('icons/NewCenter/vipCenter.png')
        },
        tip() {
            return $.$img('icons/NewCenter/tip.gif')
        },
        szbg() {
            return $.$img('icons/NewCenter/szbg.png')
        },
        suanzhu() {
            return $.$img('icons/NewCenter/suanzhu.gif')
        },
        o() {
            return $.$img('icons/NewCenter/o.png')
        }
    },
    components: {
        compFooter
    },
    methods: {
        go: $.$go,
        async init() {

            //  登陆成功
            let loginSuc = () => {
                this.isLogin = true
                $.isIndexRefresh = true
                Promise.all([
                    $.$$np('/user/info/relevant'),
                    // $.np('leftMoneyOne'),
                    $.np('userCenterData'),
                ]).then(arr => {
                    this.us = arr[0]
                    this.userData = arr[1]
                    // console.log(this.userData);
                    let { userLevel } = this.us
                    this.levelIcon = $.$img(`icons/level/l${userLevel}.png`)
                    // this.balance = arr[1].money
                })
            }

            //  登陆失败
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
        //  去设置页
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


