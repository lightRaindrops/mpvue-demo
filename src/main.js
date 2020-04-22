//引入阿拉丁统计
import './tongji/ald/ald-stat'

//引入小盟广告

import './sdk/dsp_sdk'

//引入promise封装
import './utils/wxPromise.min'

import Vue from 'vue'
import App from './App'

// 修复mpvue固有bug-start

Vue.mixin({
    // 记录页面回退的日志
    onUnload: function () {
        // Fixbug: 再次进入页面时，页面还保留上一次的旧数据（预期是清空数据）
        setTimeout(()=>{
            if (this.$options.data) {
                Object.assign(this.$data, this.$options.data());
            }
        },0)
    }
})

// 修复mpvue固有bug-end

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()