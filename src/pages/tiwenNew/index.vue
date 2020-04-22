<template>
    <div style="padding-bottom:250rpx;">
        <div class="title">
            <h2 class="txt">问题描述</h2>
            <div class="count">
                <i>{{ title.length }}</i>
                <span>/1000</span>
            </div>
        </div>
        <div class="textareaBox">
            <van-field
                class="tex"
                :value="title"
                maxlength="1000"
                type="textarea"
                :error="title.length > 500"
                @input="onInputBt"
                custom-style="height:320rpx; width:690rpx; margin:0 auto; margin-top:28rpx; background:#f5f5f5; line-height:1.2rem;"
                placeholder="描述您遇到的财税问题，表述越清楚，越容易获得满意答案(10个字以上)"
                placeholder-style="color:#999;"
                :border="false"
            ></van-field>
        </div>
        <div class="uploadWrap">
            <wux-upload
                listType="picture-card"
                :formData="formData"
                controlled
                :fileList="fileList"
                defaultFileType="image"
                max="6"
                count="6"
                :url="uploadUrl"
                @change="onChange"
                @complete="onComplete"
                @preview="onPreview"
                @remove="onRemove"
            >
                <img :src="image" class="image" mode="aspectFit" />
            </wux-upload>
        </div>

        <div class="xsBox" v-if="!isOneToOne">
            <div class="bt fx">
                选择悬赏算珠
            </div>
            <div class="items fx">
                <div
                    class="item"
                    :class="{ on: curXs == i }"
                    @click="onXsClick(i)"
                    v-for="i in xsList"
                    :key="i"
                >
                    {{ i }}
                </div>
            </div>
            <div class="custom fx">
                <div class="txt">自定义算珠数</div>
                <input
                    type="number"
                    @blur="onInputBlur"
                    maxlength="4"
                    v-model="customXs"
                    placeholder="请输入算珠数"
                />
            </div>
        </div>
        <div class="next">
            <button
                :class="canClick ? 'btn_next' : 'btn_not'"
                class="btn"
                @click="onNext"
            >
                提交问题
            </button>
        </div>
    </div>
</template>

<script>
import $ from "@/common";
import { log } from "util";
// 上传图片
let allUpload = [];
// 用户资料
let userData = {};

