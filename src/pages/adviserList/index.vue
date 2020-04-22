<template>
    <div v-if="loaded">
        <AdviserList :curType="type"></AdviserList>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import AdviserList from '@/components/AdviserList.vue'
export default {
    data() {
        return {
            options: {},
            loaded: false
        }
    },
    computed: {
        type() {
            return this.options.type
        }
    },
    components: {
        Nimg, AdviserList
    },
    onLoad(o) {
        this.options = o
        this.loaded = true
    },
    onUnload() {
        this.loaded = false
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
