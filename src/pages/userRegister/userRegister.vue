<template>
  <section class="register">
    <div class="top">
      <div class="left" @click="nextStep">跳过</div>
      <div class="right">{{pageNum}}/3</div>
    </div>
    <div class="content" v-if="pageNum == 1">
      <div class="title">{{seniorityTitle}}</div>
      <div class="decs">{{seniorityTip}}</div>
      <div class="option">
        <button
          v-for="(item,index) in option1"
          @click="clickBtn(index)"
          :class="{'active':curOn==index}"
          :key="index"
        >{{item}}</button>
      </div>
    </div>

    <!-- 选择职称模块 -->
    <div class="content2" v-if="pageNum == 2">
      <div class="title">{{certLevelTitle}}</div>
      <div class="decs">{{certLevelTip}}</div>
      <div class="option2">
        <button
          v-for="(item,index) in option2"
          @click="clickBtn(index)"
          :class="{'active':curOn==index}"
          :key="index"
        >{{item}}</button>
      </div>
    </div>

    <!-- 关注领域模块 -->
    <div class="content3" v-if="pageNum == 3">
      <div class="title">{{tagTitle}}</div>
      <div class="decs">{{tagTip}}</div>
      <div class="option">
        <button
          v-for="(item,index) in option3"
          @click="selectGoodAt(item,index)"
          :class="item.active ? 'active':''"
          :key="index"
        >{{item.name}}</button>
      </div>
    </div>
    <div class="bot" v-if="pageNum == 3">
      <span @click="modifyInfo">立即体验 ></span>
    </div>
  </section>
</template>

<script>
import $ from "@/common";
export default {
  name: "userRegister",
  data() {
    return {
      pageNum: 1, //页码
      curOn: -1, //点击的当前按钮 索引值
      opt3: [], //感兴趣的领域
      sclyCheckedNum: 0,
      option1: [],
      option2: [],
      option3: [],

      seniority: "", //工作年限
      certLevel: "", //持有证书
      tag: "", //标签

      seniorityTip: "",
      seniorityTitle: "",
      tagTip: "",
      tagTitle: "",
      certLevelTitle: "",
      certLevelTip: ""
    };
  },
  onLoad() {
    this.initData();
  },
  methods: {
    // 点击文字 跳过
    nextStep() {
      if (this.pageNum == 1) {
        this.curOn = -1;
        this.pageNum = 2;
      } else if (this.pageNum == 2) {
        this.curOn = -1;
        this.pageNum = 3;
      }
    },

    // 点击按钮
    clickBtn(index) {
      if (this.pageNum == 1) {
        this.seniority = this.option1[index];
        this.upInfo({ seniority: this.seniority }, false);
      } else if (this.pageNum == 2) {
        this.certLevel = this.option2[index];
        this.upInfo({ certLevel: this.certLevel }, false);
      }

      this.curOn = index; // 激活按钮
      setTimeout(() => {
        this.nextStep(); // 跳转页面
      }, 800);
    },

    // 点击页面三 按钮
    selectGoodAt(item) {
      if (item.active) {
        item.active = false;
        this.sclyCheckedNum--;
        this.opt3.splice(this.opt3.indexOf(item.id), 1);
        // console.log(this.opt3);
      } else {
        if (this.opt3.length === 3) {
          $.tip("最多只能选三项");
          return;
        }
        item.active = true;
        this.sclyCheckedNum++;
        this.opt3.push(item.name);
        // console.log(this.opt3);
      }
    },

    // 获取属性选择列表
    initData() {
      $.$$np("/user/info/attribute").then(res => {
        console.log(res);
        this.seniorityTip = res.seniorityTip;
        this.seniorityTitle = res.seniorityTitle;
        this.tagTip = res.tagTip;
        this.tagTitle = res.tagTitle;
        this.certLevelTitle = res.certLevelTitle;
        this.certLevelTip = res.certLevelTip;
        this.option1 = res.seniorityList;
        this.option2 = res.certLevelList;
        res.tagList.forEach((item, index) => {
          let obj = {
            id: index,
            name: item,
            isActive: false
          };
          this.option3.push(obj);
        });
      });
    },

    // 点击 立即体验
    modifyInfo() {
      this.tag = this.opt3.join(",");
      this.upInfo({ tag: this.tag }, true);
    },

    // 修改个人基本资料
    upInfo(obj, bol) {
      $.$np("/user/info", obj).then(res => {
        console.log(res);
        if (res.success == true) {
          $.tip("修改成功");
          if (bol) {
            wx.switchTab({
              url: "/pages/index/main"
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "./main.less";
</style>
