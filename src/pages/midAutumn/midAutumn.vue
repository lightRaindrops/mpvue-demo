<template>
    <section class="midAutumnBox">
        <div class="mainTop">
            <div class="kj" @click="openLpPopUp">
                <img mode="widthFix" src="https://static.cgkc.com/miniprogram/midKjBox02.gif" />
            </div>
            <div class="jp" @click="openLpPopUp"></div>
            <div class="moreKj" @click="toTaskCenter" v-if="lotteryNum===0">我要更多开宝箱机会</div>
            <div class="moreKj" @click="openLpPopUp" v-if="lotteryNum>0">点我开宝箱</div>
            <div class="num">
                <span class="left"></span>您还有
                <span style="color:#FFCD36;">{{lotteryNum}}</span>次开宝箱机会
                <span class="right"></span>
            </div>
        </div>
        <div class="jpList">
            <div class="listBox" v-if="moonListData.length>0">
                <div class="item ypIcon_act" :class="{'ypIcon':moonListData[0].user_num>0}"></div>
                <div class="item ypIcon05_act" :class="{'ypIcon05':moonListData[1].user_num>0}"></div>
                <div class="item ypIcon03_act" :class="{'ypIcon03':moonListData[2].user_num>0}"></div>
                <div class="item ypIcon04_act" :class="{'ypIcon04':moonListData[3].user_num>0}"></div>
                <div class="item ypIcon02_act" :class="{'ypIcon02':moonListData[4].user_num>0}"></div>

                <div class="jdCount">剩余{{cardNum}}张</div>
            </div>
            <div class="myPrize" @click="toMyPrizePage">我的奖品 ></div>
        </div>
        <div class="footer">
            <div class="content">
                <p v-html="ruleTip"></p>
            </div>
            <div class="shareBtn" @click="onShareClick">戳我！将活动分享给好友</div>
        </div>

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
                    <div class="prizeName" v-else>{{jpName}}</div>
                </div>
            </div>
        </div>
        <!--end 宝箱打开弹窗-->
    </section>
</template>

<script>
import $ from '@/common'
const ctx = wx.createCanvasContext('shareCanvas')
export default {
    name: 'midAutumn',
    data() {
        return {
            isShowLpPopUp: false,//是否显示宝箱弹窗

            isShareShow: false,//是否先隐藏选择分享的类型弹窗
            isShowShare: false,//是否显示生成海报弹窗
            qrcodeSrc: '',
            canvasWidth: $.windowWidth * 0.75,
            canvasHeight: $.windowWidth / 750 * 1334 * 0.7,
            canvasStyle: '',
            qrcodeUrl: '', //邀请小程序码
            inviteBack: '',

            lotteryNum: 0,//抽奖次数
            jpImgUrl: '',//奖品图片url
            rewardType: '',//奖品的类型
            jpName: '',//奖品名称
            jpValue: '',//奖品值
            ruleTip: '',
            moonListData: [],
            cardNum: 0
        }
    },

    onLoad() {
        this.getBackgroundImg()
        this.canvasStyle = 'width:' + this.canvasWidth + 'px; height:' + this.canvasHeight + 'px;'
        this.createMinParamQrcodeUrl()

        this.getlotteryNum()
        this.getMidRule()
    },

    onShow() {
        if ($.isFinishTask) {
            this.getlotteryNum()
            $.isFinishTask = false
        }
    },

    methods: {

        //跳转到任务中心页面
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

        //获取活动规则
        getMidRule() {
            let that = this;
            $.post($.url('getConfigDictKeyword'), {
                keyword: 'activeMidAutumn'
            }, function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    console.log(res)
                    that.ruleTip = res.data
                }
            })
        },

        //获取是否有抽奖次数
        getlotteryNum() {
            let that = this;
            $.post($.url('lotteryActivityMidAutumnConfig'), function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {

                    that.lotteryNum = res.data.lottery_num
                    that.cardNum = res.data.cardNum
                    that.moonListData = res.data.moonList

                }
            })
        },


        getBackgroundImg() {
            let that = this
            $.post($.url('config'), function (res) {
                //console.log('8888888'+res.data.share_mid_autumn)
                that.inviteBack = res.data.share_mid_autumn
                //console.log(that.inviteBack)
            })
        },
        createMinParamQrcodeUrl() {
            let self = this;
            $.post($.url('userCenterData'), function (res) {
                //console.log(res.data.inviteCode)
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


        //打开礼品宝箱查看开奖
        openLpPopUp() {
            $.np('isLogin').then(res => {
                if (!res.isLogin) {
                    $.go('../userLogin/main?key=midAutumn')
                } else {
                    if (this.lotteryNum === 0) {
                        $.tip('做任务获得更多开宝箱机会')
                    } else {
                        let that = this
                        $.post($.url('lotteryActivityMidAutumnStart'), function (res) {
                            if (!res.success) {
                                $.tip(res.msg)
                            } else {
                                console.log(res)
                                that.isShowLpPopUp = true
                                that.jpImgUrl = res.data.prize_photo
                                that.rewardType = res.data.reward_type
                                that.jpName = res.data.prize_name
                                that.jpValue = res.data.prize_code
                                that.getlotteryNum()
                                setTimeout(() => {
                                    that.isShowLpPopUp = false
                                }, 3000)
                                //that.lotteryNum = res.data.lottery_num

                                // let  rewardId= res.data.reward_id
                                //
                                // that.moonListData.forEach(item=>{
                                //     if(rewardId===item.id){
                                //         that.jpName = item.name
                                //     }
                                // })

                            }
                        })

                    }
                }
            })

        },

        //关闭礼品宝箱查看开奖
        closeLpPopUp(e) {
            if (e.currentTarget.dataset.id) {
                this.isShowLpPopUp = false
            }
        },

        //点分享好友弹出选择分享好友和生成海报
        onShareClick() {
            console.log(this.isShareShow)
            this.isShareShow = true
        },
        closeSharePopup() {
            this.isShareShow = false
        },

        show() {
            this.isShowShare = true
        },
        close() {
            this.isShowShare = false
        },
        go(str) {
            let arr = str.split('?')
            let url = $.pageUrl(arr[0])
            if (arr[1]) {
                url = url + '?' + arr[1]
            }
            $.go(url)
        }
    },

    onShareAppMessage(res) {
        let t = this;
        //$.log(t.inviteCode)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '中秋开宝箱，集月饼领千元京东卡',
            //path: '/pages/fxActivity/main',
            path: '/pages/index/main?local_tip=midAutumn',
            imageUrl: 'https://static.cgkc.com/miniprogram/midShareImg02.jpg?v=666',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
