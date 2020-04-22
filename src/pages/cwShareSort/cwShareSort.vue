<template>
    <section class="cwShareSortBox">
        <div class="tipInfo">
            <div class="time">上周获奖</div>
            <div class="mj">
                <swiper class="swiper_container" vertical="true" autoplay="true" circular="true" interval="2000">
                    <swiper-item v-for="(item,index) in lastData" :key="index"><span>上周{{item.name}}获得周任务榜奖励{{item.num}}算珠</span></swiper-item>
                </swiper>
            </div>
        </div>

        <div class="pxList">
            <div class="item">
                <div class="xh"></div>
                <div class="headImg">
                    <img mode="widthFix" :src="infoData.photo"/>
                </div>
                <div class="name">
                    <div class="me">{{infoData.name}}</div>
                    <div class="sort">当前排名{{infoData.sort}}</div>
                </div>
                <div class="count">{{infoData.num}}次分享</div>
            </div>

            <div class="item" v-for="(item,index) in listData" :key="index">
                <div class="orderXh" :class="{'oneXh':index===0,'twoXh':index===1,'threeXh':index===2}" v-if="index<=2"></div>
                <div class="orderXh" v-if="index>=3">{{index+1}}</div>
                <div class="headImg">
                    <img mode="widthFix" :src="item.photo"/>
                </div>
                <div class="name">
                    <div class="order">{{item.name}}</div>
                </div>
                <div class="count">{{item.sort}}次分享</div>
            </div>
        </div>
        <div class="joinBtn" @click="toMySharePage">我也要参与</div>
    </section>
</template>

<script>
  import $ from '@/common'
  export default {
    name: 'cwShareSort',
      data(){
        return{
            lastData:[],
            infoData:{},
            listData:[]
        }
      },
      onLoad(){
        this.initData()
      },
      methods:{

          //跳转到我要分享页面
          toMySharePage(){
              wx.navigateTo({
                  url:'/pages/myShareNew/main'
              })
          },

          //初始化数据
          initData(){
              wx.showLoading({
                  title: '加载中',
              })
              $.post($.url('getShareLevel'), (res) => {
                  wx.hideLoading()
                  if (res.success) {
                      console.log(res)
                      this.lastData = res.data.last
                      this.infoData = res.data.info
                      this.listData = res.data.list
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
