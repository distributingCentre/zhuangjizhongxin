const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
    	order: null
    },
    goValue: function (event) {
    	var id = event.currentTarget.dataset.id
    	swan.navigateTo({
    		url: '/pages/comment/comment?id='+id
    	})
    },
    onLoad: function(options) {
        console.log(options)
        var id = options.id
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/Myorder/evaluationOrders',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                order_id: id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                	_this.setData({order: res.data.data})
                }
            },
            fail: function(res) {
                console.log(res)
            }
        })
    }
})