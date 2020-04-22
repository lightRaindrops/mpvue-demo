<template>
    <div class="pointRuleBox">
        <div class="userBox">
            <div class="headerImg">
                <img :src="userData.headerImg">
            </div>
            <div class="userInfo">
                <div class="userName">{{userData.userName}}</div>
                <div class="userCount">总成长值：{{userData.totalGlowVal}} 周成长值：{{userData.weekVal}}</div>
            </div>
        </div>
        <div class="ruleTip">
            <p class="text">活动规则：</p>
            <p class="text">1.禁止刷单，如自问自答，发现则取消成绩且不得再参与本活动</p>
            <p class="text">2.提问和答题都是关于财税内容，且要保证一定质量；</p>
            <p class="text">
                3.活动只针对成为财税问诊的<template v-if="isAdviser">顾问</template><template v-else>用户</template>；
            </p>
        </div>
        <div class="dayPrizeBox">
            <div class="title">每日奖励成长值规则</div>
            <div class="cont">
                <p class="desc">根据以下列表行为获取相应积分、成长值。</p>
                <table>
                    <thead>
                        <tr>
                            <td>行为</td>
                            <td>单次奖励</td>
                            <td>奖励上限</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in dayPrizeData" :key="index">
                            <td>{{item.name}}</td>
                            <td>{{item.point}}成长值</td>
                            <td>{{item.day_time}}次/天</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="dayPrizeBox">
            <div class="title">等级与成长值规则</div>
            <div class="cont">
                <p class="desc">成长值到达一定范围之后会升级到相应等级</p>
                <table>
                    <thead>
                        <tr>
                            <td>等级</td>
                            <td>经验</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in glowRuleData" :key="index">
                            <td>Lv.{{item.level}}</td>
                            <td>{{item.point}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import $ from '@/common'

export default {
    name: 'pointRule',
    data() {
        return {
            userData: {
                headerImg: '',
                userName: '',
                totalGlowVal: '',
                weekVal: ''
            },
            dayPrizeData: [],
            glowRuleData: [],
            isAdviser: ''
        }
    },
    onLoad() {
        this.getDataList()
    },
    onPullDownRefresh() {
        this.getDataList()
        wx.stopPullDownRefresh()
    },
    methods: {
        getDataList() {
            wx.showLoading({
                title: '加载中',
            });
            $.post($.url('userLevelRule'), (res) => {
                console.log(res)
                if (res.code == 200) {
                    wx.hideLoading();
                    this.isAdviser = res.data.is_adviser
                    this.dayPrizeData = res.data.user_activity_level_rule
                    this.glowRuleData = res.data.level_rule
                    this.userData.totalGlowVal = res.data.user_activity_level
                    this.userData.weekVal = res.data.user_activity_weekly_level
                    this.userData.weekVal = res.data.user_activity_weekly_level
                    this.userData.userName = res.data.name
                    this.userData.headerImg = res.data.photo
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
