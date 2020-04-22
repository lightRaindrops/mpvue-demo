<template>
    <div>
        <div class="discover">
            <!--筛选 start-->
            <div class="filterBox">
                <div class="all" :class="{'upCateList':isShowPtCate==true}" @click="selectCate">
                    {{ptCateText}}
                    <i class="down" :class="{'up':isShowPtCate==true}"></i>
                </div>
                <div class="new" :class="{'upHelpMore':isShowPtNew==true}" @click="selectHelp">
                    排序：
                    <span>{{ptNewHot}}</span>
                    <i class="down" :class="{'up':isShowPtNew==true}"></i>
                </div>
            </div>
            <!--end 筛选-->
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
            <!--end 分类下拉-->
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
            <div class="tabCont" v-show="isShowList">
                <ul>
                    <li
                        v-for="(item,index) in listData"
                        :key="index"
                        @click.stop="toWhoConsulted(item.id)"
                    >
                        <div class="title">{{item.question_title}}</div>
                        <div class="answer">
                            <div class="advInfo fx">
                                <i>
                                    <img :src="item.head_url" />
                                </i>
                                <span>{{item.name}}</span>
                                <span>{{item.cpa_type}}</span>
                                <span style="margin-left:10rpx;">回答：</span>
                                <div class="fx1"></div>
                                <i>
                                    <img :src="item.head_url" />
                                </i>
                                <span style="color:#f2616d;">易**查看了问题</span>
                            </div>
                            <div class="descInfo">{{item.intro}}</div>
                        </div>
                        <div class="btnBox">
                            <div class="tip2">
                                <span>{{item.listen_num}}</span>旁听 ·
                                <span>{{item.zan}}</span>赞同
                            </div>
                            <div class="fx1"></div>
                            <span
                                style="color:#999; text-decoration: line-through; margin-right:10rpx;"
                            >价值￥30.00</span>
                            <div class="btn">￥1旁听</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <compFooter value="2" />
    </div>
</template>

<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import compFooter from '@/components/compFooter.vue'
export default {
    data() {
        return {
            isShowList: true,
            isShowMyTiwenList: false,
            isShowMeShareList: false,
            curStatus: '',
            listData: [],
            myTiwenData: [],
            meShareData: [],
            isAndroid: false,
            pageHeight: $.windowHeight,
            currentShare: {},
            qrcodeSrc: '',
            userId: '',
            currentQuesId: '',
            currentAdv: {},
            sharePopObj: {
                title: '',
                desc: '',
                advName: '',
                money: ''
            },
            ptwtType: [
                { id: 0, 'name': '全部分类' }
            ],
            ptNewArr: ['最新', '最热'],
            isShowPtCate: false,
            isShowPtNew: false,
            curSelectIndex: 0,
            curSelectIndex2: 0,
            isScrollBg: false,
            ptCateText: '全部分类',
            ptNewHot: '最新',
            curNewVal: 0,
            curNewVal2: 1,
            pageNumber: 0,
        }
    },
    computed: {

    },
    components: {
        Nimg, compFooter
    },
    onLoad() {
        let that = this
        that.initData(0)
        this.isAndroid = !$.isIphone()
    },
    methods: {
        //跳转到旁听详情
        toWhoConsulted(id) {
            //console.log(id)
            wx.navigateTo({
                url: '../whoConsulted/main?id=' + id
            })
        },

        //点遮罩层关闭下拉分类
        closePtPop(e) {
            //let ptPopDom = this.$refs.ptPop
            //console.log(e.mp.target.dataset.name)
            if (e.mp.target.dataset.name) {
                this.isShowPtCate = false
                this.isShowPtNew = false
                this.isShowGwCate = false
                this.isShowGwNew = false
                this.isScrollBg = false
            }
        },

        //选择最新最热筛选加载数据
        getPtNewHotName(item, index) {
            let that = this
            let cateType;
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

            if (that.curStatus === '') {
                cateType = 0;
            } else if (that.curStatus === 'myTiwen') {
                cateType = 2;
            } else {
                cateType = 1;
            }

            $.post($.url('listenList'), {
                type: that.curPtCateId,
                order_type: that.curNewVal,
                select_type: cateType
            }, (res) => {
                console.log(res)
                if (res.code == 200) {
                    //console.log(res.data.list)
                    wx.hideLoading();
                    if (that.curStatus === '') {
                        that.listData = res.data.list;
                    } else if (that.curStatus === 'myTiwen') {
                        that.myTiwenData = res.data.list;
                    } else {
                        that.meShareData = res.data.list;
                    }

                    that.isScrollBg = false
                }
            })
        },

        //选择分类后筛选加载数据
        getPtCateName(item, index) {
            //console.log(item.id)
            let that = this
            let cateType;
            that.pageNumber = 0
            that.curSelectIndex = index
            that.ptCateText = item.name;
            that.isShowPtCate = false;
            that.curPtCateId = item.id
            wx.showLoading({
                title: '加载中',
            });

            if (that.curStatus === '') {
                cateType = 0;
            } else if (that.curStatus === 'myTiwen') {
                cateType = 2;
            } else {
                cateType = 1;
            }

            $.post($.url('listenList'), {
                type: that.curPtCateId,
                order_type: that.curNewVal,
                select_type: cateType
            }, (res) => {
                console.log(res)
                if (res.code == 200) {
                    //console.log(res.data.list)
                    wx.hideLoading();
                    if (that.curStatus === '') {
                        that.listData = res.data.list;
                    } else if (that.curStatus === 'myTiwen') {
                        that.myTiwenData = res.data.list;
                    } else {
                        that.meShareData = res.data.list;
                    }
                    that.isScrollBg = false
                }
            })
        },

        //选择分类
        selectCate() {
            let that = this
            that.isShowPtCate = !that.isShowPtCate;
            that.isShowPtNew = false;

            if (that.isShowPtCate == true) {
                that.isScrollBg = true
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

        //选择最新最热
        selectHelp() {
            this.isShowPtCate = false;
            this.isShowPtNew = !this.isShowPtNew;
            if (this.isShowPtNew == true) {
                this.isScrollBg = true
                //console.log(that.isScrollBg)
            } else {
                this.isScrollBg = false
            }
        },
        showShareBottom(item) {
            //console.log(item)
            this.isShowShareBottom = true
            this.sharePopObj.title = item.question_title
            this.sharePopObj.desc = item.intro
            this.sharePopObj.advName = item.aname
            this.sharePopObj.money = item.consult_pay
        },
        //初始化数据
        initData(type) {
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('listenList'), {
                select_type: type
            }, (res) => {
                wx.hideLoading()
                if (res.success) {
                    console.log(res)
                    if (type === 0) {
                        this.listData = res.data.list
                    } else if (type === 1) {
                        this.meShareData = res.data.list
                    } else {
                        this.myTiwenData = res.data.list
                    }


                } else {
                    $.tip(res.msg)
                }
            })
        },
    },
    onPullDownRefresh() {
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 500)
    },
    onShow() {
        wx.hideTabBar()
    },
}
</script>

<style lang="less">
@import "./main.less";
</style>
