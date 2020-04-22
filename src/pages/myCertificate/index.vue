<template>
    <div class="myCertificate">
        <div class="title">所持证书</div>
        <div class="group fx">
            <div
                class="item fx"
                :class="{on:i==checked}"
                @click="itemClick(i)"
                v-for="(i,index) in group"
                :key="index"
            >{{i}}</div>
        </div>
    </div>
</template>

<script>

import $ from '@/common'
import initAdviserDetail from '@/initAdviserDetail'

export default {
    name: 'app',
    data() {
        return {
            group: [],
            checked: ''
        }
    },
    onLoad(o) {
        this.init()
    },
    methods: {
        init() {
            let url = '/user/info/attribute'
            this.checked = $.commonData.certLevel

            this.getAttr((data) => {
                this.group = data.certLevelList
            })

        },
        itemClick(i) {
            $.commonData.certLevel = i
            this.checked = i
            $.back()
        },
        getAttr(back = $.noop) {
            let data = $.commonData.userInfoAttribute
            if (!data) {
                let url = '/user/info/attribute'
                $.$$np(url).then(res => {
                    $.commonData.userInfoAttribute = res
                    back(res)
                })
            } else {
                back(data)
            }
        },
    },
    onShow() {

    }
}
</script>

<style lang="less">
@import "../../less/common.less";
.myCertificate {
    background: #fff;
    padding: 33rpx;
    .title {
        font-size: 33rpx;
        color: #333;
    }
    .group {
        flex-wrap: wrap;
        .item {
            width: 30.3%;
            height: 68rpx;
            justify-content: center;
            background: #f2f2f2;
            color: #6a6a6a;
            border-radius: 200rpx;
            &:nth-child(3n-1) {
                margin: 0 3%;
                margin-top: 30rpx;
            }
            margin-top: 30rpx;
            &.on{
                background: #F30719;
                color: #fff;
            }
        }
    }
}
</style>
