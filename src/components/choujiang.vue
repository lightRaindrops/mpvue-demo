<template>
    <div>
        <div class="choujiang" :style="choujiangBg" v-if="isLoaded">
            <div class="title fx jcc">
                您有
                <div class="num">{{lotteryNum}}</div>次抽奖机会
            </div>
            <div class="group fx">
                <div class="item" :style="'background-color:'+color[0]">
                    <div class="txt">{{lottery[0].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
                <div class="item" :style="'background-color:'+color[1]">
                    <div class="txt">{{lottery[1].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
                <div class="item" :style="'background-color:'+color[2]">
                    <div class="txt">{{lottery[2].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
                <div class="item" :style="'background-color:'+color[7]">
                    <div class="txt">{{lottery[7].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
                <button
                    class="item btn startDrawing"
                    @click="startDrawing"
                    :style="ljcj"
                    :class="isStartDrawingActive?'active':''"
                    :disabled="isStartDrawingDisabled"
                ></button>
                <div class="item" :style="'background-color:'+color[3]">
                    <div class="txt">{{lottery[3].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
                <div class="item" :style="'background-color:'+color[6]">
                    <div class="txt">{{lottery[6].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
                <div class="item" :style="'background-color:'+color[5]">
                    <div class="txt">{{lottery[5].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
                <div class="item" :style="'background-color:'+color[4]">
                    <div class="txt">{{lottery[4].prize_name}}</div>
                    <div class="img">
                        <img :src="hongbao" class="hongbao" mode="aspectFit" />
                    </div>
                </div>
            </div>
        </div>
        <div>
            <img :src="dahongbaoImg" />
            <van-popup
                class="popup"
                :show="isShow"
                position="center"
                custom-style="background:none"
            >
                <div>
                    <div class="popup-top" :style="dahongbao">
                        <div class="itop">
                            <span class="num" v-if="luckPosition>-1">{{lottery[luckPosition].money}}</span>
                            <span class="unit">元</span>
                        </div>
                        <div>
                            <div @click="closePopup" class="ibutton">我知道了</div>
                        </div>
                    </div>
                    <div class="popup-bottom">
                        <img class="close" :src="closeImg" @click="closePopup" />
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "../less/common.less";
.choujiang {
    width: 690rpx;
    height: 819rpx;
    margin: 0 auto;

    .title {
        padding-top: 64rpx;
        color: #fff;
        font-size: 32rpx;
        font-weight: bold;

        .num {
            color: #ff3f1f;
            padding: 0 10rpx;
        }
    }

    .group {
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 60rpx;
        margin-left: 60rpx;
        margin-right: 60rpx;
        height: 620rpx;
        .item {
            width: 180rpx;
            height: 180rpx;
            border-radius: 16rpx;
            border: 4rpx solid #fff;
            background: #fff;
            text-align: center;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;

            .hongbao {
                width: 60rpx;
                height: 45rpx;
            }

            .txt {
                font-size: 36rpx;
                color: #f30719;
                font-weight: bold;
            }

            img {
                width: 60rpx;
                margin-top: 10rpx;
            }

            &.btn {
                background: none;
                border: 0;
                background-size: contain;
            }
        }
    }
}
.startDrawing.btn.active {
    transform: scale(0.8, 0.8);
}

.popup {
    .popup-top {
        width: 664rpx;
        height: 769rpx;
        background-size: contain;
        color: #9a5918;
        text-align: center;
        padding-top: 180rpx;

        .num {
            font-size: 88rpx;
        }

        .unit {
            font-size: 26rpx;
        }

        .ibutton {
            width: 320rpx;
            height: 84rpx;
            line-height: 84rpx;
            color: #8a3e00;
            margin: 0 auto;
            margin-top: 280rpx;
            text-align: center;
            font-size: 40rpx;
            border-radius: 50rpx;
            background: linear-gradient(#fee9d0, #faaf6a) !important;
        }

        .get {
            position: absolute;
            width: 70px;
            height: 70px;
            top: 58%;
            left: 39%;
        }
    }

    .popup-bottom {
        text-align: center;
        background: none;

        .close {
            margin-top: 30px;
            width: 30px;
            height: 30px;
            background: none;
        }
    }
}
</style>

<script>
import $ from '@/common'
import { setTimeout } from 'timers';
let interval = null
let intime = 50
export default {
    data() {
        return {
            color: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
            luckPosition: -1,
            isStartDrawingActive: false,
            isShow: false,
            isStartDrawingDisabled: false,
            lotteryNum: 0,
            isLoaded: false,
            lottery: []
        }
    },
    computed: {
        dahongbaoImg() {
            return $.$img('inviteConsultants/dahongbao.png')
        },
        dahongbao() {
            return $.$bg('inviteConsultants/dahongbao.png')
        },
        closeImg() {
            return $.$img('/wx/img/signIn/close.png')
        },
        choujiangBg() {
            return $.$bg('inviteConsultants/choujiangBg.png')
        },
        hongbao() {
            return $.$img('inviteConsultants/hongbao.png')
        },
        yqphb() {
            return $.$img('inviteConsultants/yqphb.png')
        },
        ljcj() {
            return $.$bg('inviteConsultants/ljcj.png')
        },
    },
    methods: {
        closePopup() {
            this.isShow = false
        },
        stopLuck(which, index, time, splittime) {
            let e = this;
            //值越大出现中奖结果后减速时间越长
            let color = e.color;
            setTimeout(function () {
                //重置前一个位置
                if (index > 7) {
                    index = 0;
                    color[7] = '#fff'
                } else if (index != 0) {
                    color[index - 1] = '#fff'
                }
                //当前位置为选中状态
                color[index] = '#ffcc52'
                e.color = color.concat([])
                //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
                //直到旋转至中奖位置
                if (time < 400 || index != which) {
                    //越来越慢
                    splittime++;
                    time += splittime;
                    //当前位置+1
                    index++;
                    e.stopLuck(which, index, time, splittime);
                } else {
                    //1秒后显示弹窗
                    setTimeout(function () {
                        e.isStartDrawingDisabled = false
                        e.isShow = true
                        let money = Number(e.lottery[e.luckPosition].money)
                        e.$emit('stopLuck', money)
                    }, 1000);
                }
            }, time);
            console.log(time);
        },
        stop(which) {
            var e = this;
            //清空计数器
            clearInterval(interval);
            //初始化当前位置
            var current = -1;
            var color = e.color;
            for (var i = 0; i < color.length; i++) {
                if (color[i] == '#ffcc52') {
                    current = i;
                }
            }
            //下标从1开始
            var index = current + 1;

            e.stopLuck(which, index, intime, 10);
        },
        startDrawing() {
            let e = this;
            let $color = e.color

            if (this.lotteryNum == 0) {
                $.tip('邀请好友入驻获得更多抽奖机会')
                return
            }

            $.np('lotteryInviteStart', res => {
                let reward_id = res.reward_id
                e.luckPosition = this.lottery.findIndex(ele => ele.id == reward_id)
                this.lotteryNum--
                //判断中奖位置格式
                if (e.luckPosition == null || isNaN(e.luckPosition) || e.luckPosition > 7) {
                    wx.showModal({
                        title: '提示',
                        content: '请填写正确数值',
                        showCancel: false,
                    })
                    return;
                }

                //设置按钮不可点击
                e.isStartDrawingDisabled = true
                e.isStartDrawingActive = true
                setTimeout(() => {
                    e.isStartDrawingActive = false
                }, 50)
                //清空计时器
                clearInterval(interval);
                let index = 0;

                console.log($color[0]);
                //循环设置每一项的透明度
                interval = setInterval(function () {
                    if (index > 7) {
                        index = 0;
                        $color[7] = '#fff'
                    } else if (index != 0) {
                        $color[index - 1] = '#fff'
                    }
                    $color[index] = '#ffcc52'
                    e.color = $color.concat([])
                    index++;
                }, intime);

                //模拟网络请求时间  设为两秒
                let stoptime = 2000;
                setTimeout(function () {
                    e.stop(e.luckPosition);
                }, stoptime)

            })
        }
    },
    onLoad() {
        $.showLoading()

        $.np('userCenterData').then(res => {
            this.lotteryNum = res.lotteryNum
        })

        //奖品列表
        $.np('getLotteryInviteConfig', list => {
            this.lottery = list
            this.isLoaded = true
            $.hideLoading()
        })
    }
}
</script>