<template>
    <div>
        <div class="all" >
            <div class="title">
                <Filter :sortReq="sortReq" :filterReq="filterReq" :filterData="filterData" :filterTop="filterTop" />
                <ul class="selectUl" v-if="navStatus">
                    <li v-for="(item, index) in navList" :key="index"
                        :class="{'active': navActive == index}"
                        @click="handleNavList(index)">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            <div class="fx jcc loadingWrap" v-if="isLoading">
                <van-loading></van-loading>
            </div>
            <template  v-else>
            <div class="group" v-if="list && list.length">
                <div 
                    class="item fx aifs"
                    v-for="(i,index) in list"
                    :key="index"
                    @click="go('adviserInfo?id='+i.adviserId + '&categoryId=' + categoryId)"
                >
                    <div class="img">
                        <div class="photo">
                            <Nimg :src="i.photo" />
                        </div>
                        
                        <!-- <div class="isOnline" v-if="i.onlineStatus !== 0">
                            <div class="icon">
                                <Nimg :src="`icons/newTypes/line${i.onlineStatus}.png`" />
                            </div>
                            <p class="online" v-if="i.onlineStatus === 1">在线中</p>
                            <p class="online" v-if="i.onlineStatus === 2">最近活跃</p>
                            <p class="offline" v-if="i.onlineStatus === 3">离线中</p>
                            
                        </div> -->

                        <div class="level">
                            <Nimg :src="`icons/guwen/c${i.adviserLevel}.png`" />
                        </div>
                    </div>
                    <div class="txt fx1">
                        <div class="line fx">
                            <div class="name">{{i.adviserName}}</div>
                            <div class="cpaType" v-if="i.cpaType != 0 && i.cpaType < 5">
                                <Nimg :src="`icons/guwen/t${i.cpaType}.png`" />
                            </div>
                            <div class="vip" v-if="i.vipCorporate">
                                <Nimg :src="`icons/vip/qy.png`" />
                            </div>
                            <div class="vip" v-else-if="i.vipPersonal">
                                <Nimg :src="`icons/vip/gr.png`" />
                            </div>
                            <div class="fx1"></div>
                            
                        </div>
                        <div class="swsName" v-if="i.serviceName">{{i.serviceName}}</div>
                        <div class="fx">
                            <div class="fx sc">
                                <div class="bt">擅长:</div>
                                <div class="ny fx">
                                    <div class="i" v-for="(ii,q) in i.tags" :key="ii+q">{{i.tags.length && (q === i.tags.length - 1? ii : ii + '、')}}</div>
                                </div>
                            </div>
                            <div class="fx1"></div>
                        </div>
                        <div class="data">
                            <span>持证年限{{i.cpaTime}}</span>
                            <span>评分{{i.score}}</span>
                            <span>回答{{i.countAnswer}}</span>
                        </div>
                        <div class="zxbtn">
                            <div class="price" v-if="i.consultPay">{{i.consultScorePay}}算珠</div>
                            <p>立即咨询</p>
                        </div>
                    </div>
                </div>
                <p class="tips" v-if="isWaiting">正在加载中</p>
                <p class="tips" v-else>- 到底了，顾问是稀缺的哟 -</p>
                
            </div>
            <p v-else class="tips">暂无数据</p>
            </template>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
import Filter from '@/components/Filter.vue'

