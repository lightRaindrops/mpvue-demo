<template>
    <div id="app">
        <div class="back" :style="'height:'+pageHeight + 'px;'">
            <div class="title">
                <div class="t1">快来一起学</div>
                <div class="t2">超“牛”的财税知识</div>
            </div>
            <div class="middle">
                <div class="head-title">
                    <img class="head" :src="userInfo.photo"/>
                    <span class="t1"> 好友（{{userInfo.name}}）推荐您学习</span>
                </div>
                <div class="intro">
                    <span class="t1">{{res.t_title}}</span>
                    <span class="t2">{{res.t_intro}}</span>
                </div>
                <div class="dec">
                    <span class="t1">税务大咖为您解析！</span>
                    <span class="t2">价值{{adviserInfo.consult_pay}}元</span>
                    <span class="t3">只要1元</span>
                </div>
            </div>
            <div class="bottom">
                <div class="t1">已有<span class="red">{{res.listenCount}}</span>人学习</div>
                <div class="t2"><span class="btn" @click="payListen()">我也要学习</span></div>
                <div class="t3">您的<span class="red">{{shareInfo.count}}</span>名好友也在学习</div>
                <div class="t4">
                    <img class="head"
                    :src="item.head_url" v-for="(item,index) in shareInfo.list"
                    :key="index"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import $ from '@/common'
function loadFunc(data) {
    let url = $.url('moneyHistory')
    $.post(url, function (res) {
        data.res = res
        data.items = res.data.list
        data.total = res.data.total
        data.isLoading = false
    })

}
export default {
    name: 'app',
    data() {
        return {
            isLoading: true,
            pageHeight: $.windowHeight,
            o: {},
            ans: [],
            res: {},
            inviteCode: '',
            adviser_id: 0,
            userInfo: [],
            adviserInfo :[],
            shareInfo:[],
        }
    },
    methods: {
        //

        getAdviserDetailInfo(){
            //获取专家信息
            let self = this
            let answer_id = self.o.answer_id
            $.post($.url('answerDetail'), {
                id: answer_id,
            }, function (res) {
                if (res.success) {
                    $.post($.url('getAdviserDetailInfo'), {
                        id: res.data.answerer
                    }, function (res) {
                        self.adviserInfo = res.data;
                    })
                } else {
                    $.tip(res.msg)
                }
            })
        },
        questionDetail(){
            //获取问题
            let self = this
            let id = self.o.id
            $.post($.url('questionDetail'), {
                id: id
            }, function (res) {
                if (res.success) {
                    self.res = res.data
                    self.res.t_title = $.elliosisField(self.res.title, 14)
                    self.res.t_intro = $.elliosisField(self.res.intro, 40)
                } else {
                    $.tip(res.msg)
                }
            })
        },
        getUserInfoByInviteCode(){
            //获取邀请人
            let self = this
            let inviteCode=this.o.inviteCode
            $.post($.url('getUserInfoByInviteCode'), {
                inviteCode: inviteCode
            }, function (res) {
                self.userInfo = res.data.userData
            })
        },
        shareListenList(){
            //获取好友学习 根据分享
            let self = this
            let answer_id = self.o.answer_id
            $.post($.url('shareListenList'), {
                answer_id: answer_id,
                pageSizes: 6
            }, function (res) {
                self.shareInfo = res.data
            })
        },
        payListen( e) {
            var self = this
            let id=self.o.answer_id
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
                            var data = res.data
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
    components: {},
    onLoad(o){
        console.log(o)
        let t = this;
        t.o = o
        this.getUserInfoByInviteCode()
        this.questionDetail()
        this.getAdviserDetailInfo()
        this.shareListenList()
    },
}
</script>
<style lang="less">
@import "./main.less";
</style>
