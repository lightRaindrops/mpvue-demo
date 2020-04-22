<template>
    <section class="myShareNew" :class="{'ptListBoxFixed':isScrollBg}">
        <div class="tabList">
            <div class="item" :class="{'on':curStatus==='myShare'}" @click="tabItem('myShare')">我要分享<span v-if="curStatus==='myShare'"></span></div>
            <div class="item" :class="{'on':curStatus==='myTiwen'}" @click="tabItem('myTiwen')">我的提问<span v-if="curStatus==='myTiwen'"></span></div>
            <div class="item" :class="{'on':curStatus==='meShare'}" @click="tabItem('meShare')">我的分享<span v-if="curStatus==='meShare'"></span></div>
        </div>

        <!--筛选 start-->
        <div class="filterBox">
            <div class="all" :class="{'upCateList':isShowPtCate==true}" @click="selectCate">{{ptCateText}}<i class="down" :class="{'up':isShowPtCate==true}"></i></div>
            <div class="new" :class="{'upHelpMore':isShowPtNew==true}" @click="selectHelp">排序：<span>{{ptNewHot}}</span><i class="down" :class="{'up':isShowPtNew==true}"></i></div>
        </div>
        <!--end 筛选-->

        <!--分类下拉 start-->
        <div class="catePop" v-show="isShowPtCate" data-name="ptPop" @click="closePtPop($event)">
            <div class="cateItem">
                <ul>
                    <li :class="{'curSelect':curSelectIndex===index}" v-for="(item,index) in ptwtType" :key="index" @click="getPtCateName(item,index)">{{item.name}}</li>

                </ul>
            </div>
        </div>
        <!--edn 分类下拉-->

        <!--最新、最热 start-->
        <div class="catePop" v-show="isShowPtNew" data-name="ptPop" @click="closePtPop($event)">
            <div class="cateItem">
                <ul>
                    <li :class="{'curSelect':curSelectIndex2===index}" v-for="(item,index) in ptNewArr" :key="index" @click="getPtNewHotName(item,index)">{{item}}</li>
                </ul>
            </div>
        </div>
        <!--edn 最新、最热-->

        <div class="tabCont" v-show="isShowMyShareList">
            <div class="noMyShareData" v-if="myShareData.length===0">
                <div class="imgBg"></div>
                <div>还没有可分享的问题~</div>
            </div>
            <ul>
                <li v-for="(item,index) in myShareData" :key="index" @click.stop="toWhoConsulted(item.id)">
                    <div class="title"><span>价值￥{{item.consult_pay}}</span>{{item.question_title}}</div>
                    <div class="answer">
                        <div class="advInfo"><i><img :src="item.head_url"/></i><span>{{item.name}} </span><span>{{item.cpa_type}} </span>回答：</div>
                        <div class="descInfo">
                            {{item.intro}}
                        </div>
                        <div class="showBtn">
                            <span v-if="isAndroid">￥{{item.listen_pay}}查看</span>
                            <span v-else>99算珠查看</span>
                        </div>
                    </div>
                    <div class="btnBox">
                        <div class="tip" v-if="item.share_amount>0">
                            <i><img src="https://test.cgkc.com/uploads/images/15527297766493.png"/></i>
                            {{item.share_name}}刚刚分享问题获得了
                            <span v-if="item.share_type===1">¥{{item.share_amount}}</span>
                            <span v-else>{{item.share_amount}}算珠</span>
                        </div>
                        <div class="tip2" v-else><span>{{item.listen_num}}</span>旁听 · <span>{{item.zan}}</span>赞同</div>
                        <div class="shareBtn" @click.stop="showShareBottom(item)">立即分享</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="tabCont" v-show="isShowMyTiwenList">
            <div class="noMyShareData" v-if="myTiwenData.length===0">
                <div class="imgBg"></div>
                <div>您还没有提问过任何问题呢~</div>
                <div class="twBtn">我也要提问</div>
            </div>
            <ul>
                <li v-for="(item,index) in myTiwenData" :key="index" @click.stop="toWhoConsulted(item.id)">
                    <div class="title">{{item.question_title}}</div>
                    <div class="answer">
                        <div class="advInfo"><i><img :src="item.head_url"/></i><span>{{item.name}} </span><span>{{item.cpa_type}} </span>回答：</div>
                        <div class="descInfo2">
                            {{item.intro}}
                        </div>
                    </div>
                    <div class="btnBox">
                        <div class="tip2"><span>{{item.listen_num}}</span>旁听 · <span>{{item.zan}}</span>赞同</div>
                        <div class="shareBtn" @click.stop="showShareBottom(item)">立即分享</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="tabCont" v-show="isShowMeShareList">
            <div class="noMyShareData" v-if="meShareData.length===0">
                <div class="imgBg"></div>
                <div>您还没有分享过任何问题呢~</div>
            </div>
            <ul>
                <li v-for="(item,index) in meShareData" :key="index" @click.stop="toWhoConsulted(item.id)">
                    <div class="title">{{item.question_title}}</div>
                    <div class="answer">
                        <div class="advInfo"><i><img :src="item.head_url"/></i><span>{{item.name}} </span><span>{{item.cpa_type}} </span>回答：</div>
                        <div class="descInfo2">
                            {{item.intro}}
                        </div>
                    </div>
                    <div class="btnBox">
                        <div class="tip3">
                            <div class="firendsHeads" v-if="item.shareList.length>0">
                                <span class="itemList itemList2" v-for="(firend,i) in item.shareList" :key="i"><img mode="widthFix" :src="firend.photo"/></span>
                            </div>
                            <div>等{{item.shareNum}}位好友查看</div>
                        </div>
                        <div class="shareBtn" @click.stop="showShareBottom(item)">立即分享</div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="share">
            <div class="shareBottom">
                <van-popup
                    @click="cancelShare"
                    class="share-popup"
                    :show="isShowShareBottom"
                    position="bottom"
                    :overlay="true"
                    custom-style="height:500px; width:100%; padding:25px 12px; box-shadow:0 0 5px rgba(0,0,0,0.2); border-radius:20px 20px 0 0; overflow:hidden;"
                >
                    <div class="top">
                        <div class="title">越分享 越开心</div>
                        <div class="intro">邀请好友一起学习</div>
                        <div class="shareContentWrap">
                            <div class="shareContent">
                                <div class="tit">{{sharePopObj.title}}</div>
                                <div class="ny">{{sharePopObj.desc}}</div>
                            </div>
                            <div class="gwInfo fx">
                                <div class="img">
                                    <img src="" alt />
                                </div>
                                <div class="txt fx1">
                                    <div class="ttt">{{sharePopObj.advName}}财税大咖的解析！</div>
                                    <span class="jz">价值{{sharePopObj.money}}元</span>好友只要1元学习
                                </div>
                            </div>
                        </div>
                        <div class="youhui">
                            <div class="line">好咖啡要和朋友一起品尝，好知识也要和朋友一起分享</div>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="t t1">
                            <button class="btn" open-type="share">
                                <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/weixin.png" />
                            </button>
                            <div>分享给朋友</div>
                        </div>
                        <div class="t t2">
                            <button @click="show()" id="tj_shengchenghaibao">
                                <img src="https://static.cgkc.com/miniprogram/mini/wx/img/signIn/poster.png" />
                            </button>
                            <div>生成海报</div>
                        </div>
                    </div>
                </van-popup>
            </div>
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
                <span class="iconfont icon-guanbi close" @click="close()"></span>
            </van-popup>
        </div>
    </section>
