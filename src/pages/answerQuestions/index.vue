<template>
    <div id="app">
        <div class="mainBox" v-if="!isLoading">
            <div class="title">{{res.title}}</div>
            <div class="answerWrap" >
                <van-field
                    name="answer"
                    :value="ansVal"
                    @input="onInput"
                    input-class="answer input"
                    placeholder-style="font-size:16px; color:#ccc;"
                    type="textarea"
                    placeholder="请在此输入回答"
                    :border="false"
                />
            </div>
            <div class="uploadWrap">
                <div class="tl">上传相关的图片</div>
                <div class="con">
                    <div class="uploadWrap">
                        <wux-upload
                            listType="picture-card"
                            :formData="formData"
                            controlled
                            :fileList="fileList"
                            max="3"
                            count="3"
                            :url="uploadUrl"
                            @change="onChange"
                            @complete="onComplete"
                            @preview="onPreview"
                        >
                            <div class="iconfont icon-Plus"></div>
                        </wux-upload>
                    </div>
                </div>
            </div>
            <div class="line">
                <button
                    :disabled=" ansVal == '' ? true:false "
                    class="normal submit"
                    :class=" ansVal == '' ? 'disabled':'' "
                    @click="onSubmit(res.id)"
                >提交</button>
            </div>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
let allUpload = []

const initData = function () {
    return {
        isLoading: true,
        uploadUrl: $.url('uploadFile'),
        res: {},
        ansVal: '',
        wxTimer: '',
        wxTimerList: {},
        wxTimerSecond: '',
        imageUrl: '',
        file: {},
        fileList: [],
    }
}

export default {
    name: 'app',
    data() {
        return initData()
    },
    methods: {
        onChange(e) {
            const {
                file,
                fileList
            } = e.mp.detail


            this.fileList = fileList


            if (file.status === 'uploading') {
                wx.showLoading()
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
        onRemove(e) {
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
        onInput(e) {
            this.ansVal = e.mp.detail
        },
        onSubmit(id) {
            let url = $.url('answerQuestion')
            let val = this.ansVal

            let files = []
            let fileList = this.fileList

            fileList.forEach(ele => {
                let uid = ele.uid
                let arr = allUpload.filter(e => e.uid == uid)
                let data = JSON.parse(arr[0].res.data)
                let src = data.data.src
                files.push(src)
            })

            $.post(url, {
                questionId: id,
                photos: files,
                intro: val
            }, function (res) {
                if (res.success) {
                    $.back()
                    //如果已经有回答
                    $.isHasAnswered = true

                } else {
                    $.tip(res.msg)
                }
            })
        }
    },
    computed: {
    },
    components: {},
    onLoad(o) {
        allUpload = []
        //设置要刷新收到的提问页面
        $.setLocal('isRefreshQuestion', true);
        let data = initData()
        for (var key in data) {
            this[key] = data[key]
        }

        let self = this
        let url = $.url('questionDetail')
        $.post(url, {
            id: o.id
        }, function (res) {
            if (res.success) {
                self.res = res.data
                self.isLoading = false
            } else {
                $.tip(res.msg)
            }
        })

    },
    onUnload() {
        $.isRefresh = true
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
