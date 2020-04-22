<template>
    <div>
        <mpvue-cropper
            ref="cropper"
            :option="cropperOpt"
            @ready="cropperReady"
            @beforeDraw="cropperBeforeDraw"
            @beforeImageLoad="cropperBeforeImageLoad"
            @beforeLoad="cropperLoad"
        ></mpvue-cropper>
        <div
            class="cropper-buttons fx"
            :style="{ color:cropperOpt.boundStyle.color,height:botHeight}"
        >
            <div class="upload btn" @tap="uploadTap">上传图片</div>
            <div class="fx1"></div>
            <div
                class="getCropperImage btn"
                :style="{ backgroundColor: cropperOpt.boundStyle.color }"
                @tap="getCropperImage"
            >生成图片</div>
        </div>
    </div>
</template>

<script>
import MpvueCropper from 'mpvue-cropper'

import $ from '@/common'

let wecropper

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 100

export default {
    data() {
        return {
            imgUrl: '',
            uploadType: '',
            cropperOpt: {
                id: 'cropper',
                targetId: 'targetCropper',
                pixelRatio: device.pixelRatio,
                width,
                height,
                scale: 2.5,
                zoom: 8,
                cut: {
                    x: (width - 300) / 2,
                    y: (height - 200) / 2,
                    width: 300,
                    height: 200
                },
                boundStyle: {
                    color: '#04b00f',
                    mask: 'rgba(0,0,0,0.8)',
                    lineWidth: 1
                }
            }
        }
    },
    computed: {
        botHeight() {
            return '100px'
        }
    },
    components: {
        MpvueCropper
    },

    methods: {
        cropperReady(...args) {
            args[0].pushOrign(this.imgUrl)
        },
        cropperBeforeImageLoad(...args) {
            console.log('before image load')
        },
        cropperLoad(...args) {
            console.log('image loaded')
        },
        cropperBeforeDraw(...args) {
            // Todo: 绘制水印等等
        },
        uploadTap() {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    const src = res.tempFilePaths[0]
                    //  获取裁剪图片资源后，给data添加src属性及其值

                    wecropper.pushOrigin(src)
                }
            })
        },
        getCropperImage() {
            wecropper.getCropperImage()
                .then((src) => {
                    //$.sfzZmSrc = src
                    //$.sfzZmSrc = src
                    //$.log(this.uploadType)
                    $[this.uploadType] = src
                    $.FanUploadCurrent = this.uploadType
                    wx.navigateBack()
                })
                .catch(e => {
                    console.error('获取图片失败')
                })
        }
    },

    mounted() {
        wecropper = this.$refs.cropper
    },
    onLoad(option) {
        this.imgUrl = option.imgUrl
        this.uploadType = option.type

    }
}
</script>

<style>
.cropper-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #e5e5e5;
}

.cropper-buttons {
    background: #000;
    position: fixed;
    padding: 10px;
    padding-top: 20px;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
    text-align: center;
}


.btn {
    height: 30px;
    line-height: 30px;
    padding: 0 24rpx;
    border-radius: 2px;
    color: #ffffff;
}
</style>
