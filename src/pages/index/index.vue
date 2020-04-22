<template>
    <div class="index">
        <div class="ibox">
            <MiniTop></MiniTop>
            <div
                class="addMyFavorites"
                v-if="isShowAddMyFavorites"
                :style="'top:' + (mTop + mHeight) + 'px; right:'+ (mRight-40) +'px;'"
            >
                <img :src="addMyFavoritesSrc" :style="addMyFavoritesStyle" alt="添加收藏" />
            </div>
        </div>
        <div class="banner">
            <swiper
                :indicator-dots="true"
                :autoplay="true"
                :interval="5000"
                :duration="400"
                :circular="true"
                :style="{height:height+'px'}"
                indicator-active-color="#fff"
                indicator-color="rgba(255, 255, 255, .3)"
            >
                <swiper-item v-for="(item, index) in swiper" :key="index" class="item">
                    <a v-if="item.flip == 1" @click="toAddGroup()">
                        <img class="img" :src="item.img" :style="{width:'100%',height:height+'px'}" />
                    </a>
                    <navigator
                        v-else-if="item.linkType==1"
                        target="miniProgram"
                        open-type="navigate"
                        @success="goMiniSuc"
                        @fail="goMiniFail"
                        :path="item.link"
                        app-id="wxd947200f82267e58"
                    >
                        <img class="img" :src="item.img" :style="{width:'100%',height:height+'px'}" />
                    </navigator>
                    <a v-else :href="item.link">
                        <img class="img" :src="item.img" :style="{width:'100%',height:height+'px'}" />
                    </a>
                </swiper-item>
            </swiper>
        </div>

        <div class="menuWrap" v-if="menu.length>0">
            <swiper
                :indicator-dots="menu.length>1"
                :circular="true"
                indicator-color="#f5f5f5"
                indicator-active-color="#ff8a4a"
            >
                <swiper-item v-for="(i,index) in menu" :key="index">
                    <div class="menu fx fww">
                        <div
                            class="item"
                            v-for="(ii,iindex) in menu[index]"
                            :key="iindex"
                            :class="menu[index].length == 1?'one':''"
                            @click="go(ii.url)"
                        >
                            <div class="img">
                                <Nimg :src="ii.image" />
                            </div>
                            <div class="txt">{{ii.name}}</div>
                        </div>
                    </div>
                </swiper-item>
            </swiper>
        </div>
        <div class="newTabs tabs">
            <van-tabs
                animated
                swipe-threshold="4"
                line-width="18"
                :active="currentIndex"
                sticky
                @change="onTabChange"
                :offsetTop="mTop+mHeight"
            >
                <van-tab v-for="(q,qIndex) in quesType" :key="qIndex" :title="q.val">
                    <div
                        class="tab-filter fx"
                        :style="isFixed?'position:fixed; width:100%; box-shadow:0 5px 8px rgba(0,0,0,0.06); padding-bottom:30rpx; z-index:99; background:#fff; top:'+(mTop+mHeight+44)+'px':''"
                    >
                        <div
                            class="item"
                            @click="changeFilter(i,q.categoryList)"
                            v-for="(i,index) in q.categoryList"
                            :key="index"
                            :class="{on:i.active}"
                        >{{i.name}}</div>
                    </div>
                    <div v-if="isFixed" style="height:108rpx;"></div>
                    <div class="tab-con">
                        <div v-for="i in quesList[qIndex]" :key="i.questionId" class="item">
                            <div
                                class="iitem"
                                v-if="!i.question_title"
                                @click="go('problemInfo?id='+i.questionId+'&pay_type='+i.rewardType)"
                            >
                                <div class="quesTitle fx aifs">
                                    <div
                                        class="fl jz fx"
                                        v-if="i.rewardType == 1 || i.rewardType == 3"
                                    >
                                        <span :style="xianjin"></span>
                                        {{i.reward}}
                                    </div>
                                    <div class="fl jz fx" v-else-if="i.rewardType == 2">
                                        <span :style="suanzhu"></span>
                                        <span
                                            style="color:#ff6108; width:auto; height:50rpx;"
                                        >{{i.reward}}</span>
                                    </div>
                                    <div class="fx1 multiLineText">{{i.title}}</div>
                                </div>
                                <div class="photos fx" v-if="i.imgPath&&i.imgPath.length>0">
                                    <img
                                        v-for="(ii,iindex) in i.imgPath"
                                        :key="iindex"
                                        :src="ii"
                                        mode="aspectFill"
                                    />
                                </div>
                                <div class="ans" v-if="i.adviserName">
                                    <img
                                        v-show="i.isAdopt"
                                        :src="zuijiadaan"
                                        class="zuijiadaan"
                                        mode="aspectFit"
                                    />
                                    <div class="hdz fx">
                                        <div class="fx1 fx">
                                            <img
                                                :src="i.headUrl?i.headUrl:defaultFace"
                                                class="face"
                                                mode="aspectFit"
                                            />
                                            <div class="name">{{i.adviserName}}</div>
                                            <div style="color:#999;">回答：</div>
                                        </div>
                                    </div>
                                    <div class="iinfo multiLineText">{{i.intro}}</div>
                                </div>
                                <div class="bot fx" :style="i.adviserName?'':'padding-top:0;'">
                                    <div class="fx1 left">
                                        {{i.visited}}浏览
                                        <template
                                            v-if="i.answerCount"
                                        >·{{i.answerCount}}回答</template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>

        <van-popup
            class="popup"
            :show="isShowKeFuPopup"
            position="center"
            custom-style="background:none"
            lock-scroll:true
        >
            <div class="kfBg">
                <div class="kfCont">
                    <img src="https://static.cgkc.com/miniprogram/addKfBg.gif" />
                    <button
                        class="addBtn"
                        open-type="contact"
                        show-message-card="true"
                        send-message-title="加群：会计交流群"
                        send-message-path="/pages/addGroup/main"
                        send-message-img="https://static.cgkc.com/miniprogram/kfaddImg.png"
                        @click="closeKfBox"
                    >点击加群</button>
                </div>
            </div>
            <div class="closeBtn">
                <van-icon name="close" size="30px" color="#fff" @click="closeKfBox"></van-icon>
            </div>
        </van-popup>

        <!-- 弹出活动公告 -->
        <van-popup
            class="popup"
            :show="isShowAnnouncement"
            @close="closePop('isShowAnnouncement')"
            v-if="notice.updated_at"
            position="center"
            custom-style="background:none"
        >
            <div
                class="announcement"
                :style="'background:url('+notice.img+') no-repeat; width:600rpx; height:700rpx; background-size: 600rpx 700rpx;'"
            >
                <div class="title">{{notice.title}}</div>
                <div class="content">
                    <rich-text :nodes="notice.content"></rich-text>
                </div>
            </div>
            <div class="popup-bottom" style="padding-top:10px;">
                <img class="close" :src="closeImg" @click="closePop('isShowAnnouncement')" />
            </div>
        </van-popup>
        <!-- 新人登录礼包弹窗 -->
        <van-popup :show="isShowXrdllbBox&&isNewUser" custom-style="background:none" overlay="true">
            <div class="xrdllbBoxWrap">
                <div class="close fx jcc" @click="closePop('isShowXrdllbBox')">
                    <span class="iconfont icon-icon-calendar-close"></span>
                </div>
                <div class="xrdllbBox" :style="libao1">
                    <div class="btn" @click="go('userLogin')">
                        <img :src="btn1" class="btn1" mode="aspectFit" />
                    </div>
                </div>
            </div>
        </van-popup>
        <!-- 新人登录礼包弹窗 end-->
        <!-- 红包 -->
        <div
            class="redPacket"
            :class="{'minShowRight':!isShowActivityIcon}"
            id="tiaoyitiao"
            @click="toFxActivityPage"
            v-show="isShowActStatus"
        >
            <div class="img">
                <img :src="srcRedPacket" alt="红包" />
            </div>
        </div>
        <!-- 红包 end-->

        <!-- 登录-tip -->
        <div class="loginTipBoxWrap" v-if="isShowloginTipBox" @click="go('userLogin')">
            <div class="bg">
                <Nimg src="loginTip.png" />
            </div>
            <div class="close DN fx jcc" @click.stop="closePop('isShowloginTipBox')">
                <span class="iconfont icon-icon-calendar-close"></span>
            </div>
        </div>
        <!-- 登录-tip end-->

        <compFooter value="1" />
    </div>