export default {
    data() {
        return {
            navList: ['全部'],
            navActive: -1,
            currentPage: 1,
            //是否综合排序
            totalPage: 1,
            list: [],

            isLoading: true,
            isWaiting: false,

            filterData: {},
            categoryId: '', //标题id
            cpaTypeCode: '', //职称
            priceTypeCode: '', //价钱
            sortTypeCode: '', //排序
            
        }
    },
    props: {
        //一级标题id
        id: {
            type: String | Number,
            default: ''
        },
        //一级标题名称
        type: {
            type: String,
            default: ''
        },
        navStatus: {
            type: Boolean,
            default: false
        },
        filterTop:{
            type: Number,
            default: ''
        }
    },
    methods: {
        go: $.$go,
        //判断不同的模块的二级标题
        judgeModel() {
            if(this.id) {
                this.getChildNav()
                //有一级标题
                this.categoryId = +this.id
                this.getRecommendationList()
            }
        },
        //获取二级标题
        getChildNav() {
            try {
                 $.$$np('/imconsult/category/relation/list').then(res => {
                    if(res) {
                        res.map(item => {
                            if(item.name === this.type) {
                                this.navList = item.childCategoryList
                            }
                        })
                    }
                })
            } catch (error) {
                $.error(error)
            }
           
        },
        //业务咨询出现选择模块
        handleNavList(index) {
            this.navActive = this.navActive === index? -1: index
            //根据二级标题请求顾问
            this.categoryId = this.navActive === -1? +this.id : this.navList[index].id 
            this.currentPage = 1
            this.getRecommendationList()
        },
        /**
         * 获取筛选条件
         */
        getFilterData() {
            try {
                 $.$$np('/user/adviser/filter/param').then(res => {
                    this.filterData = res
                })
            } catch (error) {
                $.error(error)
            }
           
        },
       
        //排序
        sortReq(val) {
            console.log('sort',val)
            this.currentPage = 1
            this.sortTypeCode = val.code
            this.getRecommendationList()
        },
        //筛选
        filterReq(val) {
            console.log('filter',val)
            this.currentPage = 1
            if(val.type === 'submit') {
                this.priceTypeCode = val.range.code
                this.cpaTypeCode = val.duty.code
                this.getRecommendationList()
            }
            else {
                this.priceTypeCode = ''
                this.cpaTypeCode = ''
                this.getRecommendationList()
            }
        },
         /**
         * 获取顾问列表
         */
        async getRecommendationList() {
            try {
                let cacheKey = ''
                let categoryId = this.categoryId
                let cpaTypeCode = this.cpaTypeCode
                let priceTypeCode = this.priceTypeCode
                let sortTypeCode = this.sortTypeCode
                
                const data = {
                    cacheKey,
                    categoryId,
                    cpaTypeCode,
                    priceTypeCode,
                    sortTypeCode
                }

                let page = this.currentPage
                let url = '/user/adviser/v2/recommendation?page=' + page + '&pageSize=20'

                this.isWaiting = true
                if(this.currentPage === 1) {
                    this.isLoading = true
                }
                let { list, totalPage } = await $.$np(url, data)
                this.isWaiting = false

                list.forEach(ele => {
                    try {
                        if (ele.tags) {
                            let tags = ele.tags.split(',')
                            ele.tags = tags.filter(e => e !== '无')

                        }
                    } catch (e) {
                        $.error(e)
                    }
                })
                if (this.currentPage == 1) {
                    this.list = []
                }
                this.list = this.list.concat(list)
                this.totalPage = totalPage

                this.isLoading = false
            } catch (error) {
                this.isLoading = false
                $.error(error)
            }
            
        },
        nextPage() {
            if (this.isWaiting) {
                return
            }
            if (this.currentPage < this.totalPage) {
                this.currentPage++
                this.getRecommendationList()
            }
        },
    },
    components: {
        Nimg,Filter
    },
    onReachBottom() {
        this.nextPage()
    },
    onLoad() {
        console.log(123123,this.filterTop)
        if(this.navStatus) {
            this.judgeModel()
        }
        else {
            this.getRecommendationList()
        }
        this.getFilterData()
    },
}
</script>

