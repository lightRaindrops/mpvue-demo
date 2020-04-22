<template>
    <section class="fxActivityBox">
        <!--用户未参与 start-->
        <div class="activityTop" v-show="isShowUserNoJoin">
            <div class="date">活动时间：{{activityTime}}</div>
        </div>
        <!--end 用户未参与-->

        <!--用户参与 start-->
        <div class="activityTop2" v-show="isShowUserJoin">
            <div class="date">活动时间：{{activityTime}}</div>
            <div class="moneyList">
                <div class="money">
                    <div class="moneyTotal">{{userMoney}}</div>
                    <div class="moneyTip">可提现(元)</div>
                </div>
                <div class="line"></div>
                <div class="sz">
                    <div class="szTotal">{{userScore}}</div>
                    <div class="szTip">换礼品(算珠)</div>
                </div>
            </div>
            <div class="shareQuestionBtn" @click="toMySharePage">分享问题</div>
            <div class="moneyDesc" @click="toMingXiPage">收益明细</div>
        </div>
        <!--end 用户参与-->

        <!--顾问未参与 start-->
        <div class="gwActivityTop" v-show="isShowGwNoJoin">
            <div class="date">活动时间：{{activityTime}}</div>
        </div>
        <!--end 顾问未参与-->

        <!--顾问参与 start-->
        <div class="activityTop3" v-show="isShowGwJoin">
            <div class="date">活动时间：{{activityTime}}</div>

            <div class="shareCountBox">
                <div class="shareTotal">
                    <div class="shareInfo">我的价值</div>
                    <div class="nums">{{gwShareCount}}</div>
                </div>
                <div class="line"></div>
                <div class="cg">
                    <div class="cgInfo">超过了</div>
                    <div class="counts">
                        {{gwShareRatio}}%
                        <span>同行</span>
                    </div>
                </div>
            </div>

            <div class="shareQuestionBtn2" @click="toMySharePage">分享我的解答</div>
        </div>
        <!--end 顾问参与-->

        <div class="actContent">
            <div class="actDesc">
                <div class="fxzqBtn"></div>

                <!--顾问-->
                <div class="descText" v-if="isAdviser">{{descGwOne}}</div>
                <!--用户-->
                <div class="descText" v-else>{{descOne}}</div>

                <div class="twzqBtn" @click="toTiwenPage('fxActivity')" v-if="!isAdviser">立即提问参与活动</div>
                <div class="twzqBtn" @click="toFxActivityXsListPage()" v-if="isAdviser">答题冲榜</div>
            </div>

            <div class="sharePxb">
                <div>
                    <div v-if="isAdviser" class="title2"></div>
                    <div v-else class="title"></div>
                </div>

                <p class="tip" v-if="isAdviser">排行榜是答题数 + 分享数得出的总价值排行榜</p>
                <p class="tip" v-else>排行以算珠 + RMB的总价值进行排行</p>

                <!--用户分享前三名 start-->
                <div class="shareQsm" v-if="!isAdviser">
                    <ul>
                        <li v-for="(qsm,index) in qsmData" :key="index">
                            <div class="headerImg">
                                <img mode="widthFix" :src="qsm.photo" />
                            </div>
                            <div class="pmIcon"></div>
                            <div class="name">{{qsm.name}}</div>
                            <div class="value">{{qsm.reward}}</div>
                        </li>
                    </ul>
                </div>
                <!-- end 用户分享前三名 -->

                <!--顾问解答前三名 start-->
                <div class="shareQsm" v-if="isAdviser">
                    <ul>
                        <li v-for="(qsm,index) in gwQsmData" :key="index">
                            <div class="headerImg">
                                <img mode="widthFix" :src="qsm.photo" />
                            </div>
                            <div class="pmIcon"></div>
                            <div class="name">{{qsm.name}}</div>
                            <div class="value">{{qsm.total}}</div>
                        </li>
                    </ul>
                </div>
                <!-- end 顾问解答前三名 -->

                <div class="shareSyPx">
                    <div class="pxHead">
                        <ul>
                            <li>排名</li>
                            <li>头像</li>
                            <li>昵称</li>
                            <li>总价值(元)</li>
                        </ul>
                    </div>
                    <!--用户分享排行后六名 start-->
                    <div class="pxCont" v-if="!isAdviser">
                        <div class="items" v-for="(hlm,index) in hlmData" :key="index">
                            <div class="num">{{hlm.num}}</div>
                            <div class="hImg">
                                <img mode="widthFix" :src="hlm.photo" />
                            </div>
                            <div class="user">{{hlm.name}}</div>
                            <div class="total">{{hlm.reward}}</div>
                        </div>
                    </div>
                    <!-- end 用户分享排行后六名-->

                    <!--顾问解答排行后六名 start-->
                    <div class="pxCont" v-if="isAdviser">
                        <div class="items" v-for="(hlm,index) in gwHlmData" :key="index">
                            <div class="num">{{hlm.num}}</div>
                            <div class="hImg">
                                <img mode="widthFix" :src="hlm.photo" />
                            </div>
                            <div class="user">{{hlm.name}}</div>
                            <div class="total">{{hlm.total}}</div>
                        </div>
                    </div>
                    <!-- end 顾问解答排行后六名-->

                    <div class="actInfo">
                        <div class="infoTitle">
                            <span class="line"></span>
                            <span class="txt">活动详情</span>
                            <span class="line"></span>
                        </div>
                        <!--<div class="tipInfo">排名数据每天凌晨更新一次</div>-->
                        <!--用户-->
                        <div class="descInfo" v-if="!isAdviser">{{descTwo}}</div>
                        <!--顾问-->
                        <div class="descInfo" v-if="isAdviser">{{descGwTwo}}</div>
                    </div>
                </div>
            </div>

            <div class="lpBox">
                <div class="lpTitle"></div>
                <div class="lpContent">
                    <ul>
                        <li
                            v-for="(item,index) in lpData"
                            :key="index"
                            @click="go('pointsExchange?id=' + item.id)"
                        >
                            <div class="shopImg">
                                <img :src="item.pic" />
                            </div>
                            <p class="shopTitle">{{item.name}}</p>
                            <div class="btnBox">
                                <span>
                                    {{item.point}}
                                    <span class="mark">算珠</span>
                                </span>
                                <a class="thbtn" href="javascript:;">兑换</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <button class="hitShare" @click="onShareClick" v-show="isShowShareBtn">戳我！把活动分享给好友</button>

            <div class="activityRule" @click="toFxActivityRule">活动规则</div>

            <van-popup
                class="share-popup"
                :show="isShareShow"
                position="bottom"
                :overlay="true"
                custom-style="height:120px;width:110%;"
                @click="closeSharePopup"
            >
                <div class="bottom">
                    <div class="t t1">
                        <button class="btn" open-type="share">
                            <img
                                src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin.png"
                            />
                        </button>
                        <div>分享给朋友</div>
                    </div>
                    <div class="t t2">
                        <button @click="show()">
                            <img
                                src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/poster.png"
                            />
                        </button>
                        <div>生成海报</div>
                    </div>
                </div>
            </van-popup>

            <van-popup
                class="share-popup"
                :show="isShowShare"
                custom-style="height:100%;width:100%;background:none;"
            >
                <div
                    class="fx"
                    style="flex-direction:column; align-items:center; justify-content:center; height:100%;"
                >
                    <canvas canvas-id="shareCanvas" :style="canvasStyle"></canvas>
                    <div class="save-btn" @click="saveShareImg()">
                        <span class="iconfont icon-xiazai"></span>保存图片
                    </div>
                </div>
                <span class="iconfont icon-guanbi close" @click="close()"></span>
            </van-popup>
        </div>
    </section>
