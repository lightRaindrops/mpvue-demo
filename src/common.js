import config from "./config";
const clone = require("clone");

let $ = {
    log: console.log,
    error: console.error,
    noop: () => {},
    $webBaseUrl: config.$webBaseUrl,
    userInfoOk: false,
    config: config,
    userInfo: {},
    getSessionNum: 0,
    userLogin(callbackFunc = $.noop) {
        let self = this;
        if ($.getSessionNum === 0) {
            $.getSessionNum++;

            wx.login({
                success(res) {
                    if (res.code) {
                        let url = self.baseUrl + "getSession";
                        self.post(
                            url, {
                                code: res.code
                            },
                            function (res) {
                                if (res.success) {
                                    $.isIndexRefresh = true;
                                    callbackFunc(res.data);
                                } else {
                                    if (res.msg) {
                                        wx.showToast({
                                            title: res.msg,
                                            icon: "none",
                                            duration: 2000
                                        });
                                    }
                                }
                            }
                        );
                    } else {
                        self.log("登录失败！" + res.errMsg);
                    }
                },
                complete() {
                    $.getSessionNum = 0;
                }
            });
        }
    },
    heartbeat() {
        let url = "/user/online";
        let session = $.getLocal("session");
        if (session) {
            $.log("开始发送心跳包");
            let timestamp = new Date().getTime();
            const md5 = require("md5");
            let signature = md5(timestamp + session);
            $.$np(url, {
                signature,
                timestamp
            });
        }
    },
    go(url) {
        wx.navigateTo({
            url: url
        });
    },
    goSelf(url) {
        wx.redirectTo({
            url: url
        });
    },
    back(num) {
        if (num == undefined) {
            num = 1;
        }
        wx.navigateBack({
            delta: num
        });
    },
    reLaunch(str) {
        wx.reLaunch({
            url: str
        });
    },
    toBr(str) {
        return str.replace(/\n/gm, "<br/>");
    },
    setLocal: wx.setStorageSync,
    getLocal: wx.getStorageSync,
    removeLocal: wx.removeStorageSync,
    setIsAdviser() {
        $.pp($.url("userCenterData"), function (res) {
            $.setLocal("isAdviser", res.isAdviser);
            $.setLocal("isAsk", res.isAsk);
            $.setLocal("isApplying", res.isApplying);
            $.lotteryNum = res.lotteryNum;
        });
    },
    async isLogin(yes = $.noop, no = $.noop) {
        let session = $.getLocal("session");
        let isLoginReturn = false;
        if (session) {
            await $.np("isLogin").then(res => {
                if (res.isLogin) {
                    yes();
                } else {
                    no();
                }
                isLoginReturn = res.isLogin;
            });
            return isLoginReturn;
        } else {
            no();
            return isLoginReturn;
        }
    },
    //如果未上传过头像，执行回调函数back1
    notFaceUploaded: (back1 = $.noop, back2 = $.noop) => {
        $.showLoading("请稍候");
        $.np("userCenterData").then(res => {
            $.hideLoading();
            let photo = res.userData.photo;
            if (photo == null || photo == "" || photo == undefined) {
                back1();
            } else {
                photo = String(photo);
                if (photo.includes("yonghu_d.png")) {
                    back1();
                } else {
                    back2();
                }
            }
        });
    },
    uploadUserInfo: (back = $.noop) => {
        if (!$.getLocal("session")) {
            back();
        }
        $.notFaceUploaded(
            () => {
                //如果获取到微信用户信息，则上传；
                $.showLoading("请稍候");

                wx.getUserInfo({
                    success: function (res) {
                        $.log(res);
                        $.log("拿到用户授权");
                        $.np("uploadUserInfo", res.userInfo).then(res => {
                            $.hideLoading();
                            back();
                        });
                    },
                    fail: function (res) {
                        $.log("未获取用户授权");
                        $.hideLoading();
                        back();
                    }
                });

                //超时跳转
                setTimeout(() => {
                    $.hideLoading();
                    back();
                }, 5000);
            },
            () => {
                back();
            }
        );
    },
    getUserInfo: function (e, k, s) {
        $.uploadUserInfo(() => {
            if (s === 1) {
                wx.switchTab({
                    url: "../" + k + "/main"
                });
            } else {
                $.go("../" + k + "/main");
            }
        });
    },
    goTop() {
        wx.pageScrollTo({
            scrollTop: 0
        });
    },
    goBottom() {
        let height = $.winHeight;
        wx.pageScrollTo({
            scrollTop: height * 10000
        });
    },
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().windowHeight,
    pixelRatio: wx.getSystemInfoSync().pixelRatio,
    winWidth: wx.getSystemInfoSync().windowWidth,
    winHeight: wx.getSystemInfoSync().windowHeight,
    system: wx.getSystemInfoSync(),
    isIphone() {
        let phoneModel = wx.getSystemInfoSync().model;
        if (
            phoneModel.indexOf("iPhone") !== -1 ||
            phoneModel.indexOf("iphone") !== -1
        ) {
            return true;
        }
        return false;
    },
    isIphoneX() {
        let phoneModel = wx.getSystemInfoSync().model;
        if (
            phoneModel.indexOf("iPhone X") !== -1 ||
            phoneModel.indexOf("iPhone XR") !== -1 ||
            phoneModel.indexOf("iPhone XS") !== -1
        ) {
            return true;
        }
        if (
            phoneModel.indexOf("iPhone X") !== -1 ||
            phoneModel.indexOf("iPhone Xr") !== -1 ||
            phoneModel.indexOf("iPhone Xs") !== -1
        ) {
            return true;
        }

        return false;
    },
    footerHeight() {
        let val = 52;
        if (this.isIphoneX()) {
            val = 52 + 24;
        }
        return val;
    },
    post(url, data, sucFunc) {
        let sessionVal = this.getLocal("session");
        let sourceVal = "minWechat";

        if (arguments.length === 2) {
            sucFunc = data;
            data = {
                session: sessionVal,
                source: sourceVal
            };
        } else {
            data.session = sessionVal;
            data.source = sourceVal;
        }

        wx.request({
            url: url + "?v=2.0",
            data: data,
            method: "post",
            success: function (res) {
                if (res.data.code === 507) {
                    $.goSelf("/pages/userLogin/main");
                    return;
                }
                sucFunc(res.data); // 服务器回包信息
            }
        });
    },
    async pp(url, data, sucFunc) {
        let sessionVal = this.getLocal("session");
        let sourceVal = "minWechat";
        let oldUrl = url;
        let method = "post";

        //测试
        if (config.$session) {
            sessionVal = config.$session;
        }

        let header = {
            "content-type": "application/json"
        };

        if (url.includes("$$")) {
            //处理java请求
            let arr = url.split("$$");
            url = config.$javaBaseUrl + arr[1];
            if (arr.length == 3) {
                method = "get";
            }
            if (arr.length == 4) {
                method = "put";
            }
            header.session = sessionVal;
            header["api-client-platform"] = "wechat_applet";
            header["brand"] = $.system.brand + "-" + $.system.model;
            header["os-version"] = $.system.system;
            header["app-version"] = config.$version;
            header["source-type"] = "wechat_applet";
            header["device-type"] = $.isIphone() ? "ios" : "android";
        } else {
            //处理php请求
            url = url + "?v=2.0";
            if (arguments.length === 2 && typeof data == "function") {
                sucFunc = data;
                data = {
                    session: sessionVal,
                    source: sourceVal
                };
            } else {
                data.session = sessionVal;
                data.source = sourceVal;
            }
        }

        let res = await wx.pro.request({
            header: header,
            url: url,
            data: data,
            method: method
        });
        res = res.data;

        if (res.code === 507) {
            $.log(url);
            $.goSelf("/pages/userLogin/main");
            return;
        }

        if (res.success) {
            sucFunc(res.data);
            return (
                res.data || {
                    success: true
                }
            );
        } else if (res.code !== 507) {
            $.tip(res.msg);
            return {
                isError: true
            };
        }
    },
    async np(url, data = {}, sucFunc = $.noop) {
        let sessionVal = this.getLocal("session");
        let sourceVal = "minWechat";
        let oldUrl = url;
        let method = "post";

        //测试
        if (config.$session) {
            sessionVal = config.$session;
        }

        let header = {
            "content-type": "application/json"
        };

        //当url中包含header=form，则设置header
        if (url.split('#')[1] == 'header=form') {
            header = {
                "content-type": "application/x-www-form-urlencoded"
            }
            url = url.split('#')[0]
        }
        //end

        if (url.includes("$$")) {
            //处理java请求
            let arr = url.split("$$");
            url = config.$javaBaseUrl + arr[1];
            if (arr.length == 3) {
                method = "get";
            }
            if (arr.length == 4) {
                method = "put";
            }
            header.session = sessionVal;
            header["api-client-platform"] = "wechat_applet";
            header["brand"] = $.system.brand + "-" + $.system.model;
            header["os-version"] = $.system.system;
            header["app-version"] = config.$version;
            header["source-type"] = "wechat_applet";
            header["device-type"] = $.isIphone() ? "ios" : "android";
        } else {
            //处理php请求
            url = $.url(url) + "?v=2.0";
            if (arguments.length === 2 && typeof data == "function") {
                sucFunc = data;
                data = {
                    session: sessionVal,
                    source: sourceVal
                };
            } else {
                data.session = sessionVal;
                data.source = sourceVal;
            }
        }

        let res = await wx.pro.request({
            header: header,
            url: url,
            data: data,
            method: method
        });
        res = res.data;

        if (res.code === 507) {
            $.goSelf("/pages/userLogin/main");
            return;
        }
        if (res.success) {
            sucFunc(res.data);
            return (
                res.data || {
                    success: true
                }
            );
        } else if (res.code !== 507) {
            if (res.msg != "未登录") {
                if (!url.includes("/user/online")) {
                    $.tip(res.msg);
                }
            } else {
                if (res.code === 504) {
                    $.goSelf("/pages/userLogin/main");
                    return;
                }
                $.log("有一个异常---------返回数据--------");
                $.log(res);
            }

            return {
                isError: true,
                res: res
            };
        }
    },
    async $np(url, data = {}, back = $.noop) {
        return await $.np(`$$${url}`, data, back);
    },
    async $$np(url, data = {}) {
        return await $.np(`$$${url}$$`, data);
    },
    async $ng(url, data = {}) {
        return await $.np(`$$${url}$$`, data);
    },
    async $$put(url, data = {}) {
        return await $.np(`$$${url}$$'put'$$`, data);
    },
    /*获取当前页url*/
    getCurrentPageUrl() {
        var pages = getCurrentPages(); //获取加载的页面
        var currentPage = pages[pages.length - 1]; //获取当前页面的对象
        var options = currentPage.options;
        var optionsStr = "";
        Object.keys(options).forEach((ele, index) => {
            if (index == 0) {
                optionsStr = optionsStr + "?" + ele + "=" + options[ele];
            } else {
                optionsStr = optionsStr + "&" + ele + "=" + options[ele];
            }
        });
        var url = "/" + currentPage.route + optionsStr; //当前页面url
        return url;
    }
};

