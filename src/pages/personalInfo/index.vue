<template>
    <div v-if="info&&tip" class="personalInfo">
        <div class="box">
            <div class="top fx">
                <div class="fx1" @click="uploadTap('faceSrc')">
                    <div class="uploadBox">
                        <img v-if="info.photo" :src="info.photo" class="face" mode="aspectFit" />
                        <img v-else :src="faceSrc" class="face" mode="aspectFit" />
                        <div class="edit">编辑</div>
                    </div>
                    <div class="tip" v-if="!isFirstUploadAvatar">{{tip.first_upload_avatar.tip}}</div>
                </div>
            </div>
            <div class="ititle fx">
                基本资料
                <div class="tip" v-if="!isCompleteUserInfo">{{tip.complete_user_info.tip}}</div>
            </div>
            <div class="group">
                <div class="line fx">
                    <div class="name">昵&nbsp;&nbsp;&nbsp;&nbsp;称</div>
                    <div class="qt fx1">
                        <van-field
                            :value="info.name"
                            @input="changeInfo($event,'name')"
                            placeholder="请输入"
                            input-align="right"
                            placeholder-style="text-align:right;"
                            :border="false"
                        />
                    </div>
                </div>
                <div class="line fx lh1">
                    <div class="name">出生日期</div>
                    <div class="qt fx1">
                        <picker
                            mode="date"
                            @change="changeInfo($event,'year')"
                            :value="info.year"
                            :end="now"
                        >
                            <div v-if="info.year">{{info.year}}</div>
                            <div v-else class="fx lh1 jcfe">
                                请选择
                                <div class="iconfont icon-youjiantou"></div>
                            </div>
                        </picker>
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">性&nbsp;&nbsp;&nbsp;&nbsp;别</div>
                    <div class="qt fx1 fx">
                        <div class="fx1"></div>
                        <van-radio-group :value="info.sex+''" @change="changeInfo($event,'sex')">
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
                <div class="line fx lh1">
                    <div class="name">所在城市</div>
                    <div class="qt fx1">
                        <picker
                            mode="region"
                            @change="changeInfo($event,'region')"
                            :value="info.areaName"
                        >
                            <div
                                class="pickerTxt"
                                v-if="info.areaName[0]"
                                style="color:#666; font-size:14px;"
                            >{{info.areaName[0]}}-{{info.areaName[1]}}-{{info.areaName[2]}}</div>
                            <div class="fx lh1 jcfe" v-else>
                                请选择
                                <div class="iconfont icon-youjiantou"></div>
                            </div>
                        </picker>
                    </div>
                </div>
                <div class="line fx" style="padding:0;" v-if="placeholder">
                    <div class="name">学&nbsp;&nbsp;&nbsp;&nbsp;校</div>
                    <div class="qt fx1">
                        <van-field
                            :value="info.schoolName"
                            @input="changeInfo($event,'schoolName')"
                            placeholder="您毕业的学校是"
                            input-align="right"
                            placeholder-style="text-align:right;"
                            :border="false"
                        />
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">最高学历</div>
                    <div
                        class="qt fx1 fx jcfe"
                        @click="goSelect(actions,'education',info.education,'isShowXueli')"
                    >
                        <template v-if="info.education">{{info.education}}</template>
                        <template v-else>请选择</template>
                        <div class="iconfont icon-youjiantou"></div>
                    </div>
                </div>
            </div>
            <div class="ititle fx">
                个人信息
                <div
                    class="tip"
                    v-if="!isCompleteUserInfoStepTwo"
                >{{tip.complete_user_info_step_two.tip}}</div>
            </div>
            <div class="group">
                <div class="line fx">
                    <div class="name">工作年限</div>
                    <div
                        class="qt fx1 fx jcfe"
                        @click="goSelect(gongzuonianxianList,'seniority',info.seniority,'isShowGongzuoNianxian')"
                    >
                        <template v-if="info.seniority">{{info.seniority}}</template>
                        <template v-else>请选择</template>
                        <div class="iconfont icon-youjiantou"></div>
                    </div>
                </div>
                <div class="line fx lh1">
                    <div class="name">工作单位</div>
                    <div class="qt fx1">
                        <van-field
                            :value="info.companyName"
                            @input="changeInfo($event,'companyName')"
                            placeholder="请输入"
                            input-align="right"
                            placeholder-style="text-align:right;"
                            :border="false"
                        />
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">工作岗位</div>
                    <div
                        class="qt fx1 fx jcfe"
                        @click="goSelect(gongzuoGangweiList,'postName',info.postName,'isShowGongzuoGangwei')"
                    >
                        <template v-if="info.postName">{{info.postName}}</template>
                        <template v-else>请选择</template>
                        <div class="iconfont icon-youjiantou"></div>
                    </div>
                </div>
                <div class="line fx lh1" @click="go('myCertificate')">
                    <div class="name">持有证书</div>
                    <div class="qt fx1 fx jcfe">
                        <template v-if="info.certLevel">{{info.certLevel}}</template>
                        <template v-else>请选择</template>
                        <div class="iconfont icon-youjiantou"></div>
                    </div>
                </div>

                <div style="padding-bottom:100rpx; padding-top:50rpx;">
                    <button class="nextBtn" @click="save">保存</button>
                </div>
            </div>
        </div>
        <!-- 学历 -->
        <van-action-sheet
            @cancel="isShowXueli = false"
            @close="isShowXueli = false"
            @select="onSelect($event,'education')"
            :show="isShowXueli"
            :round="false"
            :actions="actions"
            cancel-text="取消"
        />
        <!-- 工作年限 -->
        <van-action-sheet
            @cancel="isShowGongzuoNianxian = false"
            @close="isShowGongzuoNianxian = false"
            @select="onSelect($event,'seniority')"
            :show="isShowGongzuoNianxian"
            :round="false"
            :actions="gongzuonianxianList"
            cancel-text="取消"
        />
        <!-- 工作岗位 -->
        <van-action-sheet
            @cancel="isShowGongzuoGangwei = false"
            @close="isShowGongzuoGangwei = false"
            @select="onSelect($event,'postName')"
            :show="isShowGongzuoGangwei"
            :round="false"
            :actions="gongzuoGangweiList"
            cancel-text="取消"
        />
    </div>
