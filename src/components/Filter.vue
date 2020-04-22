<!--  -->
<template>
  <div :class="filter_wrapper" :style="{'top': filterTop + 'rpx'}">
      <div class="title_wrapper">
        <!-- 排序 -->
        <div class="sort" @click="handleSort">
          <span :class="{'pickedColor': sortStatus}">{{sortList && sortList[sortActive].name || '综合排序'}}</span>
          <div class="img">
            <Nimg :src="sortStatus? up: down" />
          </div>
        </div>
        <!-- 筛选 -->
        <div class="filter" @click="filter">
          <span :class="{'pickedColor': filterStatus}">筛选</span>
          <div class="img">
            <Nimg :src="filterStatus? up: down" />
          </div>
        </div>
      </div>

      <!-- 排序框 -->
      <ul class="sortContent" v-show="sortStatus">
        <li v-for="(item, index) in sortList" :key="index" @click="sortSelect(index)">
          <span :class="{'pickedColor': sortActive === index}">{{item.name}}</span>
          <div class="img1" v-show="sortActive === index">
            <Nimg :src="ticked" />
          </div>
        </li>
      </ul>
      <!-- 筛选框 -->
      <div class="filterContent" v-show="filterStatus">
        <div class="range">
          <p>算珠区间</p>
          <ul class="range_box">
            <li
              v-for="(item, index) in rangeList"
              :key="index"
              :class="{'active': rangeActive === index}"
              @click="rangeSelect(index)"
            >
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="range">
          <p>顾问职称</p>
          <ul class="range_box">
            <li
              v-for="(item, index) in dutyList"
              :key="index"
              :class="{'active': dutyActive === index}"
              @click="dutySelect(index)"
            >
              <span class="duty_text">{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="btn">
          <div class="reset" @click="reset">重置</div>
          <div class="submit" @click="submit">完成</div>
        </div>
      </div>

      <div class="footer" @click="hideFilter"></div>
  </div>
</template>

<script>
import Nimg from "@/components/Nimg.vue";
export default {
  components: {
    Nimg
  },
  props: ['sortReq','filterReq', 'filterData', 'filterTop'],
  data() {
    return {
      down: "icons/newTypes/down.png",
      up: "icons/newTypes/up.png",
      ticked: "icons/newTypes/ticked.png",
      filterStatus: false,
      sortStatus: false,
      sortActive: 0,
      sortList: [
        {
          txt: "综合排序"
        },
        {
          txt: "回答次数"
        },
        {
          txt: "顾问评分"
        },
        {
          txt: "响应次数"
        },
        {
          txt: "算珠从低到高"
        },
        {
          txt: "算朱从高到低"
        }
      ],
      rangeList: ["全部", "500", "500-2000", "2000以上"],
      rangeActive: 0,
      dutyList: [
        "全部",
        "初级会计",
        "中级会计",
        "高级会计",
        "税务师",
        "注册会计师"
      ],
      dutyActive: 0,
      filter_wrapper: ""
    };
  },
  watch: {
    filterData: {
    　handler(newValue, oldValue) {
        this.dutyList = newValue.cpaTypeList
        this.rangeList = newValue.priceTypeList
        this.sortList = newValue.sortTypeList
　　　},
　　　deep: true
    }
  },
  destroyed() {
    this.sortActive = 0
    this.rangeActive = 0
    this.dutyActive = 0
  },
  mounted(){
    console.log('filter',this.filterTop)
  },
  methods: {
    //隐藏弹框
    hideFilter() {
       this.filter_wrapper = ''
       this.filterStatus = false
       this.sortStatus = false
    },
    /**
     * 出现排序框
     */
    handleSort() {
      this.sortStatus = !this.sortStatus;
      if (this.filterStatus) {
        this.filterStatus = false;
      } else {
        this.filter_wrapper = this.filter_wrapper ? "" : "filter_wrapper";
      }
    },
    /**
     * 出现筛选框
     */
    filter() {
      this.filterStatus = !this.filterStatus;
      if (this.sortStatus) {
        this.sortStatus = false;
      } else {
        this.filter_wrapper = this.filter_wrapper ? "" : "filter_wrapper";
      }
    },
    /**
     * 排序选择
     */
    sortSelect(index) {
      this.handleSort();
      if (this.sortActive === index) return;
      this.sortActive = index;
      //请求
      const data = this.sortList[index]
      this.sortReq(data)
    },
    //算珠区间
    rangeSelect(index) {
      if (this.rangeActive === index) return;
      this.rangeActive = index;
    },
    //职称选择
    dutySelect(index) {
      if (this.dutyActive === index) return;
      this.dutyActive = index;
    },
    //筛选框重置
    reset() {
      this.filter();
      this.rangeActive = 0;
      this.dutyActive = 0;
      //请求
      const data = {
        type: 'reset'
      }
      this.filterReq(data)
    },
    //筛选框提交
    submit() {
      this.filter();
      //请求
      const data = {
        type: 'submit',
        range: this.rangeList[this.rangeActive],
        duty: this.dutyList[this.dutyActive]
      }
      this.filterReq(data)
    }
  }
};
</script>
<style lang='less' scoped>
.filter_wrapper {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 60rpx;
  left: 0;
  z-index: 99;
}
.title_wrapper {
  background: #fff;
  width: 100%;
  height: 98rpx;
  border-bottom: 1rpx solid #e5e5e5;
  display: flex;
  .sort {
    color: #999;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 98rpx;
    padding-left: 29rpx;
    display: flex;
    align-items: center;
  }
  .filter {
    color: #999;
    line-height: 98rpx;
    font-size: 28rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    padding-left: 67rpx;
  }
}
.img {
  width: 20rpx;
  height: 12rpx;
  margin-left: 20rpx;
}
.pickedColor {
  color: #d3381c;
}
.sortContent {
  background: #fff;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 30rpx;
    border-bottom: 1rpx solid #f8f8f8;
    height: 83rpx;
    font-size: 24rpx;
    color: #999;
    font-weight: 500;
    .img1 {
      width: 22.9rpx;
      height: 16.3rpx;
    }
  }
}
.filterContent {
  background: #fff;
  .range {
    padding: 0 30rpx;
    color: #999;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 86rpx;
  }
  .range_box {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 210rpx;
      height: 72rpx;
      line-height: 72rpx;
      background: #f9f9f9;
      color: #b2b2b2;
      text-align: center;
      font-size: 28rpx;
      font-weight: 500;
      border-radius: 8rpx;
      margin-right: 30rpx;
      margin-bottom: 29rpx;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .duty_text {
        font-size: 26rpx;
      }
    }
    .active {
      border: 1rpx solid #d3381c;
      background: #fff;
      color: #d3381c;
      font-size: 26rpx;
      box-sizing: border-box;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .duty_text {
        color: #d3381c;
      }
    }
  }
  .btn {
    padding: 33rpx 43rpx;
    border-top: 1rpx solid #f8f8f8;
    display: flex;
    justify-content: space-between;

    .reset {
      width: 238rpx;
      height: 72rpx;
      background: #f2f2f2;
      border-radius: 36rpx;
      color: #999;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 72rpx;
      text-align: center;
    }
    .submit {
      width: 396rpx;
      height: 72rpx;
      border-radius: 36rpx;
      background: #d3381c;
      line-height: 72rpx;
      font-size: 32rpx;
      color: #fff;
      text-align: center;
    }
  }
}
.footer {
  width: 100%;
  height: 100%;
}
</style>