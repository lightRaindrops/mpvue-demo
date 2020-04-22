<template>
    <div class="whoConsultBox">
        <!--数据列表 start-->
        <div class="whoConList">
            <div class="head">
                <ul>
                    <li>价值（元）</li>
                    <li>旁听</li>
                    <li>赞</li>
                </ul>
            </div>
            <div class="cont">
                <ul>
                    <li>{{listenInfo.consult_pay}}</li>
                    <li>{{listenInfo.listen_num}}</li>
                    <li>{{listenInfo.zan}}</li>
                </ul>
            </div>
        </div>
        <!--end 数据列表-->

        <!--提问详情 start-->
        <div class="answerDetail">
            <div class="userInfo">
                <span class="userImg">
                    <img :src="listenInfo.photo" />
                </span>
                <span class="userName">{{listenInfo.name}}的提问</span>
            </div>
            <h3 class="title">{{listenInfo.question_title}}</h3>
            <p class="desc" v-html="listenInfoCont"></p>
            <div class="time">{{listenInfo.created_at}}</div>
        </div>
        <!--end 提问详情-->
        <div class="endBox">
            <span class="line"></span> 结束
            <span class="line"></span>
        </div>
        <button class="btn" @click="showComfirm(listenInfo.id,$event)">
            <span v-if="listenInfo.is_pay">查看</span>
            <span v-else>99算珠</span>
        </button>
    </div>
</template>

<script>
import $ from '@/common'

export default {
    name: 'whoConsulted',
    data() {
        return {
            listenInfo: {},
            opionsId: '',
            listenInfoCont: ""
        }
    },
    onLoad(opions) {
        this.opionsId = opions.id
        this.getPtData(opions.id)
    },
    onShow() {
        if ($.isPayMoneyAndSz) {
            this.getPtData(this.opionsId)
            $.isPayMoneyAndSz = false
        }
    },
    onUnload() {
        //支付钱和支付算珠完毕
        $.isPayMoneyAndSz2 = true
    },
    methods: {

        showComfirm(id, e) {
            console.log(id)
            let that = this
            if (that.listenInfo.is_pay) {
                let questionId = that.listenInfo.queId
                let url = $.pageUrl('problemInfo') + "?id=" + questionId + '&answer_id=' + id
                $.go(url)
            } else {

                wx.showModal({
                    content: '您确认支付吗？',
                    cancelText: '取消',
                    success(res) {
                        if (res.confirm) {
                            that.payListen(id, e)
                        }
                    }
                })
            }

        },


        getPtData(id) {
            $.post($.url('listenDetail'), {
                id: id
            }, (res) => {
                if (res.code == 200) {
                    this.listenInfo = res.data.info
                    if (res.data.info.question_intro) {
                        this.listenInfoCont = res.data.info.question_intro.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
                    }

                }
            })
        },

        payListen(id, e) {
            $.post($.url('userPointToListenAnswer'), {
                "id": id
            }, function (res) {
                if (res.success) {
                    let questionId = res.data.questionId
                    let url = $.pageUrl('ptInfo') + "?id=" + questionId + '&answer_id=' + id
                    $.go(url)
                } else {
                    $.tip(res.msg);
                }
            });
        },

    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
