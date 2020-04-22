<template>
    <div>
        <div class="box">
            <div class="mainBox">
                <div class="top">
                    <!--<div class="select fx">
                    2019年1月<i class="iconfont icon-sanjiao"></i>
                    </div>-->
                    <div class="field">
                        <div>
                            <picker
                                mode="date"
                                :value="Fmonth"
                                fields="month"
                                :end="today"
                                @change="onDateChange"
                            >
                                <view
                                    class="picker"
                                    style="height:50px; line-height:50px; font-size:14px; color:#666"
                                >
                                    <div v-if="!month" style="color:#999">筛选时间</div>
                                    <div v-else>{{month}}</div>
                                </view>
                            </picker>
                            <!-- <van-field :value="month" @input="onInput($event,'month')" :border="false" clearable placeholder="请选择领证时间" /> -->
                        </div>
                        <span class="filterType" @click="selectGwCate">类型<i class="down"></i></span>
                    </div>
                    <div class="txt fx">
                        <div class="zc">支出￥{{total.into}}</div>
                        <div class="cz">收入￥{{total.out}}</div>
                    </div>
                </div>
                <div class="group">
                    <div class="item fx" v-for="(item,index) in items" :key="index">
                        <div class="txt fx1">
                            <div class="t fx">{{item.reason}}</div>
                            <div class="b">{{item.created_at}}</div>
                        </div>
                        <div class="numWrap">
                            <span v-if="item.amount<0" style="color:#e8391f;">{{item.amount}}</span>
                            <span v-else>{{item.amount}}</span>
                        </div>
                    </div>

                    <div class="catePop" v-show="isShowGwCate">
                        <div class="cateItem">
                            <ul>
                                <li v-for="(item,index) in typeList" :key="index" @click="changeType(item.type)">{{item.name}}</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    </div>
</template>



<script type="text/javascript">
import $ from '@/common'

const T = {}

export default {

    data() {
        return {
            items: [],
            total: [],
            pageNumber: 0,
            month: '',
            isShowGwCate:false,
            typeList:[
                {
                    name:'一级分润',
                    type:1
                },
                {
                    name:'二级分润',
                    type:2
                },
                {
                    name:'其它',
                    type:3
                }
            ]
        }
    },
    computed: {

    },
    components: {},

    methods: {

        changeType(type){
            console.log(type)
            this.isShowGwCate = false
            $.post($.url('moneyHistory'),{
                type:type
            }, (res) => {
                this.items = res.data.list
            })
        },

        selectGwCate(){
            this.isShowGwCate = !this.isShowGwCate;
        },

        loadFunc(isInit, back = $.noop) {
            let url = $.url('moneyHistory')
            if (isInit) {
                T.page = 0
                T.isPageEnd = false
            }
            let data = {
                page: T.page
            }
            $.pp(url, data, res => {
                if (isInit) {
                    this.items = res.list
                    this.total = res.total
                }
                back(res)
            })
        },
        onDateChange(e) {
            let url = $.url('moneyHistory')
            let t = this
            let time = e.mp.detail.value.split('-')
            t.month = time[0] + '年' + time[1] + '月'

            $.pp(url, {
                month: e.mp.detail.value
            }, res => {
                t.items = res.list
                t.total = res.total
                T.isDateChange = true
            })
        },

    },

    onLoad() {
        this.loadFunc(true)
    },
    onReachBottom() {
        if (T.isDateChange) {
            return
        }
        if (T.isPageEnd) {
            return
        }
        T.page++
        this.loadFunc(false, res => {
            this.items = this.items.concat(res.list)
            T.isPageEnd = res.list.length < 20
        })
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
