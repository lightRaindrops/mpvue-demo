<template>
    <div id="app">
        <div class="mainBox" :style="pageHeight">
            <div class="topWrap">
                <div class="item">
                    <div class="t">
                        <div class="title">
                            <div
                                class="xsWrap fx"
                                style="float:left;"
                                v-if="res.reward > 0 &&res.question_type==1"
                            >
                                <!--<span class="icon-sz"></span>
                                <span class="xs">{{res.reward}}</span>-->
                                <span
                                    class="showXs"
                                    style="background:#FFBA00"
                                    v-if="res.reward_type==1"
                                >悬赏￥{{res.reward}}</span>
                                <span class="showXs" v-if="res.reward_type==2">{{res.reward}}算珠</span>
                            </div>
                            {{res.title}}
                        </div>
                    </div>
                    <div class="m">
                        <rich-text :nodes="res.intro"></rich-text>
                        <div
                            style="padding-top:10px;"
                            v-for="(item,index) in res.photos"
                            :key="index"
                        >
                            <img
                                mode="widthFix"
                                :src="item"
                                style="width:100%;"
                                @click="prevImg(item,res.photos)"
                            />
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
                        <button
                            v-if="!isAnswerQuestion && !res.is_author"
                            class="answer button"
                            @click="onAnswer(res.id)"
                        >
                            <span class="iconfont icon-bianji"></span>我来答
                        </button>
                    </div>
                </div>
            </div>
            <div class="answers">
                <div class="item" v-if="ans.id" style="border:none">
                    <div class="top fx">
                        <div class="face" @click="onDetail(ans)">
                            <img
                                v-if="ans.userphoto"
                                :src="ans.userphoto"
                                style="border-radius: 50%;"
                            />
                        </div>
                        <div class="txt">
                            <div class="t fx">
                                <div>
                                    {{ans.username}}
                                    <span
                                        v-if="ans.cpa_type !=='' && ans.cpa_type !=='新用户'"
                                    >
                                        <span style="margin:0 10rpx">|</span>
                                        {{ans.cpa_type}}
                                    </span>
                                </div>
                                <img
                                    class="cap-img-tip"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_1.png?1"
                                    v-if="ans.cpa_type=='注册会计师'"
                                />
                                <img
                                    class="cap-img-tip"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_2.png?1"
                                    v-else-if="ans.cpa_type=='高级会计师'"
                                />
                                <img
                                    class="cap-img-tip"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_3.png?1"
                                    v-else-if="ans.cpa_type=='中级会计师'"
                                />
                                <img
                                    class="cap-img-tip"
                                    src="https://static.cgkc.com/miniprogram/mini/qing/img/cpa_type_4.png?1"
                                    v-else-if="ans.cpa_type=='税务师'"
                                />
                            </div>
                            <div class="time">{{ans.created_at}}</div>
                        </div>
                        <div
                            class="cnBtn"
                            @click="setBestAnswer(ans)"
                            v-if="ans.question_type==1 && ans.status == 1 && ans.isBelog==true"
                        >采纳</div>
                        <div class="adpot" v-if="ans.question_type==1 && ans.status == 2"></div>
                    </div>
                    <div class="info">
                        <rich-text :nodes="ans.intro"></rich-text>
                        <div v-if="hdImgs">
                            <div
                                class="imgItem"
                                v-for="(imgSrc,imgIndex) in hdImgs"
                                :key="imgIndex"
                                style="margin-top:10px;"
                            >
                                <img
                                    :src="imgSrc"
                                    alt
                                    style="width:100%;height:300px"
                                    mode="aspectFill"
                                />
                            </div>
                        </div>
                    </div>
                    <!--必须未被采纳属于本人-->
                    <!--<div
                        class="adpot-btn"
                        v-if="ans.question_type==1 && ans.status == 1 && ans.isBelog==true"
                        @click="setBestAnswer(ans)"
                    >
                        <span class="iconfont icon-caina"></span>采纳
                    </div>-->
                </div>
                <div v-if="isReady">
                    <!--是作者-->
                    <!--图文咨询-->
                    <div class="noAnswers" v-if="!ans.id &&!res.is_adviser &&res.question_type==2">
                        <div class="center">
                            <div class="iconfont icon-wait_light"></div>
                            <div class="txt">
                                <div>顾问已收到您的提问，请耐心等待顾问为您解答</div>
                                <div>收到回答后短信通知您</div>
                            </div>
                        </div>
                    </div>
                    <!--免费咨询-->
                    <div
                        class="noAnswers"
                        v-else-if="!ans.id && res.is_author&&res.question_type==1"
                    >
                        <div class="center">
                            <div class="iconfont icon-wait_light"></div>
                            <div class="txt">
                                <div>已将您的问题发给所有在线的热心用户</div>
                                <div>收到回答后短信通知您</div>
                            </div>
                        </div>
                    </div>

                    <!--不是作者-->
                    <!--图文咨询-->
                    <div class="noAnswers" v-if="!ans.id &&res.is_adviser&&res.question_type==2">
                        <div class="center">
                            <div class="iconfont icon-biaoqing-nanguo"></div>
                            <div class="txt">
                                <div>用户正在焦急等待您的回答，请尽快为用户回答</div>
                                <button class="button" @click="onAnswer(res.id)">去回答</button>
                            </div>
                        </div>
                    </div>
                    <!--免费咨询-->
                    <div
                        class="noAnswers"
                        v-else-if="!ans.id && !res.is_author&&res.question_type==1"
                    >
                        <div class="center">
                            <div class="iconfont icon-biaoqing-nanguo"></div>
                            <div class="txt">
                                <div>还没有人回答</div>
                                <div>快去回答赚算珠吧</div>
                                <button class="button" @click="onAnswer(res.id)">去回答</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="share-div" v-if="ans.id">
                    <div class="t t1" @click="shareCount">
                        <button class="btn" open-type="share">
                            <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin1.png" />
                        </button>
                        <div>分享给朋友</div>
                    </div>
                    <div class="t t2" @click="createShareImage">
                        <button>
                            <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/poster1.png" />
                        </button>
                        <div>生成海报</div>
                    </div>
                </div>
                <div style="clear: both"></div>
            </div>

            <!-- 推荐问答 -->
            <div class="tjwdList DN" v-show="isShowRecQuestion">
                <div class="title">推荐回答</div>
                <div class="group">
                    <a
                        :href="'../problemInfo/main?id=' + item.id"
                        class="item fx"
                        v-for="item in recQuestions"
                        :key="item.id"
                    >
                        <div class="fx1">
                            <div class="DB t">{{item.title}}</div>
                            <div class="desc">{{item.intro}}</div>
                            <div class="zanBox">
                                <span class="zan iconfont" @click.stop="zanComment(item)">
                                    <span style="margin-right:15rpx">&#xe604;</span>
                                    {{item.zan}}
                                </span>
                                <span>{{item.visited}}浏览</span>
                            </div>
                            <!--<div class="fx b">
                <div class="face">
                  <img :src="item.userphoto" alt="头像">
                </div>
                <div class="name">
                  {{item.username}}
                </div>
                            </div>-->
                        </div>
                    </a>
                </div>
            </div>

            <div class="comments">
                <div class="title">评论</div>
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
                        <!--<div class="btn">-->
                        <!--<button class="normal">-->
                        <!--写评论-->
                        <!--</button>-->
                        <!--</div>-->
                    </div>
                    <div style="height:60px;"></div>
                </div>
            </div>

            <!-- 发表评论 -->
            <van-popup
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

                    <div style="padding-left:30px;">
                        <span class="icon-pinglun-copy iconfont"></span>
                        <span class="font">{{ans.commentCount}}</span>
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
                    <span class="iconfont icon-guanbi left" @click="closeSecondComment()"></span>
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

            <span
                v-if="ansCount>1"
                @click="nextQuestion()"
                style=" -moz-box-shadow:0px 0px 14px #FFBDBD; -webkit-box-shadow:0px 0px 14px #FFBDBD; box-shadow:0px 0px 14px #FFBDBD; background:white;display:block;position: fixed;bottom:100px;right:10px;border: 1px solid white; width:120px;height:30px;line-height:30px;text-align:center;color:red;border-radius: 20px;"
            >看下一条回答</span>

            <van-popup
                class="share-popup"
                :show="isShowShare"
                custom-style="height:100%;width:100%;background:none;"
            >
                <div
                    class="fx"
                    style="flex-direction:column; align-items:center; justify-content:center; height:100%;"
                >
                    <canvas canvas-id="shareCanvas" :style="canvasStyle"></canvas>
                    <div class="save-btn" @click="saveShareImg()">
                        <span class="iconfont icon-xiazai"></span>保存图片
                    </div>
                </div>
                <span class="iconfont icon-guanbi close" @click="closeShare()"></span>
            </van-popup>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
