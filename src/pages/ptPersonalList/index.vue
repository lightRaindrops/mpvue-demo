<template>
    <div>
        <div class="loadingWrap" v-show="isLoading">
            <van-loading size="15px"/>
            <span class="txt">正在加载</span>
        </div>
        <div class="mainBox" v-if="!isLoading">
            <div class="tabsWrap" :style="pageHeight">
                <div class="payQuestions">
                    <div class="group">
                        <div class="item" v-for="(item,index) in ptList" :key="index">
                            <a :href="item.gwHref" class="gw fx w100">
                                <span class="img face"><img :src="item.head_url" alt="头像"></span>
                                <span class="txt">
                                    <span class="name DB">
                                        <img class="cap-img"
                                        src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/cpa_type_1.png"
                                        v-if="item.cpa_type=='注册会计师'"/>
                                        <img class="cap-img"
                                        src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/cpa_type_2.png"
                                        v-else-if="item.cpa_type=='高级会计师'"/>
                                        <img class="cap-img"
                                        src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/cpa_type_3.png"
                                        v-else-if="item.cpa_type=='中级会计师'"/>
                                        {{item.name}}
                                    </span>
                                    <span class="bz DB">
                                        <span class="zc">{{item.cpa_type}}</span>
                                        <span class="cznx">持证年限{{item.cpa_time}}年</span>
                                        <span class="consult_pay">{{item.consult_pay}}元/次</span>
                                    </span>
                                </span>
                            </a>
                            <div class="ms" @click="payListen(item.id)">
                                {{item.question_title}}
                            </div>
                            <span class="fx b">
                                <span class="fx1">
                                    <span class="num">{{item.listen_num}}人旁听</span>
                                    <span class="num dz">{{item.zan}}人点赞</span>
                                </span>
                                <button class="button pt" @click="payListen(item.id)">
                                    <div v-if="item.is_pay">
                                        查看
                                    </div>
                                    <div v-else>
                                        {{item.listen_pay}}元旁听
                                    </div>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="ptList.length == 0" style="width:100%; height:100%; position:fixed; left:0; top:0;">
                <!--<div  style="width:100%; height:100%; position:fixed; left:0; top:0;">-->
                <noDataF></noDataF>
            </div>
        </div>
        <compFooter value="2"/>

    </div>
</template>


<script type="text/javascript">
import $ from '@/common'
import noDataF from "@/components/noDataF.vue"
import compFooter from "@/components/compFooter.vue"
function loadFunc(data) {
    $.post($.url('listenList'), {
        adviser_id: data.o.adviser_id,
        rule_out_id: data.o.answer_id,
    }, function (res) {
        data.ptList = res.data.list
        data.isLoading = false
    })
}
export default {
    data() {
        return {
            isLoading: true,
            o: {},
            active: 0,
            scrollTop: -1,
            ptList: [],
            typeList: {},
            pageNumber: [],
            typeId: 0
        }
    },
    computed: {
        pageHeight: function () {
            let val = $.windowHeight - $.footerHeight()
            return 'min-height:' + val + 'px'
        }
    },
    components: {
        compFooter,
        noDataF
    },
    methods: {
        payListen(id, e) {
            var self = this
            $.post($.url('listenAnswer'), {
                "id": id
            }, function (res) {
                self.isLoading = false
                if (res.code == 508) {
                    let questionId = res.data.id
                    $.post($.url('makeListenAnswer'), {
                        "id": id
                    }, function (res) {
                        if (res.success) {
                            var data = res.data.rs
                            var data = JSON.parse(data)
                            data.success = (res) => {
                                wx.showToast({
                                    title: '支付成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                                setTimeout(function () {
                                    let url = $.pageUrl('ptInfo') + "?id=" + questionId + '&answer_id=' + id
                                    $.go(url)
                                }, 2000)
                            }
                            data.fail = (res) => {
                                console.log(res)
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                            console.log(data)
                            wx.requestPayment(data)
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                } else if (res.code == 200) {
                    let questionId = res.data.id
                    let url = $.pageUrl('ptInfo') + "?id=" + questionId + '&answer_id=' + id
                    $.go(url)
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                    console.log(res)
                }
            })
        }

    },
    onLoad(o) {
        console.log(o)
        this.o = o
        loadFunc(this)
    },
    onPageScroll(event) {
        this.scrollTop = event.scrollTop - 1
    },
    onReachBottom: function () {

    },
    onPullDownRefresh: function () {
        loadFunc(this, function () {
            // 停止下拉动作
            wx.stopPullDownRefresh();
        })
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
