var baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        navIndex: 1,
        shops: null,
        page: 1,
        pagesize: 10,
        isMore: true
    },
    // 跳转到订单详情页
    linkToOrderDetail: function(event) {
        console.log(event)
        var order_sn = event.currentTarget.dataset.orderSn
        swan.navigateTo({
            url: "/pages/orderstatus/orderstatus?order_sn=" + order_sn
        })
    },

    // 头部导航切换
    toggleNav: function(event) {
        swan.hideLoading()
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
        this.setData({ isMore: true })
        var index = event.currentTarget.dataset.type
        this.setData({ navIndex: index })
        this.data.page = 1
        this.data.isMore = true
        console.log(this.data.navIndex)
        if (index == 1) {
            // 获取全部数据
            this.httpRequest('myorder', 1, 10)
        } else if (index == 2) {
            // 获取待付款数据
            this.httpRequest('waitpayment', 1, 10)
        } else if (index == 3) {
            // 获取待收货数据
            this.httpRequest('waitreceive', 1, 10)
        } else if (index == 4) {
            // 获取待评价数据
            this.httpRequest('waitevaluate', 1, 10)
        }
    },

    // 自定义通用请求方法
    httpRequest: function(api, page, pagesize) {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/myorder/' + api,
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                page: page,
                pagesize: pagesize
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                    _this.data.shops = res.data.data
                    _this.setData({ shops: res.data.data })
                    if (res.data.data.length < _this.data.pagesize) {
                        _this.setData({ isMore: false })
                    }
                }
                swan.hideLoading()
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },

    // 页面加载初始化数据
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
        var index = options.index
        this.setData({ navIndex: index })
        if (index == 1) {

            // 获取全部订单数据
            this.httpRequest('myorder', 1, 10)
        } else if (index == 2) {
            // 获取待付款数据
            this.httpRequest('waitpayment', 1, 10)
        } else if (index == 3) {
            // 获取待收货数据
            this.httpRequest('waitreceive', 1, 10)
        }
        
    },

    // 自定义下拉处理请求方法
    reachBottomRequest: function(api, page, pagesize) {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/myorder/' + api,
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                page: page,
                pagesize: pagesize
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                    console.log('ok')
                    var data = res.data.data
                    var shops = _this.data.shops
                    var newShops = shops.concat(data)
                    _this.setData({ shops: newShops })

                    // 没有更多了
                    if (res.data.data.length < _this.data.pagesize) {
                        _this.setData({ isMore: false })
                    }
                }
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },

    // 下拉触底加载更多数据
    onReachBottom: function() {
        var index = this.data.navIndex
        if (index == 1) {
            var api = 'myorder'
        } else if (index == 2) {
            // 获取待付款数据
            var api = 'waitpayment'
        } else if (index == 3) {
            // 获取待收货数据
            var api = 'waitreceive'
        } else if (index == 4) {
            // 获取待评价数据
            var api = 'waitevaluate'
        }
        console.log(api)
        var page = this.data.page
        var pagesize = this.data.pagesize
        page += 1
        this.reachBottomRequest(api, page, pagesize)
        this.data.page = page
    },

    // // 去支付
    // goPay: function () {
    //     console.log('ok')
    //     swan.navigateTo({
    //         url: '/pages/payfor/payfor'
    //     })
    // },
    // // 待发货状态下取消订单
    // cancelOrder: function () {
    //     console.log('待发货状态下取消订单')
    // },
    // // 确认收获
    // received: function () {
    //     console.log('确认收货')
    // },

    // // 再次购买
    // buyAgain: function () {
    //     console.log('再次购买')
    // },

    // // 去评价
    // GoValue: function () {
    //     console.log('去评价')
    // }
})