<style lang="less" scoped>
.all {
    // border-top: 20rpx solid #f2f2f2;

    .title {
        width: 100%;
        .selectUl {
            width: 100%;
            padding: 30rpx 30rpx 0;
            display: flex;
            flex-wrap: wrap;
            li {
                line-height: 52rpx;
                background: #f5f5f5;
                border-radius: 2rpx;
                color: #999;
                margin-bottom: 20rpx;
                margin-right: 30rpx;
                font-size: 26rpx;
                font-weight: 500;
                min-width: 150rpx;
                text-align: center;
                &:nth-child(4n) {
                    margin-right: 0
                }
               
            }
             .active {
                     background: #d3381c;
                     color: #fff;
                }
        }
        .item {
            height: 114rpx;
            text-align: center;

            .icon {
                width: 16rpx;
                height: 10rpx;
                margin-left: 12rpx;
            }

            .level {
                position: absolute;
                z-index: 2;
                width: 44rpx;
                height: 26rpx;
                right: 0;
                bottom: 0;
            }

            &.on {
                color: #f30719;
            }

            &.type {
                margin-right: 70rpx;
            }

            &.zhpx {
                margin-right: 40rpx;
            }

            &.price {
                .line {
                    margin-top: 2rpx;
                    margin-bottom: 2rpx;
                }
            }
        }
    }

    .group {
        padding: 0 30rpx;

        .item {
            border-bottom: 1rpx solid #ededed;
            padding: 46rpx 0;

            .img {
                position: relative;

                .photo {
                    width: 126rpx;
                    height: 126rpx;
                    overflow: hidden;
                    border-radius: 50%;
                    border: 1px solid #f0f0f0;
                }
                .isOnline {
                    display: flex;
                    align-items: center;
                    margin-top: 10rpx;
                    justify-content: center;
                    .icon {
                        width: 20rpx;
                        height: 20rpx;
                        margin-right: 11rpx;
                    }
                    .online {
                        font-size: 22rpx;
                        color: #333;
                    }
                    .offline {
                        font-size: 22rpx;
                        color: #999;
                    }
                }
            }

            .level {
                position: absolute;
                z-index: 2;
                width: 44rpx;
                height: 26rpx;
                right: 0;
                bottom: 0;
            }

            .cpaType,
            .vip {
                margin-left: 12rpx;
                width: 58rpx;
                height: 28rpx;
            }

            &:last-child {
                border: 0;
            }

            .img {
                position: relative;

                .face {
                    width: 108rpx;
                    height: 108rpx;
                    border-radius: 50%;
                    border: 1px solid #f0f0f0;
                    overflow: hidden;
                }

                .c1 {
                    width: 72rpx;
                    height: 30rpx;
                    position: absolute;
                    left: 18rpx;
                    bottom: -8rpx;
                }
            }

            .txt {
                margin-left: 24rpx;

                .name {
                    font-size: 32rpx;
                    color: #333333;
                }

                .type {
                    width: 77rpx;
                    height: 28rpx;
                    margin-left: 10rpx;
                }

                .icon.vv {
                    width: 28rpx;
                    height: 28rpx;
                    margin-left: 10rpx;
                }

                .price {
                    color: #333;
                    font-size: 28rpx;
                    font-weight: 500;
                }

                .vipPrice {
                    font-size: 20rpx;
                    color: #ff7c00;
                    background: #fff5eb;
                    border: 1rpx solid #ffddbc;
                    text-align: center;
                    min-width: 103rpx;
                    padding-left: 10rpx;
                    padding-right: 10rpx;
                    height: 36rpx;
                    border-radius: 5rpx;
                    font-size: 20rpx;
                }

                .swsName {
                    color: #666666;
                    margin-top: 15rpx;
                }

                .data {
                    color: #999;
                    font-size: 24rpx;
                    margin-top: 15rpx;
                    display: flex;
                    justify-content: space-between;
                    padding-right: 10rpx;
                    box-sizing: border-box;
                }

                .sc {
                    border-radius: 0 10rpx 10rpx 0;
                    margin-top: 15rpx;
                    // border: 1rpx solid #ededed;

                    .bt {
                        // background: #ededed;
                        height: 40rpx;
                        line-height: 40rpx;
                        text-align: center;
                        // width: 68rpx;
                        color: #999;
                        font-size: 24rpx;
                        margin-right: 10rpx;
                    }

                    .ny {
                        color: #999;
                        font-weight: 24rpx;
                        .i {
                            // border-right: 1rpx solid #e5e5e5;
                            // padding: 0 13rpx;

                            &:last-child {
                                border: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
.tips {
    text-align: center;
    color: #666666;
    margin-top: 50rpx;
}
.zxbtn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
    p {
        text-align: center;
        width:140rpx;
        height:46rpx;
        background:rgba(242,242,242,1);
        border-radius:23rpx;
        line-height: 46rpx;
        font-size: 24rpx;
        color: #d3381c;
        font-weight: 500;
    }
}
</style>
