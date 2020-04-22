<template>
    <div>
        <div class="problemInfo" v-if="ques">
            <div class="problem">
                <div class="us fx">
                    <div class="face" v-if="ques.questionerPhoto">
                        <Nimg :src="ques.questionerPhoto" />
                    </div>
                    <div class="face" v-else>
                        <Nimg src="defaultFace.png" />
                    </div>
                    <div class="txt fx1">
                        <div class="top fx">
                            <div class="name">{{ques.questionerName}}</div>
                            <div class="vip fx">
                                <div class="gr" v-if="ques.vipPersonal">
                                    <Nimg src="icons/vip/gr.png" />
                                </div>
                                <div class="qy" v-if="ques.vipCorporate">
                                    <Nimg src="icons/vip/qy.png" />
                                </div>
                            </div>
                            <div class="fx1"></div>
                            <div
                                class="xsWrap fx"
                                v-if="ques.rewardType == 1 || ques.rewardType == 3"
                            >
                                <div class="xs">
                                    <Nimg src="icons/xianjin.png" />
                                </div>
                                <div class="wb">{{ques.reward}}元</div>
                            </div>
                            <div class="xsWrap fx" v-else-if="ques.rewardType == 2">
                                <div class="xs">
                                    <Nimg src="icons/suanzhu.png" />
                                </div>
                                <div class="wb" style="color:#ff8c3f;">{{ques.reward}}</div>
                            </div>
                        </div>
                        <div class="time">{{ques.createdAt}}</div>
                    </div>
                </div>
                <div class="main">
                    <div class="title">
                        <rich-text :nodes="ques.title"></rich-text>
                    </div>
                    <div class="intro" v-if="ques.intro&&ques.intro!='如题'">{{ques.intro}}</div>
                    <div class="mark fx DN">
                        <div class="item" :style="mark">工商咨询</div>
                        <div class="item" :style="mark">喵喵咨询</div>
                    </div>
                    <div class="photos fx" style="padding-bottom:20rpx;">
                        <div
                            v-for="i in ques.imgPath"
                            :key="i"
                            class="iitem"
                            @click="previewImg(i,ques.imgPath)"
                        >
                            <img :src="i" class="img" mode="aspectFill" />
                        </div>
                    </div>
                </div>
                <div class="sjdt fx DN">
                    <div class="faceWrap fx">
                        <div class="face">
                            <Nimg src="defaultFace.png" />
                        </div>
                        <div class="face">
                            <Nimg src="defaultFace.png" />
                        </div>
                        <div class="face">
                            <Nimg src="defaultFace.png" />
                        </div>
                    </div>
                    <div class="wb">赏金已送出，看看谁领取了赏金</div>
                </div>
            </div>
            <div class="answer" v-if="ans">
                <div class="title fx">
                    {{ans.count}}条回答
                    <div class="fx1"></div>
                    <div class="wdgz fx" @click="go('web?src=/appShare/answerRule')">
                        问答规则
                        <div class="arrow">
                            <Nimg src="icons/arrow.png" />
                        </div>
                    </div>
                </div>
                <div class="group" v-if="ans.count>0">
                    <div class="item" v-for="item in ans.list" :key="item.answerId">
                        <div class="us fx aifs" @click="toGwInfo(item)">
                            <div class="face" v-if="item.photo">
                                <Nimg :src="item.photo" />
                            </div>
                            <div class="face" v-else>
                                <Nimg src="defaultFace.png" />
                            </div>
                            <div class="txt fx1">
                                <div class="top fx">
                                    <div class="name">{{item.name}}</div>
                                    <div class="type">
                                        <Nimg :src="`icons/guwen/t${item.cpaType}.png`" />
                                    </div>
                                    <div class="vip fx">
                                        <div class="gr" v-if="item.vipPersonal">
                                            <Nimg src="icons/vip/gr.png" />
                                        </div>
                                        <div class="qy" v-if="item.vipCorporate">
                                            <Nimg src="icons/vip/qy.png" />
                                        </div>
                                    </div>
                                    <div class="fx1"></div>
                                </div>
                                <div class="time">
                                    {{item.createdAt}}
                                    <template v-if="item.sws">· {{item.sws}}</template>
                                </div>
                            </div>
                            <button
                                class="gz fx jcc"
                                :class="{on:item.isFollow}"
                                @click.stop="onToggleFollow(item)"
                                v-if="item.cpaType"
                            >
                                <template v-if="item.isFollow">已关注</template>
                                <template v-else>+关注</template>
                            </button>
                            <img
                                v-show="item.isAdopt"
                                :src="zuijiadaan"
                                class="zuijiadaan"
                                mode="aspectFit"
                            />
                            <!-- <div class="zxf">￥20咨询</div> -->
                        </div>
                        <div class="info">
                            <div class="wb multiLineText8" :style="'height:'+item.height+'px;'">
                                <div class="richText">
                                    <rich-text :nodes="item.intro"></rich-text>
                                </div>
                            </div>
                            <div
                                class="fx"
                                v-if="item.isOk"
                                style="margin-top:-50rpx; z-index:2; position:relative; font-size:34rpx; color:#0085ff;"
                            >
                                <div class="fx1"></div>
                                <div
                                    v-if="item.isTooLong"
                                    class="fx"
                                    style="padding-left:100rpx; background:linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1), rgba(255,255,255,1));"
                                    @click="viewAll(item)"
                                >
                                    <span style="padding-right:10rpx;">展开</span>
                                    <div class="iconfont icon-xiajiantou"></div>
                                </div>
                                <div
                                    v-if="!item.isTooLong"
                                    class="fx"
                                    style="padding-left:100rpx; background:linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1), rgba(255,255,255,1));"
                                    @click="hideAll(item)"
                                >
                                    <span style="padding-right:10rpx;">收起</span>
                                    <div
                                        class="iconfont icon-xiajiantou"
                                        style="transform:rotate(180deg);"
                                    ></div>
                                </div>
                            </div>

                            <div class="photos fx" v-if="item.imgPath.length>0">
                                <div
                                    v-for="(i,iindex) in item.imgPath"
                                    :key="i+iindex"
                                    class="iitem"
                                    @click="previewImg(i,item.imgPath)"
                                >
                                    <img :src="i" class="img" mode="aspectFill" />
                                </div>
                            </div>
                        </div>
                        <div
                            class="zhuiwenWrap"
                            v-if="item.appendList&&!isFromUserCenter&&item.totalCount>0"
                        >
                            <div v-if="item.totalCount>1" class="line"></div>
                            <div
                                class="zwItem fx aifs"
                                v-for="(i,ind) in item.appendList"
                                :key="i.appendId+ind"
                            >
                                <div class="zwType fx jcc" v-if="i.appendType == 1">追问</div>
                                <div class="zwType fx jcc on" v-else-if="i.appendType == 2">追答</div>
                                <div class="zwInfo fx1" v-if="i.contentType==1">{{i.intro}}</div>
                                <div class="zwInfo fx1" v-if="i.contentType==2">
                                    <div class="msg-img" @click="previewImage(i.intro)">
                                        <Nimg :src="i.intro"></Nimg>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="zwViewAll jcc fx"
                                v-if="item.totalCount>3"
                                @click="onZhuiwen(item.answerId,ques.id)"
                            >查看全部({{item.totalCount}})</div>
                        </div>
                        <div class="bot fx">
                            <!-- <div class="jubao">
                            <Nimg src="icons/jubao.png" />
                        </div>
                            <div class="jb">举报</div>-->

                            <div class="fx" @click="onDianzan(item)">
                                <div
                                    class="dianzan"
                                    :class="{on:item.isLike}"
                                    :style="dianzan+'margin-left:0;'"
                                ></div>
                                <div
                                    class="zts"
                                    :class="{on:item.isLike}"
                                >{{item.zanNum>0?item.zanNum:'点赞'}}</div>
                            </div>
                            <div class="fx1"></div>
                            <button
                                class="btnCaina fx jcc"
                                v-if="item.canAdopt"
                                @click="onCaina(item.answerId)"
                            >
                                {{cainaTxt}}
                                <div class="icon" v-if="cainaTxt == '采纳'">
                                    <Nimg src="icons/caina.png" />
                                </div>
                            </button>
                            <button
                                class="btnZhuida"
                                @click="onZhuiwen(item.answerId,ques.id)"
                                v-if="ques.status == 1&&item.myAnswer"
                            >追答</button>
                            <button
                                @click="onZhuiwen(item.answerId,ques.id)"
                                v-if="item.canAdopt"
                                class="btnZhuiwen"
                            >
                                追问
                                <span
                                    v-if="item.unreadCount>0"
                                    class="unread fx jcc"
                                >{{item.unreadCount}}</span>
                            </button>
                            <button
                                @click="onZhuiwen(item.answerId,ques.id)"
                                v-else-if="item.totalCount > 0"
                                class="btnZhuiwen"
                            >共{{item.totalCount}}条对话</button>
                            <button
                                class="fx jcc comment"
                                v-if="ques.canAppraise"
                                @click="onComment"
                            >评价</button>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="noAnsWrap" v-if="isLoaded">
                        <div class="img">
                            <Nimg src="icons/wait.png" />
                        </div>
                        <div
                            class="txt"
                            v-if="ques.canAnswer&&source!='my'&&source!='expired'"
                        >还没有大咖解答，抢答赢算珠</div>
                        <div v-else class="txt">
                            <template v-if="source=='my'">
                                请您尽快为用户解答
                                <div class="next" style="left:0;">
                                    <button
                                        :style="btn_next"
                                        style="color:#fff;"
                                        class="btn"
                                        @click="go('answerQuestions?id='+ques.id)"
                                    >为TA解答</button>
                                </div>
                            </template>
                            <template v-else-if="source=='expired'">
                                顾问正在修炼未能及时回答
                                <br />问题超时失效
                                <br />
                                <button class="ibtn fx jcc" @click="switchTo('guwen')">问其他顾问</button>
                            </template>
                            <template v-else>
                                顾问正在赶来的路上
                                <div class="fx jcc">
                                    您可以看看其他
                                    <button @click="$go('meAnswer')">精选问题</button>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fx jcc loadingWrap" v-else>
                <van-loading></van-loading>
            </div>
            <template v-if="source!='my' || ques.questionType != 2">
                <div style="height:150rpx;"></div>
                <div class="fixed fx" :class="{isIphone10:isIphone10}">
                    <button
                        open-type="share"
                        class="btn fx"
                        style="padding-right:100rpx; height:90rpx; padding-left:30rpx;"
                    >
                        <div class="share">
                            <Nimg src="icons/share.png" />
                        </div>分享
                    </button>
                    <div class="fx1"></div>
                    <div
                        class="wyhd"
                        v-if="ques.canAnswer"
                        @click="go('answerQuestions?id='+ques.id)"
                    >我要回答</div>
                </div>
            </template>
            <van-popup :show="isShowComment" position="bottom">
                <div class="commentWrap">
                    <div
                        class="iconfont close icon-icon-calendar-close"
                        @click="close('isShowComment')"
                    ></div>
                    <Comment :cid="ques.id"></Comment>
                </div>
            </van-popup>
        </div>
        <div class="fx jcc loadingWrap" v-else>
            <van-loading></van-loading>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import Comment from '@/components/Comment.vue'
