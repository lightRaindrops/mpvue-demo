<template>
    <div>
        <div class="title fx">
            <div class="fx1">问题和建议</div>
            <div class="num">{{jianyi.length}}/200</div>
        </div>
        <div class="textarea">
            <van-field
                type="textarea"
                autosize
                :border="false"
                maxlength="200"
                :value="jianyi"
                @input="onJianyiChange"
                placeholder="请填写问题描述以便我们提供更好的帮助"
            />
        </div>
        <div class="title fx">
            <div class="fx1">上传图片(选填问题截图）</div>
            <div class="num">{{fileList.length}}/6</div>
        </div>
        <div class="uploadWrap">
            <wux-upload
                listType="picture-card"
                :formData="formData"
                controlled
                :fileList="fileList"
                max="6"
                count="6"
                :url="uploadUrl"
                @change="onChange"
                @complete="onComplete"
                @preview="onPreview"
                @remove="onRemove"
            >
                <Nimg src="icons/uploadAdd.png" />
            </wux-upload>
        </div>
        <div class="title fx">
            <div class="fx1">联系电话（选填）</div>
        </div>
        <div class="text">
            <van-field type="tel" :value="tel" @input="onTelChange" placeholder="请输入手机号，便于我们与你联系" />
        </div>
        <div class="qun fx">
            <div class="fx1">加入官方QQ群：{{qq}}</div>
            <button @click="clone(qq)" class="fx jcc">复制</button>
        </div>
        <div>
            <button @click="submitNow" class="nextBtn">提交</button>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'

let allUpload = []
export default {
    data() {
        return {
            jianyi: '',
            qq: '740109941',
            tel: '',
            uploadUrl: $.url('uploadFile'),
            fileList: [],
            formData: {
                'session': $.getLocal('session')
            },
        }
    },
    computed: {
        image() {
            return $.$img('icons/image.png')
        },
    },
    components: {
        Nimg
    },
    methods: {
        clone(text) {
            wx.setClipboardData({
                data: text,
                success: function (res) {
                    wx.getClipboardData({
                        success: function (res) {
                            wx.showToast({
                                title: '复制成功'
                            })
                        }
                    })
                }
            })
        },
        onChange(e) {
            const {
                file,
                fileList
            } = e.mp.detail

            

            this.fileList = fileList


            if (file.status === 'uploading') {
                $.showLoading('上传中...')    
            } else if (file.status === 'done') {
                try {
                    let data = JSON.parse(file.res.data)
                    $.log(data)
                    if (!data.success) {
                        wx.showModal({
                            title: '提示',
                            content: data.msg,
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                        this.fileList = allUpload
                    } else {
                        file.url = data.data.src
                        $.log(file)
                        allUpload.push(file)
                        this.fileList = allUpload
                    }

                } catch (error) {
                    $.error(error)
                }

            }

        },
        submitNow() {
            if (this.jianyi.trim() == '') {
                $.tip('请输入您的问题和建议')
                return false
            }


            let files = []
            let fileList = this.fileList

            fileList.forEach(ele => {
                let uid = ele.uid
                let arr = allUpload.filter(e => e.uid == uid)
                let data = JSON.parse(arr[0].res.data)
                let src = data.data.src
                files.push(src)
            })

            $.log(files)

            {
                let url = '/message/feedbackAdvise/insert'
                let data = {
                    content: this.jianyi,
                    filePath: files,
                    tel: this.tel
                }

                $.showLoading('请稍候...')
                setTimeout(() => {
                    $.hideLoading()
                }, 5000)

                $.$np(url, data).then(res => {
                    $.hideLoading()
                    if (res.isError) {
                        return
                    }
                    $.suc('提交成功')
                    setTimeout(() => {
                        $.back()
                    }, 2000)
                })
            }


        },
        onRemove(e) {
            let file = e.mp.detail.file
            allUpload = allUpload.filter((n) => n.uid !== file.uid)
            this.fileList = allUpload
        },
        onPreview(e) {
            const {
                file,
                fileList
            } = e.mp.detail

            wx.previewImage({
                current: file.url,
                urls: allUpload.map((n) => n.url),
            })
        },
        onComplete(e) {
            $.hideLoading()
        },
        onJianyiChange(e) {
            this.jianyi = e.mp.detail
        },
        onTelChange(e) {
            this.tel = e.mp.detail
        },
    },
    onLoad() {
        allUpload = []
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
