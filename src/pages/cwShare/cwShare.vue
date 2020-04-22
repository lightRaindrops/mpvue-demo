<template>
    <section class="taskCenterBox">
        <div class="top jcc fx" :class="{'topAct':isShowTopAct}" :style="'padding-top:'+top+'px;'">
            <img :src="back" @click="goBack" class="back" mode="aspectFit" />
            <div class="fx1 txt">财问分享榜</div>
        </div>
        <!--头部 start-->
        <div class="header">
            <div class="bigTitle">
                <div class="jb"></div>
                <div class="title"></div>
                <div class="ruleBox" @click="toTaskRulePage"><i></i>规则</div>
            </div>
            <div class="tipInfo">
                <swiper class="swiper_container" vertical="true" autoplay="true" circular="true" interval="2000">
                    <swiper-item v-for="(item,index) in lastData" :key="index"><i style="margin-right:10rpx"></i><span>上周{{item.name}}获得周任务榜奖励{{item.num}}算珠</span><i style="margin-left:10rpx"></i></swiper-item>
                </swiper>
            </div>
            <div class="taskPxb" @click="toCwShareSortPage">
                <div class="tIcon"></div>
                <div class="hIcon">
                    <img :src="dymData.photo"/>
                </div>
                <div class="tipBox">
                    <div class="t">{{dymData.name}}</div>
                    <div class="cont">本周完成任务累计赚取<span>{{dymData.num}}</span>算珠</div>
                </div>
                <div class="toMore"></div>
            </div>
            <div class="cjBox">
                <div class="tit"><span class="line"></span><span class="txt">本周财问值</span><span class="line"></span></div>
                <div class="cjVal">
                    <div class="item">
                        <div class="mum">{{infoData.num}}</div>
                        <div class="infoText">分享次数</div>
                    </div>
                    <div class="item">
                        <div class="mum">{{infoData.amount}}</div>
                        <div class="infoText">可提现(元)</div>
                    </div>
                    <div class="item">
                        <div class="mum">{{infoData.score    }}</div>
                        <div class="infoText">可兑换(算珠)</div>
                    </div>
                </div>
                <div class="thlp" @click="toMySharePage">继续分享问题赚更多</div>
            </div>
            <div class="infoDesc">壕友打开你的分享的财问贴每次学习知识点，最高可摄取你分享的“题主”的70%财问值。</div>
        </div>
        <!--end 头部-->

        <!--一级壕友和二级壕友 start-->
        <div class="hyBox">
            <div class="hyTitle">
                <div class="tabBox" :class="{'on':curStatus==='one'}" @click="changeHyList('one')">一级壕友({{haoyouList.length}})</div>
                <div class="tabBox" :class="{'on':curStatus==='two'}" @click="changeHyList('two')">二级壕友({{haoyouList2.length}})</div>
            </div>

            <div class="tabCont" v-show="isShowOneHyList">
                <div class="noDataBox" v-if="haoyouList.length===0">您还没有把任何问题分享给壕友呢~</div>
                <ul>
                    <li v-for="(item,index) in haoyouList" :key="index">
                        <div class="headerImg">
                            <img :src="item.photo"/>
                        </div>
                        <div class="userInfo">
                            <div class="name">{{item.name}}</div>
                            <div class="desc">{{item.question_title}}</div>
                        </div>
                        <div class="price">
                            <div class="time">{{item.created_at}}</div>
                            <div class="money" v-if="item.type===1">+{{item.amount}}元</div>
                            <div class="money" v-if="item.type===2">+{{item.amount}}算珠</div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="tabCont" v-show="isShowTwoHyList">
                <div class="noDataBox" v-if="haoyouList2.length===0">您还没有把任何问题分享给壕友呢~</div>
                <ul>
                    <li v-for="(item,index) in haoyouList2" :key="index">
                        <div class="headerImg">
                            <img :src="item.photo"/>
                        </div>
                        <div class="userInfo">
                            <div class="name">{{item.name}}</div>
                            <div class="desc">{{item.question_title}}</div>
                        </div>
                        <div class="price">
                            <div class="time">{{item.created_at}}</div>
                            <div class="money" v-if="item.type===1">+{{item.amount}}元</div>
                            <div class="money" v-if="item.type===2">+{{item.amount}}算珠</div>
                        </div>
                    </li>
                </ul>
            </div>


        </div>
        <!--end 一级壕友和二级壕友-->

    </section>
</template>

<script>
  import $ from '@/common'
  export default {
      name: 'cwShare',
      data(){
         return{
             isShowTopAct:false,
             isShowUsertask:false,//是否显示用户角色做任务模块
             isShowAdvisertask:false,//是否显示顾问角色做任务模块
             isShowOneHyList:true,//是否显示一级豪友列表
             isShowTwoHyList:false,//是否显示发给级豪友列表

             curStatus:'one',
             lastData:[],
             dymData:{},
             haoyouList:[],
             haoyouList2:[],
             infoData:{}
         }
      },
      computed: {
          top() {
              let system = wx.getSystemInfoSync()
              let val = system.statusBarHeight + 10
              return val
          },
          winHeight() {
              return $.winHeight
          }
      },

      onLoad(o) {
        this.initData()
        this.getHaoyouData(1)
        this.getHaoyouData(2)
      },

      onShow() {

      },

      onHide() {

      },

      onUnload() {

      },

      methods:{

          //获取壕友的数据
          getHaoyouData(type){
              wx.showLoading({
                  title: '加载中',
              })
              $.post($.url('getShareList'),{
                  level:type
              }, (res) => {
                  wx.hideLoading()
                  if (res.success) {
                      console.log(res)
                      if(type===1){
                          this.haoyouList = res.data.data
                      }else{
                          this.haoyouList2 = res.data.data
                      }
                  } else {
                      $.tip(res.msg)
                  }
              })
          },


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
                      this.dymData = res.data.list.length>0 ? res.data.list[0] : ''
                      this.infoData = res.data.info
                  } else {
                      $.tip(res.msg)
                  }
              })
          },

          //切换壕友榜列表
          changeHyList(status){
              this.curStatus = status
              this.isShowOneHyList = false
              this.isShowTwoHyList = false
              if(status==='one'){
                  this.getHaoyouData(1)
                  this.isShowOneHyList = true
              }else{
                  this.getHaoyouData(2)
                  this.isShowTwoHyList = true
              }
          },

          //跳转到任务规则页面
          toTaskRulePage(){
              wx.navigateTo({
                  url:'/pages/csShareRule/main'
              })
          },

          //跳转到财问分享排行榜页面
          toCwShareSortPage(){
              wx.navigateTo({
                  url:'/pages/cwShareSort/main'
              })
          }
      },

      onPullDownRefresh: function () {

      },

      onReachBottom: function () {

      },

      onPageScroll(e){
          if(e.scrollTop>=50){
              this.isShowTopAct = true
          }else{
              this.isShowTopAct = false
          }
      }
  }
</script>

<style lang="less" scoped>
@import "./main.less";
.swiper_container {
    height: 32rpx;
    line-height:32rpx;
}

.swiper_item {
    font-size: 30rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
