//取得小数基数
let BN = (num = 0) => {
    return Number(num)
}

//科学计数法转换
function toNonExponential(num) {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

let getNum = (a, b) => {
    try {
        a = a.toString().split(".")[1].length
    } catch (e) {
        try {
            a = toNonExponential(a).split(".")[1].length
        } catch (e) {
            a = 0
        }
    }
    try {
        b = b.toString().split(".")[1].length
    } catch (e) {
        try {
            b = toNonExponential(b).split(".")[1].length
        } catch (e) {
            b = 0
        }
    }

    return Math.pow(10, Math.max(a, b))
}

Number.prototype.plus = function (arg) {
    let m = getNum(arg, this)
    return (arg * m + this * m) / m
}
Number.prototype.mins = function (arg) {
    let m = getNum(arg, this)
    return (this * m - arg * m) / m
}

Number.prototype.times = function (arg) {
    let m = getNum(arg, this)
    let res = 0
    for (let i = 0; i < arg * m; i++) {
        res = res.plus(this)
    }
    return res / m
}

Number.prototype.div = function (arg) {
    let m = getNum(arg, this)
    let n = 10000
    let a = this * m * n
    let b = arg * m * n
    return a / b
}

export default BN