import { setTimeout } from 'timers';

const initData = function () {
    return {
        ansCount: 0,
        isLoading: true,
        isReady: false,
        o: {},
        res: {},
        isAnswerQuestion: true,
        ans: [],
        comments: [],
        canvasWidth: $.windowWidth * 0.7,
        canvasHeight: $.windowWidth / 750 * 1334 * 0.7,
        canvasStyle: '',
        blankImg: $.base + '/img/blankImg.gif',
        secondComments: [],
        commentId: 0, //评论使用的id
        item: [],
        isShowCommonForm: true,
        isShowSecondCommon: true,
        isShow: true,
        intro: '',
        commentCount: 0,
        pageNumber: 1,
        isShowRecQuestion: true,
        recQuestions: [],
        isShowShare: false,
        isLast: false,
        goUrl: '', //跳转页面
        inviterId: 0, //顾问用户Id
        qrcodeUrl: '', //邀请小程序码
        imagePath: '',
        hdImgs: []
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
        prevImg(item, items) {
            wx.previewImage({
                current: item, // 当前显示图片
                urls: items // 需要预览的图片列表
            })
        },
        shareCount() {
            $.post($.url('share'), (res) => {
                console.log(res)
            })
        },
        createShareImage() {
            let self = this
            self.isShowShare = true
        },
        closeShare() {
            let self = this
            self.isShowShare = false
        },
        saveShareImg() {
            const wxCanvasToTempFilePath = $.Promisify(wx.canvasToTempFilePath)
            const wxSaveImageToPhotosAlbum = $.Promisify(wx.saveImageToPhotosAlbum)

            let self = this

            wxCanvasToTempFilePath({
                canvasId: 'shareCanvas',
                destWidth: 750,
                destHeight: 1334
            }, this).then(res => {
                return wxSaveImageToPhotosAlbum({
                    filePath: res.tempFilePath
                })
            }).then(res => {
                wx.showToast({
                    title: '已保存到相册'
                })
            })
        },
        nextQuestion() {
            let t = this
            if (!t.ans.nextAnswerId) {
                $.tip('已经是最后一条了')
                return false
            }
            $.goSelf('../problemInfo/main?id=' + t.o.id + '&answerId=' + t.ans.nextAnswerId)
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
        onComment() {
            //评论答案commentId设置为0 评论评论commentId不能为0
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
                        self.ans.commentCount++
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
            self.loadCommon(this.o)
        },
        onDetail(ans) {
            //跳转到顾问详情
            if (ans.type != '新用户') {
                $.go('../adviserInfo/main?id=' + ans.adviser_id);
            }
        },
        createMinParamQrcodeUrl() {
            let self = this;
            $.post($.url('userCenterData'), function (res) {
                if (res.success) {
                    let scene = 'LT:QI:id:' + self.o.id + ':iId:' + res.data.userId;
                    $.log(scene)
                    $.log(scene.length)
                    //创建小程序码
                    $.post($.url('createMinParamQrcodeUrl'), {
                        scene: scene
                    }, function (res) {
                        if (res.success) {
                            self.qrcodeUrl = res.data.url
                            console.log(self.qrcodeUrl)
                            setTimeout(() => {
                                self.createImg()
                            }, 500)

                        }
                    })
                }
            })
        },
        //渲染canvas
        createImg() {
            let self = this
            const wxGetImageInfo = $.Promisify(wx.getImageInfo)

            $.log(self.qrcodeUrl)

            Promise.all([
                wxGetImageInfo({
                    src: $.imgOnline + 'img/share/bg.png'
                }),
                wxGetImageInfo({
                    src: self.qrcodeUrl
                }),
                wxGetImageInfo({
                    src: self.ans.userphoto
                })
            ]).then(res => {
                const ctx = wx.createCanvasContext('shareCanvas')

                let left = 0
                let top = 0

                // 底图
                ctx.drawImage(res[0].path, left, top, self.canvasWidth, self.canvasHeight)

                // 小程序码
                let qrImgSize = self.canvasWidth * 0.2
                ctx.drawImage(res[1].path, 3, self.canvasHeight * 0.85, qrImgSize * 1.2, qrImgSize * 1.2)

                //头像
                ctx.drawImage(res[2].path, self.canvasWidth * 0.15, self.canvasHeight * 0.52, 30, 30)

                let title = self.res.title
                let ansIntro = self.ans.intro
                let canW = self.canvasWidth
                let canH = self.canvasHeight

                //                    createText(title, self.res.title, 'bt')
                createText(self.res.title, 2, 'bt')

                //                    createText(ansIntro, self.ans.intro, 'ans')
                var dd = self.ans.intro.replace(/<\/?.+?>/g, "");
                var dds = dd.replace(/ /g, ""); //dds为得到后的内容
                createText(dds, 4, 'ans')

                createText(self.ans.username, 1, 'name')

                function createText(txt, lineNum, name) {
                    let chr = txt.split(""); //这个方法是将一个字符串分割成字符串数组
                    let temp = "";
                    var row = [];

                    ctx.setTextAlign('left')
                    ctx.setFillStyle('#323232')
                    ctx.setFontSize(16)

                    for (var a = 0; a < chr.length; a++) {
                        if (name == 'ans') {
                            if (ctx.measureText(temp).width < self.canvasWidth * 0.82) {
                                temp += chr[a];
                            } else {
                                a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                                row.push(temp);
                                temp = "";
                            }
                        } else {
                            if (ctx.measureText(temp).width < self.canvasWidth * 0.7) {
                                temp += chr[a];
                            } else {
                                a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                                row.push(temp);
                                temp = "";
                            }
                        }
                    }
                    row.push(temp);

                    //如果数组长度大于指定行数 则截取前两个
                    if (row.length > lineNum) {
                        if (name == 'ans') {
                            var rowCut = row.slice(0, 4);
                            var rowPart = rowCut[3];
                        } else if (name == 'bt') {
                            var rowCut = row.slice(0, 2);
                            var rowPart = rowCut[1];
                        }
                        // console.log(rowPart);
                        var test = "";
                        var empty = [];
                        for (var a = 0; a < rowPart.length; a++) {
                            if (ctx.measureText(test).width < canW * 0.7) {
                                test += rowPart[a];
                            } else {
                                break;
                            }
                        }
                        empty.push(test);
                        var group = empty[0] + "..."
                        if (name == 'ans') {
                            rowCut.splice(3, 1, group);
                        } else if (name == 'bt') {
                            rowCut.splice(1, 1, group);
                        }
                        row = rowCut;
                    }

                    for (var b = 0; b < row.length; b++) {
                        if (name == 'bt') {
                            if (row.length == 1) {
                                ctx.fillText(row[b], canW * 0.1, (canH / 2.38));
                            } else {
                                ctx.fillText(row[b], canW * 0.1, (canH / 2.52) + b * canH * 0.05);
                            }
                        } else if (name == 'ans') {
                            ctx.setFontSize(12)
                            ctx.fillText(row[b], canW * 0.15, (canH / 1.6) + b * canH * 0.04);
                        } else if (name == 'name') {
                            ctx.setFontSize(12)
                            ctx.fillText(row[b], canW * 0.29, canH * 0.56);
                        }

                    }
                }
                ctx.stroke()
                ctx.draw()

                //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
                setTimeout(function () {
                    wx.canvasToTempFilePath({
                        canvasId: 'mycanvas',
                        success: function (res) {
                            self.imagePath = res.tempFilePath;
                            // console.log(self.imagePath);
                        },
                        fail: function (res) {
                            // console.log(res);
                        }
                    });
                }, 200);

            })
        },
        savePoster() {
            let self = this
            $.post($.url('shareAnswer'), {
                answer_id: self.ans.id,
                type: 2
            }, function (res) {
            })
            //保存海报
            wx.saveImageToPhotosAlbum({
                filePath: self.imagePath,
                success(res) {
                    wx.showModal({
                        content: '图片已保存到相册，赶紧晒一下吧~',
                        showCancel: false,
                        confirmText: '好的',
                        confirmColor: '#333',
                        success: function (res) {
                            if (res.confirm) {
                                self.isShowShare = false
                                $.tip('保存图片成功');
                            }
                        },
                        fail: function (res) {
                            self.isShowShare = false
                            $.tip('保存图片失败');
                        }
                    })
                }
            })
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
                    self.ans.zan = self.item.zan
                    self.ans.commentCount = self.item.commentCount
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
            self.showCommenForm(id)
        },
        loadCommon(o) {
            let id = o.id
            let answer_id = o.answer_id
            let self = this

            $.showLoading()

            //相关问题
            function recFunc() {
                $.post($.url('relateQuestion'), {
                    type: self.res.type
                }, function (res) {
                    if (res.success) {
                        self.recQuestions = res.data.list.filter((item, index) => {
                            if (index < 3) {
                                return item
                            }
                        })
                    } else {
                        $.tip(res.msg)
                    }

                })
            }

            $.post($.url('questionDetail'), {
                id: id
            }, function (res) {
                if (res.success) {
                    let data = res.data
                    data.intro = data.intro.replace(/\n/gm, '<br/>')
                    self.res = data
                    //相关问题
                    recFunc()
                } else {
                    $.tip(res.msg)
                }

            })

            $.post($.url('answerDetail'), {
                id: answer_id,
            }, function (res) {
                // console.log('***********' + JSON.stringify(res))
                if (res.success) {
                    self.ans = res.data
                    self.ans.intro = res.data.intro.replace(/\n/gm, '<br/>')
                    self.hdImgs = res.data.photos
                    self.ansCount = res.data.answerCount
                    self.createMinParamQrcodeUrl()
                } else {
                    $.tip(res.msg)
                }
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
    },
    components: {},
    onLoad(o) {

        let data = initData()
        for (var key in data) {
            this[key] = data[key]
        }

        let self = this

        this.o = o

        this.loadCommon(this.o)

        self.canvasStyle = 'width:' + self.canvasWidth + 'px; height:' + self.canvasHeight + 'px;'

        self.isShowSecondCommon = false
        self.isShowCommonForm = true

        if (o.goUrl == 'receivedQuestions') {
            self.isShowRecQuestion = false
        }

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
    onPullDownRefresh: function () {
        this.loadCommon(this.o)
    },
    onReachBottom() {
        let url = $.url('getCommentsByAnswerId')
        let data = {
            answer_id: this.o.answer_id,
            page: this.pageNumber
        }
        if (this.isLast) {
            return
        }
        $.pp(url, data, res => {
            this.comments = this.comments.concat(res.list)
            if (res.list.length > 0) {
                this.pageNumber++
                this.isLast = false
            } else {
                this.isLast = true
            }
        })
    },
    onShareAppMessage(res) {
        //添加分享记录
        let self = this
        let url = '/pages/index/main?id=' + self.o.id + '&inviterId=' + self.inviterId + '&local_tip=problemInfo';
        $.post($.url('shareAnswer'), {
            answer_id: self.ans.id,
            type: 1
        }, function (res) {
        })
        return {
            title: '财税有难题，就问CPA！',
            path: url,
            //                path: '/pages/questionShareStep2/main?+id='+ o.id ,
            //                path: 'http://www.baidu.com',
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
        }
    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
