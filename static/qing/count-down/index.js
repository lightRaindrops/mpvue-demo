Component({
    properties: {
        fantime: {
            type: String,
            value: ''
        }
    },
    data: {
        // 这里是一些组件内部数据
        someData: {},
        wearList: {}
    },
    methods: {
        // 这里是一个自定义方法
        customMethod() {}
    },
    ready() {
        let that = this;
        let dates = {
            datetime: [{
                dat: that.data.fantime
            }, ]
        }
        // console.log(this.data.fantime)

        let len = dates.datetime.length; //时间数据长度

        function nowTime() { //时间函数
            // console.log(a)
            for (var i = 0; i < len; i++) {
                var intDiff = dates.datetime[i].dat; //获取数据中的时间戳
                // console.log(intDiff)
                var day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0;
                if (intDiff > 0) { //转换时间
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                    if (hour <= 9) hour = '0' + hour;
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    dates.datetime[i].dat--;
                    var str = ''
                    if (day > 0) {
                        str = (Number(day * 24) + Number(hour)) + ':' + minute + ':' + second
                    } else {
                        str = hour + ':' + minute + ':' + second
                    }
                    // console.log(str)
                } else {
                    var str = "已结束！";
                    clearInterval(timer);
                }
                // console.log(str);
                dates.datetime[i].difftime = str; //在数据中添加difftime参数名，把时间放进去
            }
            that.setData({
                wearList: dates
            })
            // console.log(that)
        }

        nowTime();
        var timer = setInterval(nowTime, 1000);

    }
})