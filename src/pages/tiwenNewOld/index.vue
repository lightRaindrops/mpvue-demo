<template>
    <div style="padding-bottom:250rpx;">
        <div class="step fx jcc" v-if="!isOneToOne">
            <div class="icon">1</div>
            <div class="txt">提交问题</div>
            <div class="dian" :style="diandian"></div>
            <div class="icon">2</div>
            <div class="txt">顾问回答</div>
            <div class="dian" :style="diandian"></div>
            <div class="icon">3</div>
            <div class="txt">采纳问题</div>
        </div>
        <div class="step fx jcc" v-else>
            <div class="icon">1</div>
            <div class="txt">提交问题</div>
            <div class="dian" :style="diandian"></div>
            <div class="icon">2</div>
            <div class="txt">顾问回答</div>
            <div class="dian" :style="diandian"></div>
            <div class="icon">3</div>
            <div class="txt">评价顾问</div>
        </div>
        <div class="textareaBox">
            <van-field
                :value="btValue"
                type="textarea"
                @input="onInputBt"
                custom-style="height:320rpx; width:690rpx; margin:0 auto; margin-top:28rpx; background:#f5f5f5; line-height:1.2rem;"
                placeholder="描述您遇到的财税问题，表述越清楚，越容易获得满意答案(10个字以上)"
                placeholder-style="color:#999;"
                :border="false"
            ></van-field>
        </div>
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
                @remove="onRemove"
            >
                <img :src="image" class="image" mode="aspectFit" />
            </wux-upload>
        </div>
        <div class="types">
            <div class="bt">咨询类型：</div>
            <div class="items fx">
                <div
                    class="item"
                    :class="{on:curType == i.id}"
                    @click="onTypeClick(i.id)"
                    v-for="i in types"
                    :key="i.id"
                >{{i.val}}</div>
            </div>
        </div>
        <div class="xsBox" v-if="!isOneToOne">
            <div class="bt fx">
                使用算珠咨询：
                <div class="ms">提高算珠数，吸引更多大咖解答</div>
            </div>
            <div class="items fx">
                <div
                    class="item"
                    :class="{on:curXs == i.val}"
                    @click="onXsClick(i)"
                    v-for="i in xsList"
                    :key="i.val"
                >{{i.txt}}</div>
            </div>
        </div>
        <div class="next">
            <button :style="btn_next" class="btn" @click="onNext">立即提问</button>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
import { log } from 'util'
let allUpload = []

export default {
    data() {
        return {
            adviserId: 0,
            btValue: '',
            isOneToOne: false,
            types: [],
            curXs: 5,
            payType: 2,
            uploadUrl: $.url('uploadFile'),
            fileList: [],
            xsList: [
                {
                    txt: '5算珠',
                    val: 5
                },
                {
                    txt: '10算珠',
                    val: 10
                },
                {
                    txt: '20算珠',
                    val: 20
                },
                {
                    txt: '50算珠',
                    val: 50
                },
                {
                    txt: '100算珠',
                    val: 100
                },
                {
                    txt: '200算珠',
                    val: 200
                },
            ],
            curType: '',
            formData: {
                'session': $.getLocal('session')
            },

        }
    },
    computed: {
        diandian() {
            return $.$bg('icons/diandian.png')
        },
        image() {
            return $.$img('icons/image.png')
        },
        btn_next() {
            return $.$bg('btn_next.png')
        }
    },
    methods: {
        onTypeClick(id) {
            this.curType = id
        },
        onXsClick(ele) {
            if (ele.txt.includes('算珠')) {
                this.payType = 2
            } else {
                this.payType = 1
            }
            this.curXs = ele.val
        },
        onInputBt(e) {
            this.btValue = e.mp.detail
        },
        onChange(e) {
            const {
                file,
                fileList
            } = e.mp.detail


            this.fileList = fileList

            if (file.status === 'uploading') {
                $.showLoading()                
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
        async onNext() {
            if (this.btValue) {
                if (this.btValue.length < 5) {
                    $.tip('问题至少5个字');
                    return false
                }
            }

            if (this.btValue == '') {
                $.tip('请输入您的问题');
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

            {
                let data = {
                    title: this.btValue,
                    files: files,
                    type: this.curType,
                    pay_type: this.payType,
                    reward: this.curXs,
                    question_type: 1,
                    adviser: this.adviserId,
                }


                if (data.type == '') {
                    $.tip('请选择咨询类型')
                    return
                }

                //如果提问类型为一对一

                if (this.isOneToOne) {
                    $.log('现在是一对一咨询')
                    data.question_type = 2
                    if (data.intro == '') {
                        data.intro = '如题'
                    }
                    $.setLocal('one-by-one-data', data)
                    $.$go('pay?id=' + this.adviserId)
                } else {
                    data.question_type = 1
                    if (data.intro == '') {
                        data.intro = '如题'
                    }
                    //创建问题
                    wx.showModal({
                        title: '',
                        content: '确认使用' + data.reward + '算珠支付',
                        success(res) {
                            if (res.confirm) {
                                $.showLoading('请稍候')
                                $.np('createQuestion', data).then(res => {
                                    $.hideLoading()
                                    if (res.questionId) {
                                        //算珠跳转
                                        $.suc('提交成功')
                                        let pageUrl = $.pageUrl('problemInfo') + '?id=' + res.questionId + '&new=1'
                                        $.goSelf(pageUrl)
                                    } else {
                                        //微信支付
                                        let wxData = JSON.parse(res)
                                        wx.requestPayment({
                                            timeStamp: wxData.timeStamp,
                                            nonceStr: wxData.nonceStr,
                                            package: wxData.package,
                                            signType: wxData.signType,
                                            paySign: wxData.paySign,
                                            success(res) {
                                                $.suc('支付成功')

                                                let pageUrl = $.pageUrl('problemManagement') + '?key=1'
                                                $.goSelf(pageUrl)
                                            },
                                            fail(res) {
                                                wx.showToast({
                                                    title: '支付失败',
                                                    icon: 'none',
                                                    duration: 2000
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        },
    },
    async onLoad(o) {
        allUpload = []
        //查询是否为一对一咨询
        this.isOneToOne = o.type == 1
        if (o.id) {
            this.adviserId = o.id
        }

        this.types = await $.np('questionType', { subject: 4 })
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
