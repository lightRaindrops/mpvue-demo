<template>
    <div class="myLevelBox">
        <div class="top">
            <button class="sjgl button">
                <img :src="sjglIconSrc" mode="widthFix" alt="头像">
                升级攻略
            </button>
            <div class="tt f-tac">
                <div class="img DIB">
                    <img :src="userData.photo" mode="widthFix" alt="头像">
                </div>
                <div class="txt">{{userData.name}}</div>
            </div>
            <div class="bb fx">
                <div class="item">
                    <div class="num">Lv.4</div>
                    <div class="txt">当前等级</div>
                </div>
                <div class="item">
                    <div class="num">2340</div>
                    <div class="txt">总成长值</div>
                </div>
                <div class="item">
                    <div class="num">+56</div>
                    <div class="txt">昨日成长值</div>
                </div>
            </div>
        </div>
        <div class="process boxShadow">
            <div class="title f-tac">距离下一个等级 还差1200成长值</div>
            <div class="bar">
                <div class="c">
                    <div class="a"></div>
                    <div class="b" style="background:#fec05c; width:30%;"></div>
                </div>
                <div class="d">还需要问988个问题</div>
            </div>
            <div class="hz f-tac">或者</div>
            <div class="bar">
                <div class="c">
                    <div class="a"></div>
                    <div class="b" style="background:#fe7767; width:20%;"></div>
                </div>
                <div class="d">还需付费322元提问</div>
            </div>
        </div>
        <div class="djyjl">
            <div class="title">等级与奖励</div>
            <div class="group">
                <div class="item fx">
                    <div class="iL">
                        <div class="t">Lv.0</div>
                        <div class="b">需要0成长值</div>
                    </div>
                    <div class="iM">无奖励</div>
                </div>
                <div class="item fx">
                    <div class="iL">
                        <div class="t">Lv.1</div>
                        <div class="b">需要1成长值</div>
                    </div>
                    <div class="iM">1000算珠</div>
                    <button class="iR ylq">已领取</button>
                </div>
                <div class="item fx">
                    <div class="iL">
                        <div class="t">Lv.2</div>
                        <div class="b">需要100成长值</div>
                    </div>
                    <div class="iM">2000算珠</div>
                    <button class="iR">领取</button>
                </div>
                <div class="item fx">
                    <div class="iL">
                        <div class="t">Lv.3</div>
                        <div class="b">需要300成长值</div>
                    </div>
                    <div class="iM">3500算珠</div>
                    <button class="iR swhd">尚未获得</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
const levels = [

]


export default {
    name: 'app',
    data() {
        return {
            userData: {}
        }
    },
    computed: {
        sjglIconSrc() {
            return $.imgUrl('qing/img/icons/huojian.svg')
        }
    },  
    methods: {

    },
    onLoad(o) {
        let url = $.url('userCenterData')
        $.pp(url, (res) => {
            this.userData = res.userData
        })


    }
}
</script>
<style lang="less">
@import "./main.less";
</style>
