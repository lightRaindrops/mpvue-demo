<template>
    <section>
        <section class="nationalDay">
            <div class="top">
                <span class="item01" @click="toMyPrizePage">我的奖品({{initObj.lotteryNum}})</span>
                <span class="item02" @click="toActivityRulePage">活动规则</span>
            </div>
            <div class="mainCont">
                <!--如果用户已邀请了10个人，要隐藏此按钮-->
                <div
                    class="btn01"
                    v-if="!initObj.invitation"
                    :animation="ani"
                    style="z-index:10;"
                    @transitionend="reAnimation"
                >
                    <button open-type="share">
                        <div class="imgBtn"></div>
                    </button>
                </div>
                <div class="btn05" v-else>
                    <div class="imgBtn5"></div>
                </div>
                <div class="btn02">
                    <div class="imgBtn2">
                        <div class="clickOpenPrize" @click="clickOpenPrize"></div>
                    </div>
                </div>
                <div class="btn03">
                    <div class="imgBtn3" @click="toTaskCenter"></div>
                </div>
            </div>

            <!--
                1、用户进入活动页，没有登录时，显示“我要开宝箱”，点我要开宝箱时，跳转到登录页面。

                是老用户：
                2、已经登时了，判断是否有开宝箱的机会，有则跳“我要开宝箱”，没有机会再判断是否有邀请好友的机会，
                   如果有，则显示“邀请好友开宝箱”，没有则显示“做任务天天开宝箱”。

                是新用户：
                3、如果没有过签到确认新用户身份时，则显示“点击签到开宝箱”，如果有签，也要判断是否有开宝箱的机会，
                   如有则显示“我要开宝箱”。
            -->

            <!-- <div class="btn04" v-if="initObj.status===0">
                <div class="tit" @click="toLoginPage">我要开宝箱</div>
                <div class="tip">（已有{{initObj.num}}人开启宝箱）</div>
            </div>-->

            <div>
                <div class="btn04" v-if="initObj.status===1" @click="clickOpenPrize">
                    <div class="tit">我要开宝箱</div>
                    <div class="tip">（已有{{initObj.num}}人开启宝箱）</div>
                </div>

                <button open-type="share" class="btn04" v-else-if="initObj.status===2">
                    <div class="tit" style="margin-top:15rpx;">邀请好友开宝箱</div>
                    <div class="tip" style="margin-top:6rpx;">（已有{{initObj.num}}人开启宝箱）</div>
                </button>

                <div class="btn04" v-else-if="initObj.status===3" @click="toTaskCenter">
                    <div class="tit">做任务天天开宝箱</div>
                    <div class="tip">（已有{{initObj.num}}人开启宝箱）</div>
                </div>

                <div class="btn04" v-else-if="initObj.status===0" @click="toTaskCenter">
                    <div class="tit">点击签到开宝箱</div>
                    <div class="tip">（已有{{initObj.num}}人开启宝箱）</div>
                </div>
                <div class="btn04" v-else-if="!isLogin" @click="toLoginPage">
                    <div class="tit">我要开宝箱</div>
                    <div class="tip">（已有{{initObj.num}}人开启宝箱）</div>
                </div>
            </div>
        </section>
        <section class="gqList">
            <div v-if="initObj.prize>0 || initObj.composite>0">
                <div class="jlTit"></div>
                <div class="tipInfo">现金红包满50元即可提现；算珠可进入算珠商城兑换礼品</div>
                <div class="listBox">
                    <div class="boxL boxA">
                        <div class="t">算珠</div>
                        <div class="count">{{initObj.composite}}</div>
                        <div class="boxBtn" @click="toIntegralMallPage">兑换好礼</div>
                    </div>
                    <div class="boxL boxB"></div>
                    <div class="boxL boxA">
                        <div class="t">现金</div>
                        <div class="count">
                            {{initObj.prize}}
                            <span>元</span>
                        </div>
                        <div class="boxBtn" @click="toTixianPage">我要提现</div>
                    </div>
                </div>
            </div>

            <div class="mdTit"></div>
            <div class="mdList">
                <swiper
                    class="swiper_container"
                    vertical="true"
                    autoplay="true"
                    circular="true"
                    interval="2000"
                    display-multiple-items="8"
                >
                    <swiper-item v-for="(prize,index) in prizeList" :key="index">
                        <div class="item">
                            <i>
                                <img :src="prize.photo" mode="widthFix" />
                            </i>
                            <span class="title" style="width:120rpx; overflow:hidden;">{{prize.name}}</span>
                            <span class="tips">
                                开宝箱获得
                                <span
                                    style="color:#e26767"
                                    v-if="prize.reward_type == 1"
                                >{{prize.prize_code}}算珠</span>
                                <span
                                    style="color:#e26767"
                                    v-else-if="prize.reward_type == 4"
                                >{{prize.prize_code}}元</span>

                                <span style="color:#e26767" v-else>{{prize.prize_name}}</span>
                            </span>
                        </div>
                    </swiper-item>
                </swiper>
            </div>
        </section>
        <div class="footer">
            <div class="footLogo"></div>
        </div>

        <!--宝箱打开弹窗 start-->
        <div class="lpPopUp" data-id="pop" v-if="isShowLpPopUp" @click="closeLpPopUp($event)">
            <div class="showLpBox">
                <!--<div class="s_pub lp"></div>
                <div class="s_pub lp02"></div>
                <div class="s_pub lp03"></div>
                <div class="s_pub lp04"></div>-->
                <div class="s_pub">
                    <img mode="widthFix" :src="jpImgUrl" />
                    <div class="prizeName" v-if="rewardType===1">{{jpValue}}算珠</div>
                    <div class="prizeName" v-if="rewardType===4">{{jpValue}}元</div>
                    <div class="prizeName" v-else>{{jpName}}</div>
                </div>
            </div>
        </div>
        <!--end 宝箱打开弹窗-->
    </section>
