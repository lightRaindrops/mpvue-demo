<template>
    <div v-show="isLoaded">
        <div class="box" :style="'min-height:'+winHeight+'px;'+bg">
            <div class="group">
                <div class="line fx">
                    <div class="name">图文咨询</div>
                    <div class="qt fx1">
                        <input
                            type="number"
                            v-model="FD.consult_pay"
                            placeholder="设置单次图文咨询算珠数(100起)"
                        />
                    </div>
                </div>
                <div class="line fx">
                    <div class="name">即问即答</div>
                    <div class="qt fx1">
                        <input type="number" v-model="FD.online_pay" placeholder="设置单次即问即答算珠数(200起)" />
                    </div>
                </div>
                <div class="line fx" @click="onSclyClick">
                    <div class="name">擅长领域</div>
                    <div class="qt fx1 fx" v-if="sclyCheckedNum<=0">
                        <div class="fx1"></div>每月只可修改一次
                        <img :src="arrow" class="arrow" mode="aspectFit" />
                    </div>
                    <div class="qt fx1 fx" v-else>
                        <div class="fx1"></div>
                        {{sclyChecked}}
                        <img :src="arrow" class="arrow" mode="aspectFit" />
                    </div>
                </div>
            </div>
            <div class="grjj">
                <textarea
                    v-model="FD.contact_me"
                    :hidden="isShowScly"
                    :placeholder="grjjPlaceholder"
                ></textarea>
            </div>
            <div class="tyxy fx">
                <checkbox @click="onAgreeClick" :checked="true" color="#f30719" />
                <div class="wb fx">
                    同意
                    <a href="../web/main?src=appShare/advJoinRule" class="blue">《认证用户须知》</a>
                </div>
            </div>
            <div>
                <button class="nextBtn" @click="next">下一步</button>
            </div>
        </div>
        <van-popup :show="isShowScly" position="bottom">
            <div class="xzscly">
                <div class="title fx">
                    <div class="fx1"></div>
                    <button class="ok" @click="cancel">确定</button>
                </div>
                <div class="bt">擅长领域（最多可选三项）</div>
                <div class="group fx">
                    <button
                        v-for="scly in sclyList"
                        @click="onCheckedScly(scly)"
                        :key="scly.id"
                        class="item"
                        :class="{active:scly.active}"
                    >{{scly.name}}</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>


<script>

import $ from '@/common'
import initAdviserDetail from '@/initAdviserDetail'


export default {
    name: 'app',
    data() {
        return {
            isLoaded: false,
            isAgree: true,
            isShowScly: false,
            index: 0,
            FD: {
                step_status: 3,
                consult_pay: '',
                online_pay: '',
                tags: [],
                contact_me: ''
            },
            sclyCheckedNum: 0,
            sclyChecked: [],
            sclyList: [
                {
                    id: '0',
                    name: '工商咨询',
                    active: false,
                },
                {
                    id: '1',
                    name: '财税咨询',
                    active: false,
                },
                {
                    id: '2',
                    name: '审计咨询',
                    active: false,
                },
                {
                    id: '3',
                    name: '知识产权',
                    active: false,
                },
                {
                    id: '4',
                    name: '政府补贴',
                    active: false,
                },
                {
                    id: '5',
                    name: '其他咨询',
                    active: false,
                }
            ],
            requiredSend: [
                {
                    name: 'consult_pay',
                    tip: '请填写图文咨询费'
                },
                {
                    name: 'online_pay',
                    tip: '请填写在线咨询费'
                },
                {
                    name: 'tags',
                    tip: '请选择擅长领域'
                },
                {
                    name: 'contact_me',
                    tip: '请填写个人简介'
                },
            ]
        }
    },
    computed: {
        winHeight() {
            return $.winHeight
        },
        add() {
            return $.$img("joinStep2/add.png")
        },
        arrow() {
            return $.$img("icons/arrow.png")
        },
        grjjPlaceholder() {
            let v = '详细的个人简介有助于用户了解您的专业性（18-150字）'
            if (this.isShowScly) {
                v = ''
            }
            return v
        }

    },
    components: {
    },
    onLoad() {

        //初始化顾问数据
        initAdviserDetail(this, res => {
            this.isLoaded = true
            {
                let { tags } = res
                tags = tags.filter(ele => ele !== '' || ele !== '无')
                tags.forEach(ele => {
                    this.sclyList.forEach(scly => {
                        if (scly.name == ele) {
                            scly.active = true
                        }
                    })
                })
                this.sclyCheckedNum = tags.length
                this.sclyChecked = tags
            }
        })



    },
    methods: {
        cancel() {
            this.isShowScly = false
        },
        onCheckedScly(item) {
            if (item.active) {
                item.active = false
                this.sclyCheckedNum--
                this.sclyChecked.splice(this.sclyChecked.indexOf(item.id), 1)
            } else {
                if (this.sclyCheckedNum === 3) {
                    $.tip('最多只能选三项')
                    return
                }
                item.active = true
                this.sclyCheckedNum++
                this.sclyChecked.push(item.name)

            }
            this.$set(this.FD, 'tags', this.sclyChecked)

        },
        onSclyClick() {
            this.isShowScly = true
        },
        onAgreeClick() {
            this.isAgree = !this.isAgree
        },
        next() {
            let req = this.requiredSend
            let F = this.FD
            let ok = false
            let srcDefault = $.$img("joinStep1/face.png")
            if (!this.isAgree) {
                $.tip('请同意《认证用户须知》')
                return
            }

            for (let i of req) {
                let name = i.name
                if (F[name] == '' || F[name] == undefined || F[name] == [] || F[name] == srcDefault) {
                    $.tip(i.tip)
                    ok = false
                    return
                } else {
                    ok = true
                }
            }



            if (!ok) {
                return
            }


            $.np('registerStepRegister', F, res => {
                let url = $.pageUrl('joinStep4') + '?id=' + res.id
                $.go(url)
            })
        }
    },

}
</script>

<style lang="less" scoped>
@import "../../less/common.less";
@import "./main.less";
</style>
