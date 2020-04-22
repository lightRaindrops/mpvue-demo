<template>
    <div>
        <scroll-view
            :style="scrollViewStyle"
            :scroll-anchoring="true"
            :enable-back-to-top="true"
            :scroll-into-view="scrollIntoView"
            v-if="appendList"
            :scroll-y="true"
            @scrolltoupper="onScrollToUpper"
        >
            <div class="message">
                <div
                    class="item"
                    :id="'msg_item_'+i.appendId"
                    v-for="i in appendList"
                    :key="i.appendId"
                >
                    <div class="time">{{i.createdAt}}</div>
                    <div v-if="i.appendType == 2" class="fx aifs">
                        <div class="img">
                            <Nimg :src="msg.adviserHeadUrl" />
                        </div>
                        <div v-if="i.contentType==1" class="msg">{{i.intro}}</div>
                        <div v-else-if="i.contentType==2" class="msg">
                            <div class="msg-img" @click="previewImage(i.intro)">
                                <Nimg :src="i.intro"></Nimg>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="i.appendType == 1" class="fx aifs">
                        <div class="fx1"></div>
                        <div v-if="i.contentType==1" class="msg in">{{i.intro}}</div>
                        <div v-else-if="i.contentType==2" class="msg in">
                            <div class="msg-img" @click="previewImage(i.intro)">
                                <Nimg :src="i.intro"></Nimg>
                            </div>
                        </div>
                        <div class="img">
                            <Nimg :src="msg.userHeadUrl?msg.userHeadUrl:'defaultFace.png'" />
                        </div>
                    </div>
                </div>
            </div>
        </scroll-view>

        <div class="bottomX" :class="{isIphoneX:isIphoneX}"></div>

        <div class="bottom fx" :class="{isIphoneX:isIphoneX}" v-if="msg&&!msg.canAppend">
            <button v-if="questionType!=2" class="share fx" open-type="share">
                <div class="img">
                    <Nimg src="icons/share-msg.png" />
                </div>
                <div class="txt">分享</div>
            </button>
            <div class="fx1"></div>
            <button class="ans fx jcc" @click="go('meAnswer')">回答其他问题</button>
        </div>
        <div class="bottom fx" :class="{isIphoneX:isIphoneX}" v-else>
            <input class="srk fx1" type="text" placeholder="点击输入" v-model="msgSend" />
            <div class="icon-img" @click="chooseImg">
                <Nimg src="icons/icon-img.png" />
            </div>
            <button class="send fx jcc" @click="sendMsg">发送</button>
        </div>
    </div>
</template>



<script>
import $ from '@/common'
import Nimg from '@/components/Nimg.vue'
export default {
    data() {
        return {
            msgSend: '',
            msg: null,
            answerId: '',
            scrollIntoView: '',
            appendList: null,
            pageSize: 100,
            lastAppendListLength: 0,
            questionType: 0
        }
    },
    computed: {
        scrollViewStyle() {
            let bot = 130
            if ($.isIphoneX()) {
                bot = 150
            }
            let h = $.windowHeight - bot / 750 * $.windowWidth
            return 'height:' + h + 'px;' + 'overflow-anchor:auto;'
        },
        isIphoneX() {
            return $.isIphoneX()
        }
    },
    components: {
        Nimg
    },
    methods: {
        onScrollToUpper() {
            $.log('滚动到顶部啦')
            this.prevPage()
        },
        go: $.$go,
        previewImage(src) {
            wx.previewImage({
                current: src,
                urls: [src]
            })
        },
        pushData(res) {
            $.hideLoading()
            this.msgSend = ''
            res.forEach(ele => {
                ele.createdAt = $.dateLong2String(ele.createdAt)
            })
            this.appendList = this.appendList.concat(res)
            this.scrollIntoView = 'msg_item_' + this.appendList.slice(-1)[0].appendId
        },
        sendMsg() {
            $.showLoading('请稍候')
            let url = '/imconsult/answer/append/submit'
            let currentAppendId = 0
            if (this.appendList.slice(-1)[0]) {
                currentAppendId = this.appendList.slice(-1)[0].appendId
            }

            let data = {
                answerId: this.answerId,
                contentType: 1,
                currentAppendId: currentAppendId,
                intro: this.msgSend
            }
            $.$np(url, data).then(res => {
                this.pushData(res)
            })
        },
        chooseImg() {
            let self = this
            wx.chooseImage({
                count: 1,
                success(res) {
                    const tempFilePaths = res.tempFilePaths
                    const uploadUrl = $.url('uploadFile')
                    let session = $.getLocal('session')
                    $.showLoading('上传中')
                    wx.uploadFile({
                        url: uploadUrl,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'session': session
                        },
                        success(res) {
                            const src = JSON.parse(res.data).data.src
                            let url = '/imconsult/answer/append/submit'
                            let currentAppendId = 0
                            if (self.appendList.slice(-1)[0]) {
                                currentAppendId = self.appendList.slice(-1)[0].appendId
                            }
                            let data = {
                                answerId: self.answerId,
                                contentType: 2,
                                currentAppendId: currentAppendId,
                                intro: src
                            }
                            $.$np(url, data).then((ires) => {
                                self.pushData(ires)
                            })

                        }
                    })

                }
            })
        },
        init() {
            {
                let url = '/imconsult/answer/append/initList'
                let data = {
                    answerId: this.answerId,
                    pageSize: this.pageSize,
                }
                $.$np(url, data).then(res => {

                    if (res.isError) {
                        return
                    }

                    this.msg = res

                    this.lastAppendListLength = res.appendList.length

                    res.appendList.forEach(ele => {
                        ele.createdAt = $.dateLong2String(ele.createdAt)
                    })
                    if (res.sortType == 1) {
                        this.appendList = res.appendList.reverse()
                        this.scrollIntoView = 'msg_item_' + this.appendList.slice(-1)[0].appendId
                    } else {
                        this.appendList = res.appendList
                    }

                })
            }
        },
        prevPage() {
            if (this.lastAppendListLength < this.pageSize) {
                return
            }
            let url = '/imconsult/answer/append/list'
            let data = {
                answerId: this.answerId,
                pageSize: this.pageSize,
                currentAppendId: this.appendList[0].appendId,
                sortType: this.msg.sortType
            }
            $.$np(url, data).then(res => {
                if (res.isError) {
                    return
                }
                this.lastAppendListLength = res.length
                res.forEach(ele => {
                    ele.createdAt = $.dateLong2String(ele.createdAt)
                })
                this.appendList.unshift(...res)
            })
        }
    },
    onLoad(o) {
        this.answerId = o.id
        this.questionId = o.qid
        this.questionType = o.questionType
        if(this.questionType == 2){
            wx.hideShareMenu()
        }
        this.init()
    },
    onShareAppMessage(res) {
        let url = '/pages/index/main?id=' + this.questionId + '&local_tip=problemInfo';
        return {
            title: '财税有难题，就问CPA！',
            path: url,
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png',
        }
    },
    onUnload() {
        $.isRefresh = true
    }
    // mounted() {
    //     this.answerId = 13862
    //     this.init()
    // }
}
</script>

<style lang="less">
@import "./main.less";
</style>
