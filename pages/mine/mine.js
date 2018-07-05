var baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        options: null,
        userData: null,
        userInfo: null,
    },
    linkTo: function(event) {
        var parameter = event.currentTarget.dataset.parameter
        swan.navigateTo({
            url: '/pages/order/order?index=' + parameter,
            success: function(res) {
                // console.log('111');
            },
            fail: function(res) {
                // console.log(res);
            }
        });
    },
    setting: function() {
        console.log('go setting')
        swan.navigateTo({
            url: '/pages/setting/setting'
        })
    },

    addshop: function () {
        swan.navigateTo({
            url: '/pages/addshop/addshop'
        })
    },
    onLoad: function() {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        // 未登录
        if (!uid) {
            // 如果未登录跳转到登录页
            swan.navigateTo({
                url: '/pages/login/login'
            })
        }
    },
    onShow: function() {
        console.log('onShow')
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var userInfo = swan.getStorageSync('userInfo')
        this.setData({userInfo: userInfo})
        console.log(userInfo)
        var _this = this        
        swan.request({
            url: baseUrl + 'api/user/userlist',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    _this.setData({userData: res.data.data})
                }
            }
        })
    },
    viewMessage: function (event) {
        console.log(event.currentTarget.dataset)
        var index = event.currentTarget.dataset.index
        swan.navigateTo({
            url: '/pages/messages/messages?index='+index
        })
    }
})