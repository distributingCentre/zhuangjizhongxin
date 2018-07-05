/* globals Page */

App({
    // SWAN初始化
    onLaunch: function () {
         swan.setStorageSync('sign', 'REjZR2iCbWwhyLt6ck7C')
         // swan.clearStorageSync()
    },
    // SWAN从后台进入前台
    onShow: function () {

    },
    // SWAN从前台进入后台
    onHide: function () {

    },
    // 页面加载完成
    onLoad: function () {

    },
    // 页面渲染完成
    onReady: function () {

    },
    // 监听页面卸载
    onUnload: function () {
        swan.clearStorageSync()
    },
    globalData: {
        initSign: 'REjZR2iCbWwhyLt6ck7C',
        userInfo: 'user',
        baseUrl: 'https://api.diy.yxecg.com/',
        login: 'https://api.diy.yxecg.com/api/user/login',
        // login: 'http://192.168.199.154/api/user/login',
        setUserInfo: 'https://api.diy.yxecg.com/api/user/setUserInfo',
        payment: 'https://api.diy.yxecg.com/api/user/payment',
        checkOrder: 'https://api.diy.yxecg.com/api/user/checkOrder'
    }
})
