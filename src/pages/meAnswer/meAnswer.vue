<template>
    <div class="meAnswerBox">
        <nav class="navBox">
            <ul>
                <li :class="{curAct:curSelected=='tj'}" @click="tabAnswer('tj')">推荐</li>
                <li :class="{curAct:curSelected=='new'}" @click="tabAnswer('new')">最新</li>
                <li :class="{curAct:curSelected=='xs'}" @click="tabAnswer('xs')">悬赏</li>
            </ul>
        </nav>
        <div class="itemTabBox">
            <!--推荐 start-->
            <div class="tjBox" v-show="isShowTj">
                <ul>
                    <li
                        v-for="(item,index) in tjData"
                        :key="index"
                        @click="toQuestionsInfoPage(item.id)"
                    >
                        <div class="userInfos">
                            <i class="userHeaderImg">
                                <img :src="item.userphoto" />
                            </i>
                            <span>来自{{item.username}}的提问</span>
                            <span class="count">{{item.answerCount}}人回答了该问题</span>
                            <span class="xsMoney" v-if="item.rewardType==1 && item.reward>0">
                                悬赏
                                <span class="markText">￥{{item.reward}}</span>
                            </span>
                            <span class="xsMoney" v-if="item.rewardType==2 && item.reward!=0">
                                算珠
                                <span class="markText">{{item.reward}}</span>
                            </span>
                        </div>
                        <div class="newAnsCont">
                            <div class="natLeft">
                                <h3 class="title">{{item.title}}</h3>
                                <p class="desc">{{item.intro}}</p>
                            </div>
                            <div class="natRight">
                                <div class="qsBtn" v-if="item.rewardType==1 && item.reward>0">
                                    <div class="qdIcon iconfont icon-shandian"></div>
                                    <div class="qdText">抢答赚赏金</div>
                                </div>
                                <div class="qsBtn" v-if="item.rewardType==0 || item.reward==0">
                                    <div class="qdIcon iconfont icon-xiaoxi1"></div>
                                    <div class="qdText">立即回答</div>
                                </div>
                                <div class="qsBtn" v-if="item.reward>0 && item.rewardType==2">
                                    <div class="qdIcon iconfont icon-xiaoxi1"></div>
                                    <div class="qdText">答题赚算珠</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!--end 推荐-->

            <!--最新 start-->
            <div class="tjBox" v-show="isShowNew">
                <ul>
                    <li
                        v-for="(item,index) in newData"
                        :key="index"
                        @click="toQuestionsInfoPage(item.id)"
                    >
                        <div class="userInfos">
                            <i class="userHeaderImg">
                                <img :src="item.userphoto" />
                            </i>
                            <span>来自{{item.username}}的提问</span>
                            <span class="xsMoney" v-if="item.rewardType==1 && item.reward>0">
                                悬赏
                                <span class="markText">￥{{item.reward}}</span>
                            </span>
                            <span class="xsMoney" v-if="item.rewardType==2 && item.reward!=0">
                                算珠
                                <span class="markText">{{item.reward}}</span>
                            </span>
                        </div>
                        <div class="newAnsCont">
                            <div class="natLeft">
                                <h3 class="title">{{item.title}}</h3>
                                <p class="desc">{{item.intro}}</p>
                            </div>
                            <div class="natRight">
                                <div class="qsBtn" v-if="item.rewardType==1 && item.reward>0">
                                    <div class="qdIcon iconfont icon-shandian"></div>
                                    <div class="qdText">抢答赚赏金</div>
                                </div>
                                <div class="qsBtn" v-if="item.rewardType==0 || item.reward==0">
                                    <div class="qdIcon iconfont icon-xiaoxi1"></div>
                                    <div class="qdText">立即回答</div>
                                </div>
                                <div class="qsBtn" v-if="item.reward>0 && item.rewardType==2">
                                    <div class="qdIcon iconfont icon-xiaoxi1"></div>
                                    <div class="qdText">答题赚算珠</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!--end 最新-->

            <!--悬赏 start-->
            <div class="tjBox" v-show="isShowXs">
                <ul>
                    <li
                        v-for="(item,index) in xsData"
                        :key="index"
                        @click="toQuestionsInfoPage(item.id)"
                    >
                        <div class="userInfos">
                            <i class="userHeaderImg">
                                <img :src="item.userphoto" />
                            </i>
                            <span>来自{{item.username}}的提问</span>
                            <span class="count">{{item.answerCount}}人回答了该问题</span>
                            <span
                                class="xsMoney"
                                v-if="(item.rewardType == 1 || item.rewardType == 3) && item.reward>0"
                            >
                                悬赏
                                <span class="markText">￥{{item.reward}}</span>
                            </span>
                            <span class="xsMoney" v-if="item.rewardType==2 && item.reward!=0">
                                算珠
                                <span class="markText">{{item.reward}}</span>
                            </span>
                        </div>
                        <div class="newAnsCont">
                            <div class="natLeft">
                                <h3 class="title">{{item.title}}</h3>
                                <p class="desc">{{item.intro}}</p>
                            </div>
                            <div class="natRight">
                                <div class="qsBtn" v-if="item.rewardType==1 && item.reward>0">
                                    <div class="qdIcon iconfont icon-shandian"></div>
                                    <div class="qdText">抢答赚赏金</div>
                                </div>
                                <div class="qsBtn" v-if="item.rewardType==0 || item.reward==0">
                                    <div class="qdIcon iconfont icon-xiaoxi1"></div>
                                    <div class="qdText">立即回答</div>
                                </div>
                                <div class="qsBtn" v-if="item.reward>0 && item.rewardType==2">
                                    <div class="qdIcon iconfont icon-xiaoxi1"></div>
                                    <div class="qdText">答题赚算珠</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!--end 悬赏-->
        </div>
        <div class="freeAskBtn DN" @click="toTiwenPage">免费提问</div>
    </div>
