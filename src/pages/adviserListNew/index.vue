<template>
  <div class="container">
    <div @click="go('search?type=1')">
      <Search v-model="value" :handleBlur="handleBlur" :placeholderText="'请输入顾问'" />
    </div>
    <div v-if="loaded">
      <AdviserLists :type="type" :id="id" :navStatus="true"></AdviserLists>
    </div>
  </div>
</template>



<script>
import $ from "@/common";
import Search from "@/components/Search.vue";
import AdviserLists from "@/components/AdviserLists.vue";
export default {
  data() {
    return {
      loaded: false,
      value: '',
      options: {}
    };
  },
  components: {
    AdviserLists,
    Search
  },
  computed: {
    type() {
        return this.options.curType
    },
    id() {
      return this.options.id
    }
  },
  
  onLoad(e) {
    this.options = e
    this.setTitle(e.curType);
    this.loaded = true
  },
  onUnload() {
    this.loaded = false
  },
  methods: {
     go: $.$go,
    //搜索请求
    handleBlur(val) {
      // this.searValue = val
    },
    //动态设置标题
    setTitle(title) {
      wx.setNavigationBarTitle({
        title
      });
    }
  }
};
</script>

<style lang="less">
@import "./main.less";
</style>