export default {
    data() {
        return {
            // // 顾问id
            // adviserId: 0,
            // textarea内容
            title: "",
            // // 是否一对一
            // isOneToOne: false,
            // types: [],
            // 需要的算珠
            curXs: null,
            // 自定义算珠
            customXs: null,
            // // 支付类型
            // payType: 2,
            // 上传地址
            uploadUrl: $.url("uploadFile"),
            // 已上传的文件列表
            fileList: [],
            // 算珠列表
            xsList: [20, 30, 50, 100, 200],
            // 当前选择的咨询类型
            curType: "",
            // HTTP 请求中其他额外的 form data
            formData: {
                session: $.getLocal("session")
            }
        };
    },
    computed: {
        // 上传文件图片
        image() {
            return $.$img("icons/image.png");
            // return $.$img('btn_next.png')
        },
        // 提交按钮能够被点击
        canClick() {
            return (
                this.title.length > 9 &&
                this.curType &&
                (this.customXs || this.curXs)
            );
        }
    },
    watch: {
        // 检测自定义算珠
        customXs(newVal, oldVal) {
            let num = this.customXs;
            if (!num) {
                return;
            }
            this.curXs = null;
            // this.customXs = num.replace(/\D/g, "")

            if (Number(num)) {
                this.customXs = Number(num);
            } else {
                $.tip("请输入正确算珠");
                return false;
            }
        }
    },
    methods: {
        // 自定义算珠输入框
        onInputBlur() {
            let num = this.customXs;
            if (num && num < 20) {
                $.tip("算珠最少20");
                return false;
            }
        },
        // 点击选择算珠
        onXsClick(ele) {
            this.curXs = ele;
            this.customXs = null;
        },
        // 文本框输入
        onInputBt(e) {
            // console.log(e);
            this.title = e.mp.detail;
        },
        // 上传文件改变
        onChange(e) {
            const { file, fileList } = e.mp.detail;

            this.fileList = fileList;

            if (file.status === "uploading") {
                $.showLoading();
            } else if (file.status === "done") {
                try {
                    let data = JSON.parse(file.res.data);
                    $.log(data);
                    if (!data.success) {
                        wx.showModal({
                            title: "提示",
                            content: data.msg,
                            success(res) {
                                if (res.confirm) {
                                    console.log("用户点击确定");
                                } else if (res.cancel) {
                                    console.log("用户点击取消");
                                }
                            }
                        });
                        this.fileList = allUpload;
                    } else {
                        file.url = data.data.src;
                        $.log(file);
                        allUpload.push(file);
                        this.fileList = allUpload;
                    }
                } catch (error) {
                    $.error(error);
                }
            }
        },
        // 点击删除图片
        onRemove(e) {
            let file = e.mp.detail.file;
            allUpload = allUpload.filter(n => n.uid !== file.uid);
            this.fileList = allUpload;
        },
        // 点击文件
        onPreview(e) {
            const { file, fileList } = e.mp.detail;

            wx.previewImage({
                current: file.url,
                urls: allUpload.map(n => n.url)
            });
        },
        // 上传完成
        onComplete(e) {
            $.hideLoading();
        },
        // 点击提交问题
        async onNext() {
            if (this.title) {
                if (this.title.length < 10) {
                    $.tip("问题内容至少10个字");
                    return false;
                }
            }

            if (this.title == "") {
                $.tip("请输入您的问题");
                return false;
            }

            let sz = this.curXs || this.customXs;
            if (!sz) {
                $.tip("请选择悬赏算珠");
                return false;
            } else {
                if (this.customXs < 20 && !this.curXs) {
                    $.tip("算珠最少20");
                    return false;
                }
            }

            if (!this.curType) {
                $.tip("请选择咨询类型");
                return false;
            }

            let files = [];
            let fileList = this.fileList;

            fileList.forEach(ele => {
                let uid = ele.uid;
                let arr = allUpload.filter(e => e.uid == uid);
                let data = JSON.parse(arr[0].res.data);
                let src = data.data.src;
                files.push(src);
            });

            {
                let data = {
                    title: this.title,
                    imgPath: files,
                    type: this.curType,
                    // pay_type: this.payType,
                    reward: this.customXs || this.curXs,
                    //
                    questionType: 1,
                    // adviser: this.adviserId
                    isAnonymous: 0
                };

                //如果提问类型为一对一

                // if (this.isOneToOne) {
                //     $.log("现在是一对一咨询");
                //     data.question_type = 2;
                //     if (data.intro == "") {
                //         data.intro = "如题";
                //     }
                //     $.setLocal("one-by-one-data", data);
                //     $.$go("pay?id=" + this.adviserId);
                // } else {
                // data.question_type = 1;
                // if (data.intro == "") {
                //     data.intro = "如题";
                // }
                //创建问题
                wx.showModal({
                    title: "",
                    content: "确认使用" + data.reward + "算珠支付",
                    success(res) {
                        if (res.confirm) {
                            if (userData.score < data.reward) {
                                wx.showModal({
                                    title: "算珠不足",
                                    content: "是否去任务中心赚取算珠",
                                    success(res) {
                                        if (res.confirm) {
                                            // let actPage = $.pageUrl(
                                            //     "activityCenter"
                                            // );
                                            $.goSelf("../taskCenter/main");
                                        } else {
                                            $.tip("创建问题失败");
                                            return false;
                                        }
                                    }
                                });
                            } else {
                                $.showLoading("请稍候");
                                $.$np(
                                    "/imconsult/question/createQuestion",
                                    data
                                ).then(res => {
                                    if (res.questionId) {
                                        let subData = {
                                            businessId: res.questionId,
                                            businessType: 1,
                                            payType: 4,
                                            totalTee: data.reward
                                        };

                                        $.$np(
                                            "/order/balancebead/payByBalanceAndBead",
                                            subData
                                        ).then(result => {
                                            if (result) {
                                                $.hideLoading();
                                                $.suc("提交成功");
                                                let pageUrl =
                                                    $.pageUrl("problemInfo") +
                                                    "?id=" +
                                                    res.questionId +
                                                    "&new=1";
                                                $.goSelf(pageUrl);
                                            }
                                        });
                                    }
                                    // //算珠跳转
                                    // $.suc("提交成功");
                                    // let pageUrl =
                                    //     $.pageUrl("problemInfo") +
                                    //     "?id=" +
                                    //     res.questionId +
                                    //     "&new=1";
                                    // $.goSelf(pageUrl);

                                    // else {
                                    //     //微信支付
                                    //     let wxData = JSON.parse(res);
                                    //     wx.requestPayment({
                                    //         timeStamp: wxData.timeStamp,
                                    //         nonceStr: wxData.nonceStr,
                                    //         package: wxData.package,
                                    //         signType: wxData.signType,
                                    //         paySign: wxData.paySign,
                                    //         success(res) {
                                    //             $.suc("支付成功");

                                    //             let pageUrl =
                                    //                 $.pageUrl(
                                    //                     "problemManagement"
                                    //                 ) + "?key=1";
                                    //             $.goSelf(pageUrl);
                                    //         },
                                    //         fail(res) {
                                    //             wx.showToast({
                                    //                 title: "支付失败",
                                    //                 icon: "none",
                                    //                 duration: 2000
                                    //             });
                                    //         }
                                    //     });
                                    // }
                                });
                            }
                        }
                    }
                });
                // }
            }
        }
    },
    // 进入页面触发
    async onLoad(options) {
        // console.log(o);
        // allUpload = [];
        // //查询是否为一对一咨询
        // this.isOneToOne = o.type == 1;
        // if (o.id) {
        //     this.adviserId = o.id;
        // }
        if (options.id) {
            this.curType = Number(options.id);
        }
        await $.$$np("/user/info/relevant").then(res => {
            if (res) {
                userData = res;
            }
        });
    }
};
</script>
<style lang="less">
@import "./main.less";
</style>
