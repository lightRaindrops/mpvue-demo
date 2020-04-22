<template>
    <div id="app">
        <div class="mainBox" :style="pageHeight">
            <div class="group">
                <div class="item" v-for="(item,index) in items" :key="index">
                    <a class="m DB" :href="'../problemInfo/main?id=' + item.question_id">
                        <div class="t fx">
                            <div class="fx1">
                                <img class="icon xs" v-if="item.reward>0"
                                src="https://static.cgkc.com/miniprogram/mini/qing/img/icon-sz.png"/>
                                <span class="font" v-if="item.reward>0">{{item.reward}}</span><span class="title">{{item.title}}</span>
                            </div>
                        </div>
                        <div class="m m1">
                            <rich-text :nodes="item.intro" @click="showCommenForm(item.id)">
                            </rich-text>
                        </div>
                        <div class="b fx">
                            <div class="face">
                                <img :src="item.userphoto">
                            </div>
                            <div class="twName">
                                {{item.username}}
                            </div>
                            <!--<div class="time">-->
                            <!--{{item.created_at}}-->
                            <!--</div>-->
                        </div>
                    </a>
                        <a :href="'../problemInfo/main?id=' + item.question_id" class="btn wtjd">
                        为Ta解答
                    </a>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
function loadFunc(data, back) {
    data.pageNumber = 1
    $.post($.url('getPushQuestion'), function (res) {
        data.res = res
        data.items = res.data.list
        data.isLoading = false
        for (var i in res.data.list) {
            //字段处理
            res.data.list[i].title = $.elliosisField(res.data.list[i].title, 10);
            res.data.list[i].intro = $.elliosisField(res.data.list[i].intro, 20);
        }
        if (back) {
            back()
        }
    })
}
export default {
    name: 'app',
    data() {
        return {
            isLoading: true,
            res: {},
            items: [],
            pageNumber: 1,
        }
    },
    components: {},
    computed: {
        pageHeight: function () {
            let val = $.windowHeight - $.footerHeight()
            return 'min-height:' + val + 'px'
        }
    },
    onLoad() {
        loadFunc(this)
    },
    onPullDownRefresh: function() {
        loadFunc(this, function() {
            wx.stopPullDownRefresh();
        })
    },
    onReachBottom: function () {
        let self = this
        self.isLoading = true
        let pageNumber = self.pageNumber
        //获取数
        let url = $.url('getPushQuestion')
        $.post(url, {
            page: pageNumber
        }, function (res) {
            let list = res.data.list
            for (let i of list) {
                self.items.push(i)
            }
            if (list.length > 0) {
                self.pageNumber++
            }
            for (var i in res.data.list) {
                //字段处理
                res.data.list[i].title = $.elliosisField(res.data.list[i].title, 10);
                res.data.list[i].intro = $.elliosisField(res.data.list[i].intro, 20);
            }
            self.isLoading = false
        })
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