</template>

<script>
import $ from '@/common'
export default {
    name: 'nationalDay',
    data() {
        return {
            initObj: {
                status: '',//当前用户是什么状态
                lotteryNum: 0,//奖品数
                prize: 0,//算珠
                composite: 0,//现金
                num: 0,//人数
                invitation: false,//是否已经完成邀请人数
            },

            prizeList: [],//获奖名单

            isShowLpPopUp: false,

            jpImgUrl: '',//抽到的奖品图片
            jpName: '',//抽到的奖品名称
            jpValue: '',
            rewardType: '',
            animation: null,
            ani: ''
        }
    },

    onShow() {
        if ($.isFinishTask) {
            console.log('我刷新了')
            this.initData()
            $.isFinishTask = false
        }

        {
            this.animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
                delay: 0
            });

            this.animation.translate(0, -10).step().translate(0, 0).step()
            this.ani = this.animation.export()
        }

    },

    onLoad() {
        $.np('isLogin').then(res => {
            this.isLogin = res.isLogin
        })
        $.np('userCenterData').then(res => {
            this.inviteCode = res.inviteCode
        })

        this.initData()
        this.getPrizeName()

    },
    onUnload() {
        $.isRefresh = true
    },
    methods: {
        //循环动画
        reAnimation() {
            this.animation.translate(0, 0).step({ duration: 0 }) // 重置动画
            this.ani = this.animation.export()
            setTimeout(() => {
                this.animation.translate(0, -10).step().translate(0, 0).step()
                this.ani = this.animation.export()
            }, 1000)// 播放下一次动画
        },
        //关闭礼品宝箱查看开奖
        closeLpPopUp(e) {
            if (e.currentTarget.dataset.id) {
                this.isShowLpPopUp = false
            }
        },

        //初始化数据
        initData() {
            wx.showLoading({
                title: '加载中',
            });


            $.post($.url('getMultiNational'), (res) => {
                console.log('aaaabbbb')
                console.log(res)
                wx.hideLoading();
                if (res.success) {
                    this.initObj = {
                        status: res.data.status,
                        lotteryNum: res.data.lottery_num,
                        prize: res.data.prize,
                        composite: res.data.composite,
                        num: res.data.num,
                        invitation: res.data.invitation
                    }
                }


            })
        },

        //获奖名单
        getPrizeName() {
            $.post($.url('getLotteryMidAutumnRecordList'), (res) => {
                console.log(res)
                if (res.success) {
                    let data = res.data
                    data.forEach(ele => {
                        if(ele.name.length>4){
                            ele.name = ele.name.substring(0,2)+'...'
                        }
                    })
                    this.prizeList = data
                }
            })
        },

        //打开礼品宝箱查看开奖
        clickOpenPrize() {

            let that = this
            $.post($.url('lotteryActivityMidAutumnStart'), function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    console.log(res)
                    that.isShowLpPopUp = true
                    that.jpImgUrl = res.data.prize_photo
                    that.jpName = res.data.prize_name
                    that.jpValue = res.data.prize_code
                    that.rewardType = res.data.reward_type
                    that.initData()
                    setTimeout(() => {
                        that.isShowLpPopUp = false
                    }, 3000)
                }
            })
        },

        //跳转到算珠商城页面
        toIntegralMallPage() {
            wx.navigateTo({
                url: '/pages/integralMall/main'
            })
        },

        //跳转到提现页面
        toTixianPage() {
            wx.navigateTo({
                url: '/pages/tixian/main'
            })
        },

        //跳转到登录页面
        toLoginPage() {
            $.goSelf('/pages/userLogin/main?key=nationalDay')
        },

        //跳转到任务规则页面
        toTaskCenter() {
            wx.navigateTo({
                url: '/pages/taskCenter/main'
            })
        },

        //跳转到我的奖品页面
        toMyPrizePage() {
            wx.navigateTo({
                url: '/pages/myPrize/main'
            })
        },

        //跳转到任务规则页面
        toActivityRulePage() {
            wx.navigateTo({
                url: '/pages/activityRule/main'
            })
        },
    },

    onShareAppMessage(res) {
        let t = this;
        $.log(t.inviteCode)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '国庆嗨翻天，全民开宝箱',
            //path: '/pages/fxActivity/main',
            path: '/pages/index/main?local_tip=nationalDay&inviteCode=' + t.inviteCode,
            imageUrl: 'https://static.cgkc.com/miniprogram/gqShareImg.jpg?v=666',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },

    onPullDownRefresh: function () {
        this.initData()
        wx.stopPullDownRefresh()

    },
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
