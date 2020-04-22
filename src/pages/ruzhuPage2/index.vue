<template>
    <div id="app">
        <!--<div class="back" id="back" :style="'height:'+pageHeight + 'px;'">-->
        <div style="position:relative;">
            <img class="img1" style="display:block; width:100%;" mode="widthFix" v-show="isShow" @load="onImgLoad" src="https://static.cgkc.com/miniprogram/mini/wx/img/inviteGuwen/bg1.jpg?22"/>
            <span class="btn" @click="local()"></span>
            </a>
        </div>
    </div>
</template>

<script>

    import $ from '@/common'
    const ctx = wx.createCanvasContext('shareCanvas')
    export default {
        name: 'app',
        data() {
            return {
                isLoading: true,
                pageHeight: $.windowHeight,
                res: {},
                isShow:false,
                inviteCode: '',
                isShowShare:false,
                qrcodeSrc:''
            }
        },
        methods: {
           local(){
               $.post($.url('isLogin'), function (res) {
                    if (!res.data.isLogin) {
                        $.go('../userLogin/main?key=ruzhuPage2');
                    }
                })
               $.post($.url('userCenterData'), function (res) {
                   if(res.data.isAdviser==true){
                        $.tip('您已经是顾问');
                        return false;
                   }else{
                        $.go("../applicationConsultant/main");
                   }
               })
           },
           onImgLoad(){
               this.isShow = true
           }
        },
        computed: {
            pageHeight: function() {
                let val = $.windowHeight
                return 'min-height:' + val + 'px'
            }
        },
        mounted(){

        },
        onLoad(o){

        }
    }
</script>
<style lang="less">
    @import "./main.less";
</style>
