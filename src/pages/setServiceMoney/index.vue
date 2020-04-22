<template style="background:red;">
    <div>
        <div class="box" :style="pageHeight">
            <div class="group fx">
                <div class="txt">
                    图文咨询算珠
                </div>
                <div class="field fx1 fx">
                    <input type="text" v-model="consult_pay" class="input-text fx1">
                    <div class="tip">
                        算珠/次
                    </div>
                </div>
            </div>
            <div class="group fx">
                <div class="txt">
                    在线咨询算珠
                </div>
                <div class="field fx1 fx">
                    <input type="text" v-model="online_pay" class="input-text fx1">
                    <div class="tip">
                        算珠/次
                    </div>
                </div>
            </div>

            <div class="tip" style="color:#999; padding-left:36rpx; padding-top:30rpx;">
                咨询算珠每月只能修改一次
            </div>
            <div >
                <a class="submit" @click="updateAdviserInfo()">确定</a>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import $ from '@/common'

    import compFooter from "@/components/compFooter.vue"


    export default {

        data() {
            return {
                consult_pay:0.00,
                online_pay:0.00,
            }
        },
        computed: {
            pageHeight: function () {
                let val = $.windowHeight
                return 'min-height:' + val + 'px'
            }
        },
        methods: {
            updateAdviserInfo(){
                $.post($.url('updateAdviserInfo'), {
                    online_pay: this.online_pay,
                    consult_pay: this.consult_pay
                }, function(res) {
                    if(!res.success){
                        $.tip(res.msg)
                    }else{
                        $.tip('修改成功')
                        setTimeout(()=>{
                            $.back()
                        },500)
                    }
                })
            },
            getAdviserInfo(){
                //获取自身顾问信息
                let t=this
                $.post($.url('getAdviserInfo'), {
                    intro: this.intro
                }, function(res) {
                    if(!res.success){
                        $.tip(res.msg)
                    }else{
                        t.consult_pay=res.data.consult_score_pay
                        t.online_pay=res.data.online_score_pay
                    }
                })
            }

        },
        onLoad(o) {
            let t=this
            t.getAdviserInfo()
        }
    }
</script>

<style lang="less" scoped>
    @import "./main.less";
</style>
