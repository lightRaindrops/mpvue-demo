<template>
    <div v-show="isLoaded">
        <div class="box">
            <div class="group">
                <div class="line fx">
                    <div class="name">身份证号码</div>
                    <div class="qt fx1">
                        <input
                            type="idcard"
                            v-model="FD.idcard"
                            maxlength="18"
                            placeholder="与身份证一致"
                        />
                    </div>
                </div>
                <div class="sfzWrap">
                    <div class="line bt">上传清晰照片，请勿旋转方向或打码，否则不予通过！</div>
                    <div class="fx sfz">
                        <div class="item" @click="uploadTap('sfzZmSrc')">
                            <div v-if="sfzZmSrc == ''">
                                <div class="img">
                                    <img :src="add" class="add" mode="aspectFit" />
                                </div>
                                <div class="wb">身份证正面照</div>
                            </div>
                            <div v-else>
                                <img
                                    mode="aspectFit"
                                    :src="sfzZmSrc"
                                    style="width:323rpx; height:200rpx;"
                                />
                            </div>
                        </div>
                        <div class="item" @click="uploadTap('sfzFmSrc')">
                            <div v-if="sfzFmSrc == ''">
                                <div class="img">
                                    <img :src="add" class="add" mode="aspectFit" />
                                </div>
                                <div class="wb">身份证反面照</div>
                            </div>
                            <div v-else>
                                <img
                                    mode="aspectFit"
                                    :src="sfzFmSrc"
                                    style="width:323rpx; height:200rpx;"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="zs group">
                <div class="line fx">
                    <div class="name">证书类型</div>
                    <div class="qt fx1 fx DN">
                        <div class="fx1"></div>有多个证书，优先选择等级高的证书
                        <img :src="arrow" class="arrow" mode="aspectFit" />
                    </div>
                    <div class="qt fx1">
                        <picker
                            v-model="selector"
                            @change="onPickerChange($event,'cpa_type')"
                            :value="FD.cpa_type-1"
                            :range="zslxList"
                            range-key="name"
                        >
                            <view class="picker fx">
                                <div class="fx1"></div>
                                {{currentZslx}}
                                <img :src="arrow" class="arrow" mode="aspectFit" />
                            </view>
                        </picker>
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">领取证件时间</div>
                    <div class="qt fx1 fx">
                        <picker
                            mode="date"
                            style="width:100%;"
                            :value="FD.cpa_time"
                            fields="month"
                            :end="today"
                            @change="onDateChange"
                        >
                            <div class="fx">
                                <div class="fx1"></div>
                                <div v-if="!FD.cpa_time" style="color:#999">请选择领证时间</div>
                                <div v-else>{{FD.cpa_time}}</div>
                                <img :src="arrow" class="arrow" mode="aspectFit" />
                            </div>
                        </picker>
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">证书编号</div>
                    <div class="qt fx1 fx">
                        <input type="text" v-model="FD.cpa" placeholder="与证书编号一致" />
                    </div>
                </div>
                <div class="zsWrap">
                    <div class="bt">
                        请依照示例图，上传清晰照片，请勿旋转方向或打码，否则不予通
                        过！
                    </div>
                    <div class="fx zsUpload" @click="uploadTap('zzzsSrc')">
                        <div class="item">
                            <div v-if="zzzsSrc == ''">
                                <div class="img">
                                    <img :src="add" class="add" mode="aspectFit" />
                                </div>
                            </div>
                            <div v-else>
                                <img
                                    mode="aspectFit"
                                    :src="zzzsSrc"
                                    style="width:480rpx; height:304rpx;"
                                />
                            </div>
                        </div>
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
            uploadUrl: $.url('uploadFile'),
            sfzZmSrc: '',
            sfzFmSrc: '',
            zzzsSrc: '',
            currentZslx: '请选择证书类型',
            zslxList: [],
            index: 0,
            FD: {
                step_status: 2,
                cap_type: '',
                idcard: '',
                idcard_positive: '',
                idcard_negative: '',
                cpa_type: '',
                cpa: '',
                cpa_time: '',
                cpa_path: ''
            },
            tel: '',
            requiredSend: [
                {
                    name: 'idcard',
                    tip: '请填写身份证号码'
                },
                {
                    name: 'idcard_positive',
                    tip: '请上传身份证'
                },
                {
                    name: 'idcard_negative',
                    tip: '请上传身份证'
                },
                {
                    name: 'cpa_type',
                    tip: '请选择证书类型'
                },
                {
                    name: 'cpa',
                    tip: '请填写证件编号'
                },
                {
                    name: 'cpa_time',
                    tip: '请选择领证时间'
                }, {
                    name: 'cpa_path',
                    tip: '请上传证书图片'
                },
            ]
        }
    },
    computed: {
        add() {
            return $.$img("joinStep2/add.png")
        },
        arrow() {
            return $.$img("icons/arrow.png")
        },

    },
    components: {
    },
    onLoad() {

        {
            let today = new Date()
            this.today = $.timeFormat(today, 'yyyy-MM')
        }




        //获取证书类型
        $.np('getCpaType', res => {
            let arr = []
            Object.keys(res).forEach(ele => {
                let item = {
                    id: Number(ele),
                    name: res[ele]
                }
                arr.push(item)
            })
            this.zslxList = arr

            //初始化顾问数据
            initAdviserDetail(this, res => {
                this.sfzZmSrc = res.idcard_positive
                this.sfzFmSrc = res.idcard_negative
                this.zzzsSrc = res.cpa_path
                let n = res.cpa_type
                $.log(n)
                this.currentZslx = this.zslxList.filter(ele => ele.id == n)[0].name
            })
        })
        this.isLoaded = true
    },
    methods: {
        onDateChange(e) {
            this.$set(this.FD, 'cpa_time', e.mp.detail.value)
        },
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
                                    } else if (t == 'zzzsSrc') {
                                        dif = 'cpa_path'
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
        onPickerChange(e, v) {
            let val = Number(e.mp.detail.value)
            let list = this.zslxList
            this.currentZslx = list[val].name
            this.FD[v] = val + 1
        },
        next() {
            let req = this.requiredSend
            let F = this.FD
            let ok = false
            let srcDefault = $.$img("joinStep1/face.png")

            $.log(F)
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


            $.np('registerStepRegister', F, res => {
                let url = $.pageUrl('joinStep3') + '?id=' + res.id
                $.go(url)
            })
        }
    },
}
</script>

<style lang="less" scoped>
@import "../../less/common.less";
@import "./main.less";
</style>
