<template>
    <div class="box" :style="styleStr" catchtouchmove="ture">
        <div class="main" @touchmove="touchForbidden" :class="{'ipX': isIphoneX}">
            <!-- <div class="close icon-icon-calendar-close iconfont" @click="onClose"></div> -->
            <div class="close" @click="onClose"><div class="icon"></div></div>
            <div class="time">
                <div class="small">
                    <span>{{year}}</span>
                    <span>星期{{week}}</span>
                </div>
                <div class="big">{{month}}</div>
            </div>
            <div class="line"></div>
            <!-- <div class="ti">本月事项: 截止至16日办理(一 般纳税人增值税、一般纳税人消费税、-般纳税人文化事业建设费、增值税消费附征税、个人所得税、房产税、资源税)</div> -->
            <div class="ti" v-if="tip.length">{{tip}}</div>
            <div class="title" style="width:100%; text-align:left;">遇到财税问题？</div>
            <div class="btns">
                <div class="item fx" @click="go('tiwenType')">
                    <div class="img">
                        <div class="kuaisuwen" :style="kuaisuwen"></div>
                    </div>
                    <div class="txt">
                        <div class="bt">快速咨询</div>
                        <div class="ms">快速提问 多人为你解答</div>
                    </div>
                    <div class="right"></div>
                </div>
                <div class="item fx" @click="go('choiceAdvisers')">
                    <div class="img">
                        <div class="wendaka" :style="wendaka"></div>
                    </div>
                    <div class="txt">
                        <div class="bt">咨询顾问</div>
                        <div class="ms">注册会计师1对1为你解答</div>
                    </div>
                    <div class="right"></div>
                </div>
            </div >
        </div>
    </div>
