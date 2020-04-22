<!--  -->
<template>
  <div class="search">
    <div class="bg" >
      <div class="center_text" :class="activeClass">
        <div class="img">
          <Nimg :src="'icons/newTypes/search.png'" />
        </div>
        <p>{{placeholderText}}</p>
        <!-- <input
          type="text"
          :value="value"
          @input="$emit('input',$event.target.value)"
          :placeholder="placeholderText"
          @blur="blur"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Nimg from "@/components/Nimg.vue";
export default {
  components: {
    Nimg
  },
  props: ["value", "placeholderText", "handleBlur"],
  data() {
    return {
      activeClass: ""
    };
  },
  methods: {
    blur() {
      if (!this.value) {
        this.activeClass = "center_text";
      } else {
        this.handleBlur(this.value);
      }
    },
    showInput() {
      this.activeClass = "left_text";
    }
  }
};
</script>
<style lang='less' scoped>
.search {
  width: 100%;
  background: #fff;
  height: 70rpx;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  .bg {
    width: 690rpx;
    height: 60rpx;
    // background: rgba(242, 242, 242, 0.88);
    background: #f2f2f2;
    border-radius: 30rpx;
    color: #999;
    font-size: 24rpx;
    line-height: 60rpx;
    margin: 0 auto;
    .center_text {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    .left_text {
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      input {
        width: 100%;
        height: 60rpx;
      }
    }
    input {
      width: 150rpx;
    }
    .img {
      width: 32rpx;
      height: 32rpx;
      margin-right: 25rpx;
    }
  }
}
</style>