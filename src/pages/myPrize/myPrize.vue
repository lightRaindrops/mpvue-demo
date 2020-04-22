<template>
    <section class="myPrizeBox">
        <div
            style="text-align: center;line-height:300rpx;color:#999"
            v-if="prizeList.length===0"
        >暂无奖品数据</div>
        <ul>
            <li class="fx" v-for="(item,index) in prizeList" :key="index">
                <template v-if="item.reward_type == 3">
                    <div class="prizeImg" @click="clone(item.prize_code)">
                        <img :src="item.photo" mode="aspectFit" />
                    </div>
                    <div class="prizeCon fx1" @click="clone(item.prize_code)">
                        <div class="title">{{item.prize_name}}</div>
                        <div class="desc">
                            <span v-if="item.reward_type===1">{{item.prize_code}}算珠</span>
                            <span v-if="item.reward_type===4">{{item.prize_code}}</span>
                        </div>
                        <div class="time fx">
                            {{item.created_at}}
                            <div class="fx1"></div>
                            <div v-if="item.reward_type == 3" style="color:#55a0ff;">点击复制</div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="prizeImg">
                        <img :src="item.photo" mode="aspectFit" />
                    </div>
                    <div class="prizeCon fx1">
                        <div class="title">{{item.prize_name}}</div>
                        <div class="desc">
                            <span v-if="item.reward_type===1">{{item.prize_code}}算珠</span>
                            <span v-if="item.reward_type===4">{{item.prize_code}}</span>
                        </div>
                        <div class="time fx">{{item.created_at}}</div>
                    </div>
                </template>
            </li>
        </ul>
    </section>
</template>

<script>
import $ from '@/common'
export default {
    name: 'myPrize',
    data() {
        return {
            prizeList: [],
            pageNumber: 1,
        }
    },
    onLoad() {
        this.getPrizeList()
    },
    methods: {
        //获取奖品列表

        getPrizeList() {
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('getLotteryMidAutumnRecord'), (res) => {
                wx.hideLoading()
                if (res.success) {
                    console.log(res)
                    this.prizeList = res.data.list

                } else {
                    $.tip(res.msg)
                }
            })
        },
        clone(text) {
            wx.setClipboardData({
                data: text,
                success: function (res) {
                    wx.getClipboardData({
                        success: function (res) {
                            wx.showToast({
                                title: '复制成功'
                            })
                        }
                    })
                }
            })
        },
    },
    //上拉加载更多推荐数据
    onReachBottom: function () {
        //console.log(111111)
        let self = this
        let pageNumber = self.pageNumber
        let url = $.url('getLotteryMidAutumnRecord')
        wx.showLoading({
            title: '加载中',
        })
        $.post(url, {
            page: pageNumber
        }, function (res) {
            wx.hideLoading()
            let list = res.data.list
            for (let i of list) {
                self.prizeList.push(i)
            }
            self.pageNumber++
        })
    },

    //下拉刷新推荐数据
    onPullDownRefresh: function () {
        this.getPrizeList()
        wx.stopPullDownRefresh()

    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
