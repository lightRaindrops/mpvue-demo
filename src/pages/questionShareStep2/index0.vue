<template>
    <div id="app">
        <div class="back" :style="'height:'+pageHeight + 'px;'">
            <div class="title">
                <div class="t1">快来一起学</div>
                <div class="t2">超“牛”的财税知识</div>
            </div>
            <div class="middle">
                <div class="head-title">
                    <img class="head" :src="userInfo.userData.photo"/>
                    <span class="t1"> 好友（{{userInfo.userData.name}}）推荐您学习</span>
                </div>
                <div class="intro">
                    <span class="t1">{{res.t_title}}</span>
                    <span class="t2">{{res.t_intro}}</span>
                </div>
                <div class="dec">
                    <span class="t1">税务大咖为您解析！</span>
                    <span class="t2">价值{{adviserInfo.consult_pay}}元</span>
                    <span class="t3">只要1元</span>
                </div>
            </div>
            <div class="bottom">
                <div class="t1">已有<span class="red">2342</span>人学习</div>
                <div class="t2"><span class="btn">我也要学习</span></div>
                <div class="t3">您的<span class="red">16</span>名好友也在学习</div>
                <div class="t4">
                    <img class="head"
                         src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLmxDtE2w0FHfcUuhWLicZDWMDzVVtPOoicicXhPY8hRXuTY3icp5c8jKXvrLIPDxeZjj4RcyaKFr0yAA/132"/>
                    <img class="head"
                         src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLmxDtE2w0FHfcUuhWLicZDWMDzVVtPOoicicXhPY8hRXuTY3icp5c8jKXvrLIPDxeZjj4RcyaKFr0yAA/132"/>
                    <img class="head"
                         src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLmxDtE2w0FHfcUuhWLicZDWMDzVVtPOoicicXhPY8hRXuTY3icp5c8jKXvrLIPDxeZjj4RcyaKFr0yAA/132"/>
                    <img class="head"
                         src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLmxDtE2w0FHfcUuhWLicZDWMDzVVtPOoicicXhPY8hRXuTY3icp5c8jKXvrLIPDxeZjj4RcyaKFr0yAA/132"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import $ from '@/common'
    function loadFunc(data) {
        data.getUserInfoByInviteCode()
        data.questionDetail()
        data.getAdviserDetailInfo()
        console.log(this.adviserInfo);
    }
    export default {
        name: 'app',
        data() {
            return {
                isLoading: true,
                pageHeight: $.windowHeight,
                o: {},
                res: {},
                inviteCode: '',
                adviser_id: 0,
                userInfo: [],
            }
        },
        methods: {
            getAdviserDetailInfo(){
                //获取专家信息
                let self = this
                let answer_id = self.o.answer_id
                $.post($.url('answerDetail'), {
                    id: answer_id,
                }, function (res) {
                    if (res.success) {
                        $.post($.url('getAdviserDetailInfo'), {
                            id: res.data.answerer
                        }, function (res) {
                            self.adviserInfo = res.data;
                        })
                    } else {
                        $.tip(res.msg)
                    }
                })
            },
            questionDetail(){
                //获取问题
                let self = this
                let id = self.o.id
                $.post($.url('questionDetail'), {
                    id: id
                }, function (res) {
                    if (res.success) {
                        self.res = res.data
                        self.res.t_title = $.elliosisField(self.res.title, 14)
                        self.res.t_intro = $.elliosisField(self.res.intro, 40)
                    } else {
                        $.tip(res.msg)
                    }
                })
            },
            getUserInfoByInviteCode(){
                //获取邀请人
                let self = this
                let inviteCode=this.o.inviteCode
                $.post($.url('getUserInfoByInviteCode'), {
                    inviteCode: inviteCode
                }, function (res) {
                    self.userInfo = res.data
                })
            },

        },
        components: {},
        onLoad(o){
            console.log(o)
            this.o = o
            loadFunc(this)

        },
        onShareAppMessage(res) {
            let t = this;
            $.log(t.inviteCode)
            if (res.from === 'button') {
                // 来自页面内转发按钮
                //console.log(res.target)
            }
            return {
                title: '财税有难题，就问CPA！',
                path: '/pages/index/main?inviteCode=' + t.inviteCode,
                imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
                success: function (res) {
                    //方法被废用
                    // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

                }
            }
        }
    }
</script>
<style lang="less">
    @import "./main.less";
</style>
