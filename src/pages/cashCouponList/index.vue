<template>
    <div v-show="isLoaded">
        <div class="tabs fx jcc">
            <div
                class="tab"
                :class="{'act':currentTab==index}"
                v-for="(i,index) in tabs"
                :key="index"
                @click="tab(index)"
            >
                {{i}}
                <div class="short"></div>
            </div>
        </div>
        <div style="height:90rpx;"></div>
        <div v-if="currentTab == 0">
            <div v-if="notUsed[0]" class="list notUsed">
                <div class="item fx" v-for="i in notUsed" :key="i.id" :style="itemBg">
                    <div class="ileft">
                        <div class="num">¥{{i.amount}}</div>
                        <div class="text">现金劵</div>
                    </div>
                    <div class="iright fx1">
                        <div class="no">NO.{{i.code}}</div>
                        <div class="yxq">有效期：至{{i.end_time}}</div>
                    </div>
                </div>
            </div>
            <div v-else class="noDataWrap">
                <div class="fx jcc">
                    <div class="noData" :style="noData"></div>
                </div>
                <div class="text">暂无相关数据</div>
            </div>
        </div>
        <div v-else-if="currentTab == 1">
            <div v-if="used[0]" class="list used">
                <div class="item fx" v-for="i in used" :key="i.id" :style="itemBgUsed">
                    <div class="ileft">
                        <div class="num">¥{{i.amount}}</div>
                        <div class="text">现金劵</div>
                    </div>
                    <div class="iright fx1">
                        <div class="no">NO.{{i.code}}</div>
                        <div class="yxq">有效期：至{{i.end_time}}</div>
                    </div>
                </div>
            </div>
            <div v-else-if="!isLoading" class="noDataWrap">
                <div class="fx jcc">
                    <div class="noData" :style="noData"></div>
                </div>
                <div class="text">暂无相关数据</div>
            </div>
        </div>
        <div v-else-if="currentTab == 2">
            <div v-if="expired[0]" class="list expired">
                <div class="item fx" v-for="i in expired" :key="i.id" :style="itemBgExpired">
                    <div class="ileft">
                        <div class="num">¥{{i.amount}}</div>
                        <div class="text">现金劵</div>
                    </div>
                    <div class="iright fx1">
                        <div class="no">NO.{{i.code}}</div>
                        <div class="yxq">有效期：至{{i.end_time}}</div>
                    </div>
                </div>
            </div>
            <div v-else-if="!isLoading" class="noDataWrap">
                <div class="fx jcc">
                    <div class="noData" :style="noData"></div>
                </div>
                <div class="text">暂无相关数据</div>
            </div>
        </div>
    </div>
</template>

<script>

import $ from '@/common'

export default {
    name: 'app',
    data() {
        return {
            tabs: ['未使用', '已使用', '已过期'],
            currentTab: 0,
            notUsed: [],
            used: [],
            page: 0,
            lock: false,
            expired: [],
            isLoaded: false,
            isLoading: false
        }
    },
    computed: {
        noData() {
            return $.$bg("icons/noData.png")
        },
        itemBg() {
            return $.$bg("cashCouponList/itemBg.png")
        },
        itemBgUsed() {
            return $.$bg("cashCouponList/itemBgUsed.png")
        },
        itemBgExpired() {
            return $.$bg("cashCouponList/itemBgExpired.png")
        },

    },
    components: {
    },
    methods: {
        tab(index) {
            this.currentTab = index
            this.init()
            $.goTop()
        },
        getList(status) {
            return $.np('getCashCouponList', { status: status, page: this.page }).then(res => {
                let list = res.list.list

                list.forEach(ele => {
                    ele.end_time = $.timeFormat(new Date(ele.end_time * 1000), 'yyyy-MM-dd')
                })
                return list
            })
        },
        init() {
            this.page = 0
            this.lock = false
            this.isLoading = true
            return this.nextPage().then(() => {
                this.isLoaded = true
                this.isLoading = false
            })
        },
        nextPage() {
            let s
            let g
            let t = this.currentTab
            if (t == 0) {
                s = 1
                g = 'notUsed'
            } else if (t == 1) {
                s = 2
                g = 'used'
            } else if (t == 2) {
                s = 10000
                g = 'expired'
            }

            if (this.lock) {
                return
            }

            return this.getList(s).then(list => {
                if (list.length > 0) {
                    if (this.page == 0) {
                        this[g] = list
                    } else {
                        this[g] = this[g].concat(list)
                    }

                    if (list.length == 20) {
                        this.page++
                    } else {
                        this.lock = true
                    }
                } else {
                    this.lock = true
                }

            })

        }
    },
    onLoad() {
        this.init()
    },
    onPullDownRefresh() {
        this.init().then(() => {
            wx.stopPullDownRefresh()
        })
    },
    onReachBottom() {
        this.nextPage()
    },

}
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
