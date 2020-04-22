<template>
    <div id="app">
        <div class="mainBox" :style="pageHeight">
            <div class="topWrap">
                <div class="item">
                    <div class="t">
                        <div class="title">
                            <div class="xsWrap fx" style="float:left;" v-if="res.reward > 0">
                                <template v-if="res.reward_type==2">
                                    <span class="icon-sz"></span>
                                    <span class="xs">{{res.reward}}</span>
                                </template>
                                <template v-if="res.reward_type==3 || res.reward_type==1">
                                    <span class="xs">悬赏￥{{res.reward}}</span>
                                </template>
                            </div>
                            {{res.title}}
                        </div>
                    </div>
                    <div class="m">
                        <rich-text :nodes="res.intro"></rich-text>
                        <div
                            v-if="res.photos"
                            style="padding-top:10px;"
                            v-for="(item,index) in res.photos"
                            :key="index"
                        >
                            <img mode="widthFix" :src="item" style="width:100%;" />
                        </div>
                    </div>
                    <div class="b fx">
                        <div class="fx1">
                            <div class="fx">
                                <div class="face">
                                    <img :src="imgsrc" />
                                </div>
                                <div class="twName">{{res.username}}</div>
                                <div class="time">{{res.created_at}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="answers" v-if="isHasAnsId!=='null'">
                <div class="item">
                    <div class="top fx">
                        <div class="face">
                            <img v-if="ans.userphoto" :src="ans.userphoto" />
                        </div>
                        <div class="txt">
                            <div class="t fx" @click="onDetail(ans)">
                                <img
                                    class="cap-img"
                                    mode="widthFix"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_1.png?1"
                                    v-if="ans.cpa_type=='注册会计师'"
                                />
                                <img
                                    class="cap-img"
                                    mode="widthFix"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_2.png?1"
                                    v-else-if="ans.cpa_type=='高级会计师'"
                                />
                                <img
                                    class="cap-img"
                                    mode="widthFix"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_3.png?1"
                                    v-else-if="ans.cpa_type=='中级会计师'"
                                />
                                <img
                                    mode="widthFix"
                                    class="cap-img"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_4.png?1"
                                    v-else-if="item.cpa_type=='税务师'"
                                />
                                {{ans.username}}|{{ans.cpa_type}}
                            </div>
                            <div class="time">{{ans.created_at}}</div>
                        </div>
                    </div>
                    <div class="info">
                        <rich-text :nodes="ans.intro"></rich-text>
                        <div
                            v-if="ans.photos"
                            style="padding-top:10px;"
                            v-for="(item,index) in ans.photos"
                            :key="index"
                        >
                            <img mode="widthFix" :src="item" style="width:100%;" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="comments" v-if="ans">
                <div class="title">{{comments.length}}条评论</div>
                <div class="group">
                    <div class="item" v-for="(item,index) in comments" :key="index">
                        <div class="top fx">
                            <div class="face">
                                <img v-if="item.userphoto" :src="item.userphoto" />
                            </div>
                            <div class="txt fx1 fx">
                                <div class="name fx1">{{item.username}}</div>
                                <div class="zan fx">
                                    <div class="iconfont icon-dianzan" @click="zanComment(item)"></div>
                                    <div class="num" v-if="item.zan>0">{{item.zan}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="info">
                            <rich-text :nodes="item.intro" @click="commentDetail(item.id)"></rich-text>
                        </div>
                        <div class="line">
                            <div class="time">{{item.created_at}}</div>
                        </div>
                    </div>
                    <div class="noData" v-if="comments.length == 0">
                        <div class="iconfont icon-xiaochengxu_tubiao10"></div>
                        <div class="txt">还没有人评论，快来坐沙发</div>
                    </div>
                    <div style="height:60px;"></div>
                </div>
            </div>
            <!-- 发表评论 -->
            <van-popup
                v-if="ans"
                class="answer-popup"
                :show="isShowCommonForm"
                position="bottom"
                :overlay="false"
                custom-style="border-top:1px solid #f0f0f0;z-index:999"
                overlay-style="backgorund:none;"
            >
                <div class="fx" style="padding:10px 20px; background:#fff;">
                    <div class="fx1">
                        <input
                            class="commit-btn"
                            v-model="intro"
                            style="width:100%; border-radius:3px;padding-left:20px;  height:34px; background:#f6f6f6; "
                            type="text"
                            placeholder="评论一下"
                            @blur="onComment(0)"
                        />
                    </div>
                    <div style="padding-left:30px;" @click="shareCount" v-if="res.question_type==4">
                        <span
                            class="icon-fenxiang1 iconfont"
                            @click="onShare()"
                            style="font-size:22px"
                        ></span>
                        <span class="font" @click="onShare()">分享</span>
                    </div>

                    <div v-else>
                        <div
                            style="padding-left:30px;"
                            @click="shareCount"
                            v-if="res.question_type==2"
                        >
                            <span
                                class="icon-fenxiang1 iconfont"
                                @click="onShare()"
                                style="font-size:22px"
                            ></span>
                            <span class="font" @click="onShare()">分享</span>
                        </div>
                        <div style="padding-left:30px;" v-else>
                            <span class="icon-pinglun-copy iconfont"></span>
                            <span class="font">{{ans.commentCount}}</span>
                        </div>
                    </div>

                    <div style="padding-left:30px;">
                        <span class="icon-dianzan iconfont" @click="zanAnswer()"></span>
                        <span class="font">{{ans.zan}}</span>
                    </div>
                </div>
            </van-popup>
            <!-- 二级评论 -->
            <van-popup
                class="second-comment-popup"
                :show="isShowSecondCommon"
                position="bottom"
                custom-style="height:80%;"
                overlay-style="backgorund:none;"
            >
                <div class="title">
                    <span class="left" @click="closeSecondComment()">X</span>
                    <span class="center">全部评论</span>
                </div>
                <div class="comments" style="border-bottom:4px solid #f0f0f0;padding-top:0;">
                    <div class="group">
                        <div class="item">
                            <div class="top fx">
                                <div class="face">
                                    <img v-if="item.userphoto" :src="item.userphoto" />
                                </div>
                                <div class="txt fx1 fx">
                                    <div class="name fx1">{{item.username}}</div>
                                    <div class="zan fx">
                                        <div
                                            class="iconfont icon-dianzan"
                                            @click="zanComment(item)"
                                        ></div>
                                        <div class="num" v-if="item.zan>0">{{item.zan}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <rich-text :nodes="item.intro" @click="showCommenForm(item.id)"></rich-text>
                            </div>
                            <div class="line">
                                <div class="time">{{item.created_at}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="comments">
                    <div class="group">
                        <div class="item" v-for="(item,index) in secondComments" :key="index">
                            <div class="top fx">
                                <div class="face">
                                    <img v-if="item.userphoto" :src="item.userphoto" />
                                </div>
                                <div class="txt fx1 fx">
                                    <div class="name fx1">{{item.username}}</div>
                                    <div class="zan fx">
                                        <div
                                            class="iconfont icon-dianzan"
                                            @click="zanComment(item)"
                                        ></div>
                                        <div class="num" v-if="item.zan>0">{{item.zan}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <rich-text :nodes="item.intro"></rich-text>
                            </div>
                            <div class="line">
                                <div class="time">{{item.created_at}}</div>
                            </div>
                        </div>
                        <div class="noData" v-if="comments.length == 0">
                            <div class="iconfont icon-xiaochengxu_tubiao10"></div>
                            <div class="txt">还没有人评论，快来坐沙发</div>
                        </div>
                    </div>
                </div>
            </van-popup>

            <!--分享提示弹窗-->
            <van-popup
                class="share-tip-popup"
                :show="isShowShare"
                position="top"
                custom-style="border-radius:10px;z-index:999;width:80%;height:250px;margin-top:70px; background:#F5AD33"
            >
                <div class="title">
                    <img :src="userInfo.photo" />
                    <span class="t1">（{{userInfo.name}}）推荐您学习</span>
                    <span class="close" @click="onCloseShare()">X</span>
                </div>
                <div class="middle">
                    <span class="t1">{{res.t_title}}</span>
                    <span class="t2">{{res.t_intro}}</span>
                </div>
                <div class="bottom">
                    <span class="t2">价值{{adviserInfo.consult_pay}}元</span>
                    <span class="t3">只要1元</span>
                </div>
            </van-popup>

            <!--分享底部-->
            <van-popup
                class="share-popup"
                :show="isShowShare"
                position="bottom"
                :overlay="false"
                custom-style="height:200px;"
            >
                <div class="title" v-if="res.is_author==true">分享好友购买赚学费￥1</div>
                <div class="title" v-if="res.is_author==false">分享给好友</div>
                <div class="middle">
                    <div class="t1" v-if="res.is_author==true">好友通过你的分享购买后，你赚学费￥1</div>
                    <div class="t1" v-if="res.is_author==false">好咖啡要和朋友一起品尝，好知识也要和朋友一起分享</div>
                    <div class="t2" v-if="res.is_author==true">关注"财税问诊"小程序，可随时查看收益和提现</div>
                </div>
                <div class="bottom">
                    <div class="t1">
                        <button class="btn" open-type="share">
                            <img
                                src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin.png"
                            />
                        </button>
                    </div>
                    <div class="t2">分享给朋友</div>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
const initData = function () {
    return {
        isLoading: true,
        o: {},
        adviser_id: 0,
        res: {},
        isAnswerQuestion: true,
        ans: [],
        comments: [],
        blankImg: $.base + '/img/blankImg.gif',
        secondComments: [],
        commentId: 0, //评论使用的id
        item: [],
        typeList: [],
        isShowCommonForm: true,
        isShowSecondCommon: true,
        isShowShare: false,
        isShow: true,
        intro: '',
        pageNumber: 1,
        active: 0,
        scrollTop: -1,
        ptList: [],
        userInfo: [],
        userId: '',
        adviserInfo: [],
        inviteCode: '',
        qt: '',
        isHasAnsId: ''
    }
}

export default {
    name: 'app',
    data() {
        return initData()
    },
    computed: {
        imgsrc: function () {
            if (this.res.userphoto) {
                let photo = this.res.userphoto
                if (photo) {
                    if (photo.indexOf('http') === 0) {
                        return this.res.userphoto
                    } else {
                        return $.host + this.res.userphoto
                    }
                }
            } else {
                return this.blankImg
            }


        },
        pageHeight: function () {
            let val = $.windowHeight
            return 'min-height:' + val + 'px'
        }
    },
    methods: {
        shareCount() {
            $.post($.url('share'), (res) => {
                console.log(res)
            })
        },
        onAnswer(id) {
            let url = $.pageUrl('answerQuestions') + '?id=' + id
            $.go(url)
        },
        showCommenForm(comment_id) {
            let self = this
            if (self.isShowCommonForm == false) {
                self.isShowCommonForm = true
            } else {
                self.isShowCommonForm = false
            }
            self.commentId = comment_id
        },
        onShare() {
            //分享
            let self = this;
            let answer_id = self.o.answer_id
            //获取用户信息
            if (self.userInfo.length <= 0) {
                $.pp($.url('userCenterData'), function (res) {
                    self.userInfo = res.userData
                    self.inviteCode = res.inviteCode
                    self.userId = res.userId
                })
                $.pp($.url('getAdviserDetailInfo'), {
                    id: self.ans.answerer
                }, function (res) {
                    self.adviserInfo = res;
                })
            }
            self.isShowCommonForm = false
            self.isShowSecondCommon = false
            self.isShowShare = true
        },
        onCloseShare() {
            let self = this;
            self.isShowCommonForm = true
            self.isShowShare = false
        },
        onComment() {
            //评论问题commentId设置为0 评论评论commentId不能为0
            let self = this
            let question_id = self.o.id
            let commentId = self.commentId
            let answer_id = self.o.answer_id
            let data
            if (self.intro === '') {
                return
            }
            if (commentId) {
                data = {
                    question_id: question_id,
                    comment_id: commentId,
                    intro: self.intro
                }
            } else {
                data = {
                    question_id: question_id,
                    answer_id: answer_id,
                    intro: self.intro
                }
            }
            $.post($.url('commentQuestion'), data, function (res) {
                if (res.success) {
                    $.suc('评论已发表')
                    self.intro = ''
                    if (commentId == 0) {
                        //评论问题加载数据
                        self.loadCommon(self.o)
                        self.pageNumber = 1
                    } else {
                        //评论评论加载数据
                        self.commentDetail(commentId)
                    }
                } else {
                    $.tip(res.msg)
                }
            })
        },
        closeSecondComment() {
            let self = this
            self.commentId = 0
            self.isShowSecondCommon = false
            self.isShowCommonForm = true
            self.loadCommon(self.o)
        },
        zanAnswer() {
            let self = this
            let answer_id = self.o.answer_id
            $.post($.url('zanAnswer'), {
                answer_id: answer_id,
            }, function (res) {
                if (res.success) {
                    self.ans.zan++
                } else {
                    $.tip(res.msg)
                }
            })
        },
        zanComment(item) {
            let self = this
            let comment_id = item.id
            $.post($.url('zanComment'), {
                comment_id: comment_id,
            }, function (res) {
                if (res.success) {
                    item.zan++
                } else {
                    $.tip(res.msg)
                }
            })
        },
        setBestAnswer(item) {
            //设置最佳答案
            let self = this
            let answer_id = item.id
            $.post($.url('setBestAnswer'), {
                answerId: answer_id,
                intro: '您的答案对我很有帮助'
            }, function (res) {
                if (res.success) {
                    item.isBelog = false
                    item.status = 2
                } else {
                    $.tip(res.msg)
                }
            })

        },
        commentDetail(id) {
            let self = this
            $.post($.url('getCommentDetail'), {
                comment_id: id,
            }, function (res) {
                if (res.success) {
                    self.item = res.data
                    self.res.zan = self.item.zan
                    self.res.commentCount = self.item.commentCount
                } else {
                    $.tip(res.msg)
                }
            })
            $.post($.url('getCommentsByCommentId'), {
                comment_id: id
            }, function (res) {
                if (res.success) {
                    self.secondComments = res.data.list
                } else {
                    $.tip(res.msg)
                }
                wx.stopPullDownRefresh()
                self.isLoading = false
            })
            self.isShowCommonForm = false
            self.isShowSecondCommon = true
        },
        listenList(adviser_id) {
            //  相关旁听
            let self = this
            $.post($.url('listenList'), {
                adviser_id: adviser_id,
                rule_out_id: self.o.answer_id,
                page: 0,
                pageSize: 5,
            }, function (res) {
                if (res.success) {
                    self.ptList = res.data.list
                    for (var i in res.data.list) {
                        //字段处理
                        res.data.list[i].intro = $.elliosisField(res.data.list[i].intro, 60);
                    }
                    self.isLoading = false
                } else {
                    $.tip(res.msg)
                }

            })
        },
        onTabChange(e) {
            this.active = e.mp.detail.index
            var self = this
            var index = this.active
            $.post($.url('listenList'), {
                "type": this.typeList[index].id
            }, function (res) {
                self.isLoading = false
                self.ptList = res.data.list
            })
        },
        payListen(id, e) {
            var self = this
            $.post($.url('listenAnswer'), {
                "id": id
            }, function (res) {
                self.isLoading = false
                if (res.code == 508) {
                    let questionId = res.data.id
                    $.post($.url('makeListenAnswer'), {
                        "id": id
                    }, function (res) {
                        if (res.success) {
                            var data = res.data

                            var data = JSON.parse(data)
                            data.success = (res) => {
                                wx.showToast({
                                    title: '支付成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                                setTimeout(function () {
                                    let url = $.pageUrl('ptInfo') + "?id=" + questionId + '&answer_id=' + id
                                    $.go(url)
                                }, 2000)
                            }
                            data.fail = (res) => {
                                console.log(res)
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                            console.log(data)
                            wx.requestPayment(data)
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                } else if (res.code == 200) {
                    let questionId = res.data.id
                    let url = $.pageUrl('ptInfo') + "?id=" + questionId + '&answer_id=' + id
                    $.go(url)
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                    console.log(res)
                }
            })
        },
        loadCommon(o) {
            let id = o.id
            let answer_id = o.answer_id
            let self = this
            $.showLoading()
            if (!answer_id) {
                //没有答案则跳回列表
                $.go('../ptList/main');
            }

            let ansFunc = (type) => {

                $.post($.url('answerDetail'), {
                    id: answer_id,
                }, function (res) {
                    if (res.success) {
                        self.ans = res.data
                        // if (!self.ans.is_pay) {
                        //     if (type == 2) {
                        //         //未支付
                        //         $.go('../questionShareStep2/main?id=' + id + '&answer_id=' + answer_id);
                        //     }
                        // }
                        //相关旁听
                        self.adviser_id = res.data.answerer
                        self.listenList(res.data.answerer)
                    } else {
                        $.tip(res.msg)
                    }
                })


            }




            $.post($.url('questionDetail'), {
                id: id
            }, function (res) {
                if (res.success) {
                    self.res = res.data
                    self.res.t_title = $.elliosisField(self.res.title, 14)
                    self.res.t_intro = $.elliosisField(self.res.intro, 40)
                    ansFunc(self.res.question_type)
                } else {
                    $.tip(res.msg)
                }
            })


            $.pp($.url('isAnswerQuestion'), {
                question_id: id
            }, function (res) {
                self.isAnswerQuestion = res
            })

            $.post($.url('getCommentsByAnswerId'), {
                answer_id: answer_id
            }, function (res) {
                if (res.success) {
                    self.comments = res.data.list
                    //self.commentId = self.comments[0].id
                } else {
                    $.tip(res.msg)
                }
                wx.stopPullDownRefresh()
                $.hideLoading()
                self.isLoading = false
            })

        },
        onDetail(item) {
            //跳转到顾问详情
            if (item.type != '新用户') {
                $.go('../adviserInfo/main?id=' + item.adviser_id);
            }
        }
    },
    components: {},
    onLoad(o) {
        wx.hideShareMenu()
        console.log(o);
        let data = initData()
        for (var key in data) {
            this[key] = data[key]
        }
        let self = this
        this.o = o
        this.loadCommon(o)
        self.isShowSecondCommon = false
        self.isShowCommonForm = true

        self.qt = o.qType
        self.isHasAnsId = o.answer_id
    },
    onShow() {
        if ($.isAnswered) {
            this.loadCommon(this.o)
            $.isAnswered = false
        }
    },
    onHide() {
        $.isAnswered = false
    },
    onUnload() {
        //支付钱和支付算珠完毕
        $.isPayMoneyAndSz = true
        $.isPayFxActivity = true
    },
    onPullDownRefresh: function () {
        this.loadCommon(this.o)
    },
    onReachBottom: function () {
        let self = this
        self.isLoading = true
        let pageNumber = self.pageNumber
        let id = this.o.id
        //获取数
        let url = $.url('getCommentsByAnswerId')
        $.pp(url, {
            answer_id: id,
            page: pageNumber
        }, function (res) {
            let list = res.list
            for (let i of list) {
                self.comments.push(i)
            }
            if (list.length > 0) {
                self.pageNumber++
            }
            self.isLoading = false
        })
    },
    onShareAppMessage(res) {
        let path
        let self = this
        let imageUrl
        let title
        if (self.res.question_type == 2) {
            //添加分享记录
            $.post($.url('shareListen'), {
                answer_id: self.o.answer_id
            })
            imageUrl = 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png?00'
            title = '财税有难题，就问CPA！'
            path = '/pages/index/main?id=' + self.o.id + '&answer_id=' + self.o.answer_id + '&inviteCode=' + self.inviteCode + '&local_tip=questionShareStep2';
        } else {
            title = self.res.t_title
            path = '/pages/index/main?local_tip=inviteGoodFriends&q=' + self.o.id + '&i=' + self.userId
            imageUrl = $.imgUrl('/qing/img/woyaofenxiang.jpg')
        }

        return {
            title,
            path,
            imageUrl,
        }
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
