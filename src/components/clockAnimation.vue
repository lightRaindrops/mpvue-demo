<template>
    <div class="container" v-if="isShow">
        <!-- 创建金币对象 -->
        <!-- 大金币 -->
        <div :class="coinShow?'coinShow bgCoin':'bgCoin'" :animation="bgCoinAnimation"></div>
        <!-- 7个小金币 -->
        <div :class="coinShow?'coinShow coin coin1':' coin coin1'" :animation="coinAnimation1"></div>
        <div :class="coinShow?'coinShow coin coin2':' coin coin2'" :animation="coinAnimation2"></div>
        <div :class="coinShow?'coinShow coin coin3':' coin coin3'" :animation="coinAnimation3"></div>
        <div :class="coinShow?'coinShow coin coin4':' coin coin4'" :animation="coinAnimation4"></div>
        <div :class="coinShow?'coinShow coin coin5':' coin coin5'" :animation="coinAnimation5"></div>
        <div :class="coinShow?'coinShow coin coin6':' coin coin6'" :animation="coinAnimation6"></div>
        <div :class="coinShow?'coinShow coin coin7':' coin coin7'" :animation="coinAnimation7"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            coinShow: false,//金币对象是否显示，用于重置动画时，隐藏对象
            isShow: false, //遮罩显示
            //大金币动画
            bgCoinAnimation: {},
            //小金币动画
            coinAnimation1: {},
            coinAnimation2: {},
            coinAnimation3: {},
            coinAnimation4: {},
            coinAnimation5: {},
            coinAnimation6: {},
            coinAnimation7: {},
        }
    },

    methods: {
        //动画
        animation() {
            this.coinShow = false
            this.isShow = true
            this.bgAnimation()
            this.smallAnimation()

        },
        //大金币动画
        bgAnimation() {
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease-in-out',
            })
            this.timer = setTimeout(() => {
                animation.translate3d(0, 30, 0).step().translate3d(0, 0, 0).step().rotate(80).step({ duration: 400 }).rotate(0).step({ duration: 500 })
                this.bgCoinAnimation = animation.export()
            }, 100)
            setTimeout(() => {
                animation.opacity(0).scale(4).step()
                this.bgCoinAnimation = animation.export()

            }, 3000)
        },
        //小金币动画
        smallAnimation() {
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease-in-out',
            })
            animation.translate3d(0, 30, 0).step().translate3d(0, 0, 0).step()
            setTimeout(() => {
                this.coinAnimation1 = animation
            }, 300)
            setTimeout(() => {
                this.coinAnimation2 = animation
            }, 500)
            setTimeout(() => {
                this.coinAnimation3 = animation
            }, 600)
            setTimeout(() => {
                this.coinAnimation4 = animation
            }, 700)
            setTimeout(() => {
                this.coinAnimation5 = animation
            }, 800)
            setTimeout(() => {
                this.coinAnimation6 = animation
            }, 900)
            setTimeout(() => {
                this.coinAnimation7 = animation.export()
            }, 1000)
            //小金币掉落动画
            setTimeout(() => {
                animation.translate3d(0, 1000, 0).step()
                this.coinAnimation1 = animation
                this.coinAnimation2 = animation
                this.coinAnimation3 = animation
                this.coinAnimation4 = animation
                this.coinAnimation5 = animation
                this.coinAnimation6 = animation
                this.coinAnimation7 = animation

            }, 3000)
            //动画结束，重置动画初始位置
            setTimeout(() => {
                this.coinShow = true
                var animation = wx.createAnimation({
                    duration: 300,
                    timingFunction: 'ease-in-out',
                })
                var animation2 = wx.createAnimation({
                    duration: 300,
                    timingFunction: 'ease-in-out',
                })
                animation.translate3d(0, -1000, 0).step()
                animation2.translate3d(0, -1000, 0).step().scale(1).step()
                this.bgCoinAnimation = animation2.export()
                this.coinAnimation1 = animation
                this.coinAnimation2 = animation
                this.coinAnimation3 = animation
                this.coinAnimation4 = animation
                this.coinAnimation5 = animation
                this.coinAnimation6 = animation
                this.coinAnimation7 = animation
                setTimeout(() => {
                    this.isShow = false

                }, 500)
            }, 4000)



        }
    },

    mounted() {

    },
    onShow() {
    }

}

</script>

<style lang="less" scoped>
.container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    // z-index: 999;
    background: rgba(5, 5, 5, 0.5);
}
.bgCoin {
    background: rgb(233, 201, 19);
    border-radius: 50%;
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    left: 350rpx;
    margin-left: -50rpx;
    top: 600rpx;
    text-align: center;
    line-height: 100rpx;
    color: #ffffff;
    transform: rotate(180deg);
    transform: translate3d(0, -1000rpx, 0);
}
.coinShow {
    opacity: 0;
}
.coin {
    background: url('https://static.cgkc.com/miniprogram/mini/icons/jinsuanzhu.png') no-repeat;
    background-size:100% 100%;
    border-radius: 50%;
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    font-size: 24rpx;
    text-align: center;
    line-height: 40rpx;
    color: #ffffff;
    transform: translate3d(0, -1000rpx, 0);
}
.coin1 {
    top: 40rpx;
    left: 60rpx;
}
.coin2 {
    top: 90rpx;
    left: 200rpx;
}
.coin3 {
    top: 860rpx;
    left: 250rpx;
}
.coin4 {
    top: 150rpx;
    left: 600rpx;
}
.coin5 {
    top: 270rpx;
    left: 500rpx;
}
.coin6 {
    top: 490rpx;
    left: 580rpx;
}
.coin7 {
    top: 350rpx;
    left: 150rpx;
}
</style>

