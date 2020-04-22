<template>
    <div class="comment">
        <div class="title fx jcc">评价</div>
        <div class="content">
            <div class="starWrap">
                <div class="item fx">
                    <div class="txt">服务态度：</div>
                    <div class="xingxing">
                        <van-rate @change="onChangeStarsService" :value="starsService" />
                    </div>
                </div>
                <div class="item fx">
                    <div class="txt">性价比：</div>
                    <div class="xingxing">
                        <van-rate @change="onChangeStarsWorth" :value="starsWorth" />
                    </div>
                </div>
                <div class="item fx">
                    <div class="txt">专业程度：</div>
                    <div class="xingxing">
                        <van-rate @change="onChangeStarsProfession" :value="starsProfession" />
                    </div>
                </div>
            </div>
            <div class="info">
                <textarea
                    placeholder="还有什么要夸奖/吐槽的地方吗？"
                    @input="onCommentChange"
                    v-model="commentVal"
                ></textarea>
            </div>
            <div class="button fx jcc" :style="btn_next" @click="submitNow">提交评价</div>
        </div>
    </div>
</template>
<script>
import $ from '@/common'
export default {
    data() {
        return {
            commentVal: '',
            starsProfession: 5,
            starsService: 5,
            starsWorth: 5
        }
    },
    props: {
        cid: {
            type: Number,
            default: 0
        }

    },
    computed: {
        btn_next() {
            return $.$bg('btn_next.png')
        },
    },
    methods: {
        onCommentChange(e) {
            $.log(this.commentVal)
        },
        onChangeStarsService(e){
            this.starsService = e.mp.detail
        },
        onChangeStarsWorth(e){
            this.starsWorth = e.mp.detail
        },
        onChangeStarsProfession(e){
            this.starsProfession = e.mp.detail
        },
        submitNow() {
            let url = '/imconsult/comment/adviser'
            let data = {
                intro: this.commentVal,
                questionId: this.cid,
                starsProfession: this.starsProfession,
                starsService: this.starsService,
                starsWorth: this.starsWorth
            }
            $.$np(url, data).then(res => {
                if(!res.isError){
                    $.tip('评价成功')
                    $.back()
                    $.isRefresh = true
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.comment {
    .title {
        border-bottom: 1px solid #dedede;
        height: 120rpx;
        font-size: 36rpx;
    }
    .content {
        .starWrap {
            padding-bottom: 38rpx;
            .item {
                margin-left: 54rpx;
                margin-top: 38rpx;
                .txt {
                    width: 160rpx;
                    font-size: 32rpx;
                    color: #666;
                }
            }
        }
        .info {
            textarea {
                background: #f2f2f2;
                width: 690rpx;
                height: 248rpx;
                font-size: 28rpx;
                border-radius: 8rpx;
                margin: 0 auto;
                margin-bottom: 54rpx;
                padding: 30rpx 24rpx;
            }
        }
    }
    .button {
        width: 693rpx;
        height: 131rpx;
        font-size: 32rpx;
        color: #fff;
        margin: 0 auto;
        padding-bottom: 20rpx;
        margin-bottom: 20rpx;
    }
}
</style>