</template>

<script>
import $ from '@/common'
const ctx = wx.createCanvasContext('shareCanvas')
export default {
    name: 'index',
    data() {
        return {
            descOne: '',
            descGwOne: '',
            descTwo: '',
            descGwTwo: '',
            qsmData: [],
            gwQsmData: [],
            hlmData: [],
            gwHlmData: [],
            activityTime: '',
            lpData: [],
            userMoney: 0,
            userScore: 0,
            gwShareCount: 0,
            gwShareRatio: 0,

            isAdviser: '',
            isAdviserJoin: false,
            isUserJoin: false,

            isShowUserNoJoin: false,
            isShowUserJoin: false,
            isShowGwNoJoin: false,
            isShowGwJoin: false,

            isShareShow: false,
            isShowShare: false,
            qrcodeSrc: '',
            canvasWidth: $.windowWidth * 0.75,
            canvasHeight: $.windowWidth / 750 * 1334 * 0.7,
            canvasStyle: '',
            qrcodeUrl: '', //邀请小程序码
            inviteBack: '',
            isShowShareBtn: false
        }
    },

    onLoad() {
        this.getLpShopList()
        this.getCheckingData()
        this.getSharePxData()
        this.getGwAnswerPxData()
        this.getBackgroundImg()
        this.canvasStyle = 'width:' + this.canvasWidth + 'px; height:' + this.canvasHeight + 'px;'
        this.createMinParamQrcodeUrl()
    },

    methods: {
        getBackgroundImg() { 
            let that = this
            $.post($.url('config'), function (res) {
                that.inviteBack = res.data.share_back1
                console.log(that.inviteBack)
            })
        },
        createMinParamQrcodeUrl() {
            let self = this;
            $.post($.url('userCenterData'), function (res) {
                console.log(res.data.inviteCode)
                let scene = 'local_tip:fxActivity';
                //创建小程序码
                $.post($.url('createMinParamQrcodeUrl'), { scene: scene }, function (res) {
                    if (res.success) {
                        self.qrcodeUrl = res.data.url
                        console.log(res.data.url);
                        //绘制图
                        self.createImg()
                    } else {
                        $.tip(res.msg)
                    }
                })
            })

        },
        //渲染canvas
        createImg() {
            let self = this
            const wxGetImageInfo = $.Promisify(wx.getImageInfo)
            Promise.all([
                wxGetImageInfo({
                    src: self.inviteBack
                }),
                wxGetImageInfo({
                    src: self.qrcodeUrl
                }),
            ]).then(res => {
                const ctx = wx.createCanvasContext('shareCanvas')

                let left = 0
                let top = 0
                // 底图
                ctx.drawImage(res[0].path, left, top, self.canvasWidth, self.canvasHeight)

                // 小程序码
                // let qrImgSize = self.canvasWidth * 0.2
                // ctx.drawImage(res[1].path, qrImgSize * 1.9, self.canvasHeight * 0.78, qrImgSize * 1.1, qrImgSize * 1.1)

                ctx.stroke()
                ctx.draw()
            })
        },

        saveShareImg() {

            const wxCanvasToTempFilePath = $.Promisify(wx.canvasToTempFilePath)
            const wxSaveImageToPhotosAlbum = $.Promisify(wx.saveImageToPhotosAlbum)

            let self = this

            wxCanvasToTempFilePath({
                canvasId: 'shareCanvas',
                destWidth: 750,
                destHeight: 1334
            }, this).then(res => {
                return wxSaveImageToPhotosAlbum({
                    filePath: res.tempFilePath
                })
            }).then(res => {
                wx.showToast({
                    title: '已保存到相册'
                })
            })
        },
        shareToPoster() {
            $.showLoading();
            let t = this
            wx.downloadFile({
                url: t.qrcodeSrc,     //仅为示例，并非真实的资源  
                success: function (res) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容  
                    if (res.statusCode === 200) {
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success(res) {
                                t.isShowShare = false
                                $.tip('保存图片成功');
                            },
                            fail(res) {
                                t.isShowShare = false
                                $.tip('保存图片失败');
                            }
                        })
                    }
                }
            })
        },

        show() {
            this.isShowShare = true
        },
        close() {
            this.isShowShare = false
        },
        closeSharePopup() {
            this.isShareShow = false
        },
        onShareClick() {
            this.isShareShow = true
        },
        go(str) {
            let arr = str.split('?')
            let url = $.pageUrl(arr[0])
            if (arr[1]) {
                url = url + '?' + arr[1]
            }
            $.go(url)
        },
        toFxActivityRule() {
            wx.navigateTo({
                url: '../fxActivityRule/main'
            })
        },
        toTiwenPage(type) {
            wx.navigateTo({
                url: '../tiwen/main?type=' + type
            })
        },

        toFxActivityXsListPage() {
            wx.navigateTo({
                url: '../fxActivityXsList/main'
            })
        },
        toMySharePage() {
            wx.navigateTo({
                url: '../myShare/main'
            })
        },
        toMingXiPage() {
            wx.navigateTo({
                url: '../mingxi/main'
            })
        },

        getLpShopList() {
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('getPointProductList'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    this.lpData = res.data.list.list.slice(0, 8)
                } else {
                    $.tip(res.msg)
                }
            })
        },

        getCheckingData() {
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('listenginShareCheck'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    //console.log(res)

                    this.isAdviser = res.data.is_adviser

                    this.isShowGwJoin = false
                    this.isShowGwNoJoin = false
                    this.isShowUserJoin = false
                    this.isShowUserNoJoin = false

                    if (res.data.is_adviser && res.data.is_adviser_join) {//顾问参与
                        this.isShowGwJoin = true
                    } else if (res.data.is_adviser && !res.data.is_adviser_join) {//顾问未参与
                        this.isShowGwNoJoin = true
                    } else if (!res.data.is_adviser && res.data.is_user_join) {//用户参与
                        this.isShowUserJoin = true
                    } else if (!res.data.is_adviser && !res.data.is_user_join) {//用户未参与
                        this.isShowUserNoJoin = true
                    }

                    console.log(this.isShowGwJoin)
                    console.log(this.isShowGwNoJoin)
                    console.log(this.isShowUserJoin)
                    console.log(this.isShowUserNoJoin)

                } else {
                    $.tip(res.msg)
                }
            })
        },

        getSharePxData() {
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('getListeningShareRankingList'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    //console.log(res)
                    this.activityTime = res.data.time_group
                    this.descOne = res.data.intro1
                    this.descTwo = res.data.intro2
                    this.qsmData = res.data.list.slice(0, 3)
                    this.hlmData = res.data.list.slice(3, 10)
                    this.userMoney = res.data.purse.money
                    this.userScore = res.data.purse.score
                } else {
                    $.tip(res.msg)
                }
            })
        },

        getGwAnswerPxData() {
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('getAdviserAnswerRankingList'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    //console.log(res.data.list)
                    this.descGwOne = res.data.intro1
                    this.descGwTwo = res.data.intro2
                    this.gwQsmData = res.data.list.slice(0, 3)
                    this.gwHlmData = res.data.list.slice(3, 10)
                    //value_group:{count: 2, ratio: 0}
                    this.gwShareCount = res.data.value_group.count
                    this.gwShareRatio = res.data.value_group.ratio
                } else {
                    $.tip(res.msg)
                }
            })
        }
    },

    onPageScroll(e) {
        if (e.scrollTop >= 600) {
            this.isShowShareBtn = true
        } else {
            this.isShowShareBtn = false
        }
    },

    onShareAppMessage(res) {
        let t = this;
        return {
            title: '分享赚钱 冲榜领京东卡',
            path: '/pages/index/main?local_tip=fxActivity',
            imageUrl: 'https://static.cgkc.com/miniprogram/shareOutImgBg2.jpg?v=666'
        }
    },

    //下拉刷新推荐数据
    onPullDownRefresh: function () {
        this.getLpShopList()
        this.getCheckingData()
        this.getSharePxData()
        this.getGwAnswerPxData()
        wx.stopPullDownRefresh()
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
