const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        // 店铺信息
        shop: {},
        // 产品列表
        goodsList: [],
        goodsCate: [],
        catIsActive: false,
        paramers: {
            page: 1,
            type: 2, // 1->价格升序； 2->价格降序；3->销量升序； 4->销量降序
            shop_id: null,
            level: null,
            cid: null,
            goods_name: ''
        },
        isMore: true
    },



    // 页面加载完毕获取首页数据
    onShow: function() {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        if (!uid) {
            uid = 0
        }
        if (!login_sign) {
            login_sign = 'REjZR2iCbWwhyLt6ck7C'
        }
        var shop_id = swan.getStorageSync('shop_id')
        console.log(shop_id)
        if (shop_id == 1 || shop_id == '') {
            var params = {
                uid: uid,
                login_sign: login_sign
            }
        } else {
            var params = {
                uid: uid,
                login_sign: login_sign,
                shop_id: shop_id
            }
            swan.removeStorage({
                key: 'shop_id',
                success: function(res) {
                    console.log('移除成功！')
                }
            })
        }

        var _this = this
        swan.request({
            url: baseUrl + 'api/shop/lists',
            method: 'POST',
            dataType: 'json',
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res)
                // _this.data.goodsList = res.data.data
                _this.setData({ goodsList: res.data.data })
                // _this.data.shop = res.data.shop
                _this.setData({ shop: res.data.shop })
                // _this.data.goodsCate = res.data.goods_cate
                _this.setData({ goodsCate: res.data.goods_cate })
                _this.data.paramers.shop_id = res.data.shop.id
                _this.data.paramers.cid = res.data.goods_cate[0].cid
                swan.hideLoading()
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },

    // 显示和隐藏分类筛选
    sortByCat: function() {
        this.setData({ catIsActive: !this.data.catIsActive })
    },
    cidSelected: function(event) {
        var cid = event.currentTarget.dataset.cid
        // 更新已选参数
        this.data.paramers.cid = cid
        // 更新视图
        this.setData({ paramers: this.data.paramers })
    },
    levelSelected: function(event) {
        var level = parseInt(event.currentTarget.dataset.level)
        this.data.paramers.level = level
        // 更新视图
        this.setData({ paramers: this.data.paramers })
    },
    searchGoods: function() {
        // 隐藏分类模态框
        this.setData({ catIsActive: false, isMore: true })
        // 发送请求更新GoodsList和视图
        this.data.paramers.page = 1
        var uid = swan.getStorage('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorage('sign')
        if (!login_sign) {
            login_sign = 'REjZR2iCbWwhyLt6ck7C'
        }
        this.data.paramers.uid = uid,
            this.data.paramers.login_sign = login_sign
        var _this = this
        swan.request({
            url: baseUrl + 'api/shop/lists', //开发者服务器接口地址
            method: 'POST',
            data: this.data.paramers,
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                _this.setData({
                    goodsList: res.data.data
                })
            },
            fail: function(res) {
                console.log(res);
            }
        })

    },
    sortByValume: function() {
        console.log('销量排序')
        var uid = swan.getStorage('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorage('sign')
        if (!login_sign) {
            login_sign = 'REjZR2iCbWwhyLt6ck7C'
        }
        this.data.paramers.uid = uid,
            this.data.paramers.login_sign = login_sign
        this.data.paramers.page = 1
        this.data.paramers.type = this.data.paramers.type == 4 ? 3 : 4
        this.setData({ paramers: this.data.paramers, isMore: true })
        var _this = this
        swan.request({
            url: baseUrl + 'api/shop/lists', //开发者服务器接口地址
            method: 'POST',
            data: this.data.paramers,
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res);
                _this.setData({
                    goodsList: res.data.data
                })
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },
    sortByPrice: function() {
        var uid = swan.getStorage('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorage('sign')
        if (!login_sign) {
            login_sign = 'REjZR2iCbWwhyLt6ck7C'
        }
        this.data.paramers.uid = uid,
            this.data.paramers.login_sign = login_sign
        this.data.paramers.page = 1
        this.data.paramers.type = this.data.paramers.type == 2 ? 1 : 2
        this.setData({ paramers: this.data.paramers, isMore: true })
        var _this = this
        swan.request({
            url: baseUrl + 'api/shop/lists', //开发者服务器接口地址
            method: 'POST',
            data: this.data.paramers,
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res);
                _this.setData({
                    goodsList: res.data.data
                })
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },
    // 上拉触底
    onReachBottom: function() {
        var uid = swan.getStorage('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorage('sign')
        if (!login_sign) {
            login_sign = 'REjZR2iCbWwhyLt6ck7C'
        }
        this.data.paramers.page++
            this.data.paramers.uid = uid,
            this.data.paramers.login_sign = login_sign
        console.log(this.data.paramers)
        console.log(this.data.paramers.page)
        var _this = this
        swan.request({
            url: baseUrl + 'api/shop/lists', //开发者服务器接口地址
            method: 'POST',
            data: _this.data.paramers,
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res.data.data.length)
                if (res.data.data.length !== 0) {
                    _this.data.goodsList = _this.data.goodsList.concat(res.data.data)
                    _this.setData({ goodsList: _this.data.goodsList })
                } else {
                    _this.setData({ isMore: false })
                }

            },
            fail: function(res) {
                console.log(res);
            }
        })
    },
    linkToDiy: function(event) {
        var id = event.currentTarget.dataset.id
        var type = 'host'
        swan.setStorageSync('hostinfo', id + ',' + type);
        swan.switchTab({
            url: '/pages/diy/diy'
        })
    }

})