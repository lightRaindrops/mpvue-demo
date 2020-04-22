<template>
    <div>
        <div class="box">
            <div class="loadingWrap" v-show="isLoading">
                <van-loading size="15px" />
                <span class="txt">正在加载</span>
            </div>

            <template v-if="!isLoading">
                <div class="myFollow">
                    <div v-if="items.length == 0">
                        <noDataF></noDataF>
                    </div>
                    <div class="item" v-for="(item,index) in items" :key="index">
                        <div class="gw fx">
                            <span class="img face" @click="onDetail(item)">
                                <img :src="item.head_url" alt="头像" style="border-radius: 50%;" />
                                <img
                                    mode="widthFix"
                                    class="cap-img"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_1.png?1"
                                    v-if="item.cpa_type=='注册会计师'"
                                />
                                <img
                                    mode="widthFix"
                                    class="cap-img"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_2.png?1"
                                    v-else-if="item.cpa_type=='高级会计师'"
                                />
                                <img
                                    mode="widthFix"
                                    class="cap-img"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_3.png?1"
                                    v-else-if="item.cpa_type=='中级会计师'"
                                />
                                <img
                                    mode="widthFix"
                                    class="cap-img"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_4.png?1"
                                    v-else-if="item.cpa_type=='税务师'"
                                />
                            </span>
                            <span class="txt fx1">
                                <span class="DB">
                                    <span class="name">{{item.name}}</span>
                                    <span class="zc">{{item.cpa_type}}</span>
                                    <span class="cznx">持证年限{{item.cpa_time}}年</span>
                                </span>
                                <span class="jj DB">{{item.intro}}</span>
                                <span class="sc DB">擅长：{{item.good_at}}</span>
                                <span class="DB other">
                                    <span class="zhpf">综合评分：{{item.score}}</span>
                                    <span class="bzg">帮助过：{{item.help_count}}人</span>
                                    <span class="price">
                                        <span>{{item.consult_score_pay}}</span>算珠/次
                                    </span>
                                </span>
                                <span class="DB buttons">
                                    <a @click="unfollowAdviser(item.id)" class="btn">取消关注</a>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>



<script type="text/javascript">

import $ from '@/common'
import noDataF from "@/components/noDataF.vue"

function loadFunc(data, back) {

    $.post($.url('followList'), function (res) {
        data.res = res
        data.items = res.data.list
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
            items: []
        }
    },
    computed: {

    },
    components: {
        noDataF
    },

    methods: {
        checked(id) {
            this.$set(this.items, "active", id)
        },
        unfollowAdviser(adviser_id) {
            let t = this;
            $.post($.url('unfollowAdviser'), { adviser_id: adviser_id }, function (res) {
                loadFunc(t)
            })
        },
        onDetail(item) {
            //跳转到顾问详情
            if (item.type != '新用户') {
                $.go('../adviserInfo/main?id=' + item.id);
            }
        }
    },

    onLoad() {
        loadFunc(this)
    },
    onPullDownRefresh: function () {
        loadFunc(this, function () {
            wx.stopPullDownRefresh();
        })
    },
    onReachBottom() {
        $.log('下一页')
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