export default {
    data() {
        return {
            isLoaded: false,
            ques: null,
            ans: null,
            page: 1,
            isLoadMore: false,
            source: '',
            expired: '',
            currentCommentId: '',
            isShowComment: false,
            cainaTxt: '采纳',
            isFromUserCenter: false,
        }
    },
    computed: {
        mark() {
            return $.$bg('icons/mark.png')
        },
        zuijiadaan() {
            return $.$img("icons/zuijiadaan.png")
        },
        dianzan() {
            return $.$bg('icons/dianzan.png')
        },
        btn_next() {
            return $.$bg('btn_next.png')
        },
        isIphone10() {
            return $.isIphoneX()
        },
    },
    components: {
        Nimg, Comment
    },
    methods: {
        previewImg(src, arr) {
            wx.previewImage({
                current: src,
                urls: arr
            })
        },
        setIsFromUserCenter() {
            let pages = getCurrentPages();
            let prevpage = pages[pages.length - 2];
            if (prevpage) {
                console.log('上一个页面', prevpage.route)
                this.isFromUserCenter = prevpage.route.includes('pages/problemManagement/main')
            } else {
                this.isFromUserCenter = false
            }
        },
        previewImage(src) {
            wx.previewImage({
                current: src,
                urls: [src]
            })
        },
        onZhuiwen(id, qid) {
            $.$go(`questionClosely?id=${id}&qid=${qid}&questionType=${this.ques.questionType}`)
        },
        onDianzan(item) {
            let url = '/imconsult/question/thumbsUp'
            let data = {
                id: item.answerId,
                type: 2
            }
            let oldList = $.clone(this.ans.list)

            if (item.isLike) {
                item.zanNum--
            } else {
                item.zanNum++
            }
            item.isLike = !item.isLike

            this.$set(this.ans, 'list', $.clone(this.ans.list))

            $.$np(url, data).then(res => {
                if (res.isError) {
                    this.$set(this.ans, 'list', oldList)
                }
            })
        },
        onCaina(id) {
            let url = '/imconsult/answer/adopt/' + id
            $.$np(url).then(res => {
                if (!res.isError) {
                    $.suc('已采纳')
                    this.init()
                }
            })
        },
        onComment() {
            this.isShowComment = true
        },
        go: $.$go,
        $go: $.$goSelf,
        toGwInfo(item) {
            if (item.cpaType) {
                this.go('adviserInfo?id=' + item.answerer)
            }
        },
        close(str) {
            this[str] = false
        },
        switchTo(str) {
            wx.switchTab({
                url: `../${str}/main`
            })
        },
        onToggleFollow(item) {
            let base = '/user/focus/adviser/'
            if (item.isFollow) {
                base = '/user/unfocus/adviser/'
            }
            $.showLoading('请稍候')
            $.$np(`${base}${item.answerer}`).then(res => {
                if (!res.isError) {
                    $.hideLoading()
                    item.isFollow = !item.isFollow
                    this.$set(this.ans, 'list', $.clone(this.ans.list))
                }
            })
        },
        async quesFunc() {
            let url = '/imconsult/question/questionDetail/v2/' + this.questionId
            let ques = await $.$$np(url)
            ques.createdAt = $.dateLong2String(ques.createdAt)
            if (ques.title) {
                ques.title = $.toBr(ques.title)
            }
            this.ques = ques
            if (this.ques.questionType == 2) {
                wx.hideShareMenu()
            }
        },
        async ansFunc() {
            let url = '/imconsult/answer/list/answerAndAppend/' + this.questionId
            let ans = await $.$$np(url, {
                page: this.page,
                pageSize: 20
            })
            if (this.page > 1 && this.isLoadMore) {
                this.isLoadMore = false
                ans.list = this.ans.list.concat(ans.list)
            }
            ans.list.forEach(ele => {
                ele.createdAt = $.dateLong2String(ele.createdAt)
                ele.isTooLong = false
                ele.height = 100
                ele.intro = $.toBr(ele.intro)
            })
            this.ans = ans
            {
                setTimeout(() => {
                    let $$ = wx.createSelectorQuery()
                    $$.selectAll('.richText').boundingClientRect()
                    $$.exec((res) => {
                        $.log('res', res)
                        res[0].forEach((ele, index) => {
                            $.log('ele', ele)
                            let winWidth = $.winWidth
                            let height = ele.height
                            let list = $.clone(this.ans.list)
                            list[index].xheight = height
                            list[index].height = height
                            if (ele.height > 206 / 375 * winWidth) {
                                list[index].isOk = true
                                list[index].isTooLong = true
                                list[index].height = 206 / 375 * winWidth
                            }
                            this.$set(this.ans, 'list', list)
                        })
                    })
                }, 100)
            }

        },
        viewAll(item) {
            item.isTooLong = false
            item.height = item.xheight
            $.log(item.xheight)
            let list = $.clone(this.ans.list)
            this.$set(this.ans, 'list', list)
        },
        hideAll(item) {
            item.isTooLong = true
            let winWidth = $.winWidth
            if (item.xheight > 206 / 375 * winWidth) {
                item.height = 206 / 375 * winWidth
            }
            let list = $.clone(this.ans.list)
            this.$set(this.ans, 'list', list)
        },
        async init() {
            this.setIsFromUserCenter()
            this.page = 1
            let tasks = [
                this.quesFunc(),
                this.ansFunc()
            ]

            await Promise.all(tasks)

            {
                let messageType
                if (this.ques.questionType == 1) {
                    messageType = 5
                } else if (this.ques.questionType == 2) {
                    messageType = 6
                }
                let url = `/message/messageNotice/updateReadStatus/${this.questionId}/${messageType}`

                $.isLogin(() => {
                    $.$$put(url)
                })

            }

            {
                setTimeout(() => {
                    let url = '/user/action/taskEffect/browse_content'
                    $.$$np(url).then(res => {
                        $.log('获得算珠', res)
                        if (res.isAdd) {
                            $.tip('+' + res.scoreCount + '算珠')
                        }
                    })
                }, 4000)
            }
            this.isLoaded = true
        }
    },
    async onPullDownRefresh() {
        await this.init()
        wx.stopPullDownRefresh()
    },
    onReachBottom() {
        let total = this.ans.totalPage
        if (total > this.page) {
            this.page++
            this.isLoadMore = true
            this.ansFunc()
        }
    },
    async onLoad(o) {
        this.o = o
        this.questionId = o.id
        this.source = o.source
        this.init()
    },
    onShow() {
        if ($.isRefresh) {
            $.isRefresh = false
            this.init()
        }
    },
    onUnload() {
        $.isProblemManagementRefresh = true
        if (this.o.new == 1) {
            $.isRefresh = true
            $.reLaunch($.pageUrl('index'))
        }
    },
    onShareAppMessage(res) {
        let url = '/pages/index/main?id=' + this.questionId + '&local_tip=problemInfo';
        return {
            title: '财税有难题，就问CPA！',
            path: url,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
        }
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
