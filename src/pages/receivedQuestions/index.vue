<template>
    <div>
        <div>
            <div class="loadingWrap" v-show="isLoading">
                <van-loading size="15px"/>
                <span class="txt">正在加载</span>
            </div>
            <div class="receivedQuestions">
                <div v-if="items.length == 0 && !isLoading">
                    <noDataF></noDataF>
                </div>

                <div class="group">
                    <div
                        v-for="(item,index) in items"
                        class="item DB itemWrap"
                        :key="index"
                    >
                        <a
                            :href="item.question_type == 3 ?item.onlineHref : '../problemInfo/main?id='+item.id+'&goUrl=receivedQuestions'"
                        >
                            <div class="title fx">
                                <div class="des">
                                    <div v-if="item.question_type == 2" class="fx">
                                        <div class="iconfont icon-zhengwuyaowen"></div>图文咨询
                                    </div>
                                    <div v-else-if="item.question_type == 3" class="fx">
                                        <div class="iconfont icon-xianchangshenbao"></div>在线咨询
                                    </div>
                                </div>
                                <!-- 小红点 -->
                                <div class="redRound" v-if="item.status == 1"></div>

                                <!--图文咨询-->
                                <span class="status" v-if="item.question_type==2">
                                    <span
                                        class="jzhd red fx"
                                        v-if="item.status==1&&item.left_time>0"
                                    >
                                        <fan-count-down :fantime="item.left_time"></fan-count-down>订单失效
                                    </span>
                                    <span v-if="item.status == 2" class="dhd green">已回答</span>
                                    <span v-if="item.status == 3" class="dhd red">已关闭</span>
                                    <span v-if="item.status == 4" class="dhd green">已完成</span>
                                </span>
                                <!--在线咨询-->
                                <span class="status" v-if="item.question_type==3">
                                    <!-- <span class="jzhd red fx" v-if="item.status==1&&item.left_time>0&&item.is_answer==false">
                                    15分钟后订单失效
                                    </span>-->
                                    <span
                                        class="jzhd red fx"
                                        v-if="item.status==1&&item.is_answer==true"
                                    >
                                        <fan-count-down :fantime="item.left_time"></fan-count-down>订单失效
                                    </span>
                                    <span v-if="item.status == 2" class="dhd green">已回答</span>
                                    <span v-if="item.status == 3" class="dhd red">已失效</span>
                                    <span v-if="item.status == 4" class="dhd green">已完成</span>
                                </span>
                            </div>
                            <div class="t fx">
                                <div class="fx1">
                                    <div>
                                        <div style="float:left; margin-right: 5px;">
                                            <div
                                                class="xsWrap fx"
                                                style="float:left;padding:5rpx 10rpx;box-sizing:border-box;font-size:24rpx;color:#fff;background:#FFBA00;border-radius:40rpx;"
                                                v-if="item.reward_type==1"
                                            >
                                                <span class="showXs">￥{{item.reward}}</span>
                                            </div>
                                            <div
                                                class="xsWrap fx"
                                                style="float:left;padding:5rpx 10rpx;box-sizing:border-box;font-size:24rpx;color:#fff;background:#B3D465;border-radius:40rpx;"
                                                v-if="item.reward_type==2"
                                            >
                                                <span class="showXs">{{item.reward}}算珠</span>
                                            </div>
                                        </div>
                                        {{item.title}}
                                    </div>
                                </div>
                            </div>
                            <div class="ms">
                                <div>
                                    <rich-text :nodes="item.intro"></rich-text>
                                </div>
                            </div>
                            <div class="b fx">
                                <div class="fx1">
                                    <span class="time">{{item.created_at}}</span>
                                </div>
                            </div>
                        </a>
                        <div class="statusWrap">
                            <div class="buttons fx">
                                <span class="red-btn" v-if="item.status==1&&item.left_time>0">
                                    <a
                                        :href="'../problemInfo/main?id='+item.id+'&goUrl=receivedQuestions'"
                                        v-if="item.question_type==2"
                                    >查看</a>
                                    <a v-if="item.question_type==3" :href="item.onlineHref">查看</a>
                                </span>
                                <span
                                    class="grey-btn"
                                    v-else
                                    @click="removeReceiveQuestion(item)"
                                >移除</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <compFooter v-if="isShowFooter" value="3"/>
        </div>
    </div>
</template>


<script type="text/javascript">
import $ from '@/common'
import noDataF from "@/components/noDataF.vue"
import compFooter from "@/components/compFooter.vue"

function loadFunc(data, back) {
    data.pageNumber = 1
    $.post($.url('myReceiveQuestion'), function (res) {
        let list = res.data.list
        let realList = []
        for (let i of list) {
            i.onlineHref = '../chating/main?usId=' + i.questioner + '&guId=' + i.adviser_id + '&isAsk=false' + '&chatTo=' + i.yunxin_id + '&chatToName=' + i.uname + '&faceSrc=' + i.head_url + '&quesId=' + i.id
            realList.push(i)
        }
        data.items = realList
        data.isLoading = false
        if (back) {
            back()
        }
    })
}
export default {
    data() {
        return {
            isLoading: true,
            res: {},
            items: [],
            pageNumber: 1,
            isShowFooter: false,
            o: [],
        }
    },
    computed: {},
    components: {
        noDataF,
        compFooter
    },
    methods: {
        removeReceiveQuestion(item) {
            let t = this
            $.post($.url('removeReceiveQuestion'), {
                id: item.id
            }, function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    //移除元素
                    for (var k in t.items) {
                        if (t.items[k].id == item.id) {
                            t.items.splice(k, 1);
                        }
                    }
                }
            })
        }
    },
    onLoad(o) {
        $.log(o.isShowFooter);
        if (o.isShowFooter === undefined) {
            this.isShowFooter = true
        } else {
            this.isShowFooter = false
        }
        loadFunc(this)
    },
    onPullDownRefresh: function () {

        loadFunc(this, function () {
            wx.stopPullDownRefresh();
        })
    },
    onReachBottom: function () {
        let self = this
        self.isLoading = true
        let pageNumber = self.pageNumber
        //获取数
        let url = $.url('myReceiveQuestion')
        $.post(url, {
            page: pageNumber
        }, function (res) {
            let list = res.data.list
            for (let i of list) {
                i.onlineHref = '../chating/main?usId=' + i.questioner + '&guId=' + i.questioner + '&isAsk=false' + '&chatTo=' + i.yunxin_id + '&chatToName=' + i.uname + '&faceSrc=' + i.head_url + '&quesId=' + i.id
                self.items.push(i)
            }
            if (list.length > 0) {
                self.pageNumber++
            }
            self.isLoading = false
        })
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