</template>

<script>
  import $ from '@/common'
  export default {
      name: 'myShareNew',
      data(){
        return{
            isShowMyShareList:true,
            isShowMyTiwenList:false,
            isShowMeShareList:false,
            curStatus:'myShare',
            myShareData:[],
            myTiwenData:[],
            meShareData:[],
            isAndroid:false,

            pageHeight: $.windowHeight,
            currentShare: {},
            qrcodeSrc: '',
            inviteCode: '',
            isShowShare: false,
            isShowShareBottom: false,
            canvasWidth: $.windowWidth * 0.75,
            canvasHeight: $.windowWidth / 750 * 1334 * 0.7,
            canvasStyle: '',
            qrcodeUrl: '', //邀请小程序码
            userId: '',
            currentQuesId: '',
            currentAdv: {},
            sharePopObj:{
                title:'',
                desc:'',
                advName:'',
                money:''
            },
            ptwtType:[
                {id:0,'name':'全部分类'}
            ],
            ptNewArr:['最新','最热'],
            isShowPtCate:false,
            isShowPtNew:false,
            curSelectIndex:0,
            curSelectIndex2:0,
            isScrollBg:false,
            ptCateText:'全部分类',
            ptNewHot:'最新',
            curNewVal:0,
            curNewVal2:1,
            pageNumber: 0,
        }
      },
      onLoad(){
          let that = this
          that.initData(0)

          wx.getSystemInfo({

              success (res) {
                  //console.log(res.system.includes('Android'))
                  that.isAndroid = res.system.includes('Android')
              }
          })

          //分享
          {
              $.post($.url('userCenterData'), function (res) {
                  that.inviteCode = res.data.inviteCode
                  that.userId = res.data.userId
              })
              that.canvasStyle = 'width:' + that.canvasWidth + 'px; height:' + that.canvasHeight + 'px;'
          }
      },

      onShareAppMessage(res) {

          let t = this;
          let title = t.currentShare.question_info.title
          let id = this.currentQuesId
          let imageUrl = $.imgUrl('/qing/img/woyaofenxiang.jpg')

          if (res.from === 'button') {
              // 来自页面内转发按钮
              //console.log(res.target)
          }
          return {
              title,
              path: '/pages/index/main?local_tip=inviteGoodFriends&q=' + id + '&i=' + t.userId,
              imageUrl: imageUrl,
              success: function (res) {
                  //方法被废用
                  // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

              }
          }
      },

      onPullDownRefresh() {
          wx.showLoading({
              title: '加载中',
          });

          let cateType;
          if(this.curStatus==='myShare'){
              cateType = 0;
          }else if(this.curStatus==='myTiwen'){
              cateType = 2;
          }else{
              cateType = 1;
          }

          $.post($.url('listenList'),{
              type:this.curPtCateId,
              order_type:this.curNewVal,
              select_type:cateType
          }, (res) => {
              console.log(res)
              if (res.code == 200) {
                  //console.log(res.data.list)
                  wx.hideLoading();
                  if(that.curStatus==='myShare'){
                      that.myShareData = res.data.list;
                  }else if(that.curStatus==='myTiwen'){
                      that.myTiwenData = res.data.list;
                  }else{
                      that.meShareData = res.data.list;
                  }
              }
          })
          wx.stopPullDownRefresh()
      },

      onReachBottom: function () {
          let self = this
          let ptwtData = this.ptwtType;
          //console.log(ptwtData)
          let cateType;
          if(self.curStatus==='myShare'){
              cateType = 0;
          }else if(self.curStatus==='myTiwen'){
              cateType = 2;
          }else{
              cateType = 1;
          }

          let pageAdd = self.pageNumber+1
          if(ptwtData){
              ptwtData.forEach((item) =>{
                  if(item.name==self.ptCateText){
                      //console.log(item.name)
                      $.post($.url('listenList'),{
                          type:item.id,
                          page: pageAdd,
                          select_type:cateType
                      }, function (res) {
                          let list = res.data.list

                          if(self.curStatus==='myShare'){
                              for (let i of list) {
                                  self.myShareData.push(i)
                              }
                          }else if(self.curStatus==='myTiwen'){
                              for (let i of list) {
                                  self.myTiwenData.push(i)
                              }
                          }else{
                              for (let i of list) {
                                  self.meShareData.push(i)
                              }
                          }

                          self.pageNumber++
                          //self.isLoading = false
                      })
                  }
              })
          }

      },

      methods:{
          //跳转到旁听详情
          toWhoConsulted(id) {
              //console.log(id)
              wx.navigateTo({
                  url: '../whoConsulted/main?id=' + id
              })
          },

          //点遮罩层关闭下拉分类
          closePtPop(e){
              //let ptPopDom = this.$refs.ptPop
              //console.log(e.mp.target.dataset.name)
              if(e.mp.target.dataset.name){
                  this.isShowPtCate = false
                  this.isShowPtNew = false
                  this.isShowGwCate = false
                  this.isShowGwNew = false
                  this.isScrollBg = false
              }
          },

          //选择最新最热筛选加载数据
          getPtNewHotName(item,index){
              let that = this
              let cateType;
              that.pageNumber = 0
              that.curSelectIndex2 = index
              that.ptNewHot = item;
              that.isShowPtNew = false;
              wx.showLoading({
                  title: '加载中',
              });

              if(item ==='最新'){
                  that.curNewVal = 0
              }else{
                  that.curNewVal = 1
              }

              if(that.curStatus==='myShare'){
                  cateType = 0;
              }else if(that.curStatus==='myTiwen'){
                  cateType = 2;
              }else{
                  cateType = 1;
              }

              $.post($.url('listenList'),{
                  type:that.curPtCateId,
                  order_type:that.curNewVal,
                  select_type:cateType
              }, (res) => {
                  console.log(res)
                  if (res.code == 200) {
                      //console.log(res.data.list)
                      wx.hideLoading();
                      if(that.curStatus==='myShare'){
                          that.myShareData = res.data.list;
                      }else if(that.curStatus==='myTiwen'){
                          that.myTiwenData = res.data.list;
                      }else{
                          that.meShareData = res.data.list;
                      }

                      that.isScrollBg = false
                  }
              })
          },

          //选择分类后筛选加载数据
          getPtCateName(item,index){
              //console.log(item.id)
              let that = this
              let cateType;
              that.pageNumber = 0
              that.curSelectIndex = index
              that.ptCateText = item.name;
              that.isShowPtCate = false;
              that.curPtCateId = item.id
              wx.showLoading({
                  title: '加载中',
              });

              if(that.curStatus==='myShare'){
                  cateType = 0;
              }else if(that.curStatus==='myTiwen'){
                  cateType = 2;
              }else{
                  cateType = 1;
              }

              $.post($.url('listenList'),{
                  type:that.curPtCateId,
                  order_type:that.curNewVal,
                  select_type:cateType
              }, (res) => {
                  console.log(res)
                  if (res.code == 200) {
                      //console.log(res.data.list)
                      wx.hideLoading();
                      if(that.curStatus==='myShare'){
                          that.myShareData = res.data.list;
                      }else if(that.curStatus==='myTiwen'){
                          that.myTiwenData = res.data.list;
                      }else{
                          that.meShareData = res.data.list;
                      }
                      that.isScrollBg = false
                  }
              })
          },

          //选择分类
          selectCate(){
              let that = this
              that.isShowPtCate = !that.isShowPtCate;
              that.isShowPtNew = false;

              if(that.isShowPtCate==true){
                  that.isScrollBg = true
                  //console.log(that.isScrollBg)
              }else{
                  that.isScrollBg = false
              }

              if(that.ptwtType.length>1){
                  return false
              }else{
                  let url = $.url('questionType')
                  $.post(url, function (res) {
                      if (res.success) {
                          res.data.forEach((item)=>{
                              that.ptwtType.push(
                                  {id:item.id,'name':item.val}
                              )
                          })
                          //that.ptwtType = res.data

                      } else {
                          $.tip(res.msg)
                      }

                  })
              }

          },

          //选择最新最热
          selectHelp(){
              this.isShowPtCate = false;
              this.isShowPtNew = !this.isShowPtNew;
              if(this.isShowPtNew==true){
                  this.isScrollBg = true
                  //console.log(that.isScrollBg)
              }else{
                  this.isScrollBg = false
              }
          },

          cancelShare() {
              this.isShowShareBottom = false
          },
          showShareBottom(item) {
              //console.log(item)
              this.isShowShareBottom = true
              this.sharePopObj.title = item.question_title
              this.sharePopObj.desc = item.intro
              this.sharePopObj.advName = item.aname
              this.sharePopObj.money = item.consult_pay
              // let id = item.question_id
              // $.pp($.url('getShareQuestionInfo'), { id }, res => {
              //     //$.log(res)
              //     res.question_info.intro = $.elliosisField(res.question_info.intro, 100)
              //
              //     this.currentShare = res
              //     this.currentQuesId = id
              //     this.createMinParamQrcodeUrl(id)
              // })
          },
          //share
          getMinParamInviteInviteUrl() {
              let t = this
              //获取邀请小程序码
              $.post($.url('getMinParamInviteUrl'), function (res) {
                  t.qrcodeSrc = res.data.url;
                  console.log(res.data.url);
              })
          },
          createMinParamQrcodeUrl(id) {
              //创建小程序码
              let self = this
              let scene = 'local_tip:itf:q:' + id + ':i:' + self.userId
              $.post($.url('createMinParamQrcodeUrl'), { scene }, function (res) {
                  if (res.success) {
                      self.qrcodeUrl = res.data.url
                      console.log(res.data.url)
                      //绘制图
                      self.createImg()
                  } else {
                      $.tip(res.msg)
                  }
              })
          },
          //渲染canvas
          createImg() {
              let self = this
              const wxGetImageInfo = $.Promisify(wx.getImageInfo)
              const share = this.currentShare
              Promise.all([
                  wxGetImageInfo({
                      src: self.shareBg
                  }),
                  wxGetImageInfo({
                      src: self.qrcodeUrl
                  }),
                  wxGetImageInfo({
                      src: share.inviter_info.photo
                  }),
                  wxGetImageInfo({
                      src: self.currentAdv.photo
                  })
              ]).then(res => {
                  const ctx = wx.createCanvasContext('shareCanvas')
                  let left = 0
                  let top = 0
                  // 底图
                  ctx.drawImage(res[0].path, left, top, self.canvasWidth, self.canvasHeight)

                  // 小程序码
                  let qrImgSize = self.canvasWidth * 0.2
                  ctx.drawImage(res[1].path, qrImgSize * 2, self.canvasHeight * 0.8, qrImgSize * 1.1, qrImgSize * 1.1)



                  //头像
                  ctx.drawImage(res[2].path, self.canvasWidth * 0.42, self.canvasHeight * 0.2, 40, 40)



                  let title = share.question_info.title
                  let intro = share.question_info.intro
                  let canW = self.canvasWidth
                  let canH = self.canvasHeight

                  //设置邀请标题
                  {
                      ctx.setFontSize(14)
                      ctx.setTextAlign('center')
                      ctx.setFillStyle('#d2482e')

                      ctx.fillText(share.inviter_info.name + "邀请您一起学习", canW * 0.5, canH * 0.33);
                  }

                  createText(title, 2, 'bt')

                  //设置顾问头像

                  {
                      ctx.drawImage(res[3].path, self.canvasWidth * 0.14, self.canvasHeight * 0.575, 40, 40)
                  }

                  //设置一些文本

                  {
                      let t = this.currentAdv.name + '财税大咖的解析！'
                      let b = '价值' + this.currentAdv.consult_pay + '元  好友只要1元学习'
                      ctx.setFontSize(10)
                      ctx.setTextAlign('left')
                      ctx.setFillStyle('#fff')

                      ctx.fillText(t, canW * 0.30, canH * 0.61);
                      ctx.fillText(b, canW * 0.30, canH * 0.64);
                  }

                  //设置分享优惠

                  // {
                  //     let t = '每分享一位好友，还有机会获得0.7~1元'
                  //     ctx.setFontSize(10)
                  //     ctx.setTextAlign('center')
                  //     ctx.setFillStyle('#d2482e')
                  //
                  //     ctx.fillText(t, canW * 0.50, canH * 0.74);
                  //
                  // }







                  function createText(txt, lineNum, name) {
                      let chr = txt.split("");
                      let temp = "";
                      var row = [];

                      ctx.setTextAlign('left')
                      ctx.setFillStyle('#323232')
                      ctx.setFontSize(16)

                      for (var a = 0; a < chr.length; a++) {
                          if (name == 'ans') {
                              if (ctx.measureText(temp).width < self.canvasWidth * 0.65) {
                                  temp += chr[a];
                              } else {
                                  a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                                  row.push(temp);
                                  temp = "";
                              }
                          } else {
                              if (ctx.measureText(temp).width < self.canvasWidth * 0.65) {
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
                              if (ctx.measureText(test).width < canW * 0.65) {
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
                                  ctx.fillText(row[b], canW * 0.1, (canH / 2.25) - 0.5);
                                  ctx.fillText(row[b], canW * 0.1 - 0.5, (canH / 2.25));
                              } else {
                                  ctx.fillText(row[b], canW * 0.13, (canH / 2.25) + b * canH * 0.05);
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
              })
          },
          //保存到本地
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

          show() {
              this.isShowShare = true
          },
          close() {
              this.isShowShare = false
          },

          //初始化数据
          initData(type){
              wx.showLoading({
                  title: '加载中',
              })
              $.post($.url('listenList'),{
                  select_type:type
              }, (res) => {
                  wx.hideLoading()
                  if (res.success) {
                      console.log(res)
                      if(type===0){
                          this.myShareData = res.data.list
                      }else if(type===1){
                          this.meShareData = res.data.list
                      }else{
                          this.myTiwenData = res.data.list
                      }


                  } else {
                      $.tip(res.msg)
                  }
              })
          },

          //切换类型
          tabItem(type){
              this.pageNumber = 0
              this.curStatus = type
              this.isShowMyShareList = false
              this.isShowMyTiwenList = false
              this.isShowMeShareList = false
              if(type==='myShare'){
                  this.initData(0)
                  this.isShowMyShareList = true
              }else if(type==='myTiwen'){
                  this.initData(2)
                  this.isShowMyTiwenList = true
              }else{
                  this.initData(1)
                  this.isShowMeShareList = true
              }
          }
      }
  }
</script>

<style lang="less" scoped>
    @import "./main.less";
</style>
