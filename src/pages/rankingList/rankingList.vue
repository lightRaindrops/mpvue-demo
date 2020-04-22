<template>
    <div class="rankingBox">
        <div class="rankingTitle"></div>
        <!--<div class="weekTab">
      <ul>
        <li :class="{act:selectAct=='prevPrev'}" @click="selectCurWeek('prevPrev')"><div class="week">第一周</div><div class="date">3月25号- 3月31号</div></li>
        <li :class="{act:selectAct=='prev'}" @click="selectCurWeek('prev')"><div class="week">第二周</div><div class="date">4月1号- 4月7号</div></li>
        <li :class="{act:selectAct=='current'}" @click="selectCurWeek('current')"><div class="week">本 周</div></li>
      </ul>
        </div>-->
        <div class="bestBox">
            <div class="bestTab">
                <ul>
                    <li :class="{'curAct':curIndexTab=='gw'}" @click="tabLi('gw')">最佳顾问排行</li>
                    <li :class="{'curAct':curIndexTab=='user'}" @click="tabLi('user')">最佳用户排行</li>
                </ul>
            </div>
            <div class="bestCont">
                <!--最佳顾问排行切换 start-->
                <div v-show="isBestGw" class="bestGw">
                    <!--排行榜 start-->
                    <div class="phbBox">
                        <div class="phbTitle">{{curTime.start_time}} - {{curTime.end_time}} 排行榜</div>
                        <!--<div class="phbTitle">3月1号 - 3月15号  排行榜</div>-->
                        <div class="showUserInfo">
                            <ul>
                                <li v-for="(item,index) in curWeekData" :key="index">
                                    <a class="phb_userImg" :href="'../adviserInfo/main?id='+item.adviser_id">
                                        <img :src="item.photo">
                                    </a>
                                    <div class="phb_jf">{{item.activity_level}}</div>
                                    <div class="phb_tel">{{item.tel}}</div>
                                    <div class="pxLvIcon"></div>
                                </li>
                            </ul>
                        </div>
                        <div class="myPmBox" v-if="isAdviser">
                            <div class="pmCont">
                                <div class="myPm">
                                    <div class="num">{{curUserInfo.postion}}</div>
                                    <div class="text">我的排名</div>
                                </div>
                                <div class="myHeadImg">
                                    <div class="headImg">
                                        <img :src="curUserInfo.photo">
                                    </div>
                                </div>
                                <div class="myJf">
                                    <div class="num">{{curUserInfo.user_activity_weekly_level}}</div>
                                    <div class="text">周成长值</div>
                                </div>
                            </div>
                        </div>

                        <div class="myPmBox" style="height:64rpx;line-height:64rpx" v-else>
                            <div class="pmCont">
                                <div class="myPm" style="text-align:left;">
                                    <div class="text">顾问排名</div>
                                </div>

                                <div class="myJf" style="text-align:right;padding-right:30rpx">
                                    <div class="text">周成长值</div>
                                </div>
                            </div>
                        </div>

                        <!--4-10名排行 start-->
                        <div class="otherPxBox">
                            <ul>
                                <li v-for="(item,index) in curWeekData2" :key="index">
                                    <div class="number">{{index+4}}</div>
                                    <div class="imgTel">
                                        <a class="img" :href="'../adviserInfo/main?id='+item.adviser_id">
                                            <img :src="item.photo">
                                        </a>
                                        <div class="tel">{{item.tel}}</div>
                                    </div>
                                    <div class="otherJf">{{item.activity_level}}</div>
                                </li>
                            </ul>
                        </div>
                        <!--end 4-10名排行-->
                    </div>
                    <!--end排行榜-->

                    <div class="prizeUser" v-if="pervWeekData.length>0">
                        <div class="title">上周获奖名单</div>
                        <!--1到3名 start-->
                        <div class="qsmBox">
                            <ul>
                                <li v-for="(prev,index) in pervWeekData" :key="index">
                                    <div class="userImg">
                                        <img :src="prev.photo">
                                    </div>
                                    <div class="userName">{{prev.name}}</div>
                                    <div class="userTel">{{prev.prizeVal}}</div>
                                    <div class="pmLv" v-if="index==0">
                                        <img
                                            src="https://static.cgkc.com/miniprogram/weekPm01.png"
                                        >
                                    </div>
                                    <div class="pmLv" v-if="index==1">
                                        <img
                                            src="https://static.cgkc.com/miniprogram/weekPm02.png"
                                        >
                                    </div>
                                    <div class="pmLv" v-if="index==2">
                                        <img
                                            src="https://static.cgkc.com/miniprogram/weekPm03.png"
                                        >
                                    </div>
                                </li>
                            </ul>
                            <div class="jfBox">
                                <ul>
                                    <li
                                        v-for="(prev,index) in pervWeekData"
                                        :key="index"
                                    >{{prev.activity_level}}</li>
                                </ul>
                            </div>
                        </div>
                        <!--end 1到3名-->
                        <div style="clear:both"></div>

                        <!--4到10 start-->
                        <div class="syhBox">
                            <div class="tit">
                                <ul>
                                    <li>名字</li>
                                    <li>成长值</li>
                                    <li>奖品</li>
                                </ul>
                            </div>
                            <div class="conts">
                                <ul>
                                    <li v-for="(item,index) in pervWeekData2" :key="index">
                                        <span class="head_user">
                                            <i class="userHead">
                                                <img :src="item.photo">
                                            </i>
                                            {{item.name}}
                                        </span>
                                        <span>{{item.activity_level}}</span>
                                        <span class="prizeBox">{{item.prize.dec}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--end 4到10-->
                    </div>
                </div>
                <!--end 最佳顾问排行切换-->

                <!--最佳用户排行 start-->
                <div v-show="isBestUser" class="bestGw">
                    <!--排行榜 start-->
                    <div class="phbBox">
                        <div class="phbTitle">{{curTime.start_time}} - {{curTime.end_time}} 排行榜</div>
                        <!--<div class="phbTitle">3月1号 - 3月15号  排行榜</div>-->
                        <div class="showUserInfo">
                            <ul>
                                <li v-for="(item,index) in curUserWeekData" :key="index">
                                    <div class="phb_userImg">
                                        <img :src="item.photo">
                                    </div>
                                    <div class="phb_jf">{{item.activity_level}}</div>
                                    <div class="phb_tel">{{item.tel}}</div>
                                    <div class="pxLvIcon"></div>
                                </li>
                            </ul>
                        </div>

                        <div class="myPmBox" v-if="!isAdviser">
                            <div class="pmCont">
                                <div class="myPm">
                                    <div class="num">{{curUserInfo.postion}}</div>
                                    <div class="text">我的排名</div>
                                </div>
                                <div class="myHeadImg">
                                    <div class="headImg">
                                        <img :src="curUserInfo.photo">
                                    </div>
                                </div>
                                <div class="myJf">
                                    <div class="num">{{curUserInfo.user_activity_weekly_level}}</div>
                                    <div class="text">周成长值</div>
                                </div>
                            </div>
                        </div>

                        <div class="myPmBox" style="height:64rpx;line-height:64rpx" v-else>
                            <div class="pmCont">
                                <div
                                    class="myPm"
                                    style="text-align:left;padding-left:40rpx;box-sizing: border-box"
                                >
                                    <div class="text">排名</div>
                                </div>

                                <div class="myJf" style="text-align:right;padding-right:30rpx">
                                    <div class="text">周成长值</div>
                                </div>
                            </div>
                        </div>

                        <!--4-10名排行 start-->
                        <div class="otherPxBox">
                            <ul>
                                <li v-for="(item,index) in curUserWeekData2" :key="index">
                                    <div class="number">{{index+4}}</div>
                                    <div class="imgTel">
                                        <div class="img">
                                            <img :src="item.photo">
                                        </div>
                                        <div class="tel">{{item.tel}}</div>
                                    </div>
                                    <div class="otherJf">{{item.activity_level}}</div>
                                </li>
                            </ul>
                        </div>
                        <!--end 4-10名排行-->
                    </div>
                    <!--end排行榜-->
                    <div class="prizeUser" v-if="userPervWeekData.length>0">
                        <div class="title">上周获奖名单</div>
                        <!--1到3名 start-->
                        <div class="qsmBox">
                            <ul>
                                <li v-for="(prev,index) in userPervWeekData" :key="index">
                                    <div class="userImg">
                                        <img :src="prev.photo">
                                    </div>
                                    <div class="userName">{{prev.name}}</div>
                                    <div class="userTel" v-text="prev.prizeVal"></div>
                                    <div class="pmLv" v-if="index==0">
                                        <img
                                            src="https://static.cgkc.com/miniprogram/weekPm01.png"
                                        >
                                    </div>
                                    <div class="pmLv" v-if="index==1">
                                        <img
                                            src="https://static.cgkc.com/miniprogram/weekPm02.png"
                                        >
                                    </div>
                                    <div class="pmLv" v-if="index==2">
                                        <img
                                            src="https://static.cgkc.com/miniprogram/weekPm03.png"
                                        >
                                    </div>
                                </li>
                            </ul>
                            <div class="jfBox">
                                <ul>
                                    <li
                                        v-for="(prev,index) in userPervWeekData"
                                        :key="index"
                                    >{{prev.activity_level}}</li>
                                </ul>
                            </div>
                        </div>
                        <!--end 1到3名-->
                        <div style="clear:both"></div>

                        <!--4到10 start-->
                        <div class="syhBox">
                            <div class="tit">
                                <ul>
                                    <li>名字</li>
                                    <li>积分</li>
                                    <li>奖品</li>
                                </ul>
                            </div>
                            <div class="conts">
                                <ul>
                                    <li v-for="(item,index) in userPervWeekData2" :key="index">
                                        <span class="head_user">
                                            <i class="userHead">
                                                <img :src="item.photo">
                                            </i>
                                            {{item.name}}
                                        </span>
                                        <span>{{item.activity_level}}</span>
                                        <span class="prizeBox">{{item.prize.dec}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--end 4到10-->
                    </div>
                </div>
                <!--end 最佳用户排行-->
            </div>

            <!--本期活动奖品 start-->
            <div class="newActivityPrize">
                <div class="prizeTitle">本期活动奖品</div>
                <div class="prizeList">
                    <ul>
                        <li v-for="(item,index) in prizeList" :key="index">
                            <div class="prizeNum">{{item.name}}</div>
                            <div class="prizeCont">{{item.dec}}</div>
                        </li>
                    </ul>
                </div>
                <div class="prizeTip">
                    <rich-text :nodes="bottomRemarks"></rich-text>
                </div>
            </div>
            <!--end本期活动奖品-->

            <div class="copyRight">--深圳市成功快车科技有限公司--</div>
            <div style="height:150rpx"></div>
        </div>
        <div class="footerBtn">
            <button class="callFired" open-type="share">叫上好友一起赢</button>
            <button class="myGo" @click="toCwgwPage" v-if="!isAdviser">我要成为顾问</button>
            <button class="myGo" @click="toRwPage" v-else>我要冲榜</button>
        </div>
        <div class="toRulePage" @click="toRulePage">规则</div>
    </div>
</template>

<script>
import $ from '@/common'


export default {
    name: 'rankingList',
    data() {
        return {
            selectAct: 'current',
            curWeekData: [],
            curWeekData2: [],
            curTime: {},
            curUserInfo: {},
            pervWeekData: [],
            pervWeekData2: [],
            userPervWeekData: [],
            userPervWeekData2: [],
            curUserWeekData2: [],
            curUserWeekData: [],
            curNumber: '',
            prizeList: [],
            isBestGw: true,
            isBestUser: false,
            curIndexTab: 'gw',
            isAdviser: '',
            bottomRemarks: ''
        }
    },
    onLoad() {
        //console.log(this.curTime)
        this.getWeekData()
        // this.getCurPrizeList(this.curTime.number)
    },
    methods: {
        selectCurWeek(curWeek) {
            this.selectAct = curWeek
        },
        getWeekData() {
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('getAdivserUserLevelWeeklyRankingList'), (res) => {
                if (res.code == 200) {
                    console.log(res)
                    //console.log(res.data.current.date.number)
                    wx.hideLoading();
                    this.isAdviser = res.data.is_adviser
                    this.pervWeekData = res.data.pre.list.slice(0, 3)
                    this.pervWeekData2 = res.data.pre.list.slice(3, 10)
                    this.curWeekData = res.data.current.list.slice(0, 3)
                    this.curWeekData2 = res.data.current.list.slice(3, 10)
                    this.curUserInfo = res.data.current.user
                    this.curTime = res.data.current.date
                    this.curNumber = res.data.current.date.number

                    $.log(this.curWeekData2)

                    {
                        let us = res.data.pre.list.slice(0, 3)


                        us.forEach(n => {
                            n.prizeVal = n.prize.dec.split('，')[0].slice(0, 10)
                        })

                        this.pervWeekData = us
                    }


                    //console.log(this.curNumber)
                    $.post($.url('getWeeklyPrizeListByNumber?number=' + res.data.current.date.number + '&type=1'), (res) => {
                        if (res.code == 200) {
                            console.log(res)
                            this.prizeList = res.data.list
                            this.bottomRemarks = res.data.bottom_remarks
                        }
                    })
                }

            })
        },

        getUserWeekData() {
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('getUserLevelWeeklyRankingList'), (res) => {
                if (res.code == 200) {
                    console.log(res)
                    //console.log(res.data.current.date.number)
                    wx.hideLoading();
                    this.curUserWeekData = res.data.current.list.slice(0, 3)
                    this.userPervWeekData2 = res.data.pre.list.slice(3, 10)
                    this.curUserWeekData2 = res.data.current.list.slice(3, 10)
                    this.curUserInfo = res.data.current.user
                    this.curTime = res.data.current.date
                    this.curNumber = res.data.current.date.number

                    {
                        let us = res.data.pre.list.slice(0, 3)


                        us.forEach(n => {
                            n.prizeVal = n.prize.dec.split('，')[0].slice(0, 10)
                        })

                        this.userPervWeekData = us
                    }



                    //console.log(this.curNumber)
                    $.post($.url('getWeeklyPrizeListByNumber?number=' + res.data.current.date.number + '&type=2'), (res) => {
                        if (res.code == 200) {
                            console.log(res)
                            this.prizeList = res.data.list
                        }
                    })
                }

            })
        },

        toCwgwPage() {
            wx.navigateTo({
                url: '../applicationConsultant/main'
            })
        },

        toRulePage() {
            wx.navigateTo({
                url: '../pointRule/main'
            })
        },
        toRwPage() {
            wx.navigateTo({
                url: '../sign/main'
            })
        },
        tabLi(tabVal) {
            this.curIndexTab = tabVal
            if (tabVal == 'gw') {
                this.isBestGw = true
                this.isBestUser = false
                this.getWeekData()
                this.isAdviser = false
            } else if (tabVal == 'user') {
                this.isBestGw = false
                this.isBestUser = true
                this.getUserWeekData()
                this.isAdviser = true
            }
        }

    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }

        //添加分享记录
        // let self = this
        // let url = '/pages/rankingList/main?id=' + self.o.id + '&inviterId=' + self.inviterId + '&local_tip=problemInfo';
        $.post($.url('shareAnswer'), {
            answer_id: '',
            type: 1
        }, function (res) {
            console.log(res)
        })
        return {
            title: '财税问诊财税大咖',
            path: '/pages/index/main?local_tip=rankingList',
            //                path: '/pages/questionShareStep2/main?+id='+ o.id ,
            //                path: 'http://www.baidu.com',
            imageUrl: 'https://static.cgkc.com/miniprogram/sharePtImg.jpg',
        }
    },
    //下拉刷新推荐数据
    onPullDownRefresh: function () {
        if (this.curIndexTab == 'gw') {
            this.getWeekData()
            wx.stopPullDownRefresh()
        } else if (this.curIndexTab == 'user')
            this.getUserWeekData()
        wx.stopPullDownRefresh()
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
