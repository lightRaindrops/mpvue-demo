<template>
    <div>
        <div class="miniTop fx" :style="'padding-top:'+mTop+'px; padding-right:'+mRight+'px'">
            <div class="dalibao DN" @click="go('taskCenter')">
                <img :src="dalibao" class="img" mode="aspectFit" />
            </div>
            <div class="title">
                财税问诊
            </div>
            <div class="search fx" @click="go('search')">
                <div class="icon" :style="search"></div>
                <input
                    type="text"
                    :style="'height:'+ mHeight +'px;'"
                    placeholder="#搜索问题、顾问#"
                    disabled="disabled"
                />
            </div>
        </div>
        <div :style="'height:'+ mHeight +'px; margin-top:'+ mTop +'px;'"></div>
    </div>
</template>
<script>
import $ from '@/common'
const $m = wx.getMenuButtonBoundingClientRect()
export default {
    props: {
    },
    methods: {
        go: $.$go,
    },
    computed: {
        dalibao() {
            return $.$img("icons/dalibao.png")
        },
        search() {
            return $.$bg("icons/search.png")
        },
        mTop() {
            let val = $m.top
            return val
        },
        mRight() {
            let val = $m.width + 20
            return val
        },
        mHeight() {
            let val = $m.height
            return val
        },
    }
}
</script>

<style lang="less">
//顶部

.miniTop {
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    padding-bottom: 20rpx;

    .dalibao {
        padding-left: 30rpx;
        padding-right: 20rpx;

        img {
            width: 38rpx;
            height: 36rpx;
        }
    }

    .title{
        padding-left: 30rpx;
        padding-right: 10rpx;
        width: 320rpx;
        letter-spacing: 4rpx;
        font-size: 36rpx;
        font-weight: bold;
    }

    .search {
        width: 100%;
        background: #ededed;
        border-radius: 100rpx;
        padding: 0 25rpx;

        .icon {
            width: 32rpx;
            height: 32rpx;
            margin-right: 20rpx;
        }

        input[type="text"] {
            flex: 1;
            background: none;
            border: 0;
        }
    }
}
</style>




