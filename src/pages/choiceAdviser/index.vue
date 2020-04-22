<template>
    <div>
        <div class="choiceAdviser">
            <div class="types fx">
                <div
                    class="item"
                    v-for="i in types"
                    :key="i.txt"
                    @click="go('adviserList?type='+i.txt)"
                >
                    <div class="img">
                        <Nimg :src="i.src" />
                    </div>
                    <div class="txt">{{i.txt}}</div>
                </div>
            </div>
            <AdviserList></AdviserList>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import AdviserList from '@/components/AdviserList.vue'
import types from '@/data/types'

export default {
    data() {
        return {
            types
        }
    },
    computed: {

    },
    methods: {
        go: $.$go,
    },
    components: {
        Nimg, AdviserList
    },
}
</script>

<style lang="less">
@import "./main.less";
</style>
