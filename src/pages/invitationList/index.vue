<template>
    <div v-if="isLoaded">
        <div class="invitationList">
            <div class="tabs fx jcc">
                <div
                    class="tab"
                    :class="{'act':currentTab==index}"
                    v-for="(i,index) in tabs"
                    :key="i.id"
                    @click="tab(index)"
                >
                    <div class="fx jcc">
                        <div class="dian mr18" v-if="i.dian"></div>
                        {{i.text}}
                    </div>
                    <div class="short"></div>
                </div>
            </div>
            <div style="height:90rpx;"></div>
            <div class="cons">
                <div v-if="currentTab == 0">
                    <div v-if="ywc[0]" class="list ywc">
                        <div v-for="i in ywc" :key="i.id" class="item fx">
                            <img :src="i.photo" alt="头像" />
                            <div class="name fx1">{{i.name}}</div>
                            <div class="created_at">{{i.created_at}}</div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="!isLoading" class="noDataWrap">
                            <div class="fx jcc">
                                <div class="noData" :style="noData"></div>
                            </div>
                            <div class="text">暂无相关数据</div>
                        </div>
                    </div>
                </div>
                <div v-if="currentTab == 1">
                    <div v-if="wwc[0]" class="list wwc">
                        <div v-for="i in wwc" :key="i.id" class="item fx">
                            <img :src="i.photo" class="img" mode="aspectFit" />
                            <div class="name fx1">{{i.name}}</div>
                            <button open-type="share" class="orange">再次邀请</button>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="!isLoading" class="noDataWrap">
                            <div class="fx jcc">
                                <div class="noData" :style="noData"></div>
                            </div>
                            <div class="text">暂无相关数据</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script type="text/javascript">
import $ from '@/common'


export default {
    data() {
        return {
            isLoaded: false,
            tabs: [{ text: '已完成', dian: false, id: 'tab1' }, { text: '未完成', dian: false, id: 'tab2' }],
            currentTab: 0,
            page: 0,
            inviteCode: '',
            isLoading: false,
            lock: false,
            ywc: [],
            wwc: [],
        }
    },
    computed: {
        noData() {
            return $.$bg("icons/noData.png")
        },
    },
    onPullDownRefresh() {
        this.init().then(() => {
            wx.stopPullDownRefresh()
        })
    },
    onReachBottom() {
        this.nextPage()
    },
    methods: {
        toWhoConsulted(id) {
            wx.navigateTo({
                url: '../whoConsulted/main?id=' + id
            })
        },
        tab(index) {
            this.currentTab = index
            this.init()
            $.goTop()
        },
        go(url) {
            if (url) {
                $.go(url)
            }
        },
        getList(url) {
            let c = this.currentTab
            let s
            if (c == 0) {
                s = 1
            } else if (c == 1) {
                s = 0
            }
            return $.np(url, { page: this.page, status: s }).then(res => {
                let list = res
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
                s = 'getInvitedRecord'
                g = 'ywc'
            } else if (t == 1) {
                s = 'getInvitedRecord'
                g = 'wwc'
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
                    this[g] = []
                    this.lock = true
                }

            })

        }
    },
    onLoad(o) {
        this.currentTab = Number(o.status)
        this.init()
        this.inviteCode = $.usInfo.inviteCode
        $.log('邀请码', $.usInfo.inviteCode)
    },
    onShareAppMessage(res) {
        let t = this;
        $.log(t.inviteCode)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '财税达人,虚位已待,恭迎大驾!',
            //is_guwen_line用标识通过邀请顾问页面跳转
            path: '/pages/index/main?isGuwenLine=1&local_tip=becomeConsultant&inviteCode=' + t.inviteCode,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/wx/img/inviteGuwen/bg4.jpg?999',
            success: function (res) {
                //方法被废用
                // https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408

            }
        }
    },
}
</script>

<style lang="less">
@import "./main.less";
</style>
