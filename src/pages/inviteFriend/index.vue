<template>
    <div id="app">
        <div class="back" :style="backStyle">
        </div>
        <van-popup
            class="share-popup"
            :show="true"
            position="bottom"
            :overlay="false"
            custom-style="height:120px;width:110%;"
        >
            <div class="bottom">
                <div class="t t1">
                    <button class="btn" open-type="share">
                        <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin.png">
                    </button>
                    <div>分享给朋友</div>
                </div>
                <div class="t t2">
                    <button @click="show()">
                        <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/poster.png">
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
export default {
    name: 'app',
    data() {
        return {
            isLoading: true,
            pageHeight: $.windowHeight,
            res: {},
            inviteCode: '',
            isShowShare: false,
            qrcodeSrc: '',
            canvasWidth: $.windowWidth * 0.75,
            canvasHeight: $.windowWidth / 750 * 1334 * 0.7,
            canvasStyle: '',
            qrcodeUrl: '', //邀请小程序码
            inviteBack1:'',
            inviteBack2:''
        }
    },
    computed: {
        backStyle() {
            let height = 'height:'+ this.pageHeight + 'px;'
            let bg = 'background:url('+ this.inviteBack1  +') no-repeat top center;'

            return height + bg + 'background-size:cover;'
        }
    },
    methods: {

        getBackgroundImg(){
            let that = this
            $.post($.url('config'), function (res) {
                //console.log(res)
                that.inviteBack1 = res.data.invite_back1
                that.inviteBack2 = res.data.invite_back2
            })
        },
        createMinParamQrcodeUrl() {
            let self = this;
            $.post($.url('userCenterData'), function (res) {
                console.log(res.data.inviteCode)
                //创建小程序码
                $.post($.url('createMinParamQrcodeUrl'), { scene: res.data.inviteCode }, function (res) {
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
                    //src: $.imgOnline + 'img/share/invite_pop.png?1'
                    src: self.inviteBack2
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
                ctx.drawImage(res[1].path, 3, self.canvasHeight * 0.85, qrImgSize * 1.1, qrImgSize * 1.1)

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
        show() {
            this.isShowShare = true
        },
        close() {
            this.isShowShare = false
        },
    },
    components: {},

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
            title: '财税有难题，就问CPA！',
            path: '/pages/index/main?inviteCode=' + t.inviteCode,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },


}
</script>
<style lang="less">
@import "./main.less";
</style>
