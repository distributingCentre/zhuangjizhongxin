const baseUrl = getApp().globalData.baseUrl
const initSign = getApp().globalData.initSign
Page({
    data: {
        currentNav: 'zixun',
        page: 1,
        pagesize: 10,
        zixunData: null,
        shopList: null,
        noreMore: false
    },
    newsDetail: function() {
        swan.navigateTo({
            url: '/pages/newsDetail/newsDetail',
            success: function(res) {
                console.log(res);
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },
    // 进店
    linkToShop: function(event) {
        var shop_id = event.currentTarget.dataset.id
        swan.setStorageSync('shop_id', shop_id);
        swan.navigateTo({
            url: '/pages/host/host'
        })
    },

    // 导航切换
    toggleNav: function(event) {
        // 隐藏暂无更多数据
        this.setData({ noMore: false })
        // 导航样式切换
        var currentNav = event.currentTarget.dataset.nav
        this.setData({ currentNav: currentNav })
        // 初始化page

        this.data.page = 1
        var page = this.data.page
        var pagesize = this.data.pagesize
        var _this = this

        // 根据当前导航项请求相应数据
        if (currentNav == 'haodian') {
            this.haodianRequest(page, pagesize, _this, false)
        } else if (currentNav == 'zixun') {
            this.zixunRequest(page, pagesize, _this, false)
        }
    },
    // 好店数据请求方法
    haodianRequest: function(page, pagesize, _this, isReachBottom) {
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }

        swan.request({
            url: baseUrl + 'api/shop/shoplist',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                page: page,
                pagesize: pagesize
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                if (res.data.status == 1) {
                    var data = res.data.data
                    if (data.length < pagesize) {
                        _this.setData({ noMore: true })
                    }
                    if (isReachBottom) {
                        var shopList = _this.data.shopList
                        var newShopList = shopList.concat(data)
                        _this.setData({ shopList: newShopList })
                    } else {
                        _this.setData({ shopList: data })
                    }
                }
            },
            fail: function(res) {}
        });

    },

    // 资讯数据请求方法
    zixunRequest: function(page, pagesize, _this, isReachBottom) {
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }
        swan.request({
            url: baseUrl + 'api/news/lists',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                page: page,
                pagesize: pagesize
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    var data = res.data.data
                    if (data.length < pagesize) {
                        _this.setData({ noMore: true })
                    }
                    if (isReachBottom) {
                        var zixunData = _this.data.zixunData
                        var newZixunData = zixunData.concat(data)
                        _this.setData({ zixunData: newZixunData })
                    } else {
                        _this.setData({ zixunData: data })
                    }

                }
            },
            fail: function(res) {}
        });
    },
    onLoad: function() {
        console.log('onLoad')
        var currentNav = swan.getStorageSync('spotNav');
        console.log(currentNav)
        this.data.page = 1
        var page = this.data.page
        var pagesize = this.data.pagesize
        var _this = this
        if (currentNav == 'haodian') {
            this.setData({ currentNav: currentNav })
            this.haodianRequest(page, pagesize, _this, false)
            swan.removeStorageSync('spotNav');
        } else {
            this.zixunRequest(page, pagesize, _this, false)
        }

    },
    onReachBottom: function() {
        console.log('到达底部')
        var page = this.data.page
        var pagesize = this.data.pagesize
        var currentNav = this.data.currentNav
        var _this = this
        page++
        if (currentNav == 'zixun') {
            this.zixunRequest(page, pagesize, _this, true)
        } else if (currentNav == 'haodian') {
            this.haodianRequest(page, pagesize, _this, true)
        }
        this.data.page = page
    }
})