</template>

<script>

import $ from '@/common'
import initAdviserDetail from '@/initAdviserDetail'

const isEqual = (a, b) => {
    //如果a和b本来就全等
    if (a === b) {
        //判断是否为0和-0
        return a !== 0 || 1 / a === 1 / b;
    }
    //判断是否为null和undefined
    if (a == null || b == null) {
        return a === b;
    }
    //接下来判断a和b的数据类型
    var classNameA = toString.call(a),
        classNameB = toString.call(b);
    //var classNameA = typeof(a), (兼容IE的写法)
    //classNameB = typeof(b);
    //如果数据类型不相等，则返回false
    if (classNameA !== classNameB) {
        return false;
    }
    if (a instanceof Date) {
        classNameA = '[object Date]';
    }

    //如果数据类型相等，再根据不同数据类型分别判断
    switch (classNameA) {
        case '[object RegExp]':
        case '[object String]':
        case 'string':
            //进行字符串转换比较
            return '' + a === '' + b;
        case 'number':
        case '[object Number]':
            //进行数字转换比较,判断是否为NaN
            if (+a !== +a) {
                return +b !== +b;
            }
            //判断是否为0或-0
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
        case 'boolean':
            return +a === +b;
    }
    //如果是对象类型
    if (classNameA == '[object Object]' || classNameA == 'object') {
        //获取a和b的属性长度
        var propsA = Object.getOwnPropertyNames(a),
            propsB = Object.getOwnPropertyNames(b);
        if (propsA.length != propsB.length) {
            return false;
        }
        for (var i = 0; i < propsA.length; i++) {
            var propName = propsA[i];
            //如果对应属性对应值不相等，则返回false
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }
    //如果是数组类型
    if (classNameA == '[object Array]') {
        if (a.toString() == b.toString()) {
            return true;
        }
        return false;
    }
}

const initData = {}

export default {
    name: 'app',
    data() {
        return {
            isFirstUploadAvatar: true,
            isCompleteUserInfo: true,
            isCompleteUserInfoStepTwo: true,
            faceSrc: $.$img("joinStep1/face.png"),
            isShowXueli: false,
            isShowZaikaoDengji: false,
            isShowGongzuoNianxian: false,
            isShowGongzuoGangwei: false,
            placeholder: '您毕业的学校是',
            gongzuonianxianList: [],
            gongzuoGangweiList: [],
            xuexiao: '',
            tip: null,
            actions: [
                {
                    name: '大专',
                    color: '#3399FF'
                },
                {
                    name: '本科',
                    color: '#3399FF'
                },
                {
                    name: '硕士',
                    color: '#3399FF'
                },
                {
                    name: '博士',
                    color: '#3399FF'
                },
                {
                    name: '其他',
                    color: '#3399FF'
                },
            ],
            uploadUrl: $.url('uploadFile'),
            info: null,
            tel: '',
            region: ['广东省', '深圳市', '福田区'],
        }
    },
    onLoad(o) {
        this.isLoaded = true
        this.init()
    },
    watch: {
        info: {
            handler(n, o) {
                const check = () => {
                    $.log('n', n)
                    this.isFirstUploadAvatar = !n.photo.includes('wx.qlogo.cn')
                    const jbzl = ['name', 'year', 'sex', 'areaName', 'schoolName', 'education']
                    let jbzlPass = jbzl.filter(ele => {
                        return n[ele]
                    })

                    this.isCompleteUserInfo = jbzlPass.length == jbzl.length
                    //个人信息

                    {
                        const grxx = ['seniority', 'companyName', 'postName', 'certLevel']
                        let grxxPass = grxx.filter(ele => {
                            return n[ele]
                        })
                        this.isCompleteUserInfoStepTwo = grxxPass.length == grxx.length
                    }


                }
                const tip = () => {
                    check()
                    if (o) {
                        //提示头像
                        if (this.isFirstUploadAvatar && (!initData.isFirstUploadAvatar)) {
                            $.tip(this.tip.first_upload_avatar.completeTip)
                            initData.isFirstUploadAvatar = true
                        }
                        //基本资料
                        if (this.isCompleteUserInfo && (!initData.isCompleteUserInfo)) {
                            $.tip(this.tip.complete_user_info.completeTip)
                            initData.isCompleteUserInfo = true
                        }
                        //个人资料
                        if (this.isCompleteUserInfoStepTwo && (!initData.isCompleteUserInfoStepTwo)) {
                            $.tip(this.tip.complete_user_info_step_two.completeTip)
                            initData.isCompleteUserInfoStepTwo = true
                        }
                    }
                }

                if (!o) {
                    if (n.photo) {
                        $.log('check')
                        check()
                        initData.isFirstUploadAvatar = this.isFirstUploadAvatar
                        initData.isCompleteUserInfo = this.isCompleteUserInfo
                        initData.isCompleteUserInfoStepTwo = this.isCompleteUserInfoStepTwo
                        $.log(initData)
                        $.log('第一次')
                    }

                }

                if (n && o && Object.keys(o).length > 1) {
                    //找出新旧对象的异同
                    for (let i in n) {
                        if (n[i]) {
                            if (!isEqual(n[i], o[i])) {
                                if (n[i]) {
                                    this.sendData(n)
                                    tip()
                                }

                            }
                        }

                    }

                }
            },
            deep: true
        },
    },
    computed: {

    },
    methods: {
        init() {
            //获取tip
            {
                let url = '/user/action/edit/user/infos'
                $.$$np(url).then(res => {
                    let obj = {}
                    res.forEach(ele => {
                        obj[ele.action] = ele
                    })
                    this.tip = obj
                })
            }


            // 初始化数据填充
            this.fillData()
            this.getAttr(data => {
                $.log('data', data)
                {
                    let list = []
                    data.seniorityList.forEach(ele => {
                        let item = {
                            name: ele,
                            color: '#3399FF'
                        }
                        list.push(item)
                    })
                    this.gongzuonianxianList = list
                }



                {
                    let list = []
                    data.postNameList.forEach(ele => {
                        let item = {
                            name: ele,
                            color: '#3399FF'
                        }
                        list.push(item)
                    })
                    $.log('gongzuogangwei', list)
                    this.gongzuoGangweiList = list
                }
            })

        },
        save() {
            $.suc('保存成功')
            setTimeout(() => {
                $.back()
            }, 1500)
        },
        getAttr(back = $.noop) {
            let data = $.commonData.userInfoAttribute
            if (!data) {
                let url = '/user/info/attribute'
                $.$$np(url).then(res => {
                    $.commonData.userInfoAttribute = res
                    back(res)
                })
            } else {
                back(data)
            }
        },
        fillData() {
            let url = '/user/info'
            $.$$np(url).then(res => {
                if (typeof res.areaName == 'string') {
                    res.areaName = res.areaName.split('-')
                    if (res.areaName.length < 3) {
                        res.areaName = []
                    }
                }
                this.info = res
                $.commonData.certLevel = res.certLevel
            })
        },
        sendData(obj) {
            let url = '/user/info'
            $.$np(url, obj).then(res => {
                if (!res.isError) {
                    $.log('保存成功')
                }
            })
        },
        changeActiveColor(arr, key, name) {
            let { ...info } = this.info
            info[key] = name
            this.info = info

            arr.forEach((ele, index) => {
                this.$set(ele, 'color', '#3399FF')
                if (ele.name == name) {
                    this.$set(ele, 'color', 'red')
                }
            })
        },
        goSelect(arr, key, name, isShowName) {
            this[isShowName] = true
            this.changeActiveColor(arr, key, name)
        },
        onSelect(e, type) {
            this.changeActiveColor(this.actions, type, e.mp.detail.name)
        },
        onSelectForGongzuoNianxian(e) {
            this.changeActiveColor(this.actions, 'seniority', e.mp.detail.name)
        },
        onSelectForGongzuoGangwei(e) {
            this.$set(this.info, 'postName', e.mp.detail.name)
        },
        onSelectForZaikaodengji(e) {
            this.$set(this.info, 'education', e.mp.detail.name)
        },
        onSchoolNameChange(e) {
            this.$set(this.info, 'schoolName', e.mp.detail)
        },
        changeInfo(e, type) {
            let { ...info } = this.info

            if (type == 'year') {
                info[type] = e.mp.detail.value
            } else if (type == 'region') {
                let val = e.mp.detail.value
                let code = e.mp.detail.code[2]
                info['areaName'] = val
                info['areaId'] = code
            } else {
                info[type] = e.mp.detail
            }
            this.info = info
        },
        go: $.$go,
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
                    let url = $.pageUrl('FanfaceUpload') + '?imgUrl=' + src
                    $.go(url)

                }
            })
        },
        bindRegionChange(e) {
            let val = e.mp.detail.value
            let code = e.mp.detail.code[2]
            this.$set(this.info, 'areaName', val)
            this.$set(this.info, 'areaId', code)
        },

    },
    onShow() {

        let self = this
        if ($.commonData.certLevel) {
            let { ...info } = this.info
            info['certLevel'] = $.commonData.certLevel
            this.info = info
        }


        if ($.FanUploadCurrent === 'faceSrc') {
            // 您刚上传了头像
            wx.showLoading({
                title: '上传中'
            })
            wx.uploadFile({
                url: self.uploadUrl,
                filePath: $.faceSrc,
                name: 'file',
                formData: self.formData,
                success(res) {
                    const data = JSON.parse(res.data)
                    if (data.success) {
                        $.hideLoading()
                        let src = data.data.src
                        let { ...info } = self.info
                        info['photo'] = src
                        self.info = info
                        self.faceSrc = src
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
@import "./main.less";
</style>
