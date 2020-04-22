<template>
    <div v-show="isLoaded">
        <div class="box">
            <div class="top fx">
                <div class="slt">
                    <div class="img">
                        <img :src="slt" class="slt" mode="aspectFit" />
                    </div>
                    <div class="wb">示例图</div>
                </div>
                <div class="fx1" @click="uploadTap('faceSrc')">
                    <div class="uploadBox">
                        <img :src="faceSrc" class="face" mode="aspectFit" />
                        <div class="edit">编辑</div>
                    </div>
                </div>
                <div class="sczjz">上传证件照</div>
            </div>
            <div class="group">
                <div class="line fx">
                    <div class="name">姓 名</div>
                    <div class="qt fx1">
                        <input type="text" v-model="FD.name" placeholder="与身份证一致" />
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">性 别</div>
                    <div class="qt fx1 fx">
                        <div class="fx1"></div>
                        <van-radio-group :value="FD.sex" @change="onRadioChange($event,'sex')">
                            <div class="fx">
                                <div class="ml">
                                    <van-radio name="1" checked-color="#ff0000">男</van-radio>
                                </div>
                                <div class="ml">
                                    <van-radio name="2" checked-color="#ff0000">女</van-radio>
                                </div>
                            </div>
                        </van-radio-group>
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">所在城市</div>
                    <div class="qt fx1">
                        <picker mode="region" @change="bindRegionChange" :value="region">
                            <div
                                class="pickerTxt"
                                style="color:#666; font-size:14px;"
                            >{{region[0]}}-{{region[1]}}-{{region[2]}}</div>
                        </picker>
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">手机号</div>
                    <div class="qt fx1">{{tel}}</div>
                </div>
            </div>
            <div class="tips">
                <div class="item fx aifs">
                    <div class="circle mt"></div>
                    <div class="fx1">成为顾问可以获得 <a href="/pages/web/main?src=appShare/adviserBenefit" hover-class="none" class="blue DIB">更多权益</a></div>
                </div>
                <div class="item fx aifs">
                    <div class="circle mt"></div>
                    <div class="fx1">为了确保认证通过，请按要求填写认证资料；</div>
                </div>
                <div class="item fx aifs">
                    <div class="circle mt"></div>
                    <div class="fx1">
                        部分信息将在个人主页展示，如个人简介.履历.咨询价格.擅长领域等，请认真填写；
                        需要帮助，请联系
                        <button
                            class="blue DIB"
                            open-type="contact"
                        >我的客服</button>
                    </div>
                </div>
            </div>
            <div style="padding-bottom:100rpx;">
                <button class="nextBtn" @click="next">下一步</button>
            </div>
        </div>
    </div>
</template>

<script>

import $ from '@/common'
import initAdviserDetail from '@/initAdviserDetail'

export default {
    name: 'app',
    data() {
        return {
            isLoaded: false,
            faceSrc: $.$img("joinStep1/face.png"),
            uploadUrl: $.url('uploadFile'),
            FD: {
                step_status: 1,
                head_url: '',
                name: '',
                sex: '1',
                area: '广东省-深圳市-福田区',
                area_id: '440304',
            },
            tel: '',
            region: ['广东省', '深圳市', '福田区'],
            requiredSend: [
                {
                    name: 'head_url',
                    tip: '请上传您的头像'
                },
                {
                    name: 'name',
                    tip: '请填写您的姓名'
                },
            ]
        }
    },
    computed: {
        slt() {
            return $.$img("joinStep1/slt.png")
        },

    },
    components: {
    },
    onLoad(o) {

        //初始化顾问数据

        initAdviserDetail(this, res => {
            this.faceSrc = res.head_url
            if (res.area) {
                this.region = res.area.split('-')
            }

        })


        if (o.inviterId) {
            $.post($.url('getInviteCodeByUserId'), {
                userId: o.inviterId
            }, function (res) {
                $.setLocal('inviteCode', res.data.invite_code)
            })
        }
        $.getTel(tel => {
            this.tel = tel
            this.isLoaded = true
        })
    },
    methods: {
        uploadTap(t) {
            let self = this
            self.activeUpload = t

            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    const src = res.tempFilePaths[0]
                    //  获取裁剪图片资源后，给data添加src属性及其值
                    let url
                    if (t == 'faceSrc') {
                        url = $.pageUrl('FanfaceUpload') + '?imgUrl=' + src + '&type=' + t
                        $.go(url)
                    } else {
                        // 身份证正面-反面
                        wx.showLoading({
                            title: '上传中'
                        })
                        wx.uploadFile({
                            url: self.uploadUrl,
                            filePath: src,
                            name: 'file',
                            formData: self.formData,
                            success(res) {
                                const data = JSON.parse(res.data)
                                if (data.success) {
                                    $.hideLoading()
                                    let src = data.data.src
                                    self[t] = src
                                    let dif
                                    if (t == 'sfzZmSrc') {
                                        dif = 'idcard_positive'
                                    } else if (t == 'sfzFmSrc') {
                                        dif = 'idcard_negative'
                                    }
                                    self.$set(self.FD, dif, src)
                                } else {
                                    $.tip(data.msg)
                                }
                            }
                        })
                    }
                }
            })
        },
        onRadioChange(e, v) {
            this.$set(this.FD, v, e.mp.detail)
        },
        next() {
            let req = this.requiredSend
            let F = this.FD
            let ok = false
            let srcDefault = $.$img("joinStep1/face.png")
            for (let i of req) {
                let name = i.name
                if (F[name] == '' || F[name] == undefined || F[name] == [] || F[name] == srcDefault) {
                    $.tip(i.tip)
                    ok = false
                    return
                } else {
                    ok = true
                }
            }

            if (!ok) {
                return
            }

            F.invite_code = $.getLocal('inviteCode')

            $.np('registerStepRegister', F, res => {
                let url = $.pageUrl('joinStep2') + '?id=' + res.id
                $.go(url)
            })
        },
        bindRegionChange(e) {
            let code = e.mp.detail.code[2]
            let val = e.mp.detail.value
            val = val[0] + '-' + val[1] + '-' + val[2]

            this.region = e.mp.detail.value
            this.$set(this.FD, 'area', val)
            this.$set(this.FD, 'area_id', code)

        },

    },
    onShow() {
        let self = this

        if ($.FanUploadCurrent === 'faceSrc') {
            // 您刚上传了头像
            wx.showLoading({
                title: '上传中'
            })
            self.faceSrc = $.faceSrc
            wx.uploadFile({
                url: self.uploadUrl,
                filePath: self.faceSrc,
                name: 'file',
                formData: self.formData,
                success(res) {
                    const data = JSON.parse(res.data)
                    if (data.success) {
                        $.hideLoading()
                        let src = data.data.src
                        self.$set(self.FD, 'head_url', src)
                    } else {
                        $.tip(data.msg)
                    }
                }
            })
        }

        $.FanUploadCurrent = ''

    }
}
</script>

<style lang="less">
@import "../../less/common.less";
@import "./main.less";
</style>