$.Promisify = function (fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                resolve(res);
            };
            obj.fail = function (res) {
                reject(res);
            };
            fn(obj);
        });
    };
};

$.$domain = config.$domain;
$.base = "https://" + $.$domain + "/qing/";
$.baseUrl = "https://" + $.$domain + "/api/mp/";
$.host = "https://" + $.$domain;

$.lotteryNum = 0;

$.isRefresh = false;
$.isIndexRefresh = false;
$.isUserCenterRefresh = false;

$.$currentTab = "";

$.imgOnline = config.$static + "qing/";

$.imgRoot = config.$static;

$.$img = str => {
    return config.$static + str + "?picRand=" + $.picRand + config.$picRand;
};

$.$go = str => {
    if (typeof str == "string") {
        if (str.includes("?")) {
            let a = str.split("?")[0];
            let b = str.split("?")[1];
            str = $.pageUrl(a) + "?" + b;
        } else {
            str = $.pageUrl(str);
        }
        wx.navigateTo({
            url: str
        });
    }
};

$.$goSelf = str => {
    if (typeof str == "string") {
        if (str.includes("?")) {
            let a = str.split("?")[0];
            let b = str.split("?")[1];
            str = $.pageUrl(a) + "?" + b;
        } else {
            str = $.pageUrl(str);
        }
        wx.redirectTo({
            url: str
        });
    }
};

