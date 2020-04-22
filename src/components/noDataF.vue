<template lang="html">
  <div class="noDataF" :style="styleCom">
    <img :src="noDataSrc" :style="styleCom" alt="无数据">
    <div class="txt">
      {{txt}}
    </div>
  </div>
</template>

<script>
import $ from '@/common'
export default {
    computed: {
        styleCom() {
            return 'width:' + $.windowWidth + 'px; height:' + $.windowWidth / 750 * 397 + 'px;'
        },
        noDataSrc() {
            return $.$img('wx/img/noData.png')
        }
    },
    props: {
        txt: {
            type: String,
            default: '暂无数据'
        }

    },
    onLoad() {
        $.log('无数据组件', this.styleCom)
    }
}
</script>

<style lang="less" scoped>
.noDataF {
    padding-top: 80px;
    background: #fff;
    text-align: center;
    .txt {
        text-align: center;
        color: #999;
    }
}
</style>
