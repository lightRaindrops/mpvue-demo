<template>
    <div :value="value">
        <div :style="{'height':footerHeight+'px'}"></div>
        <footer
            class="footer fx"
            :class="isIphone10?'iphone10':''"
            :style="'height:'+footerHeight+'px;'+footerBg + 'background-position:center top;'"
        >
            <form @submit="formSubmit" :report-submit="true" class="item" :class="class1">
                <button class="line" form-type="submit" @click="go('index')">
                    <span class="DB no" :style="sy"></span>
                    <span class="DB on" :style="sy_on"></span>
                    财问
                </button>
            </form>
            <form @submit="formSubmit" :report-submit="true" class="item" :class="class2">
                <button class="line" form-type="submit" @click="go('ptList_new')">
                    <span class="DB no" :style="fx"></span>
                    <span class="DB on" :style="fx_on"></span>
                    旁听
                </button>
            </form>
            <form @submit="formSubmit" :report-submit="true" class="item">
                <button class="line middle" form-type="submit" @click="toAsk">
                    <span class="DB wen" :style="wen"></span>
                </button>
            </form>
            <form @submit="formSubmit" :report-submit="true" class="item" :class="class3">
                <button class="line" form-type="submit" @click="go('guwen')">
                    <span class="DB no" :style="gw"></span>
                    <span class="DB on" :style="gw_on"></span>
                    顾问
                </button>
            </form>
            <form @submit="formSubmit" :report-submit="true" class="item" :class="class4">
                <button
                    class="line"
                    form-type="submit"
                    open-type="getUserInfo"
                    @getuserinfo="getUserInfo($event,'userCenter')"
                >
                    <span class="DB no" :style="wd"></span>
                    <span class="DB on" :style="wd_on"></span>
                    我的
                    <span
                        class="redRound"
                        v-if="myQuestionRedGlobal && isAdviser || myWalletGlobal"
                    ></span>
                </button>
            </form>
        </footer>
        <van-popup
            custom-style="background:none"
            :overlay="false"
            :show="isTiwenBoxShow"
            position="bottom"
        >
            <TiwenBox @vclose="onClose"></TiwenBox>
        </van-popup>
    </div>
</template>

<script>
import $ from '@/common'
import TiwenBox from '@/components/TiwenBox.vue'
export default {
    data() {
        return {
            footerHeight: 85,
            isTiwenBoxShow: false,
            isIphone10: false,
            isIphone: false,
            myQuestionRedGlobal: false,
            orderRedGlobal: false,
            myWalletGlobal: false,
            isLogin: false,
            isAdviser: false
        }
    },
    props: {
        value: {
            type: String,
            default: '',
        }
    },
    components: {
        TiwenBox
    },
    computed: {
        footerBg() {
            return $.$bg('common/footer.png')
        },
        sy() {
            return $.$bg('icons/footer/sy.png')
        },
        sy_on() {
            return $.$bg('icons/footer/sy_on.png')
        },
        fx() {
            return $.$bg('icons/footer/fx.png')
        },
        fx_on() {
            return $.$bg('icons/footer/fx_on.png')
        },
        gw() {
            return $.$bg('icons/footer/gw.png')
        },
        gw_on() {
            return $.$bg('icons/footer/gw_on.png')
        },
        wd() {
            return $.$bg('icons/footer/wd.png')
        },
        wd_on() {
            return $.$bg('icons/footer/wd_on.png')
        },
        wen() {
            return $.$bg('icons/footer/wen.png')
        },
        class1() {
            if (this.value === '1') {
                return 'active'
            } else {
                return ''
            }
        },
        class2() {
            if (this.value === '2') {
                return 'active'
            } else {
                return ''
            }
        },
        class3() {
            if (this.value === '3') {
                return 'active'
            } else {
                return ''
            }
        },
        class4() {
            if (this.value === '4') {
                return 'active'
            } else {
                return ''
            }
        },
    },

    methods: {
        toAsk() {
            this.isTiwenBoxShow = true
        },
        onClose() {
            this.isTiwenBoxShow = false
        },
        go(url, datas = '') {
            // 点击顾问时写入全局变量

            let realUrl = $.pageUrl(url)

            if (url == 'problemManagement') {
                if (!this.isLogin) {
                    $.go($.pageUrl('userLogin'))
                }
            }

            if (datas) {
                realUrl = $.pageUrl(url) + "?" + datas
            }



            if (url == 'tiwen' || url == 'problemManagement') {
                $.go(realUrl)
            } else {
                if (url == 'index' || url == 'ptList_new' || url == 'guwen') {
                    wx.switchTab({
                        url: realUrl
                    })
                }
                $.goSelf(realUrl)
            }
        },
        getUserInfo(e, k, o = 1) {
            if (this.isLogin) {
                $.getUserInfo(e, k, o)
            } else {
                wx.switchTab({
                    url: '../' + k + '/main'
                })
            }

        },
        imgUrl(str) {
            return $.imgUrl('/qing/img/' + str)
        },
        formSubmit(e) {
            let formId = e.mp.detail.formId
            let url = $.url('storageFormId')
            $.pp(url, { formId }, $.noop)
        }
    },
    async created() {

        let self = this

        this.isLogin = await $.isLogin()

        if ($.isIphoneX()) {
            this.footerHeight = 85 + 18
            this.isIphone10 = true
        }

        if ($.isIphone()) {
            this.isIphone = true
        } else {
            this.isIphone = false
        }

        //设置小红点

        if (this.isLogin) {

            $.log('设置小红点')

            this.isAdviser = $.getLocal('isAdviser')
            let url = $.url('userRedPoint')
            let session = $.getLocal('session')
            if (session) {
                $.pp(url, function (res) {
                    self.myQuestionRedGlobal = res.myQuestionRed
                    self.orderRedGlobal = res.orderRed
                    self.myWalletGlobal = res.walletRed
                })
            }

        }

    },
}
</script>

<style lang="less" scoped>
footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 4;
    height: 170rpx;
    padding-top: 40rpx;

    &.iphone10 {
        align-items: flex-start;
        padding-top: 60rpx;
    }

    .redRound {
        width: 8px;
        height: 8px;
        position: absolute;
        right: 35%;
        top: 6%;
        border-radius: 50%;
        background: #ff0000;
    }
    button.middle {
        &.line {
            background: none;
            height: 100%;
            top: -10rpx;
            position: relative;
        }
        overflow: visible;
    }
    .item {
        width: 25%;
        position: relative;
        button {
            text-align: center;
            color: #999;
            border-radius: 0;
            .DB {
                width: 40rpx;
                height: 46rpx;
                margin: 0 auto;
                &.wen {
                    width: 68%;
                    height: 120rpx;
                    margin-top: -20rpx;
                }
                &.on {
                    display: none;
                }
                &.no {
                    display: block;
                }
            }
        }

        &.active {
            button {
                color: #f52f3e;
            }
            .DB {
                &.on {
                    display: block;
                }
                &.no {
                    display: none;
                }
            }
        }
    }
}
</style>