$.$bg = str => {
    return (
        "background-image:url(" +
        $.$img(str) +
        "); background-repeat:no-repeat; background-position:center center; background-size:100% auto;"
    );
};

$.imgUrl = str => {
    return $.imgRoot + str + "?picRand=" + $.picRand + config.$picRand;
};

$.isPhone = function (str) {
    var phone_val = str;
    var reg = /^1[1|2|3|4|5|6|7|8|9]\d{9}$/;
    return reg.test(phone_val);
};

$.tip = function (str) {
    wx.showToast({
        title: str,
        icon: "none"
    });
};

$.suc = function (str) {
    wx.showToast({
        title: str,
        icon: "success"
    });
};

$.showLoading = function (str = "加载中") {
    wx.showLoading({
        title: str,
        mask: true
    });
    setTimeout(() => {
        wx.hideLoading();
    }, 20000);
};

$.hideLoading = function () {
    wx.hideLoading();
};

$.url = function (str) {
    return $.baseUrl + str;
};

$.pageUrl = function (str) {
    return "../" + str + "/main";
};

//获取手机号码

$.getTel = (fn = $.noop) => {
    $.np("userCenterData", res => {
        fn(res.userData.tel);
    });
};

//显示忽略字段
$.elliosisField = function (str, count) {
    if (str.length > count) {
        str = str.substring(0, count) + "...";
    }
    return str;
};

