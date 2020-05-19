import config from "./config";

const $ = {
    log: console.log,
    error: console.error,
    noop: () => { },
    setLocal: wx.setStorageSync,
    getLocal: wx.getStorageSync,
    removeLocal: wx.removeStorageSync,
    clearLocal: wx.clearStorageSync,
    async request(url, data = {}, method) {
        let token = ''
        const personMsg = $.getLocal("personMsg")
        try {
            const msg = JSON.parse(personMsg)
            token = msg.token
        } catch (error) {
            if (personMsg) {
                $.log(error)
            }
        }
        let header = {
            "content-type": "application/x-www-form-urlencoded",
        }
        if (token) {
            header.token = token
        }
        url = config.$url + url

        let res = await $.promisify('request')({
            header: header,
            url: url,
            data: data,
            method: method
        });

        let statusCode = res.statusCode

        res = res.data
        if (res.success) {
            return (
                res.data || {
                    success: true
                }
            );
        } else {
            if (res.msg) {
                $.tip(res.msg)
            }

            return {
                isError: true,
                statusCode,
                res: res
            };
        }
    },
    async post(url, data = {}) {
        return await $.request(url, data, 'post')
    },
    async get(url, data = {}) {
        return await $.request(url, data, 'get')
    }
}

$.promisify = (api) => {
    return (args = {}) => {
        return new Promise((resolve, reject) => {
            api({
                fail: reject,
                success: resolve,
                ...args,
            })
        })
    }
}


$.$domain = config.$domain;

$.$img = str => {
    return config.$static + str + "?picRand=" + config.$picRand;
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

$.$goBack = () => {
    wx.navigateBack({
        delta: 1
    })
}

$.$bg = str => {
    return (
        "background-image:url(" +
        $.$img(str) +
        "); background-repeat:no-repeat; background-position:center center; background-size:100% auto;"
    );
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

$.isIphoneX = () => {
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
}

$.date2String = time => {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day;
};

export default $;