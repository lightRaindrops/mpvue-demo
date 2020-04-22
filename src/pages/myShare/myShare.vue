<template>
    <section class="myShareBox" @click="cancelShare">
        <div class="topTab">
            <ul>
                <li
                    v-if="!isAdviser"
                    :class="{act:curTab=='tiwen'}"
                    @click="changeTab('tiwen')"
                >我的提问</li>
                <li v-if="isAdviser" :class="{act:curTab=='tiwen'}" @click="changeTab('tiwen')">我的解答</li>
                <li :class="{act:curTab=='share'}" @click="changeTab('share')">我的分享</li>
            </ul>
        </div>

        <div class="tabTiwenCont">
            <div class="filerCont" v-show="isShowMytiwen">
                <!--我的提问 start-->
                <ul v-if="!isAdviser">
                    <li v-for="(item,index) in myTiwenData" :key="index" @click="toQuestionsInfoAll(item.question_id,item.answer_id)">

                        <div class="headInfo">
                            <div class="headImg">
                                <img :src="item.head_url" />
                            </div>
                            <div class="nameBox">
                                <div class="name">
                                    <span>{{item.cpa_type}}</span>
                                    <span>{{item.adviser_name}}</span> 回答了问题
                                </div>
                                <div class="jy">{{item.cpa_time}}年 | 会计师事务所工作经验</div>
                            </div>
                        </div>
                        <div class="descInfo">{{item.title}}</div>
                        <div class="countInfo">
                            <span class="flowCount">{{item.listen_num}}人旁听</span>
                            <span class="flowCount">{{item.zan}}人点赞</span>
                            <span class="jz">价值￥{{item.consult_pay}}</span>
                            <span class="ptBtn" @click.stop="showShareBottom(item)">
                                <span>分享</span>
                            </span>
                        </div>
                    </li>
                    <li style="color:#999;text-align: center" v-if="myTiwenData.length===0">
                        <img
                            style="width:750rpx;height:397rpx"
                            src="https://static.cgkc.com/miniprogram/mini/wx/img/noData.png"
                        />
                        <span>暂无数据</span>
                    </li>
                </ul>
                <!--我的提问 start-->

                <!--我的解答 start-->
                <ul v-if="isAdviser">

                    <li v-for="(answer,index) in tiwenAnswerData" :key="index" @click="toQuestionsInfoAll(answer.question_id,answer.answer_id)">

                        <div class="desc">{{answer.intro}}</div>
                        <div class="btnBox">
                            <div
                                class="tip"
                                style="margin-top:20rpx;margin-right:20rpx;"
                            >{{answer.created_at}}</div>
                            <div class="tip" style="margin-top:20rpx">{{answer.listen_num}}人旁听</div>
                            <button
                                class="goOnShareBtn"
                                @click.stop="showShareBottom(answer)"
                                style="width:125rpx;"
                            >分享</button>
                        </div>
                    </li>
                    <li style="color:#999;text-align: center" v-if="tiwenAnswerData.length===0">
                        <img
                            style="width:750rpx;height:397rpx"
                            src="https://static.cgkc.com/miniprogram/mini/wx/img/noData.png"
                        />
                        <span>暂无数据</span>
                    </li>
                </ul>
                <!--end 我的解答-->
            </div>

            <div class="shareCont" v-show="isShowMyShare">
                <ul>
                    <li v-for="(item,index) in myShareData" :key="index" @click="toQuestionsInfoAll(item.question_id,item.answer_id)">
                        <div class="desc">{{item.title}}</div>
                        <div class="btnBox">
                            <div class="firendsHeads">
                                <span
                                    class="itemList itemList2"
                                    v-for="(list,i) in item.share_user_list"
                                    :key="i"
                                >
                                    <img mode="widthFix" :src="list.photo" />
                                </span>
                            </div>
                            <div class="tip">等好友查看</div>
                            <button class="goOnShareBtn" @click.stop="showShareBottom(item)">继续分享</button>
                        </div>
                    </li>
                    <li style="color:#999;text-align: center" v-if="myShareData.length===0">
                        <img
                            style="width:750rpx;height:397rpx"
                            src="https://static.cgkc.com/miniprogram/mini/wx/img/noData.png"
                        />
                        <span>暂无数据</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="share" v-if="currentShare.question_info">
            <div class="shareBottom">
                <van-popup
                    class="share-popup"
                    :show="isShowShareBottom"
                    position="bottom"
                    :overlay="true"
                    custom-style="height:500px; width:100%; padding:25px 12px; box-shadow:0 0 5px rgba(0,0,0,0.2); border-radius:20px 20px 0 0; overflow:hidden;"
                >
                    <div class="top">
                        <div class="title">越分享 越开心</div>
                        <div class="intro">邀请好友一起学习</div>
                        <div class="shareContentWrap">
                            <div class="shareContent">
                                <div class="tit">{{currentShare.question_info.title}}</div>
                                <div class="ny">{{currentShare.question_info.intro}}</div>
                            </div>
                            <div class="gwInfo fx">
                                <div class="img">
                                    <img :src="currentAdv.photo" alt />
                                </div>
                                <div class="txt fx1">
                                    <div class="ttt">{{currentAdv.name}}财税大咖的解析！</div>
                                    <span class="jz">价值{{currentAdv.consult_pay}}元</span>好友只要1元学习
                                </div>
                            </div>
                        </div>
                        <div class="youhui">
                            <div class="line">好咖啡要和朋友一起品尝，好知识也要和朋友一起分享</div>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="t t1">
                            <button class="btn" open-type="share">
                                <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin.png" />
                            </button>
                            <div>分享给朋友</div>
                        </div>
                        <div class="t t2">
                            <button @click="show()" id="tj_shengchenghaibao">
                                <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/poster.png" />
                            </button>
                            <div>生成海报</div>
                        </div>
                    </div>
                </van-popup>
            </div>
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
export default {
    name: 'myShare',
    data() {
        return {
            isShowMytiwen: true,
            isShowMyShare: false,
            curTab: 'tiwen',
            tiwenAnswerData: [],
            myTiwenData: [],
            myShareData: [],
            isAdviser: '',
            //share
            pageHeight: $.windowHeight,
            currentShare: {},
            qrcodeSrc: '',
            inviteCode: '',
            isShowShare: false,
            isShowShareBottom: false,
            canvasWidth: $.windowWidth * 0.75,
            canvasHeight: $.windowWidth / 750 * 1334 * 0.7,
            canvasStyle: '',
            qrcodeUrl: '', //邀请小程序码
            userId: '',
            currentQuesId: '',
            currentAdv: {}
        }
    },
    computed: {
        shareBg() {
            return $.imgUrl('qing/img/inviteGoodFriends/shareBg.jpg')
        },
    },
    watch: {
        currentShare(val) {
            if (this.isAdviser) {
                this.currentAdv = this.currentShare.adviser_info
            } else {
                this.currentAdv = this.currentShare.adviser_info
            }
        }
    },
    onLoad() {
        let t = this
        this.getMyTiwenData()
        this.getCheckingData()
        this.getMyQusitionsData()
        this.getShareData()
        //分享
        {
            $.post($.url('userCenterData'), function (res) {
                t.inviteCode = res.data.inviteCode
                t.userId = res.data.userId
            })
            t.canvasStyle = 'width:' + t.canvasWidth + 'px; height:' + t.canvasHeight + 'px;'
        }
    },
    onShareAppMessage(res) {

        let t = this;
        let title = t.currentShare.question_info.title
        let id = this.currentQuesId
        let imageUrl = $.imgUrl('/qing/img/woyaofenxiang.jpg')

        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title,
            path: '/pages/index/main?local_tip=inviteGoodFriends&q=' + id + '&i=' + t.userId,
            imageUrl: imageUrl,
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },

    //下拉刷新推荐数据
    onPullDownRefresh: function () {
        this.getMyTiwenData()
        this.getCheckingData()
        this.getMyQusitionsData()
        this.getShareData()
        wx.stopPullDownRefresh()
    },

    methods: {

        toQuestionsInfoAll(id,ansId) {
            wx.navigateTo({
                url: '../ptInfo/main?id=' + id + '&answer_id=' + ansId
            })
        },

        cancelShare() {
            this.isShowShareBottom = false
        },
        showShareBottom(item) {
            this.isShowShareBottom = true
            let id = item.question_id
            $.pp($.url('getShareQuestionInfo'), { id }, res => {
                //$.log(res)
                res.question_info.intro = $.elliosisField(res.question_info.intro, 100)

                this.currentShare = res
                this.currentQuesId = id
                this.createMinParamQrcodeUrl(id)
            })
        },
        //share
        getMinParamInviteInviteUrl() {
            let t = this
            //获取邀请小程序码
            $.post($.url('getMinParamInviteUrl'), function (res) {
                t.qrcodeSrc = res.data.url;
                console.log(res.data.url);
            })
        },
        createMinParamQrcodeUrl(id) {
            //创建小程序码
            let self = this
            let scene = 'local_tip:itf:q:' + id + ':i:' + self.userId
            $.post($.url('createMinParamQrcodeUrl'), { scene }, function (res) {
                if (res.success) {
                    self.qrcodeUrl = res.data.url
                    console.log(res.data.url)
                    //绘制图
                    self.createImg()
                } else {
                    $.tip(res.msg)
                }
            })
        },
        //渲染canvas
        createImg() {
            let self = this
            const wxGetImageInfo = $.Promisify(wx.getImageInfo)
            const share = this.currentShare
            Promise.all([
                wxGetImageInfo({
                    src: self.shareBg
                }),
                wxGetImageInfo({
                    src: self.qrcodeUrl
                }),
                wxGetImageInfo({
                    src: share.inviter_info.photo
                }),
                wxGetImageInfo({
                    src: self.currentAdv.photo
                })
            ]).then(res => {
                const ctx = wx.createCanvasContext('shareCanvas')
                let left = 0
                let top = 0
                // 底图
                ctx.drawImage(res[0].path, left, top, self.canvasWidth, self.canvasHeight)

                // 小程序码
                let qrImgSize = self.canvasWidth * 0.2
                ctx.drawImage(res[1].path, qrImgSize * 2, self.canvasHeight * 0.8, qrImgSize * 1.1, qrImgSize * 1.1)



                //头像
                ctx.drawImage(res[2].path, self.canvasWidth * 0.42, self.canvasHeight * 0.2, 40, 40)



                let title = share.question_info.title
                let intro = share.question_info.intro
                let canW = self.canvasWidth
                let canH = self.canvasHeight

                //设置邀请标题
                {
                    ctx.setFontSize(14)
                    ctx.setTextAlign('center')
                    ctx.setFillStyle('#d2482e')

                    ctx.fillText(share.inviter_info.name + "邀请您一起学习", canW * 0.5, canH * 0.33);
                }

                createText(title, 2, 'bt')

                //设置顾问头像

                {
                    ctx.drawImage(res[3].path, self.canvasWidth * 0.14, self.canvasHeight * 0.575, 40, 40)
                }

                //设置一些文本

                {
                    let t = this.currentAdv.name + '财税大咖的解析！'
                    let b = '价值' + this.currentAdv.consult_pay + '元  好友只要1元学习'
                    ctx.setFontSize(10)
                    ctx.setTextAlign('left')
                    ctx.setFillStyle('#fff')

                    ctx.fillText(t, canW * 0.30, canH * 0.61);
                    ctx.fillText(b, canW * 0.30, canH * 0.64);
                }

                //设置分享优惠

                // {
                //     let t = '每分享一位好友，还有机会获得0.7~1元'
                //     ctx.setFontSize(10)
                //     ctx.setTextAlign('center')
                //     ctx.setFillStyle('#d2482e')
                //
                //     ctx.fillText(t, canW * 0.50, canH * 0.74);
                //
                // }







                function createText(txt, lineNum, name) {
                    let chr = txt.split("");
                    let temp = "";
                    var row = [];

                    ctx.setTextAlign('left')
                    ctx.setFillStyle('#323232')
                    ctx.setFontSize(16)

                    for (var a = 0; a < chr.length; a++) {
                        if (name == 'ans') {
                            if (ctx.measureText(temp).width < self.canvasWidth * 0.65) {
                                temp += chr[a];
                            } else {
                                a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                                row.push(temp);
                                temp = "";
                            }
                        } else {
                            if (ctx.measureText(temp).width < self.canvasWidth * 0.65) {
                                temp += chr[a];
                            } else {
                                a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                                row.push(temp);
                                temp = "";
                            }
                        }
                    }
                    row.push(temp);

                    //如果数组长度大于指定行数 则截取前两个
                    if (row.length > lineNum) {
                        if (name == 'ans') {
                            var rowCut = row.slice(0, 4);
                            var rowPart = rowCut[3];
                        } else if (name == 'bt') {
                            var rowCut = row.slice(0, 2);
                            var rowPart = rowCut[1];
                        }
                        // console.log(rowPart);
                        var test = "";
                        var empty = [];
                        for (var a = 0; a < rowPart.length; a++) {
                            if (ctx.measureText(test).width < canW * 0.65) {
                                test += rowPart[a];
                            } else {
                                break;
                            }
                        }
                        empty.push(test);
                        var group = empty[0] + "..."
                        if (name == 'ans') {
                            rowCut.splice(3, 1, group);
                        } else if (name == 'bt') {
                            rowCut.splice(1, 1, group);
                        }
                        row = rowCut;
                    }

                    for (var b = 0; b < row.length; b++) {
                        if (name == 'bt') {
                            if (row.length == 1) {
                                ctx.fillText(row[b], canW * 0.1, (canH / 2.25) - 0.5);
                                ctx.fillText(row[b], canW * 0.1 - 0.5, (canH / 2.25));
                            } else {
                                ctx.fillText(row[b], canW * 0.13, (canH / 2.25) + b * canH * 0.05);
                            }
                        } else if (name == 'ans') {
                            ctx.setFontSize(12)
                            ctx.fillText(row[b], canW * 0.15, (canH / 1.6) + b * canH * 0.04);
                        } else if (name == 'name') {
                            ctx.setFontSize(12)
                            ctx.fillText(row[b], canW * 0.29, canH * 0.56);
                        }

                    }
                }


                ctx.stroke()
                ctx.draw()
            })
        },
        //保存到本地
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
        show() {
            this.isShowShare = true
        },
        close() {
            this.isShowShare = false
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
                }
            })

        },
        getMyTiwenData() {
            $.post($.url('myShareAnswer'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    //console.log(res)
                    this.tiwenAnswerData = res.data.list.list
                } else {
                    $.tip(res.msg)
                }
            })
        },
        getMyQusitionsData() {
            $.post($.url('myShareQuestion'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    console.log(res)
                    this.myTiwenData = res.data.list.list
                } else {
                    $.tip(res.msg)
                }
            })
        },

        getShareData() {
            $.post($.url('myShare'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    console.log(res)
                    this.myShareData = res.data.list.list
                } else {
                    $.tip(res.msg)
                }
            })
        },
        changeTab(type) {
            if (type === 'tiwen') {
                this.curTab = 'tiwen'
                this.isShowMytiwen = true
                this.isShowMyShare = false
            } else if (type === 'share') {
                this.curTab = 'share'
                this.isShowMytiwen = false
                this.isShowMyShare = true
            }
        }
    }


}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