</template>

<script>
import $ from '@/common'
export default {
    name: 'meAnswer',
    data() {
        return {
            isShowTj: true,
            isShowNew: false,
            isShowXs: false,
            curSelected: 'tj',
            tjData: [],
            newData: [],
            xsData: [],
            pageNumber: 1,
            fixedTop: ''
        }
    },
    onLoad(options) {
        console.log(options)
        this.getTjData()

        if (options.type) {
            this.curSelected = options.type
            this.tabAnswer(options.type)

            // $.post($.url('listeningShareQuestionList'), (res) => {
            //     if (res.success) {
            //         console.log(res)
            //         this.xsData = res.data.list
            //     } else {
            //         $.tip(res.msg)
            //     }
            // })

        }
    },
    methods: {
        toTiwenPage() {
            wx.navigateTo({
                url: '../tiwen/main'
            })
        },
        tabAnswer(type) {
            if (type == 'tj') {
                this.getTjData()
                this.curSelected = type;
                this.isShowTj = true;
                this.isShowNew = false;
                this.isShowXs = false;
            } else if (type == 'new') {
                this.getNewData()
                this.curSelected = type;
                this.isShowTj = false;
                this.isShowNew = true;
                this.isShowXs = false;
            } else if (type == 'xs') {
                this.getXsData()
                this.curSelected = type;
                this.isShowTj = false;
                this.isShowNew = false;
                this.isShowXs = true;
            }

        },
        getTjData() {
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('recommentNeedAnswerQuestion'), (res) => {
                //console.log(res)
                if (res.code == 200) {
                    wx.hideLoading();
                    this.tjData = res.data.list
                }
            })
        },
        getNewData() {
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('newNeedAnswerQuestion'), (res) => {
                //console.log(res)
                if (res.code == 200) {
                    wx.hideLoading();
                    this.newData = res.data.list
                }
            })
        },
        getXsData() {
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('rewardNeedAnswerQuestion'), (res) => {
                //console.log(res)
                if (res.code == 200) {
                    wx.hideLoading();
                    this.xsData = res.data.list
                }
            })
        },
        toQuestionsInfoPage(id) {
            console.log(id)
            wx.navigateTo({
                url: '../problemInfo/main?id=' + id
            })
        }
    },

    //上拉加载更多推荐数据
    onReachBottom: function () {
        let self = this
        let pageNumber = this.pageNumber

        let url = $.url('recommentNeedAnswerQuestion')
        let url2 = $.url('newNeedAnswerQuestion')
        let url3 = $.url('rewardNeedAnswerQuestion')
        if (this.curSelected == 'tj') {
            $.post(url, {
                page: pageNumber
            }, function (res) {
                let list = res.data.list

                for (let i of list) {
                    self.tjData.push(i)
                }

                self.pageNumber++
            })
        } else if (this.curSelected == 'new') {
            $.post(url2, {
                page: pageNumber
            }, function (res) {
                let list = res.data.list

                for (let i of list) {
                    self.newData.push(i)
                }

                self.pageNumber++
            })
        } else if (this.curSelected == 'xs') {
            $.post(url3, {
                page: pageNumber
            }, function (res) {
                let list = res.data.list

                for (let i of list) {
                    self.xsData.push(i)
                }

                self.pageNumber++
            })
        }

    },

    //下拉刷新推荐数据
    onPullDownRefresh: function () {
        if (this.curSelected == 'tj') {
            this.getTjData()
            wx.stopPullDownRefresh()
        } else if (this.curSelected == 'new') {
            this.getNewData()
            wx.stopPullDownRefresh()
        } else if (this.curSelected == 'xs') {
            this.getXsData()
            wx.stopPullDownRefresh()
        }

    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
