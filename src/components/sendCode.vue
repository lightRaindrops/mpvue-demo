<template lang="html">
  <div class="captcha-row">
     <div v-if="showtime===null" class="captcha-button" @click="send('sendRandCode')"> 获取验证码 </div>
     <div v-else class="captcha-button"> {{showtime}} </div>
   </div>

</template>

<script>
import $ from '@/common'
export default {
  data() {
    return {
      // 计时器,注意需要进行销毁
      timeCounter: null,
      // null 则显示按钮 秒数则显示读秒
      showtime: null
    }
  },
  props: {
    phoneValue: {
      type: String,
      default: '',
    }
  },
  methods: {
    // 倒计时显示处理
    countDownText(s) {
      this.showtime = `${s}s后重新获取`
    },
    //倒计时 60秒
    countDown(times) {
      const self = this;
      // 时间间隔 1秒
      const interval = 1000;
      let count = 0;
      self.timeCounter = setTimeout(countDownStart, interval);

      function countDownStart() {
        if (self.timeCounter == null) {
          return false;
        }
        count++
        self.countDownText(times - count + 1);
        if (count > times) {
          clearTimeout(self.timeCounter)
          self.showtime = null;
        } else {
          self.timeCounter = setTimeout(countDownStart, interval)
        }
      }
    },
    send(k) {
      let url = $.baseUrl + k
      let self = this
      let phoneValue = this.phoneValue
      if ($.isPhone(phoneValue)) {
        $.pp(url, {
          phone: phoneValue
        }, function() {
          self.countDown(60);
        })
      } else {
        $.tip('手机号码无效')

      }


    }
  },
}
</script>


<style lang="less" scoped>
.captcha-row {
    display: flex;
    .captcha-button {
        background: #fff;
        color: #F30719;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
