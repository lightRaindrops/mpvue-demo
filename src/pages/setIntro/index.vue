<template style="background:red;">
    <div>
        <div class="box" :style="pageHeight">
            <div class="group">
                <div class="field">
                    <input type="text" v-model="intro" />
                </div>
            </div>
            <div>
                <a class="submit" @click="updateAdviserInfo()">确定</a>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import $ from '@/common'

import compFooter from "@/components/compFooter.vue"


export default {

    data() {
        return {
            intro: ''
        }
    },
    computed: {
        pageHeight: function () {
            let val = $.windowHeight
            return 'min-height:' + val + 'px'
        }
    },
    methods: {
        updateAdviserInfo() {
            $.post($.url('updateAdviserInfo'), {
                intro: this.intro
            }, function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    $.tip('修改成功')
                }
            })
        },
        getAdviserInfo() {
            //获取自身顾问信息
            let t = this
            $.post($.url('getAdviserInfo'), function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    // $.log(res)
                    if (res.data) {
                        t.intro = res.data.intro
                    }
                }
            })
        }

    },
    onLoad(o) {
        let t = this
        t.getAdviserInfo()
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
