const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        currentNav: 1,
        settingData: null,
        shopData: null,
        page: 1,
        pagesize: 10,
        activeId: null,
    },

    // 进入店铺详情页
    linkToShop: function(event) {
        var shop_id = event.currentTarget.dataset.shopId
        console.log(shop_id)
        swan.setStorageSync('shop_id', shop_id);
        swan.navigateTo({
            url: '/pages/host/host'
        })
    },
    goShop: function() {
        swan.setStorageSync('spotNav', 'haodian');
        swan.reLaunch({
            url: '/pages/spot/spot'
        });
    },
    // 配置收藏详细内容显示和隐藏
    toggle: function(event) {
        var id = event.currentTarget.dataset.id
        var currentId = this.data.activeId
        var targetId = currentId == id ? null : id
        this.setData({ activeId: targetId })
    },

    // 删除收藏配置
    delSetting: function(event) {
        var id = event.currentTarget.dataset.id
        // 获取uid和签名
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/user/delCollect',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                id: id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    var arr = _this.data.settingData
                    arr.forEach(function(item, key) {
                        if (item.id == id) {
                            arr.splice(key, 1)
                        }
                    })
                    _this.setData({ settingData: arr })
                    swan.showToast({
                        title: res.data.msg,
                        icon: 'normal',
                        duration: 1000,
                        success: function(res) {
                            console.log(res);
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    })
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })

    },

    // 收藏配置-->购买
    goBuy: function(event) {
        var id = event.currentTarget.dataset.did
        var type = 'settingStore'
        swan.setStorageSync('hostinfo', id + ',' + type)
        swan.switchTab({
            url: '/pages/diy/diy'
        })
    },

    // 获取配置收藏数据
    settingRequest: function(page, pagesize, _this) {
        // 获取uid和签名
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        swan.request({
            url: baseUrl + 'api/user/configCollect', //开发者服务器接口地址
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
                    var obj = res.data.data.list
                    obj.forEach(function(item) {
                        item.settings = []
                        Object.keys(item.goods_details).forEach(function(key) {
                            item.settings.push({ cat: key, title: item.goods_details[key] })
                        })
                    })

                    _this.setData({ settingData: obj })
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },

    // 获取店铺收藏数据
    shopRequest: function(page, pagesize, _this) {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        swan.request({
            url: baseUrl + 'api/user/shopCollect', //开发者服务器接口地址
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
                    console.log(res)
                    _this.setData({ shopData: res.data.data.list })
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },

    // 页面加载初始化数据
    onLoad: function(options) {
        console.log(options.index)
        var index = options.index
        this.setData({ currentNav: index })
        var page = this.data.page
        var pagesize = this.data.pagesize
        var _this = this

        if (index == 1) {
            this.settingRequest(page, pagesize, _this)
        } else if (index == 2) {
            this.shopRequest(page, pagesize, _this)

        }

    },

    // 删除店铺收藏
    delShop: function(event) {
        var id = event.currentTarget.dataset.id
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        console.log(id)
        swan.request({
            url: baseUrl + 'api/user/delCollect',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                id: id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    var arr = _this.data.shopData
                    console.log(arr)
                    arr.forEach(function(item, key) {
                        if (item.id == id) {
                            arr.splice(key, 1)
                        }
                    })
                    _this.setData({ shopData: arr })
                    swan.showToast({
                        title: res.data.msg,
                        icon: 'normal',
                        duration: 1000,
                        success: function(res) {
                            console.log(res);
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    })
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },
    // 头部导航切换
    changeNav: function(event) {
        // 导航切换
        var index = event.currentTarget.dataset.index
        this.setData({ currentNav: index })

        // 重置page、pagesize
        var page = 1
        var pagesize = this.data.pagesize
        var _this = this

        if (index == 1) {
            this.settingRequest(page, pagesize, _this)
        } else if (index == 2) {
            this.shopRequest(page, pagesize, _this)

        }

    },

    // 再去配置一个
    settingAgain: function() {
        swan.reLaunch({
            url: '/pages/diy/diy'
        })
    }
})