</template>
<script>
import $ from "@/common";
const $m = wx.getMenuButtonBoundingClientRect();
export default {
    data() {
        return {
            year: "",
            month: "",
            week: "",
            day: "",
            tip: "", //事项
            tipList: [],
            tipNumber: 0, //循环事项下标
            isIphoneX: false
        };
    },
    computed: {
        mTop() {
            let val = $m.top;
            return val;
        },
        styleStr() {
            return (
                "width:" +
                $.winWidth +
                "px; height:" +
                ($.winHeight + this.mTop + 20) +
                // ($.winHeight + this.mTop + 50) +
                "px;"
            );
        },
        kuaisuwen() {
            return $.$bg("icons/kuaisuwen.png");
        },
        wendaka() {
            return $.$bg("icons/wendaka.png");
        }
    },
    onLoad() {
        this.getModel();
        this.getData();
        this.getTip();
    },
    methods: {
        onClose() {
            this.$emit("vclose");
            setTimeout(() => {
                this.tipNumber++;
                // console.log(this.tipNumber);
                if (this.tipNumber === this.tipList.length) {
                    this.tipNumber = 0;
                }
                this.getTip();
            }, 1000);
            if ((this.day <= 9) & (this.day >= 6)) {
                wx.removeStorage({
                    key: "cs_tipList",
                    success(res) {
                        console.log(res);
                    }
                });
            }
        },
        // 获取手机型号
        getModel() {
            var that = this;
            wx.getStorage({
                key: "model",
                success(res) {
                    console.log("手机2:", res.data);
                    let result = res.data.replace(" ", "");
                    if (result.includes("iPhoneX") || result.includes("iPhone11")) {
                        that.isIphoneX = true;
                        console.log("is:", that.isIphoneX);
                    }
                }
            });
        },
        go(str) {
            this.$emit("vclose");
            $.$go(str);
        },

        // 获取 初始数据
        async getData() {
            let res = await $.$$np("/imconsult/tipsList");
            console.log(res);
            // 本月事项 存入本地
            wx.setStorage({
                key: "cs_tipList",
                data: JSON.stringify(res.productInfo)
            });
            // 显示时间
            let d = new Date(res.systemTime);
            this.year = $.timeFormat(d, "yyyy");
            this.month = $.timeFormat(d, "MM.dd");
            this.week = "日一二三四五六".charAt(d.getDay());
            this.day = d.getHours();
        },

        // 从本地 获取事项
        getTip() {
            try {
                var value = wx.getStorageSync("cs_tipList");
                if (value) {
                    this.tipList = JSON.parse(value);
                    // console.log(this.tipNumber);
                    this.tip = this.tipList[this.tipNumber].tips;
                } else {
                    this.getData();
                }
            } catch (e) {
                // Do something when catch error
            }
        },

    }
};
</script>
<style lang="less" scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 999;
    background: rgba(255, 255, 255, 0.98);
    margin: 0;
    overflow: hidden;
    .main {
        // position: fixed;
        width: 100%;
        height: 100%;
        padding: 30rpx;
        text-align: center;
        box-sizing: border-box;
    }
    .close {
        width: 220rpx;
        height: 50rpx;
        margin: 0 auto;
        margin-top: 25rpx;
        margin-bottom: 29rpx;
        box-sizing: border-box;
        padding-top: 16rpx;
        .icon{
            width: 56rpx;
            height: 18rpx;
            margin: 0 auto;
            background: url("http://static.cgkc.com/miniprogram/jtou3.png")
            no-repeat center center;
            background-size: cover;
        }
    }
    .time {
        width: 100%;
        color: #666666;
        text-align: left;
        .small {
            font-size: 28rpx;
            margin-bottom: 20rpx;
            span {
                margin-right: 22rpx;
            }
        }
        .big {
            font-size: 72.18rpx;
        }
    }
    .line {
        width: 208rpx;
        height: 1rpx;
        background: rgba(102, 102, 102, 1);
        margin: 18rpx 0 40rpx;
    }
    .ti {
        color: #666666;
        font-size: 26rpx;
        text-align: left;
        box-sizing: border-box;
        padding-right: 30rpx;
        line-height: 40rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 6;
        overflow: hidden;
    }
    .title {
        font-size: 34rpx;
        font-weight: bold;
        width: 690rpx;
        margin: 0 auto;
        color: #333333;
        text-align-last: left;
        position: absolute;
        bottom: 580rpx;
    }
    .btns {
        width: 690rpx;
        margin: 0 auto;
        position: absolute;
        bottom: 100rpx;
        .item {
            height: 180rpx;
            background: #fff;
            margin-bottom: 40rpx;
            border-radius: 16rpx;
            box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            .img {
                margin-left: 24rpx;
                margin-right: 36rpx;
                padding-top: 18rpx;
            }
            .kuaisuwen,
            .wendaka {
                width: 108rpx;
                height: 108rpx;
            }
            .txt {
                flex: 1;
                text-align: left;
                .bt {
                    color: #141414;
                    font-weight: bold;
                    font-size: 32rpx;
                    letter-spacing: 1rpx;
                }
                .ms {
                    color: #999;
                    margin-top: 6rpx;
                    font-size: 24rpx;
                }
            }
            .right {
                width: 18rpx;
                height: 33rpx;
                background: url("http://static.cgkc.com/miniprogram/toright.png")
                    no-repeat center center;
                background-size: cover;
                margin-right: 23rpx;
            }
        }
    }
    .van-popup--bottom.van-popup--safe {
        padding: 0 !important;
    }
    .ipX {
        position: fixed;
        width: 100%;
        height: 100%;
        text-align: center;
        box-sizing: border-box;
        padding: 100rpx 30rpx 30rpx;
        .title{
            bottom: 600rpx;
        }
        .btns{
            bottom: 130rpx;
        }
    }
}
// .ipH{
//     width: 100%;
//     height: 812rpx;
//     position: relative;
//     z-index: 999;
//     background: rgba(255, 255, 255, 0.98);
// }
</style>



