<template>
    <div class="ptListBox" :class="{'ptListBoxFixed':isScrollBg}">
        <!--旁听 start-->
        <div v-show="isShowPt" class="ptAndGwList">
            <!--选择分类 start-->
            <div class="cateBox">
                <span
                    class="cateList"
                    :class="{'upCateList':isShowPtCate==true}"
                    @click="selectCate"
                >
                    {{ptCateText}}
                    <i class="down" :class="{'up':isShowPtCate==true}"></i>
                </span>
                <span
                    class="helpMore"
                    :class="{'upHelpMore':isShowPtNew==true}"
                    @click="selectHelp"
                >
                    <i class="beforeHelp" :class="{'afterHelp':isShowPtNew==true}"></i>
                    {{ptNewHot}}
                </span>
            </div>
            <!--end 选择分类-->

            <!--分类下拉 start-->
            <div
                class="catePop"
                v-show="isShowPtCate"
                data-name="ptPop"
                @click="closePtPop($event)"
            >
                <div class="cateItem">
                    <ul>
                        <li
                            :class="{'curSelect':curSelectIndex===index}"
                            v-for="(item,index) in ptwtType"
                            :key="index"
                            @click="getPtCateName(item,index)"
                        >{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <!--edn 分类下拉-->

            <!--最新、最热 start-->
            <div class="catePop" v-show="isShowPtNew" data-name="ptPop" @click="closePtPop($event)">
                <div class="cateItem">
                    <ul>
                        <li
                            :class="{'curSelect':curSelectIndex2===index}"
                            v-for="(item,index) in ptNewArr"
                            :key="index"
                            @click="getPtNewHotName(item,index)"
                        >{{item}}</li>
                    </ul>
                </div>
            </div>
            <!--edn 最新、最热-->

            <div class="filerCont">
                <ul>
                    <li
                        v-for="(item,index) in listenListData"
                        :key="index"
                        @click.stop="toWhoConsulted(item.id)"
                    >
                        <div class="headInfo">
                            <div class="headImg" @click.stop="onToGwInfo(item.adviser_id)">
                                <img :src="item.head_url" />
                            </div>
                            <div class="nameBox">
                                <div class="name">
                                    <span>{{item.cpa_type}}</span>
                                    <span>{{item.name}}</span> 回答了问题
                                </div>
                                <div class="jy">{{item.cpa_time}}年 | 会计师事务所工作经验</div>
                            </div>
                        </div>
                        <div class="descInfo">{{item.question_title}}</div>
                        <div class="countInfo">
                            <span class="flowCount">{{item.zan}}人点赞</span>
                            <span class="jz">价值¥{{item.consult_pay}}</span>
                            <span class="ptBtn">
                                <span v-if="is_members">会员免费查看</span>
                                <span v-else-if="item.is_pay">查看</span>
                                <span v-else>99算珠旁听</span>
                            </span>
                        </div>
                    </li>
                    <li v-if="listenListData.length==0" style="color:#999;text-align: center">
                        <img
                            style="width:750rpx;height:397rpx"
                            src="https://static.cgkc.com/miniprogram/mini/wx/img/noData.png"
                        />
                        <span>暂无数据</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--end 旁听-->
        <compFooter value="2" />
    </div>
</template>

<script>

import $ from '@/common'
import compFooter from '@/components/compFooter.vue'
let myInviteCode = ''
export default {
    name: 'app',
    data() {
        return {
            curNewVal: 0,
            curNewVal2: 1,
            curPtCateId: '',
            curSelectIndex: 0,
            curSelectIndex2: 0,
            curSelectIndex3: 0,
            curSelectIndex4: 0,
            ptCateText: '全部分类',
            ptNewHot: '最新',
            ptNewArr: ['最新', '最热'],
            ptwtType: [
                { id: 0, 'name': '全部分类' }
            ],
            isShowPtCate: false,
            isShowPtNew: false,
            pageNumber: 1,
            currentLi: 'pt',
            isShowPt: true,
            adviserList: [],
            kingGlodAdivsers: [],
            listenListData: {},
            isLoading: true,
            isScrollBg: false,
            is_members: false,
        }
    },
    components: {
        compFooter
    },

    onLoad() {
        $.isLogin(() => {
            //读取自己的邀请码
            let url = 'userCenterData'
            $.np(url).then(res => {
                myInviteCode = res.inviteCode
                $.log('我自己的邀请码' + myInviteCode)
            })
        })
        this.init()
    },
    onShow() {
        wx.hideTabBar()
        let session = $.getLocal('session')
        if ($.isPtRefresh || session == '' || session == undefined) {
            $.isPtRefresh = false
            this.init()
        }
    },
    methods: {
        init() {
            $.isLogin(() => {
                $.np('getUserMembers').then(res => {
                    this.is_members = res.is_members
                })
            })

            this.getListenList()
        },
        closePtPop(e) {
            if (e.mp.target.dataset.name) {
                this.isShowPtCate = false
                this.isShowPtNew = false
                this.isScrollBg = false
            }
        },
        getPtCateName(item, index) {
            console.log(item.id)
            let that = this
            that.pageNumber = 0
            that.curSelectIndex = index
            that.ptCateText = item.name;
            that.isShowPtCate = false;
            that.curPtCateId = item.id
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('listenList'), {
                type: that.curPtCateId,
                order_type: that.curNewVal
            }, (res) => {
                console.log(res)
                if (res.code == 200) {
                    //console.log(res.data.list)
                    wx.hideLoading();
                    that.listenListData = res.data.list;
                    that.isScrollBg = false
                }
            })
        },
        getPtNewHotName(item, index) {
            let that = this
            that.pageNumber = 0
            that.curSelectIndex2 = index
            that.ptNewHot = item;
            that.isShowPtNew = false;
            wx.showLoading({
                title: '加载中',
            });

            if (item === '最新') {
                that.curNewVal = 0
            } else {
                that.curNewVal = 1
            }

            $.post($.url('listenList'), {
                type: that.curPtCateId,
                order_type: that.curNewVal
            }, (res) => {
                console.log(res)
                if (res.code == 200) {
                    //console.log(res.data.list)
                    wx.hideLoading();
                    that.listenListData = res.data.list;
                    that.isScrollBg = false
                }
            })
        },

        selectCate() {
            let that = this
            that.isShowPtCate = !that.isShowPtCate;
            that.isShowPtNew = false;
            if (that.isShowPtCate == true) {
                that.isScrollBg = true
                console.log(that.isScrollBg)
            } else {
                that.isScrollBg = false
            }

            if (that.ptwtType.length > 1) {
                return false
            } else {
                let url = $.url('questionType')
                $.post(url, function (res) {
                    if (res.success) {
                        res.data.forEach((item) => {
                            that.ptwtType.push(
                                { id: item.id, 'name': item.val }
                            )
                        })

                    } else {
                        $.tip(res.msg)
                    }

                })
            }

        },
        selectHelp() {
            this.isShowPtCate = false;
            this.isShowPtNew = !this.isShowPtNew;
            if (this.isShowPtNew == true) {
                this.isScrollBg = true
            } else {
                this.isScrollBg = false
            }
        },
        onToGwInfo(id) {
            //跳转到顾问详情
            $.go('../adviserInfo/main?id=' + id);
        },
        tabLi(liVal) {
            this.currentLi = liVal
            if (liVal == 'pt') {
                this.isShowPt = true
                this.getListenList()
            }
        },
        onToGwInfo(id) {
            //跳转到顾问详情
            $.go('../adviserInfo/main?id=' + id);
        },

        getListenList() {
            let that = this
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('listenList'), (res) => {
                console.log(res)
                if (res.code == 200) {
                    console.log(res.data.list)
                    that.listenListData = res.data.list;
                    wx.hideLoading();
                }
            })
        },
        toWhoConsulted(id) {
            wx.navigateTo({
                url: '../whoConsulted/main?id=' + id
            })
        },
    },
    onPullDownRefresh() {
        if (this.currentLi == 'pt') {
            $.post($.url('listenList'), {
                type: this.curPtCateId,
                order_type: this.curNewVal
            }, (res) => {
                console.log(res)
                if (res.code == 200) {
                    wx.hideLoading();
                    this.listenListData = res.data.list;
                }
            })
        }
        wx.stopPullDownRefresh()
    },

    onReachBottom: function () {
        let self = this
        let ptwtData = this.ptwtType;
        if (self.currentLi == 'pt') {
            let pageAdd = self.pageNumber + 1
            if (ptwtData) {
                ptwtData.forEach((item) => {
                    if (item.name == self.ptCateText) {
                        $.post($.url('listenList'), {
                            type: item.id,
                            page: pageAdd
                        }, function (res) {
                            let list = res.data.list

                            for (let i of list) {
                                self.listenListData.push(i)
                            }

                            self.pageNumber++
                        })
                    }
                })
            }
        }
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        let path = '/pages/index/main?inviteCode=' + myInviteCode
        return {
            title: '财税有难题，就问CPA！',
            path: path,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
