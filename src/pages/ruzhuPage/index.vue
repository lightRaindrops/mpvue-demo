<template>
    <div id="app">
        <!--<div class="back" id="back" :style="'height:'+pageHeight + 'px;'">-->
        <div style="position:relative;" class="topWrap">
            <img
                class="img1"
                style="display:block; width:100%;"
                mode="widthFix"
                v-show="isShow"
                @load="onImgLoad"
                :src="bg2"
            />
            <img
                class="img1"
                style="display:block; width:100%;"
                mode="widthFix"
                v-show="isShow"
                @load="onImgLoad"
                :src="bg3"
            />
            <button class="btn" @click="onShareClick"></button>
        </div>
        <van-popup
            class="share-popup"
            :show="isShareShow"
            position="bottom"
            :overlay="false"
            custom-style="height:120px;width:110%;"
        >
            <div class="bottom">
                <div class="t t1">
                    <button class="btn" open-type="share">
                        <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin.png" />
                    </button>
                    <div>分享给朋友</div>
                </div>
                <div class="t t2">
                    <button @click="show()">
                        <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/poster.png" />
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

<script>

import $ from '@/common'
const ctx = wx.createCanvasContext('shareCanvas')
export default {
    name: 'app',
    data() {
        return {
            isLoading: true,
            pageHeight: $.windowHeight,
            res: {},
            isShow: false,
            isShareShow: false,
            inviteCode: '',
            isShowShare: false,
            qrcodeSrc: '',
            isLogin: false,
            isShowShare: false,
            qrcodeSrc: '',
            canvasWidth: $.windowWidth * 0.75,
            canvasHeight: $.windowWidth / 750 * 1334 * 0.7,
            canvasStyle: '',
            qrcodeUrl: '', //邀请小程序码
            inviteBack: ''
        }
    },
    methods: {
        local() {
            $.post($.url('userCenterData'), function (res) {
                if (res.data.isAdviser == true) {
                    $.tip('您已经是顾问');
                    return false;
                } else {
                    $.post($.url('isLogin'), (res) => {
                        if (res.success) {
                            this.isLogin = true
                        }
                    })
                    if (this.isLogin) {
                        $.go("../applicationConsultant/main");
                    } else {
                        $.go("../userLogin/main");
                    }
                }
            })
        },
        getBackgroundImg(){
            let that = this
            $.post($.url('config'), function (res) {
                that.inviteBack = res.data.invite_back3
            })
        },
        onShareClick() {
            this.isShareShow = true
        },
        onImgLoad() {
            this.isShow = true
        },
        getMinParamInviteInviteUrl() {
            let t = this
            //获取邀请小程序码
            $.post($.url('getMinParamInviteUrl'), function (res) {
                t.qrcodeSrc = res.data.url;
                console.log(res.data.url);
            })
        },
        createMinParamQrcodeUrl() {
            let self = this;
            $.post($.url('userCenterData'), function (res) {
                console.log(res.data.inviteCode)
                let scene='local_tip:appli:inviterId:' + res.data.userId;
                //let scene='local_tip:fxActivity';
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
                ctx.drawImage(res[1].path, qrImgSize * 1.9, self.canvasHeight * 0.58, qrImgSize * 1.1, qrImgSize * 1.1)

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
    },
    computed: {
        pageHeight: function () {
            let val = $.windowHeight
            return 'min-height:' + val + 'px'
        },
        bg2() {
            return $.imgUrl('wx/img/inviteGuwen/bg2.jpg')
        },
        bg3() {
            return $.imgUrl('wx/img/inviteGuwen/bg3.jpg')
        }
    },
    mounted() {

    },
    onLoad(o) {
        let t = this;

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
            title: '财税达人,虚位已待,恭迎大驾!',
            //is_guwen_line用标识通过邀请顾问页面跳转
            path: '/pages/index/main?isGuwenLine=1&local_tip=applicationConsultant&inviteCode=' + t.inviteCode,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/wx/img/inviteGuwen/bg4.jpg?999',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
