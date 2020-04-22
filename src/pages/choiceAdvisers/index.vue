<template>
    <div>
        <div class="choiceAdvisers">
            <div @click="go('search?type=1')">
                <Search v-model="value" :handleBlur="handleBlur" :placeholderText='"请输入顾问"'/>
            </div>
            <div class="types fx">
                <div
                    class="item"
                    v-for="(i, index) in list"
                    :key="index"
                    @click="go('adviserListNew?id='+i.id+'&curType='+i.name)"
                >
                    <div class="img">
                        <Nimg :src="i.icon" />
                    </div>
                    <div class="txt">{{i.name}}</div>
                </div>
            </div>
            <AdviserLists></AdviserLists>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import Search from '@/components/Search.vue'
import AdviserLists from '@/components/AdviserLists.vue'
import types from '@/data/newTypes'


export default {
    data() {
        return {
            types,
            value: '',
            list: []
        }
    },
    onLoad() {
        this.getData()
    },
    methods: {
        go: $.$go,
        //获取一级标题
        getData() {
            try {
                 $.$$np('/imconsult/category/relation/list').then(res => {
                    if(res && res.length) {
                        this.list = res
                    }
                    else {
                        $.tip('error')
                    }
                })
            } catch (error) {
                $.tip(error)
            }
            
            
        },
        handleBlur() {}
    },
    components: {
        Nimg, AdviserLists,Search
    },
}
</script>

<style lang="less">
@import "./main.less";
</style>
