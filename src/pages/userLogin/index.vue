<template>
    <div>
        <div class="loginWrap" :style="pageHeight">
            <div class="logo">
                <img :src="logo" style="width:100%;" mode="widthFix" alt="logo" />
            </div>
            <div class="form" v-if="isMsg">
                <div class="line">
                    <van-field
                        name="phone"
                        :value="phoneValue"
                        @input="onInputPhone"
                        input-class="bt input"
                        maxlength="25"
                        placeholder-style="font-size:16px; color:#ccc;"
                        placeholder="请输入手机号"
                        :border="false"
                    />
                </div>
                <div class="line fx">
                    <div class="fx1">
                        <van-field
                            name="yzm"
                            :value="yzmValue"
                            @input="onInputYzm"
                            input-class="yzm input"
                            maxlength="25"
                            placeholder-style="font-size:16px; color:#ccc;"
                            placeholder="输入验证码"
                            :border="false"
                            use-button-slot
                        ></van-field>
                    </div>
                    <sendCode :phoneValue="phoneValue"></sendCode>
                </div>
            </div>
            <div class="tips" v-if="!isMsg">
                如果您还没有用这个手机号注册过财税问诊
                <br />我们将为您创建账号
            </div>
            <div class="buttonWrap">
                <div v-if="isMsg">
                    <div style="margin-top:50rpx;"></div>
                    <button class="btn quick" v-if="isMsg" @click="onLogin">立即登录</button>
                    <div class="fx">
                        <div class="fx1"></div>
                        <button
                            open-type="getPhoneNumber"
                            @getphonenumber="getPhoneNumber"
                            class="link"
                        >手机号一键登录</button>
                    </div>
                </div>

                <div v-else>
                    <button
                        open-type="getPhoneNumber"
                        @getphonenumber="getPhoneNumber"
                        class="btn quick"
                    >手机号一键登录</button>
                    <div class="fx">
                        <div class="fx1"></div>
                        <div @click="onMsgLogin" class="link">短信验证登录</div>
                    </div>
                </div>
            </div>

            <div class="phoneFixed">
                点击登录，即表示已阅读并同意
                <a href="../web/main?src=appShare/registAgee" class="blue">《法律条款与隐私政策》</a>
            </div>
        </div>
    </div>
</template>


<script type="text/javascript">
import $ from '@/common'
import sendCode from "@/components/sendCode.vue"

export default {
    data() {
        return {
            isLoading: true,
            phoneValue: '',
            yzmValue: '',
            key: '',
            isMsg: false,
            new: false,
            res: {},
            session: '',
            openid: ''
        }
    },
    computed: {
        pageHeight: function () {
            let val = $.windowHeight - $.footerHeight()
            return 'min-height:' + val + 'px'
        },
        logo() {
            return $.$img('logo.png')
        }
    },
    components: {
        sendCode
    },

    methods: {
        onInputPhone(v) {
            this.phoneValue = v.mp.detail
        },
        onInputYzm(v) {
            this.yzmValue = v.mp.detail
        },
        uploadUserInfo() {
            let url = $.url('uploadUserInfo')
            let self = this

            $.uploadUserInfo(() => {
                $.log('key+++', self.key)
                $.hideLoading()
                if (this.new) {
                    $.goSelf('../userRegister/main')
                    return
                }
                if (self.key == 'index' || self.key == 'ptList' || self.key == 'ptList_new' || self.key == "sign" || self.key == "myAdvice" || self.key == "receivedQuestions" || self.key == "userCenter" || self.key == 'applicationConsultant') {
                    if (self.key == 'index' || self.key == 'ptList_new' || self.key == 'userCenter') {
                        //使tablist-刷新
                        $.isRefresh = true
                        $.isIndexRefresh = true
                        $.isUserCenterRefresh = true
                        $.isPtRefresh = true
                        wx.switchTab({
                            url: '../' + self.key + '/main'
                        })
                    } else {
                        $.reLaunch('../' + self.key + '/main')
                    }

                } else {
                    if (self.key.includes('$')) {
                        $.goSelf('../' + self.key.split('$')[0] + '/main?new=' + self.new + '&src=' + self.key.split('$')[1])
                    } else {
                        $.goSelf('../' + self.key + '/main?new=' + self.new)
                    }

                }
            })

        },
        getPhoneNumber(e) {
            let iv = e.mp.detail.iv
            let encryptedData = e.mp.detail.encryptedData
            let isGuwenLine = 0
            let self = this
            if ($.getLocal('isGuwenLine')) {
                isGuwenLine = $.getLocal('isGuwenLine')
            } else {
                isGuwenLine = 0
            }
            let url = 'loginByEncryptedData'

            if (!iv) {
                return
            }


            $.setLocal('openid', this.openid)

            wx.setStorage({
                key: 'session',
                data: this.session,
                success: function () {
                    $.showLoading('请稍候')
                    $.np(url, {
                        iv: iv,
                        encryptData: encryptedData,
                        inviteCode: $.getLocal('inviteCode'),
                        is_guwen_line: isGuwenLine
                    }).then(res => {
                        if (!res.isError) {
                            $.xiaomeng()
                            self.new = res.new
                            self.uploadUserInfo()
                        }
                    })
                }
            })


        },
        onMsgLogin() {
            this.isMsg = true
        },
        onLogin() {
            let self = this
            let isGuwenLine = 0
            if ($.getLocal('isGuwenLine')) {
                isGuwenLine = $.getLocal('isGuwenLine')
            } else {
                isGuwenLine = 0
            }

            if (!self.phoneValue) {
                $.tip('请输入手机号')
                return
            }

            if (!self.yzmValue) {
                $.tip('请输入验证码')
                return
            }

            $.setLocal('session', this.session)
            $.setLocal('openid', this.openid)

            $.showLoading('请稍候')

            $.np('loginByPhone', {
                phone: self.phoneValue,
                code: self.yzmValue,
                inviteCode: $.getLocal('inviteCode'),
                is_guwen_line: isGuwenLine
            }).then(res => {
                if (!res.isError) {
                    $.xiaomeng()
                    this.new = res.new
                    this.uploadUserInfo()
                }
            })
        }

    },
    onLoad(option) {
        if (!option.key) {
            this.key = 'index'
        } else {
            this.key = option.key
        }
        $.userLogin(res => {
            this.session = res.session
            this.openid = res.openid
        })
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
