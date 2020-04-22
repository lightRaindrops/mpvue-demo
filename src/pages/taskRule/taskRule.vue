<template>
    <section class="taskRuleBox">
        <div class="contBox">
            <!--<div class="title"><span></span>任务榜：</div>-->
            <div class="cont">
                <p v-html="ruleTip"></p>
                <!--<p>1.每周排行前三可获得算珠奖励：排名第一奖励2000算珠，排名第二奖励1000算珠，排名第三奖励500算珠。</p>
                <p>2.任务榜针对所有用户，根据7天回完成任务数排名，多名用户完成任务数一样的情况下，答题数多的排前；若答题数一样，则按照算珠总数数进行排名；</p>-->
            </div>
        </div>
        <!--<div class="contBox">
            <div class="title"><span></span>奖励发放：</div>
            <div class="cont">
                <p>奖励每周一上午10:00通过后台发放到对应的顾问账户中，可在“我的”-“账户”中查看。</p>
            </div>
        </div>-->
    </section>
</template>

<script>
  import $ from '@/common'
  export default {
    name: 'taskRule',
      data(){
        return{
            ruleTip:''
        }
      },
      onLoad(){
        this.getMidRule()
      },
      methods:{
          //获取活动规则
          getMidRule(){
              let that = this;
              $.post($.url('getConfigDictKeyword'),{
                  keyword:'taskRule'
              }, function (res) {
                  if (!res.success) {
                      $.tip(res.msg)
                  } else {
                      console.log(res)
                      that.ruleTip = res.data
                  }
              })
          },
      }
  }
</script>

<style lang="less" scoped>
    @import "./main.less";
</style>
