<template>
    <section class="cwShareSortBox">
        <div class="tipInfo">
            <div class="time">上周获奖名单</div>
            <div class="mj">
                <swiper class="swiper_container" vertical="true" autoplay="true" circular="true" interval="2000">
                    <swiper-item v-for="(item,index) in scrollInfo" :key="index"><span>上周{{item.name}}获得周任务榜奖励{{item.num}}算珠</span></swiper-item>
                </swiper>
            </div>
        </div>

        <div class="pxList">
            <div class="item" v-if="myInfo.rownum>10">
                <div class="xh"></div>
                <div class="headImg">
                    <img mode="widthFix" :src="myInfo.photo"/>
                </div>
                <div class="name">
                    <div class="me">{{myInfo.name}}</div>
                    <div class="sort">当前排名{{myInfo.rownum}}</div>
                </div>
                <div class="count">{{myInfo.num}}算珠</div>
            </div>

            <div class="item" v-for="(item,index) in getTastPxList" :key="index">
                <div class="orderXh " :class="{'oneXh':index===0,'twoXh':index===1,'threeXh':index===2}" v-if="index<=2"></div>
                <div class="orderXh" v-if="index>=3">{{index+1}}</div>
                <div class="headImg">
                    <img mode="widthFix" :src="item.photo"/>
                </div>
                <div class="name">
                    <div class="order">{{item.name}}</div>
                </div>
                <div class="count">{{item.num}}算珠</div>
            </div>
        </div>
    </section>
</template>

<script>
  import $ from '@/common'
  export default {
    name: 'cwShareSort',
      data(){
        return{
            scrollInfo:[],//上面滚动的信息
            getTastPxList:[],//任务排行榜数据
            myInfo:{},//自己的信息
        }
      },
      onLoad(o) {
          this.getprevPxData()
          this.getTastPxData()
      },
      methods:{
          //获取滚动信息的数据
          getprevPxData(){
              let that =this
              $.post($.url('getSoftware'), {

              }, function (res) {
                  if (res.success) {
                      //console.log(res)
                      that.scrollInfo = res.data

                  } else {
                      $.tip(res.msg)
                  }
              })
          },

          //获取任务排行榜数据
          getTastPxData(){
              let that =this
              $.post($.url('getTaskDrag'), {

              }, function (res) {
                  if (res.success) {
                      //console.log(res.data.list)
                      that.myInfo = res.data.info
                      that.getTastPxList = res.data.list

                  } else {
                      $.tip(res.msg)
                  }
              })
          },
      }
  }
</script>

<style lang="less" scoped>
    @import "./main.less";
    .swiper_container {
        width:414rpx;
        height: 60rpx;
        line-height:60rpx;
    }



    .swiper_item {

        font-size: 30rpx;

        overflow: hidden;

        text-overflow: ellipsis;

        white-space: nowrap;

    }
</style>
