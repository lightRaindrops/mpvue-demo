<template>
    <div>

        <div class="box">
            <div class="wrap">
                <div class="search fx">
                    <span class="iconfont icon-sousuo"></span>
                    <input type="text" focus="true" :value="searchKeyword" :placeholder="plText" confirm-type="search" @confirm="onSearch">
                </div>
            </div>
            <div class="wrap">
                <div class="searchResultBox">
                    <!--<div class="loadingWrap" v-show="isLoading">
                        <van-loading size="15px" />
                        <span class="txt">正在加载</span>
                    </div>-->
                    <template v-if="!isLoading">

                        <div class="payQuestions" v-if="listenList.length>0">
                            <div class="title fx">
                                <div class="fx1">
                                    相关旁听
                                </div>
                                <!-- <a href="#" class="more">
                                更多<span class="iconfont R icon-jiantouxiangyou"></span>
                            </a> -->
                        </div>
                        <div class="group">
                            <div class="item" v-for="(item,index) in listenList" :key="index">
                                <a :href="'../problemInfo/main?id='+item.id" class="gw fx">
                                    <span class="img face">
                                        <img :src="item.head_url" alt="头像">
                                    </span>
                                    <span class="txt">
                                        <span class="name DB">
                                            {{item.gwName}}
                                        </span>
                                        <span class="bz DB">
                                            <span class="zc">
                                                {{item.cpa_type}}
                                            </span>
                                            <span class="cznx">
                                                持证年限{{item.cpa_time}}年
                                            </span>
                                        </span>
                                    </span>
                                </a>
                                <div class="ms">
                                    {{item.intro}}
                                </div>
                                <span class="fx b">
                                    <span class="fx1">
                                        <span class="num">
                                            {{item.listen_num}}人旁听
                                        </span>
                                        <span class="num dz">
                                            {{item.zan}}人点赞
                                        </span>
                                    </span>
                                    <a href="javascript:;" class="button pt">{{item.listen_pay}}元旁听</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="gwtj" v-if="adviserList.length>0">
                        <div class="title fx">
                            <div class="fx1">
                                顾问推荐
                            </div>
                            <!-- <a href="#" class="more">
                            更多<span class="iconfont R icon-jiantouxiangyou"></span>
                        </a> -->
                    </div>
                    <div class="group">
                        <div class="item" v-for="(item,index) in adviserList" :key="index">
                            <a :href="'../adviserInfo/main?id='+item.id" class="gw fx">
                                <span class="img face">
                                    <img :src="item.head_url" alt="头像">
                                </span>
                                <span class="txt fx1">
                                    <span class="DB">
                                        <span class="name">
                                            {{item.name}}
                                        </span>
                                        <span class="zc">
                                            {{item.cpa_type}}
                                        </span>
                                        <span class="cznx">
                                            持证年限{{item.cpa_time}}年
                                        </span>
                                    </span>
                                    <span class="jj DB">
                                        {{item.intro}}
                                    </span>
                                    <span class="sc DB">
                                        擅长：{{item.tags}}
                                    </span>
                                    <span class="DB other">
                                        <span class="zhpf">综合评分：{{item.score}}</span>
                                        <span class="bzg">帮助过：{{item.qcount}}人</span>
                                        <span class="price"><span>{{item.consult_score_pay}}</span>算珠/次</span>
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="xgwt" v-if="questionList.length>0">
                    <div class="title fx">
                        <div class="fx1">
                            相关问题
                        </div>
                        <!-- <a href="#" class="more">
                        更多<span class="iconfont R icon-jiantouxiangyou"></span>
                    </a> -->
                </div>
                <div class="group">
                    <a :href="'../problemInfo/main?id='+item.id" class="item DB" v-for="(item,index) in questionList" :key="index">
                        <span class="t DB">
                            {{item.title}}
                        </span>
                        <!-- <span class="ms DB">
                        <rich-text :nodes="item.intro"></rich-text>
                    </span> -->
                    <span class="bz fx">
                        <span class="iconfont icon-dianzan"></span>
                        <span class="dz">
                            {{item.zan}}
                        </span>
                        <span class="ll">
                            {{item.visited}}浏览
                        </span>
                    </span>
                </a>
            </div>
        </div>

    </template>

</div>

</div>

</div>

<div :style="{'height':footerHeight+'px'}"></div>



</div>
</template>



<script type="text/javascript">
import $ from '@/common'


function loadFunc(data) {
    let url = $.url('search')
    let kw = data.searchKeyword
    $.pp(url, {
        kw: kw
    }, function(res) {
        data.listenList = res.listenList
        data.adviserList = res.adviserList
        data.questionList = res.questionList
        data.isLoading = false
    })

}

export default {

    data() {
        return {
            isLoading: true,
            searchKeyword: '',
            listenList: [],
            adviserList: [],
            questionList: [],
            type: '',
            plText: '请输入问题、顾问'

        }
    },
    computed: {

    },
    components: {},

    methods: {

        onSearch(event) {
            let val = event.target.value
            
            let url = $.url('search')
            let kw = val
            $.pp(url, {
                kw: kw,
                type: this.type
            }, (res) => {
                console.log(res)
                if(this.type == 1) {
                    if(!Array.isArray(res)) {
                         wx.showToast({
                            title: '没有搜索到顾问',
                            icon: "none",
                            duration: 2000
                        });
                    }
                    this.adviserList = res
                }
                else {
                    this.listenList = res.listenList
                    this.adviserList = res.adviserList
                    this.questionList = res.questionList
                }
                
                this.isLoading = false
            })
            

            //$.goSelf("../search/main?keyword=" + val);
        }

    },

    onLoad(option) {
        this.type = option.type 
        if(this.type && this.type == 1) {
            this.plText = '请输入顾问'
        }
        //this.searchKeyword = option.keyword
       // loadFunc(this)
    },
    onReachBottom: function() {
        // let _this = this
        // this.isLoading = true
        // let pageNumber = this.pageNumber
        // //获取数据
        //
        // $.post($.base + 'test.php', {
        //   page: pageNumber
        // }, function(res) {
        //   _this.recQuestions = _this.recQuestions.concat(res.recQuestions)
        //   _this.pageNumber++
        //   _this.isLoading = false
        // })

    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