</template>

<style lang="less">
@import "./main.less";
</style>


<script>
import $ from '@/common'
import compFooter from '@/components/compFooter.vue'
import MiniTop from '@/components/MiniTop.vue'
import Nimg from '@/components/Nimg.vue'
const $m = wx.getMenuButtonBoundingClientRect()
let timer
let myInviteCode = ''
export default {
    data() {
        return {
            menu: [],
            isFilterChange: false,
            isShowAddMyFavorites: false,
            isShowAskPopup: false, //提问弹窗
            addMyFavoritesStyle: 'width:' + $.windowWidth / 1.8 + 'px; height:' + $.windowWidth / 507 * 120 / 1.8 + 'px',
            quesType: [{ val: '推荐', active: 0, page: 1 }],
            height: $.windowWidth / 750 * 280,
            swiper: [],
            isFixed: false,
            notice: {},
            quesList: [],
            currentIndex: 0,
            isShowKeFuPopup: false,
            isShowXrdllbBox: false,//新人登录礼包
            isNewUser: false,
            isShowActivityIcon: true,
            isShowActStatus: false,
            isShowloginTipBox: false,
            isChangeTab: false,
            isShowActivityIcon: true,
            isShowActStatus: false,
            activityLink: null,
            srcRedPacket: null,
            action: 0,
            firstPage: 0,
            lastPage: 0
        }
    },
    computed: {
        isIphone() {
            return $.isIphone()
        },
        addMyFavoritesSrc() {
            return $.$img('qing/img/addMyFavorites.png')
        },
        mTop() {
            let val = $m.top
            return val
        },
        type() {
            return this.quesType[this.currentIndex]
        },
        mRight() {
            let val = $m.width + 16
            return val
        },
        mHeight() {
            let val = $m.height
            return val
        },
        closeImg() {
            return $.$img("wx/img/signIn/close.png")
        },
        defaultFace() {
            return $.$img("defaultFace.png")
        },
        dalibao() {
            return $.$img("icons/dalibao.png")
        },
        search() {
            return $.$bg("icons/search.png")
        },
        suanzhu() {
            return $.$bg("icons/suanzhu.png")
        },
        xianjin() {
            return $.$bg("icons/xianjin.png")
        },
        shandian() {
            return $.$img("icons/shandian.png")
        },
        zuijiadaan() {
            return $.$img("icons/zuijiadaan.png")
        },
        libao1() {
            return $.$bg('icons/xinrenlibao/libao1.png')
        },
        btn1() {
            return $.$img('icons/xinrenlibao/btn1.png')
        },
        libao2() {
            return $.$bg('icons/xinrenlibao/libao2.png')
        },
        btn2() {
            return $.$img('icons/xinrenlibao/btn2.png')
        }
    },
    methods: {
        goMiniSuc(e) {
            $.log(e)
        },
        goMiniFail(e) {
            $.log(e)
        },
        // 判断手机型号
        pd() {
          wx.getSystemInfo({
            success(res) {
              console.log("手机:", res.model);
              wx.setStorage({
                key: "model",
                data: res.model
              });
            }
          });
        },
        async init() {

            {
                let isNewUser = $.getLocal('isNewUser')
                if (isNewUser !== 'no') {
                    this.isNewUser = true
                    $.setLocal('isNewUser', 'no')
                } else {
                    this.isNewUser = false
                }
            }

            //判断活动是否开启与关闭
            $.np('getActivity').then(res => {
                if (res.status === 3) {
                    if (res.img) {
                        this.isShowActStatus = true
                        this.srcRedPacket = res.img
                    }
                    if (res.link) {
                        this.activityLink = res.link
                    }
                } else if (res.status === 2) {
                    this.isShowActStatus = false
                } else {
                    this.isShowActStatus = false
                }
            })

            //获取menu组

            $.np('getSmallList', { type: 1 }).then(res => {
                let menu = []
                let num = 4


                for (let i = 0, j = res.length; i < j; i += num) {
                    menu.push(res.slice(i, i + num));
                }
                this.menu = menu
            })
            $.log('进入初始化函数')

            this.currentPage = 1
            //隐藏登录礼包
            this.isShowXrdllbBox = false
            this.isShowloginTipBox = false
            //判断是否登录

            $.isLogin(() => {
                this.isShowXrdllbBox = false
                this.isShowloginTipBox = false
                //上报小盟openid
                $.xiaomeng()
            }, () => {
                //弹出新人登录礼包
                this.isShowXrdllbBox = true
                this.isShowloginTipBox = true
            })

            //判断活动是否开启与关闭
            $.np('getActivity').then(res => {
                if (res.status === 3) {
                    this.isShowActStatus = true
                } else if (res.status === 2) {
                    this.isShowActStatus = false
                } else {
                    this.isShowActStatus = false
                }
            })

            this.bannerFunc()
            await this.quesTypeFunc()
            this.datasFunc()
        },
        popAsk() {
            let t = this
            //判断是否要弹提问窗口 (10分钟未回答就要弹)
            if ($.getLocal('askPopTime')) {
                let minue = Math.round(new Date() / 1000 - $.getLocal('askPopTime')) / 60 //分钟
                console.log(minue)
                if (minue >= 1 && minue <= 10) {
                    $.post($.url('userCenterData'), function (res) {
                        console.log('是否问答:' + res.data.isAsk)
                        if (!res.data.isAsk) {
                            t.isShowAskPopup = true
                            $.setLocal('askPopTime', (Math.round(new Date() / 1000 - 10000000)))
                        }
                    })
                }
            }
        },
        toFxActivityPage() {
            wx.navigateTo({
                url: this.activityLink
            })
        },
        //关闭提问弹窗
        closePop(str) {
            this[str] = false
        },
        filterGo(i, q) {
            q.active = i
            this.currentPage = 1
            this.datasFunc()
        },
        go: $.$go,
        async bannerFunc() {
            let url = '/user/banner/getBannerByType/1'
            let banner = await $.$$np(url)

            this.swiper = banner
        },
        //获取问题类型
        quesTypeFunc() {
            return $.$$np('/imconsult/category/level/list').then(res => {
                res.forEach(i => {
                    i.active = 0
                    i.val = i.levelName
                    i.page = 1
                    if (Array.isArray(i.categoryList)) {
                        i.categoryList.forEach((ii, index) => {
                            ii.active = 0
                            if (index == 0) {
                                ii.active = 1
                            }
                        })
                    }
                })
                if (this.quesType.length == 1) {
                    this.quesType = this.quesType.concat(res)
                }
            })
        },
        datasFunc() {
            let index = this.currentIndex
            let type = this.type
            let list
            let oldList = this.quesList[index] || []

            if (this.isChangeTab) {
                this.isChangeTab = false
                oldList = []
                this.$set(type, 'page', 1)
                // wx.pageScrollTo({
                //     scrollTop: 0,
                //     duration: 100
                // })
            }

            if (this.isFilterChange) {
                this.isFilterChange = false
                this.$set(type, 'page', 1)
                oldList = []
            }

            if (index == 0) {
                let url = '/imconsult/question/recommendList'
                let data = {
                    action: this.action,
                    firstPage: this.firstPage,
                    lastPage: this.lastPage
                }

                $.$np(url, data).then(res => {
                    list = res.currentPageList
                    if (!Array.isArray(list)) {
                        list = []
                    }

                    if (this.action == 2) {
                        this.$set(this.quesList, index, list.concat(oldList))
                    } else {
                        this.$set(this.quesList, index, oldList.concat(list))
                    }
                    this.firstPage = res.firstPage
                    this.lastPage = res.lastPage
                })

            } else {
                let levelType = type.levelType
                let categoryId = type.categoryId || type.categoryList[0].id
                let url = `/imconsult/question/fastList/levelType/${levelType}/categoryId/${categoryId}?page=${type.page}`
                $.$$np(url).then(res => {
                    list = res.list
                    if (!Array.isArray(list)) {
                        list = []
                    }
                    this.$set(this.quesList, index, oldList.concat(list))
                })
            }


        },
        onTabChange(e) {
            this.currentIndex = e.mp.detail.name
            this.isChangeTab = true
            this.datasFunc()
        },
        changeFilter(i, list) {
            this.$set(this.type, 'categoryId', i.id)
            list.forEach(ele => {
                ele.active = 0
            })
            i.active = 1
            this.isFilterChange = true
            this.datasFunc()
        },
        nextPage() {
            let page = this.type.page + 1
            this.$set(this.type, 'page', page)
            this.action = 1
            this.datasFunc()
        },
        //收藏小程序
        addMyFavoritesFunc() {
            this.isShowAddMyFavorites = $.getLocal('isShowAddMyFavorites')

            if (this.isShowAddMyFavorites) {
                setTimeout(() => {
                    this.isShowAddMyFavorites = false
                    $.setLocal('isShowAddMyFavorites', false)
                }, 5000)
            }
        },
        //活动图标
        activeIconFunc(e) {
            this.isShowActivityIcon = false
            clearTimeout(timer)
            this.scrollTopx = e.scrollTop
            timer = setTimeout(() => {
                if (e.scrollTop === this.scrollTopx) {
                    console.log('滚动结束了')
                    this.isShowActivityIcon = true
                }
            }, 500)
        },
        toAddGroup() {
            this.isShowKeFuPopup = true
        },
        closeKfBox() {
            this.isShowKeFuPopup = false
        }
    },
    components: {
        compFooter,
        MiniTop,
        Nimg
    },
    async onLoad(o) {

        $.log('进入onLoad')

        $.isLogin(() => {
            //读取自己的邀请码
            let url = 'userCenterData'
            $.np(url).then(res => {
                myInviteCode = res.inviteCode
                $.log('我自己的邀请码' + myInviteCode)
            })
        })





        await this.init()

        $.log('onLoad-初始化完成')

        $.log('首页页面参数', o)


        // 手机型号
        this.pd()



        //检测到有推荐人id转成邀请码并存储
        if (o.inviterId) {
            if (o.inviterId != 0) {
                let { invite_code } = await $.np('getInviteCodeByUserId', {
                    userId: o.inviterId
                })
                $.setLocal('inviteCode', invite_code)
            }
        }
        //检测参数有邀请码存储
        if (o.inviteCode) {
            $.setLocal('inviteCode', o.inviteCode)
        }
        //检测参数有邀请顾问页面标识
        if (o.isGuwenLine) {
            $.setLocal('isGuwenLine', o.isGuwenLine)
        }

        //小程序码分享中转
        if (o.scene) {
            let scene = decodeURIComponent(o.scene)
            //                $.log(o.scene);
            $.log(scene)
            //                scence格式k1&v1&k2&v2
            let url = ''
            let param = ''
            let sceneGroup = scene.toString().split(':')
            let tip
            console.log(sceneGroup[0])
            console.log('scene' + sceneGroup)
            if (sceneGroup.length == 1) {
                //只有一个的话就是邀请码 邀请码存储
                $.setLocal('inviteCode', sceneGroup[0])
            } else {
                //拼接参数跳转
                for (let j = 0; j < sceneGroup.length; j++) {
                    //检测到有推荐人id转成邀请码并存储
                    if (sceneGroup[j] == 'iId') {
                        if (sceneGroup[j + 1] != 0) {
                            $.post($.url('getInviteCodeByUserId'), {
                                userId: sceneGroup[j + 1]
                            }, function (res) {
                                $.log(res.data.invite_code)
                                $.setLocal('inviteCode', res.data.invite_code)
                            })
                        }
                    }

                    if (sceneGroup[j] == 'local_tip' || sceneGroup[j] == 'LT') {
                        tip = sceneGroup[j + 1]
                        if (tip == 'qInfo' || tip == 'QI') {
                            tip = 'problemInfo'
                        } else if (tip == 'appli' || tip == 'BE') {
                            tip = 'becomeConsultant'
                        } else if (tip == 'itf') {
                            tip = 'inviteGoodFriends'
                        }
                        url = '../' + tip + '/main?'
                    } else {
                        if (j % 2 == 0) {
                            param += sceneGroup[j] + '=' + sceneGroup[j + 1] + '&'
                        }
                    }
                }
                param = param.substr(0, param.length - 1)
                url = url + param
                if (($.getLocal('isApplying') || $.getLocal('isAdviser')) && tip == 'becomeConsultant') {
                    //如果是已申请成顾问的调个人中心
                    $.tip('您已经是顾问，或者正在申请中...')
                } else {
                    $.go(url)
                }
            }
        }

        //分享页面中转
        if (o.local_tip) {
            let str = ''
            for (var i in o) {
                console.log(i + '....' + o[i])
                if (i != 'local_tip') {
                    str += i + '=' + o[i] + '&'
                }
            }
            str = str.substr(0, str.length - 1)
            let url = '../' + o.local_tip + '/main?' + str
            $.go(url)
        } else if (o.LT) {
            let str = ''
            for (var i in o) {
                console.log(i + '....' + o[i])
                if (i != 'LT') {
                    str += i + '=' + o[i] + '&'
                }
            }
            str = str.substr(0, str.length - 1)
            let url = '../' + o.LT + '/main?' + str
            $.go(url)
        }

        //收藏提醒
        this.addMyFavoritesFunc()
    },
    onShow() {
        wx.hideTabBar()

        $.log('进入onShow')

        if ($.isRefresh || $.isIndexRefresh) {
            $.log('进入onShow-刷新')
            $.isRefresh = false
            $.isIndexRefresh = false
            this.init()
        }
    },
    onReachBottom() {
        this.nextPage()
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
    async onPullDownRefresh() {
        this.action = 2
        await this.init()
        wx.stopPullDownRefresh()
    },
    //监听页面滚动获取滚动条到顶部的距离
    onPageScroll(e) {
        //console.log(e)
        this.fixedTop = e.scrollTop
        this.isShowActivityIcon = false

        clearTimeout(timer)
        this.scrollTopx = e.scrollTop
        timer = setTimeout(() => {
            if (e.scrollTop === this.scrollTopx) {
                console.log('滚动结束了')
                this.isShowActivityIcon = true
            }
        }, 500)
    },
}
</script>


