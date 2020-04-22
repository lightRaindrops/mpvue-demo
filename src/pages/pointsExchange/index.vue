<template>
    <div class="pointsExchangeBox">
        <div class="top fx">
            <div class="img fx4">
                <img :src="info.pic" mode="widthFix" alt>
            </div>
            <div class="fx6">
                <div class="title">{{info.name}}</div>
                <div class="scjg">市场价格 ¥{{info.market_price}}</div>
                <div class="jf fx">
                    <img :src="szSrc" mode="widthFix" class="icon" alt>
                    {{info.point}}
                </div>
            </div>
        </div>
        <div class="xqsm">
            <div class="title">详情说明</div>
            <div class="info">
                <rich-text :nodes="ruleHtml"></rich-text>
            </div>
        </div>
        <div class="txxx">
            <div class="title">填写信息</div>
            <div class="info">
                <div class="line">
                    <van-field
                        :value="contact_phone"
                        @input="onInput($event,'contact_phone')"
                        type="number"
                        :border="false"
                        label="联系电话："
                        clearable
                    />
                </div>
                <div class="line">
                    <van-field
                        :value="contact_name"
                        @input="onInput($event,'contact_name')"
                        :border="false"
                        label="收件人姓名："
                        clearable
                    />
                </div>
                <div class="line">
                    <van-field
                        :value="address"
                        @input="onInput($event,'address')"
                        :border="false"
                        label="收件地址："
                        clearable
                    />
                </div>
                <div class="line">
                    <van-field
                        placeholder="请填写您选择的物品型号"
                        :value="remarks"
                        @input="onInput($event,'remarks')"
                        :border="false"
                        label="备注："
                        clearable
                    />
                </div>
            </div>
            <button class="button" @click="onSubmit" :loading="isSubmiting" :disabled="isSubmiting">确认兑换</button>
        </div>
    </div>
</template>

<script>
import $ from '@/common'
import { setTimeout } from 'timers';

let initData = () => {
    return {
        info: {},
        ruleHtml: '',
        productId: '',
        contact_phone: '',
        contact_name: '',
        address: '',
        remarks: '',
        isSubmiting:false
    }
}


export default {
    name: 'app',
    data() {
        return initData()
    },
    computed: {
        szSrc() {
            return $.imgUrl('qing/img/icon-sz.png')
        }
    },
    components: {
    },
    methods: {
        onInput(e, i) {
            let v = e.mp.detail
            this[i] = v
        },
        onSubmit() {
            let url = $.url('exchangePointProduct')
            let { productId, contact_phone, contact_name, address, remarks } = this
            let data = [contact_phone, contact_name, address]
            let tip = ['请输入联系电话', '请输入收件人姓名', '请输入收件地址']
            let isOk = true
            let eData = data.entries()
            for (let [i, n] of eData) {
                if (n == '') {
                    $.tip(tip[i])
                    isOk = false
                    break
                }
            }


            if (!isOk) {
                return
            }

            let sendData = { productId, contact_phone, contact_name, address, remarks }
            this.isSubmiting = true
            $.post(url, sendData, res => {
                if(res.success){
                    $.suc('提交成功')
                    setTimeout(() => {
                        $.back()
                    }, 1000)
                    setTimeout(() => {
                        this.isSubmiting = false
                    }, 3000)
                }else{
                    $.tip(res.msg)
                    this.isSubmiting = false
                }

            })
        }
    },
    onLoad(o) {
        let url = $.url('getPointProductDetail')
        this.productId = o.id
        $.pp(url, { productId: o.id }, res => {
            this.info = res.info
            let rule = res.rule
            let html = ''
            rule.forEach(n => {
                html = html + n + '<br>'
            });
            this.ruleHtml = html
        })
    },
    onUnload() {
        let data = initData()
        for (let key in data) {
            this[key] = data[key]
        }
    }
}
</script>

<style lang="less">
@import "./main.less";
</style>
