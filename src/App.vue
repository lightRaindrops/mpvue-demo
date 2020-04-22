<script>
import $ from '@/common'

export default {
    onLaunch(options) {
        console.log("[onLaunch] 场景值:", options.scene)
        $.log('app启动')

        //版本更新检测

        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        }


        //更新图片版本号

        {
            let url = $.url('config')
            $.pp(url, res => {
                $.picRand = res.picRand
            })
        }

        //发送心跳

        setInterval(() => {
            $.heartbeat()
        }, 1000 * 60 * 5)




        //保存是否为顾问

        $.isLogin(() => {
            $.setIsAdviser()
            let isAddParam = $.getLocal('isAddParam')

            if (options.scene == 1089 && !isAddParam) {
                let url = $.url('addParam')
                $.pp(url, function (res) {
                    $.setLocal('isAddParam', true)
                })
            }


            $.setLocal('isShowAddMyFavorites', true)
        })


    }

}
</script>

<style lang="less">
@import "./App.less";
</style>
