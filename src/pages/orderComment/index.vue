<template>
<div>
    <div>
        <div class="title">
            <div class="title-t1">顾问已为您回答</div>
            <div class="title-t2">请评价一下为您解答的顾问吧</div>
        </div>
        <div class="content">
            <!--<div class="content-title">1星为差评，2-3星为中评，4-5星为好评</div>-->
            <div class="content-title">评价顾问</div>
            <div class="star-group">
                <span class="icon-xiaochengxu_tubiao15 iconfont star" v-for="(item,index) in starGroup" :key="index" :class="{'star-active':item.show===true}" @click="activeStar(item)"></span>
            </div>
            <div class="tip-group">
                <div class="tip" v-for="(item,index) in tipGroup" :key="index" :class="{'tip-active':item.show===true}" @click="activeTip(item)">{{item.name}}
                </div>
            </div>
            <div style="clear:both;"></div>
            <div style="margin:20px 0 5px 0;width:100%;border-bottom: 1px solid #f0f0f0;"></div>
            <div>
                <textarea class="comment" placeholder="在此输入评价" cols="50" v-model="intro"></textarea>
            </div>
            <div style="text-align:center">
                <button class="submit" @click="commentQuestion()">提交</button>
            </div>
        </div>
    </div>
</div>
</template>


<script type="text/javascript">
import $ from '@/common'

function loadFunc(data) {

    $.post($.url('myOrders'), function (res) {
        data.res = res
        data.items = res.data.list
        data.isLoading = false
    })

}

export default {

    data() {
        return {
            isLoading: true,
            items: [],
            res: {},
            id: 0,
            score: 5,
            tip: '',
            countGroup: {
                datetime: [{
                    dat: 72
                }, ]
            },
            starGroup: [{
                    num: 1,
                    show: false
                },
                {
                    num: 2,
                    show: false
                },
                {
                    num: 3,
                    show: false
                },
                {
                    num: 4,
                    show: false
                },
                {
                    num: 5,
                    show: false
                }
            ],
            tipGroup: [{
                    name: '不错',
                    show: false
                },
                {
                    name: '服务态度好',
                    show: false
                },
                {
                    name: '非常专业',
                    show: false
                },
                {
                    name: '回复快',
                    show: false
                },
                {
                    name: '下次还找TA',
                    show: false
                },
                {
                    name: '非常满意',
                    show: false
                },
                {
                    name: '很好',
                    show: false
                },
                {
                    name: '解决了问题',
                    show: false
                },
            ],
        }
    },
    computed: {},
    components: {},

    methods: {

        checked(id) {
            this.$set(this.items, "active", id)
        },
        activeTip(item) {
            if (item.show) {
                item.show = false
            } else {
                item.show = true
            }
        },
        activeStar(item) {
            let t = this
            t.score = item.num
            for (var i in t.starGroup) {
                if (item.num >= t.starGroup[i].num) {
                    t.starGroup[i].show = false
                } else {
                    t.starGroup[i].show = true
                }
            }
        },
        commentQuestion() {
            let t = this
            let tip = ''
            for (var i in t.tipGroup) {
                if (t.tipGroup[i].show == true) {
                    tip += t.tipGroup[i].name + ',';
                }

            }


            $.post($.url('commentAdviser'), {
                question_id: t.id,
                intro: t.intro || '这个用户很懒，没有写评论',
                tip: tip,
                score: t.score
            }, function (res) {
                if (res.code == 200) {
                    $.suc('评论成功');
                    $.back()
                    $.isPingLunSuccess = true
                    // $.go('../myOrder/main');
                } else {
                    $.tip(res.msg)
                }
            })
        }
    },
    onLoad(o) {
        this.id = o.id
        loadFunc(this)
    },
    onUnload() {
        //返回刷新
        $.isPingLunSuccess = true
    },
    onReachBottom: function () {

    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
