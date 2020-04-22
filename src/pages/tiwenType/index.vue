<template>
  <div style="padding:44rpx 30rpx 0 30rpx;">
    <div class="top">
      <h2>请选择咨询类型</h2>
      <p>{{titleTxt.default}}</p>
      <div class="type-box df jcs fw">
        <div
          class="type-item"
          :class="{active:curType===index}"
          @click="curType=index"
          v-for="(item,index) in typeList"
          :key="index"
        >
          <img :src="item.icon" class="icon" />
          <div class="txt">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="curType>-1">
      <h2>立即咨询</h2>
      <div class="items-box df jcs fw" v-show="typeList[curType].childCategoryList">
        <a
          :href="'../tiwenNew/main?id='+item.id"
          class="item"
          v-for="(item,index) in typeList[curType].childCategoryList"
          :key="index"
        >{{item.name}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import $ from '@/common'
// let allUpload = []

export default {
  data() {
    return {
      titleTxt: {
        type: String,
        default: '以便精确的推荐给顾问，获得更优质的回答。'
      },
      typeList: [
      ],
      curType: -1,
    }
  },
  computed: {
  },
  methods: {
    //   选择咨询类型
    selectType(index) {
      this.curType = index
    },
  },
  async onLoad(o) {
    // allUpload = []
    // //查询是否为一对一咨询
    // this.isOneToOne = o.type == 1
    // if (o.id) {
    //   this.adviserId = o.id
    // }
    let url = '/imconsult/category/relation/list'
    this.typeList = await $.$$np(url)
  }
}
</script>
<style lang="less">
@import "./main.less";
</style>
