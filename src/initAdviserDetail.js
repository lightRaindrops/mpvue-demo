import $ from '@/common'
export default (t, fn = $.noop) => {
    $.showLoading()
    $.np('getAdviserInfo', res => {
        if (!res) {
            $.hideLoading()
            return
        }
        let F = t.FD
        Object.keys(F).forEach(ele => {
            let v = res[ele]
            if (ele == 'step_status') {
                return
            }
            if (ele == 'sex') {
                v = v.toString()
            }
            if (ele == 'cpa_type') {
                v = Number(v)
                $.log(v)
            }

            if (v) {
                $.log(v)
                $.log(typeof v)
                if (typeof v == 'string' && v.includes('static.cgkc.com/img/yonghu_d.png')) {
                    v = ''
                }
                t.$set(F, ele, v)
            }
        })
        $.hideLoading()
        fn(res)
    })
}