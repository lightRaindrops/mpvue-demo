<template>
    <div class="inviteGoodFriends">
        <div class="top">
            <img :src="topBgSrc" class="bg" mode="widthFix" alt />
            <div class="layer">
                <div class="ttt">
                    <div class="yqk fx">
                        <div class="img fx1">
                            <img :src="userInfo.photo" alt mode="widthFix" />
                        </div>
                        <div class="wb fx7">好友（{{userInfo.name}}）推荐您学习</div>
                    </div>
                </div>
                <div class="bbb">
                    <div class="tit">{{questionInfo.title}}</div>
                    <div class="info">{{questionInfo.intro}}</div>
                    <div class="jiazhi">价值{{gwInfo.consult_pay}}元</div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="yiyou">
                已有
                <span>{{learsInfo.count}}</span>人学习
            </div>
            <div class="btn" @click="toPay">
                <button>
                    <img :src="wyyxxSrc" mode="widthFix" alt="我也要学习"/>
                </button>
            </div>
            <div class="yzxx fx">
                <div class="fx1">
                    您的
                    <span>{{friednInfo.count}}</span>名好友也在学习
                </div>
                <div class="zan">87%好友都觉得赞</div>
            </div>
            <div class="yijiaru fx">
                <div class="item" v-for="(item,index) in friednInfo.user_list" :key="index">
                    <img :src="item.photo" mode="widthFix" alt />
                </div>
                <div class="slh">......</div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import $ from '@/common'
export default {
    data() {
        return {
            answerId:'',
            shareId:'',
            shareInviterId:'',
            gwInfo:{},
            questionInfo:{},
            userInfo:{},
            learsInfo:{},
            friednInfo:{},
            isPay:false,
            qType:0,
            isAndroid:''
        }
    },
    computed: {
        topBgSrc() {
            return $.imgUrl('qing/img/inviteGoodFriends/bg.jpg')
        },
        defaultFace() {
            return $.imgUrl('qing/img/defaultFace.png')
        },
        wyyxxSrc() {
            return $.imgUrl('qing/img/inviteGoodFriends/btnNext.png')
        }
    },

    onShow() {
        if ($.isPayFxActivity) {
            $.tip('已支付成功')
            this.getShareOpenList()
            $.isPayFxActivity = false
        }
    },
    onLoad(options){
        let that = this
        wx.getSystemInfo({

            success (res) {
                //console.log(res.system.includes('Android'))
                that.isAndroid = res.system.includes('Android')
            }
        })
        that.shareId = options.q
        that.shareInviterId = options.i
        that.getShareOpenList()
    },

    onUnload() {
        $.goSelf('/pages/index/main')
    },
    methods:{
        getShareOpenList(){
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('getShareQuestionInfo'),{
                id:this.shareId,
                inviter_id:this.shareInviterId
            }, (res) => {
                wx.hideLoading()
                $.log(res)
                if (res.success) {
                    //console.log(res.data.is_pay)
                    this.answerId = res.data.answer_id;
                    this.isPay = res.data.is_pay
                    this.gwInfo = res.data.adviser_info
                    this.userInfo = res.data.inviter_info
                    this.questionInfo = res.data.question_info
                    this.learsInfo = res.data.learn_users
                    this.friednInfo = res.data.learn_friend_users
                } else {
                    $.tip(res.msg)
                }
            })
        },

        toPtInfoPage(){
            wx.navigateTo({
                //url: '../whoConsulted/main?id=' + id
                url: '../ptInfo/main?id=' + this.shareId + '&answer_id=' + this.answerId
            })
        },

        toPay(){
           if(this.isPay){
               console.log(8888)
               this.toPtInfoPage()
           } else{
               if(this.isAndroid){
                   let that = this
                   $.post($.url('makeListenShareQuesiton'),{
                       id:this.shareId,
                       share_user_id:this.shareInviterId
                   }, (res) => {
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
                                   //console.log('我付款了，跳转')
                                   that.toPtInfoPage()
                                   //let url = $.pageUrl('ptInfo') + "?id=" + questionId + '&answer_id=' + id
                                   //$.go(url)
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
               }else{
                   //ios直接用算珠
                   let that = this
                   wx.showModal({
                       content: '您确认支付99算珠查看吗？',
                       cancelText: '取消',
                       success(res) {
                           if (res.confirm) {
                               console.log(996969)

                               $.post($.url('userPointToListenQuestion'), {
                                   id: that.shareId,
                                   invteir_id:that.shareInviterId
                               }, (res) => {
                                   if (res.success) {
                                       //let questionId = res.data.questionId
                                       that.toPtInfoPage()
                                   } else {
                                       $.tip(res.msg);
                                   }
                               });


                           }
                       }
                   })





               }

           }
        }
    }

}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
