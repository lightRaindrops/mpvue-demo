<template>
    <div v-if="isLoaded">
        <div class="all" :style="'min-height:'+winHeight+'px'" @click="close">
            <div class="bg">
                <img :src="inviteConsultantsBg" class="bg" mode="aspectFit" />
            </div>
            <div class="main">
                <div :style="wdyqBg" class="wdyq" v-if="user">
                    <div class="fx datas">
                        <div class="item fx1" @click="go('invitationList','?status=0')">
                            <div class="num">{{user.sucess}}</div>
                            <div class="txt">成功邀请(人)</div>
                        </div>
                        <div class="item fx1">
                            <div class="num">{{user.money}}</div>
                            <div class="txt">累计红包(元)</div>
                        </div>
                        <div class="item fx1" @click="go('invitationList','?status=1')">
                            <div class="num">{{user.fail}}</div>
                            <div class="txt">未成功(人)</div>
                        </div>
                    </div>
                    <button class="sbtn" @click="onShareClick" style="margin-top:30rpx">继续邀请赚更多</button>
                </div>
                <div class="yqcgnhhyjhd" :style="yqcgnhhyjhd">
                    <div class="fx datas">
                        <div class="item fx1">18.8元</div>
                        <div class="item fx1">888.8元</div>
                    </div>
                </div>
                <div class="yqhygl" :style="yqhygl"></div>
                <div class="cjcknd" :style="cjcknd"></div>
                <div style="background:#ffe5bc;">
                    <choujiang @stopLuck="stopLuck"></choujiang>
                </div>
                <div class="yqphbWrap">
                    <div class="yqphb">
                        <img :src="yqphb" class="yqphb" mode="aspectFit" />
                    </div>
                    <div class="phb">
                        <div class="self fx" v-if="user">
                            <div class="img">
                                <img
                                    :src="user.photo"
                                    v-if="user.photo"
                                    class="face"
                                    mode="aspectFit"
                                />
                                <img :src="defaultFace" v-else class="face" mode="aspectFit" />
                            </div>
                            <div class="txt fx1">
                                <div class="name">{{user.name}}</div>
                                <div class="dqpm">当前排名{{user.sort}}</div>
                            </div>
                            <div class="money">¥{{user.money}}</div>
                        </div>
                        <div class="list">
                            <div class="fx top">
                                <div class="one">排名</div>
                                <div class="two fx1">用户名</div>
                                <div class="three">总收入</div>
                            </div>
                            <div class="item fx" v-for="(i,index) in list" :key="index">
                                <div class="one" v-if="index>2">{{index+1}}</div>
                                <div class="one" v-else-if="index == 0">
                                    <img :src="one" class="icon" mode="aspectFit" />
                                </div>
                                <div class="one" v-else-if="index == 1">
                                    <img :src="two" class="icon" mode="aspectFit" />
                                </div>
                                <div class="one" v-else-if="index == 2">
                                    <img :src="three" class="icon" mode="aspectFit" />
                                </div>
                                <div class="two fx1">
                                    <div class="fx">
                                        <div class="img">
                                            <img
                                                :src="i.photo"
                                                v-if="i.photo"
                                                class="face"
                                                mode="aspectFit"
                                            />
                                            <img
                                                :src="defaultFace"
                                                v-else
                                                class="face"
                                                mode="aspectFit"
                                            />
                                        </div>
                                        <div class="txt fx1">
                                            <div class="name">{{i.name}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="three">¥{{i.money}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="yqhy" v-if="isShareShow" @click="onShareClick">邀请好友</div>
            </div>
        </div>
        <van-popup
            class="share-popup"
            :show="isShareShow2"
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
</template>

<style lang="less" scoped>
@import "../../less/common.less";
@import "./main.less";
</style>


<script>
import $ from '@/common'
import choujiang from '@/components/choujiang.vue'

export default {
    data() {
        return {
            isLoaded: false,
            pageHeight: $.windowHeight,
            res: {},
            isShow: false,
            isShareShow: false,
            isShareShow2: false,
            inviteCode: '',
            qrcodeSrc: '',
            isLogin: false,
            isShowShare: false,
            qrcodeSrc: '',
            canvasWidth: $.windowWidth * 0.75,
            canvasHeight: $.windowWidth / 750 * 1342 * 0.7,
            canvasStyle: '',
            qrcodeUrl: '', //邀请小程序码
            inviteBack: '',
            user: null,
            list: null
        }
    },
    computed: {
        defaultFace() {
            return $.$img('defaultFace.png')
        },
        inviteConsultantsBg() {
            return $.$img('inviteConsultants/bg.png')
        },
        one() {
            return $.$img('inviteConsultants/one.png')
        },
        two() {
            return $.$img('inviteConsultants/two.png')
        },
        three() {
            return $.$img('inviteConsultants/three.png')
        },
        winHeight() {
            return $.winHeight
        },
        wdyqBg() {
            return $.$bg('inviteConsultants/wdyq.png')
        },
        yqcgnhhyjhd() {
            return $.$bg('inviteConsultants/yqcgnhhyjhd.png')
        },
        yqphb() {
            return $.$img('inviteConsultants/yqphb.png')
        },
        yqhygl() {
            return $.$bg('inviteConsultants/yqhygl.png')
        },
        cjcknd() {
            return $.$bg('inviteConsultants/cjcknd.png')
        },
    },
    methods: {
        stopLuck(money) {
            $.np('lotteryInviteLevel').then(res => {
                this.isLoaded = true
                this.user = res.user
                this.list = res.list
                $.log('user', this.list)
                $.log('list', this.user)
            })
        },
        go(url, datas) {
            $.go($.pageUrl(url) + datas)
        },
        onShareClick() {
            this.isShareShow2 = true
        },
        closeSharePopup() {
            this.isShareShow2 = false
        },
        onImgLoad() {
            this.isShow = true
        },
        getBackgroundImg() {
            let that = this
            $.post($.url('config'), function (res) {
                that.inviteBack = res.data.invite_back4
            })
        },
        getMinParamInviteInviteUrl() {
            let t = this
            //获取邀请小程序码
            $.post($.url('getMinParamInviteUrl'), function (res) {
                t.qrcodeSrc = res.data.url
                console.log(res.data.url)
            })
        },
        createMinParamQrcodeUrl() {
            let self = this;
            $.post($.url('userCenterData'), function (res) {
                console.log(res.data.inviteCode)
                let scene = 'LT:BE:inviterId:' + res.data.userId;
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
                let qrImgSize = self.canvasWidth * 0.2
                ctx.drawImage(res[1].path, qrImgSize * 1.9, self.canvasHeight * 0.68, qrImgSize * 1.1, qrImgSize * 1.1)

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
                destHeight: 1342
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

    },
    components: {
        choujiang
    },
    onLoad() {
        let t = this
        $.np('lotteryInviteLevel').then(res => {
            this.isLoaded = true
            this.user = res.user
            this.list = res.list
            $.log('user', this.list)
            $.log('list', this.user)
        })

        this.getBackgroundImg()

        $.post($.url('userCenterData'), function (res) {
            t.inviteCode = res.data.inviteCode
        })
        t.canvasStyle = 'width:' + t.canvasWidth + 'px; height:' + t.canvasHeight + 'px;'
        t.createMinParamQrcodeUrl()

    },
    onShareAppMessage(res) {
        let t = this;
        $.log(t.inviteCode)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '入驻成功最高领888元红包!',
            //is_guwen_line用标识通过邀请顾问页面跳转
            path: '/pages/index/main?isGuwenLine=1&local_tip=becomeConsultant&inviteCode=' + t.inviteCode,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/wx/img/inviteGuwen/bg4.jpg?999',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },
    onPageScroll(t) {
        let top = t.scrollTop
        if (top > 500) {
            this.isShareShow = true
        } else {
            this.isShareShow = false
        }
    }
}
</script>


