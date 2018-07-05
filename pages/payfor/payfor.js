//获取应用实
var app = getApp()
var API_URL = app.globalData.payment
var API_URLS = app.globalData.checkOrder
Page({
    data: {
        userInfo: null,
        editActive: false,
        title: '',
        editTarget: '',
        // 订单号
        orderNumber: null
    },
    onLoad: function(options) {
        console.log(options)
        var orderNumber = options.data
        this.data.orderNumber = orderNumber
    },
    btnPay: function(res) {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var data = {
            uid: uid,
            login_sign: login_sign,
            order_sns: this.data.orderNumber
        }
        swan.request({
            url: API_URL,
            data: data,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res)

                if (res.data.status == 1) {
                    console.log('ok')
                    var data = res.data.data.code
                    console.log(res.data.data.code)
                    var order_sn = res.data.data.order_sn
                    swan.requestAliPayment({
                        orderInfo: data,

                        success(res) {
                            swan.request({
                                url: API_URLS,
                                data: {
                                    uid: uid,
                                    login_sign: login_sign,
                                    order_sn: order_sn
                                },
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                method: 'POST',
                                success: function(res) {
                                    var code = res.data.data.code
                                    code = parseInt(code)
                                    if (code === 1) {
                                        swan.showToast({
                                            title: '支付成功',
                                            icon: 'success',
                                            duration: 2000,
                                            mask: true,
                                            success: function(res) {
                                                swan.reLaunch({
                                                    url: '/pages/order/order?index=1'
                                                })
                                            }
                                        })
                                    } else if (code === 0) {
                                        swan.showToast({
                                            title: '支付失败',
                                            icon: 'success'
                                        })
                                    }
                                },
                                fail: function(params) {
                                    swan.showModal({
                                        title: '提示',
                                        content: '支付失败',
                                        showCancel: false,
                                        cancelColor: '#999999',
                                        confirmColor: '#0099cc',
                                        success: function(res) {

                                        },
                                        fail: function(res) {
                                            console.log(res)
                                        }
                                    })
                                }
                            })
                        },
                        fail(err) {
                            swan.showToast({
                                title: '支付失败'
                            })
                        }
                    })
                } else {
                    var msg = res.data.msg
                    console.log(res)
                    swan.showToast({
                        title: msg,
                        icon: 'normal',
                        duration: 1000,
                        success: function(res) {
                            console.log(res);
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    });
                }
             },
            //错误处理
            fail: function(params) {
                swan.showModal({
                    title: '提示',
                    content: '失败',
                    showCancel: false,
                    cancelColor: '#999999',
                    confirmColor: '#0099cc',
                    success: function(res) {

                    },
                    fail: function(res) {
                        console.log(res)
                    }
                })
            }
        })
    }
})