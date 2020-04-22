<template>
    <div class="all" :style="'min-height:'+winHeight+'px;'+bg" v-if="us.name">
        <div class="top jcc fx" :style="'padding-top:'+top+'px;'">
            <img :src="back" @click="goBack" class="back" mode="aspectFit" />
            <div class="fx1 txt">会员中心</div>
        </div>
        <div class="us">
            <div class="itop fx">
                <div class="img">
                    <img :src="face" v-if="!us.photo" class="face" alt />
                    <img
                        :src="us.photo"
                        style="overflow:hidden; border-radius:50%;"
                        v-else
                        class="face"
                        alt
                    />
                    <img :src="circle" class="circle" alt />
                </div>
                <div class="txt">
                    <div class="itt fx">
                        <span class="qdl">{{us.name}}</span>
                        <span class="mark">{{us.member_type_name}}</span>
                    </div>
                    <div style="margin-top:10rpx;">
                        <div v-if="us.end_time" class="fx">
                            <div class="ibb">有效期至：{{us.end_time}}</div>
                            <a
                                v-if="!isIphone&& us.member_type != 'corporate_member'"
                                href="../buyingMembers/main"
                                class="xfBtn"
                            >续费</a>
                        </div>
                        <div class="ibb fx" v-else>
                            <a v-if="!isIphone" href="../buyingMembers/main" class="kthyBtn">开通会员</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="idata fx">
                <a href="../cashCouponList/main" class="item fx1" hover-class="none">
                    <div class="num">{{us.cash_coupon}}</div>
                    <div class="wb">现金劵</div>
                </a>
                <a href="../activationCodeList/main" class="item fx1" hover-class="none">
                    <div class="num">{{us.active_code}}</div>
                    <div class="wb">激活码</div>
                </a>
            </div>
            <div class="jihuo fx">
                <input
                    type="text"
                    class="fx1"
                    style="color:#fff;"
                    v-model="currentActiveCode"
                    placeholder="请输入激活码成为会员"
                />
                <div class="submit" @click="useCodeToAcitveMemberType">确定</div>
            </div>
        </div>
        <div :style="privilege" class="privilege"></div>
    </div>
</template>

<style lang="less">
@import "../../less/common.less";
@import "./main.less";
</style>


<script>
import $ from '@/common'
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            us: {},
            isIphone: $.isIphone(),
            currentActiveCode: '',
        }
    },
    computed: {
        top() {
            let system = wx.getSystemInfoSync()
            let val = system.statusBarHeight + 10
            return val
        },
        winHeight() {
            return $.winHeight
        },
        back() {
            return $.$img("vip/back.png")
        },
        privilege() {
            return $.$bg("vip/privilege.png")
        },
        face() {
            return $.$img("vip/face.png")
        },
        circle() {
            return $.$img("vip/circle.png")
        },
        bg() {
            return $.$bg("vip/bg.png")
        }
    },
    methods: {
        goBack() {
            $.back()
        },
        init() {
            $.np('userMemberTypeInfo', res => {
                this.us = res.user_info
                $.log(this.us)
                this.face = ''
            })
        },
        useCodeToAcitveMemberType() {
            const code = this.currentActiveCode
            if (code == '') {
                $.tip('请输入激活码')
                return
            }
            $.np('useCodeToAcitveMemberType', { code }, res => {
                $.suc('激活成功')
                this.currentActiveCode = ''
                this.init()
            })
        }
    },
    components: {
    },
    onLoad() {
        this.init()
    }
}
</script>