//判断字符串是否为json

$.isJSON = function (str) {
    if (typeof str == "string") {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == "object" && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log("error：" + str + "!!!" + e);
            return false;
        }
    }
    return false;
};

$.timeFormat = function (date, formatStr) {
    var zeroize = function (value, length) {
        if (!length) {
            length = 2;
        }
        value = new String(value);
        for (var i = 0, zeros = ""; i < length - value.length; i++) {
            zeros += "0";
        }
        return zeros + value;
    };
    return formatStr.replace(
        /"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g,
        function ($0) {
            switch ($0) {
            case "d":
                return date.getDate();
            case "dd":
                return zeroize(date.getDate());
            case "ddd":
                return ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"][
                    date.getDay()
                ];
            case "dddd":
                return [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ][date.getDay()];
            case "M":
                return date.getMonth() + 1;
            case "MM":
                return zeroize(date.getMonth() + 1);
            case "MMM":
                return [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ][date.getMonth()];
            case "MMMM":
                return [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ][date.getMonth()];
            case "yy":
                return new String(date.getFullYear()).substr(2);
            case "yyyy":
                return date.getFullYear();
            case "h":
                return date.getHours() % 12 || 12;
            case "hh":
                return zeroize(date.getHours() % 12 || 12);
            case "H":
                return date.getHours();
            case "HH":
                return zeroize(date.getHours());
            case "m":
                return date.getMinutes();
            case "mm":
                return zeroize(date.getMinutes());
            case "s":
                return date.getSeconds();
            case "ss":
                return zeroize(date.getSeconds());
            case "l":
                return date.getMilliseconds();
            case "ll":
                return zeroize(date.getMilliseconds());
            case "tt":
                return date.getHours() < 12 ? "am" : "pm";
            case "TT":
                return date.getHours() < 12 ? "AM" : "PM";
            }
        }
    );
};

$.xiaomeng = function () {
    $.log("isXiaomeng" + $.getLocal("isXiaomeng"));
    let openid = $.getLocal("openid");
    if (openid) {
        $.np("logXiaomeng", {
            openid: openid
        });
        wx.dsp.setOpenid(openid);
    }
};

$.dateLong2String = time => {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day;
};

$.clone = clone;

//公共全局变量
$.commonData = {
    // 个人资料-属性
    userInfoAttribute: null,
    certLevel: ""
};

//订单支付结果
$.currentOrderInfo = null

export default $;