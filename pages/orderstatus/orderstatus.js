var baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        order: null,
        orderNumber: '',
        reasonData: ['我不想买了', '信息填写错误，重新拍', '卖家缺货', '付款遇到问题（如余额不足、不知道怎么付款）', '拍错了', '其他原因'],
        reasonValue: '',
        isCandel: false,
        drawbackName: '',
        drawbackAcount: '',
        isPay: false
    },
    // 取消订单时监听退款人姓名
    drawbackName: function(event) {
        console.log('username')
        var value = event.detail.value
        this.setData({ drawbackName: value })
    },
    // 取消订单时监听退款人支付宝账号
    drawbackAcount: function(event) {
        console.log('aliacount')
        var value = event.detail.value
        this.setData({ drawbackAcount: value })
    },
    // 公共获取订单详情的请求
    orderDetailHttp: function(_this, order_sn) {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        swan.request({
            url: baseUrl + 'api/myorder/details',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                order_sn: order_sn
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                    _this.data.order = res.data.data
                    _this.setData({ order: res.data.data })
                    console.log(_this.data.order)
                }
                swan.hideLoading()
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    onLoad: function(options) {
         swan.showLoading({
            title: '加载中',
            mask: 'false',
            success: function(res) {
                console.log(res);
            },
            fail: function(res) {
                console.log(res);
            }
        });
        console.log(options)
        // 获取订单编号
        var order_sn = options.order_sn
        // 保存当前订单编号用于支付
        this.data.orderNumber = order_sn
        console.log(order_sn)
        // 发送请求获取订单详情
        var _this = this
        this.orderDetailHttp(_this, order_sn)

    },
    // 去支付
    goPay: function() {
        console.log('ok')
        console.log(this.data.orderNumber)
        var orderNumber = this.data.orderNumber
        swan.navigateTo({
            url: '/pages/payfor/payfor?data=' + orderNumber
        })
    },

    // 未支付状态下取消订单
    cancelOrderNoPay: function() {
        console.log('未支付状态下取消订单')
        var _this = this
        swan.showModal({
            title: '取消订单？',
            content: '您确定取消该订单吗？',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    _this.setData({ reasonValue: _this.data.reasonData[0] })
                    _this.setData({ isCancel: true })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    bindReasonChange: function(event) {
        console.log(event)
        var index = event.detail.value
        var reasonValue = this.data.reasonData[index]
        this.setData({ reasonValue: reasonValue })
    },
    // 撤销取消订单
    noHandle: function() {
        // 回复默认取消订单的原因
        this.setData({ reasonValue: this.data.reasonData[0] })

        this.setData({ drawbackAcount: '' })
        this.setData({ drawbackName: '' })

        // 隐藏模态框
        this.setData({ isCancel: false })
    },
    // 确定取消订单
    confirmCandelOrder: function() {
        // 获取取消订单的原因
        var reason = this.data.reasonValue
        // 获取订单编号
        var order = this.data.orderNumber
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        // 获取订单支付状态
        var isPay = this.data.isPay
        var _this = this
        if (isPay == false) {
            var params = {
                uid: uid,
                login_sign: login_sign,
                order: order,
                reason: reason
            }
        } else if (isPay == true) {
            var name = this.data.drawbackName
            var alipay = this.data.drawbackAcount
            var params = {
                uid: uid,
                login_sign: login_sign,
                order: order,
                reason: reason,
                name: name,
                alipay: alipay
            }
        }

        swan.request({
            url: baseUrl + 'api/myorder/cancelOrder',
            method: 'POST',
            dataType: 'json',
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                    var msg = res.data.msg
                    swan.showToast({
                        title: msg,
                        icon: 'normal',
                        duration: 1000,
                        success: function(res) {

                            // 隐藏模态框 数据初始化
                            _this.setData({ isCancel: false })
                            _this.setData({ isPay: false })
                            _this.setData({ drawbackAcount: '' })
                            _this.setData({ drawbackName: '' })
                            _this.setData({ reasonValue: _this.data.reasonData[0] })

                            // 重新获取该订单详情
                            // 获取订单编号
                            var order_sn = _this.data.orderNumber
                            // 保存当前订单编号用于支付
                            _this.data.orderNumber = order_sn
                            console.log(order_sn)
                            // 发送请求获取订单详情
                            _this.orderDetailHttp(_this, order_sn)
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    });
                } else if (res.data.status == 0) {
                    var msg = res.data.msg
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
            fail: function(res) {
                console.log(res)
            }
        })
    },
    // 待发货状态下取消订单
    cancelOrder: function() {
        console.log('待发货状态下取消订单')

        var _this = this
        swan.showModal({
            title: '取消订单？',
            content: '您确定取消该订单吗？',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    // 弹出取消订单模态框
                    _this.setData({ isCancel: true })
                    // 初始化取消订单的原因
                    _this.setData({ reasonValue: _this.data.reasonData[0] })
                    // 初始化退款用户信息
                    _this.setData({ isPay: true })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 确认收获
    received: function() {
        console.log('确认收货')
        // 获取订单编号
        var order_sn = this.data.orderNumber
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/Myorder/confirmation',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                order_sn: order_sn
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                    var msg = res.data.msg
                    swan.showToast({
                        title: msg,
                        icon: 'normal',
                        duration: 1000,
                        success: function(res) {
                            // 发送请求获取订单详情
                            _this.orderDetailHttp(_this, order_sn)
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    });
                } else if (res.data.status == 0) {
                    var msg = res.data.msg
                    swan.showToast({
                        title: msg,
                        icon: 'normal',
                        duration: 2000,
                        success: function(res) {

                        },
                        fail: function(res) {

                        }
                    })
                }
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },

    // 再次购买
    buyAgain: function() {
        console.log('再次购买')
        var goods_info = this.data.order.goods_info
        swan.navigateTo({
            url: '/pages/orderdetail/orderdetail?goods_info=' + JSON.stringify(goods_info)
        })

    },

    // 去评价
    GoValue: function(event) {
        console.log('去评价')
        var id = event.currentTarget.dataset.id
        swan.navigateTo({
            url: '/pages/ordervalue/ordervalue?id=' + id
        })
    },

    // 删除订单
    delOrder: function() {
        console.log('删除订单')
        // 获取订单编号
        var order_sn = this.data.orderNumber
        swan.showModal({
            title: '提示',
            content: '确定删除该订单吗？',
            cancelColor: '#999999',
            confirmColor: '#0099cc',
            success: function(res) {
                if (res.confirm) {
                    console.log('确定')
                    var uid = swan.getStorageSync('uid')
                    var login_sign = swan.getStorageSync('sign')
                    swan.request({
                        url: baseUrl + 'api/Myorder/delOrder',
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            uid: uid,
                            login_sign: login_sign,
                            order_sn: order_sn
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            console.log(res);
                            if (res.data.status == 1) {
                                var msg = res.data.msg
                                swan.showToast({
                                    title: msg,
                                    icon: 'normal',
                                    duration: 1000,
                                    success: function(res) {
                                        swan.redirectTo({
                                            url: '/pages/order/order?index=1',
                                            success: function(res) {
                                                console.log(res);
                                            },
                                            fail: function(res) {
                                                console.log(res);
                                            }
                                        });
                                    },
                                    fail: function(res) {
                                        console.log(res);
                                    }
                                });
                            }
                        },
                        fail: function(res) {
                            console.log(res)
                        }
                    })

                } else if (res.cancel) {
                    console.log('取消')
                }
            },
            fail: function(res) {
                console.log(res);
            }
        });

    }
})