<template>
    <view>
        <view @click="clockInAnimation">立即签到</view>
        <clockAnimation :isShow="clockIsShow" ref="clockAnimation"></clockAnimation>
    </view>
</template>
<script>
//引入组件
import clockAnimation from "@/components/clockAnimation.vue";
export default {
    components: {
        clockAnimation
    },
    data() {
        return {
            clockIsShow: false,
        }
    },
    methods: {
        clockInAnimation() {
            this.clockIsShow = true;
            this.$refs.clockAnimation.animation();
        },
    }
}
</script>
