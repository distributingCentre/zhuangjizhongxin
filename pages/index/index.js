const baseUrl = getApp().globalData.baseUrl
const initSign = getApp().globalData.initSign
Page({
    data: {
        advList: null,
        goodsList: null,
        currentGoods: null,
        togglesParams: [],
        shopList: null,
        recNavId: 147,
        hasMessage: false,
        messageIndex: ''
    },
    // 更多好店
    moreShop: function() {
        console.log('前往更多好店')
        swan.setStorageSync('spotNav', 'haodian');
        swan.reLaunch({
            url: '/pages/spot/spot'
        });
    },
    viewMessage: function() {
        var index = this.data.messageIndex
        swan.navigateTo({
            url: '/pages/messages/messages?index=' + index
        })
    },

    diyConfig: function() {
        console.log('定制')
        console.log(this.data.currentGoods)
        var id = this.data.currentGoods.goods_id
        var type = 'host'
        swan.setStorageSync('hostinfo', id + ',' + type);
        swan.switchTab({
            url: '/pages/diy/diy'
        })
    },

    toggleGoods: function() {
        var type_id = this.data.recNavId
        var currentId = this.data.currentGoods.goods_id
        var params = this.data.togglesParams
        var index = params.indexOf(currentId)
        console.log(index)
        if (index == params.length - 1) {
            index = 0
        } else {
            index++
        }
        var id = params[index]
        // params.forEach(function (item,key) {

        // })
        console.log('换一个')
        console.log(this.data.currentGoods)
        console.log(this.data.togglesParams)
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }
        var _this = this
        swan.request({
            url: baseUrl + 'api/index/get_goods',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                id: id,
                cpu_type: type_id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    var result = res.data.data
                    var goodsList = []
                    result.data.forEach(function(item, key) {
                        if (key <= 5) {
                            goodsList.push(item)
                        }
                    })
                    _this.setData({ goodsList: goodsList })

                    var currentGoods = result.goods
                    _this.setData({ currentGoods: currentGoods })
                }
            },
            fail: function(res) {}
        });
    },

    toggleNav: function(event) {
        var type_id = event.currentTarget.dataset.typeId
        var id = 0

        this.setData({ recNavId: type_id })
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }
        var _this = this
        swan.request({
            url: baseUrl + 'api/index/get_goods',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                id: id,
                cpu_type: type_id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    var result = res.data.data
                    var goodsList = []
                    result.data.forEach(function(item, key) {
                        if (key <= 5) {
                            goodsList.push(item)
                        }
                    })
                    _this.setData({ goodsList: goodsList })

                    var currentGoods = result.goods
                    _this.setData({ currentGoods: currentGoods })

                    var togglesParams = []
                    result.goods_list.forEach(function(item) {
                        togglesParams.push(item.id)
                    })
                    _this.data.togglesParams = togglesParams
                }
            },
            fail: function(res) {}
        });
    },


    onShow: function() {
        // 判断是否有未读消息
        // 获取轮播图数据
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }
        var _this = this
        swan.request({
            url: baseUrl + 'api/index/hasMessage',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    _this.setData({ hasMessage: true })
                    var type = res.data.data.message
                    console.log(type)
                    if (type == 'orderMessage') {
                        _this.data.messageIndex = 3
                    } else if (type == 'sysMessage') {
                        _this.data.messageIndex = 1
                    } else {
                        _this.data.messageIndex = 2
                    }
                    console.log(_this.data.messageIndex)
                } else {
                    _this.setData({ hasMessage: false })
                }
            },
            fail: function(res) {
                console.log(res);
            }
        });
    },

    // 进店
    linkToShop: function (event) {
        var shop_id = event.currentTarget.dataset.id
        swan.setStorageSync('shop_id', shop_id);
        swan.navigateTo({
            url: '/pages/host/host'
        })
    },

    onLoad: function() {
        // 获取轮播图数据
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }
        var _this = this

        // 获取轮播图数据
        swan.request({
            url: baseUrl + 'api/index/advList',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    _this.setData({ advList: res.data.data })
                    console.log(_this.data.advList)
                }
            },
            fail: function(res) {
                console.log(res);
            }
        });

        // 获取快速推荐数据
        swan.request({
            url: baseUrl + 'api/index/get_goods',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                id: 0,
                cpu_type: 147
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    var result = res.data.data
                    var goodsList = []
                    result.data.forEach(function(item, key) {
                        if (key <= 5) {
                            goodsList.push(item)
                        }
                    })
                    _this.setData({ goodsList: goodsList })

                    var currentGoods = result.goods
                    _this.setData({ currentGoods: currentGoods })

                    var togglesParams = []
                    result.goods_list.forEach(function(item) {
                        togglesParams.push(item.id)
                    })
                    _this.data.togglesParams = togglesParams
                }
            },
            fail: function(res) {}
        });

        // 获取精选店铺数据

        swan.request({
            url: baseUrl + 'api/shop/shoplist',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                page: 1,
                pagesize: 3
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                if (res.data.status == 1) {
                    _this.setData({ shopList: res.data.data })
                    console.log(_this.data.shopList)
                }
            },
            fail: function(res) {}
        });
    }
})