<template lang="html">
  <img
    :src="src"
    mode="widthFix"
>
</template>

<script>
import $ from '@/common'

export default {
    props: {
        src: {
            type: String,
            default: ''
        }
    },
}
</script>

<style lang="less" scoped>
img {
    width: 100%;
    height: 0;
}
</style>
