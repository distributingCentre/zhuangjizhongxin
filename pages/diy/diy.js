const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        // 基础配置
        chassis: [],
        // 软件配件
        system: [],
        // 服务支持
        guarantee: [],
        /* 初始化DIY选项 */

        // DIY 产品类型
        currentAlias: 'chassis',

        // 默认选中分类
        goodsCateId: null,

        // 默认当前页面选中的商品id
        currentSelectedId: 0,

        // 基础配件状态下当前选中分类的别名
        uniqueAlias: '',

        // 初始化产品列表
        goods: {}, //包含data 和 attr 
        goodsAttr: null,

        // 筛选状态存储
        filterObj: {
            chassis: {

            },
            system: {

            },
            guarantee: {

            }

        },
        // 所有已选商品ID
        selectedId: {},
        selectedPrice: {},
        url: {
            chassis: {
                base: baseUrl + 'diysearch/ajax_get_data/',
                cid: 0,
                attrids: [],
                bid: 0,
                level: 0,
                selectid: {
                    chassis: 0,
                    cpu: 0,
                    radiator: 0,
                    board: 0,
                    video: 0,
                    memory: 0,
                    ssd: 0,
                    harddisk: 0,
                    power: 0
                }
            },
            system: {
                base: baseUrl + 'diysearch/ajax_get_data/',
                cid: 0,
                attrids: [],
                bid: 0,
                level: 0,
                selectid: {
                    chassis: 0,
                    cpu: 0,
                    radiator: 0,
                    board: 0,
                    video: 0,
                    memory: 0,
                    ssd: 0,
                    harddisk: 0,
                    power: 0
                }
            },
            guarantee: {
                base: baseUrl + 'diysearch/ajax_get_data/',
                cid: 0,
                attrids: [],
                bid: 0,
                level: 0,
                selectid: {
                    chassis: 0,
                    cpu: 0,
                    radiator: 0,
                    board: 0,
                    video: 0,
                    memory: 0,
                    ssd: 0,
                    harddisk: 0,
                    power: 0
                }
            }

        },
        // 已经选商品总价
        totalPrice: 0,
        // 筛选状态
        diyFilterActive: false,
        // ------------------------------------------
        // // 已选商品总价
        // countNum: 0,
        // 已选商品数量
        selectedNum: 0,
        // 基础配件分类

        // 默认价格排序方式
        sortType: 'desc',

        // 购物车参数
        goodsList: [],

        // 空购物车
        emptyCart: []
    },
    confirmFilter: function() {
        /*
            将fiterObj中对应在bid level attrids 更新到 url 中
            注意： filterObj中attrids是对象而url中的 attrids 是数组
        */
        // 1、获取filterObj中当前筛选在对象
        var currentAlias = this.data.currentAlias
        var uniqueAlias = this.data.uniqueAlias
        var target = this.data.filterObj[currentAlias][uniqueAlias]

        // 将fiterObj中对应在bid level attrids 更新到 url 中
        this.data.url[currentAlias].bid = target.bid
        this.data.url[currentAlias].level = target.level
        var attrids = []
        Object.keys(target.attrids).forEach(function(key) {
            attrids.push(target.attrids[key])
        })
        if (attrids.length == 0) {
            attrids = [0]
        }
        this.data.url[currentAlias].attrids = attrids

        // 调用url 拼凑函数， 获取当前请求的url
        var url = this.newUrl(this.data.url[this.data.currentAlias])

        // 调用request请求函数，发送请求
        var _this = this
        this.toggleRequest(url, _this)

        // 隐藏筛选模态框 
        this.setData({ diyFilterActive: !this.data.diyFilterActive })
    },

    // 拼接请求地址
    newUrl: function(url) {
        var id = url.selectid
        var selectid = id.chassis + ',' + id.cpu + ',' + id.radiator + ',' + id.board + ',' + id.video + ',' + id.memory + ',' + id.ssd + ',' + id.harddisk + ',' + id.power
        return url.base + 'cid/' + url.cid + '/attrids/' + url.attrids.join(',') + '/selectid/' + selectid + '/bid/' + url.bid + '/level/' + url.level
    },
    /* 激活种类筛选 */
    diyFilter: function(event) {
        this.setData({ diyFilterActive: !this.data.diyFilterActive })
    },
    filter: function(event) {
        var id = event.currentTarget.dataset.id
        var type = event.currentTarget.dataset.type
        var aid = event.currentTarget.dataset.aid
        var currentAlias = this.data.currentAlias
        var uniqueAlias = this.data.uniqueAlias
        if (type == 'brand') {
            this.data.filterObj[currentAlias][uniqueAlias].bid == id ? this.data.filterObj[currentAlias][uniqueAlias].bid = 0 : this.data.filterObj[currentAlias][uniqueAlias].bid = id
        } else if (type == 'level') {
            this.data.filterObj[currentAlias][uniqueAlias].level == id ? this.data.filterObj[currentAlias][uniqueAlias].level = 0 : this.data.filterObj[currentAlias][uniqueAlias].level = id
        } else {
            this.data.filterObj[currentAlias][uniqueAlias].attrids[aid] == id ? this.data.filterObj[currentAlias][uniqueAlias].attrids[aid] = 0 : this.data.filterObj[currentAlias][uniqueAlias].attrids[aid] = id
        }
        this.setData({ filterObj: this.data.filterObj })

    },

    onLoad: function() {
        
        var _this = this
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = 'REjZR2iCbWwhyLt6ck7C'
        }
        swan.showLoading({
            title: '加载中',
            mask: 'true',
            success: function(res) {
                console.log(res);
            },
            fail: function(res) {
                console.log(res);
            }
        });
        // 获取分类数据
        swan.request({
            url: baseUrl + 'api/diy/getGoods',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign
            },
            header: {
                'content-type': 'application/json',
            },
            success: function(res) {
                // 初始化购物车数据
                res.data.arr_cate.forEach(function(item) {
                    _this.data.goodsList.push(item.alias + '_0')
                })
                // 保存空购物车数据
                _this.data.emptyCart = JSON.parse(JSON.stringify(_this.data.goodsList))
                // 初始化基础配件分类
                _this.data.chassis = res.data.arr_cate.filter(function(item) {

                    // 初始化基础配件筛选状态
                    if (item.pid == 1) {
                        _this.data.filterObj.chassis[item.alias] = {
                            bid: 0,
                            level: 0,
                            attrids: {}
                        }
                    }

                    return item.pid == 1
                })
                // 初始化默认选中在产品分类 goodsCateId
                _this.data.goodsCateId = _this.data.chassis[0].id

                // 初始化基础配件状态下当前选中分类的别名
                _this.data.uniqueAlias = _this.data.chassis[0].alias

                // 初始化默认选中商品id
                _this.data.currentSelectedId = _this.data.chassis[0].select_id

                // 初始化软件配件分类
                _this.data.system = res.data.arr_cate.filter(function(item) {
                    if (item.pid == 2) {
                        _this.data.filterObj.system[item.alias] = {
                            bid: 0,
                            level: 0,
                            attrids: {}
                        }
                    }
                    return item.pid == 2
                })

                // 初始化服务支持分类
                _this.data.guarantee = res.data.arr_cate.filter(function(item) {
                    if (item.pid == 3) {
                        _this.data.filterObj.guarantee[item.alias] = {
                            bid: 0,
                            level: 0,
                            attrids: {}
                        }
                    }
                    return item.pid == 3
                })

                _this.setData({ chassis: _this.data.chassis })
                _this.setData({ system: _this.data.system })
                _this.setData({ guarantee: _this.data.guarantee })
                _this.setData({ goodsCateId: _this.data.goodsCateId })
                _this.setData({ uniqueAlias: _this.data.uniqueAlias })
                _this.data.url.chassis.cid = _this.data.goodsCateId

                // 初始化已选商品id
                res.data.arr_cate.forEach(function(item) {
                    // 0 为没有已选商品， 非0为已选商品的id
                    var id = item.selec_id
                    var cid = item.id
                    if (id) {
                        this.data.selectedId[cid] = id
                        this.setData({ selectedId: _this.data.selectedId })
                    }
                })
            }
        })

        // 获取产品列表数据
        swan.request({
            url: baseUrl + 'diysearch/ajax_get_data/cid/6/attrids/0/bid/0/level/0/selectid/0,0,0,0,0,0,0,0,0',
            method: 'POST',
            data: {
                uid: uid,
                login_sign: login_sign,
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                _this.data.goods = res.data
                _this.setData({ goods: res.data })
            }
        })

        swan.hideLoading()
    },

    /*  DIY选项业务逻辑处理(alias切换) 
        基础配件
        软件配件
        服务支持
    */

    toggleRequest: function(url, that) {
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = 'REjZR2iCbWwhyLt6ck7C'
        }
        swan.request({
            url: url,
            method: 'POST',
            data: {
                uid: uid,
                login_sign: login_sign
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                that.setData({ goods: res.data })
                console.log(res)
            }
        })
    },
    /*基础配件 软件配置 服务支持 切换逻辑处理*/
    aliasToggle: function(event) {
        // 获取当前点击的 alias
        var alias = event.currentTarget.dataset.alias
        // 更新页面当前 alias ---> currentAlias
        this.setData({ currentAlias: alias })
        // 跟新当前页面默认选中产品分类 goodsCateId
        var _this = this
        switch (alias) {
            case 'chassis':
                this.data.goodsCateId = this.data.chassis[0].id
                this.data.uniqueAlias = this.data.chassis[0].alias
                this.data.url.chassis.cid = this.data.goodsCateId
                var url = this.newUrl(this.data.url[this.data.currentAlias])
                this.toggleRequest(url, _this)
                break;
            case 'system':
                this.data.goodsCateId = this.data.system[0].id
                this.data.uniqueAlias = this.data.system[0].alias
                this.data.url.system.cid = this.data.goodsCateId
                var url = this.newUrl(this.data.url[this.data.currentAlias])
                this.toggleRequest(url, _this)
                break;
            case 'guarantee':
                this.data.goodsCateId = this.data.guarantee[0].id
                this.data.uniqueAlias = this.data.guarantee[0].alias
                this.data.url.guarantee.cid = this.data.goodsCateId
                var url = this.newUrl(this.data.url[this.data.currentAlias])
                this.toggleRequest(url, _this)
                break;
        }
        // 更新试图
        this.setData({ goodsCateId: this.data.goodsCateId })
        this.setData({ uniqueAlias: this.data.uniqueAlias })
    },

    /* 产品分类切换逻辑处理（cid) */
    categoryToggle: function(event) {
        var id = event.currentTarget.dataset.id
        var uniqueAlias = event.currentTarget.dataset.uniqueAlias
        this.data.uniqueAlias = uniqueAlias
        this.setData({ goodsCateId: id })
        this.setData({ uniqueAlias: uniqueAlias })
        this.data.url[this.data.currentAlias].cid = id
        // 根据不同分类查询数据
        var _this = this
        /*
            将fiterObj中对应在bid level attrids 更新到 url 中
            注意： filterObj中attrids是对象而url中的 attrids 是数组
        */
        // 1、获取filterObj中当前筛选在对象
        var currentAlias = this.data.currentAlias
        var uniqueAlias = this.data.uniqueAlias
        var target = this.data.filterObj[currentAlias][uniqueAlias]

        // 将fiterObj中对应在bid level attrids 更新到 url 中
        this.data.url[currentAlias].bid = target.bid
        this.data.url[currentAlias].level = target.level
        var attrids = []
        Object.keys(target.attrids).forEach(function(key) {
            attrids.push(target.attrids[key])
        })
        this.data.url[currentAlias].attrids = attrids

        // 调用url 拼凑函数， 获取当前请求的url
        var url = this.newUrl(this.data.url[this.data.currentAlias])
        this.toggleRequest(url, _this)

    },

    // 加入配置
    addConfig: function(event) {
        var _this = this
        var uniqueAlias = this.data.uniqueAlias
        // 获取当前产品的id和价格
        var id = event.currentTarget.dataset.id
        var price = event.currentTarget.dataset.price

        // 拼接购物车参数
        this.data.goodsList.forEach(function(item, index) {
            if (item.indexOf(uniqueAlias) != -1) {
                _this.data.goodsList[index] = uniqueAlias + '_' + id
            }
        })

        if (this.data.currentAlias == 'chassis') {
            var param = this.data.uniqueAlias
            this.data.url.chassis.selectid[param] = id
        }
        console.log(this.data.url)

        // 动态更新当前页面所选产品id
        this.setData({ currentSelectedId: id })
        // 更新所选产品id信息 
        this.data.selectedId[this.data.goodsCateId] = this.data.currentSelectedId
        this.setData({ selectedId: this.data.selectedId, totalPrice: price })

        this.data.selectedPrice[this.data.goodsCateId] = price
        var temp = this.data.selectedPrice
        var total = 0
        Object.keys(temp).forEach(function(key) {
            total += parseFloat(temp[key])
        })
        // 已选商品数量
        this.setData({
            selectedNum: Object.keys(temp).length
        })
        this.setData({ totalPrice: total })
    },

    // 取消加入配置

    cancelConfig: function(event) {
        var _this = this
        var uniqueAlias = this.data.uniqueAlias

        if (this.data.currentAlias == 'chassis') {
            var param = this.data.uniqueAlias
            this.data.url.chassis.selectid[param] = 0
        }
        this.setData({ currentSelectedId: 0 })
        delete this.data.selectedId[this.data.goodsCateId]
        delete this.data.selectedPrice[this.data.goodsCateId]
        this.setData({ selectedId: this.data.selectedId })
        var temp = this.data.selectedPrice
        var total = 0
        Object.keys(temp).forEach(function(key) {
            total += parseFloat(temp[key])
        })
        this.setData({ totalPrice: total })
        this.setData({
            selectedNum: Object.keys(temp).length
        })
        // 修改goodsList
        this.data.goodsList.forEach(function(value, index) {
            if (value.indexOf(uniqueAlias) != -1) {
                _this.data.goodsList[index] = uniqueAlias + '_0'
            }
        })
    },

    /* 取消筛选*/
    cancelFilter: function(event) {
        console.log("取消筛选")
        this.setData({ diyFilterActive: !this.data.diyFilterActive })
        console.log(this.data.diyFilterActive)
    },


    /* 价格排序 */
    priceSort: function(event) {
        var sortType = this.data.sortType
        this.data.sortType = sortType === 'desc' ? 'asc' : 'desc'
        this.setData({ sortType: this.data.sortType })

    },
    // 加入购物车
    addCart: function(evnet) {
        console.log('加入购物车')

        // 判断登录状态
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        // 未登录
        if (!uid) {
            console.log('未登录')
            swan.showModal({
                title: '提示',
                content: '当前用户未登陆,是否前去登陆？',
                success: function(res) {
                    if (res.confirm) {
                        swan.navigateTo({
                            url: '/pages/login/login'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        } else {
            // 已登录发送请求添加到购物车
            var goodsList = this.data.goodsList.join(',')
            swan.request({
                url: baseUrl + 'api/diy/addcart',
                method: 'POST',
                dataType: 'json',
                data: {
                    goods_list: goodsList,
                    uid: uid,
                    login_sign: login_sign
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    if (res.data.status == 0) {
                        // console.log(res.data.msg)
                        swan.showToast({
                            title: res.data.msg,
                            icon: 'normal',
                            duration: 500
                        })
                    }
                    if (res.data.stauts == 1) {
                        swan.showToast({
                            title: '加入成功',
                            icon: 'success',
                            duration: 500
                        })
                    }
                },
                fail: function(res) {
                    console.log(res);
                }
            });
        }

    },

    clearSelectedSets: function() {
        console.log('清空已选配置')
    },
    onShow: function() {

        this.onLoad()
        console.log('onshow')
        var _this = this

        swan.getStorage({
            key: 'hostinfo',
            success: function(res) {
                // console.log(res)
                // console.log(_this.data.selectedId)
                if (res.data) {
                    // console.log(res.data)
                    var uid = swan.getStorageSync('uid')
                    if (!uid) {
                        uid = 0
                    }
                    var login_sign = swan.getStorageSync('sign')
                    if (!login_sign) {
                        login_sign = 'REjZR2iCbWwhyLt6ck7C'
                    }

                    // 如果不在基础配件状态下，切换到基础配件,如果在则重新加载数据
                    _this.setData({ currentAlias: 'chassis' })

                    _this.data.goodsCateId = _this.data.chassis[0].id
                    _this.data.uniqueAlias = _this.data.chassis[0].alias
                    _this.data.url.chassis.cid = _this.data.goodsCateId
                    var url = _this.newUrl(_this.data.url[_this.data.currentAlias])
                    _this.toggleRequest(url, _this)

                    // 更新试图
                    _this.setData({ goodsCateId: _this.data.goodsCateId })
                    _this.setData({ uniqueAlias: _this.data.uniqueAlias })
                    // console.log(res.data)
                    var configs = res.data.split(',')
                    var id = configs[0]
                    var type = configs[1]
                    // console.log(configs[1])
                    if (type == 'host') {
                        var params = {
                            uid: uid,
                            login_sign: login_sign,
                            goods_id: id
                        }
                    } else if (type == 'settingStore') {
                        var params = {
                            uid: uid,
                            login_sign: login_sign,
                            install_id: id
                        }
                    }

                    // 获取分类数据
                    swan.request({
                        url: baseUrl + 'api/diy/getGoods',
                        method: 'POST',
                        dataType: 'json',
                        data: params,
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function(res) {
                            console.log(res)
                            // 初始化购物车数据
                            _this.data.goodsList = JSON.parse(JSON.stringify(_this.data.emptyCart))

                            // 初始化selectedPrice
                            _this.data.selectedPrice = []
                            // 临时购物车数据
                            var tempCart = []
                            res.data.arr_cate.forEach(function(item) {
                                _this.data.goodsList.push(item.alias + '_0')
                                // 更新url 添加selectid
                                // 只需要更新基础配件
                                if (item.pid == 1) {
                                    _this.data.url.chassis.selectid[item.alias] = item.select_id

                                }

                                // 添加购物车
                                // console.log(item.select_id)

                                if (item.select_id == 0) {
                                    tempCart.push(item.alias + '_0')
                                } else {
                                    tempCart.push(item.alias + "_" + item.select_id)
                                    // 更新selectedPrice
                                    _this.data.selectedPrice[item.id] = item.price
                                }
                            })
                            var temp = _this.data.selectedPrice
                            var total = 0
                            Object.keys(temp).forEach(function(key) {
                                total += parseFloat(temp[key])
                            })
                            // 已选商品总价
                            _this.setData({ totalPrice: total })
                            // 已选商品数量
                            _this.setData({
                                selectedNum: Object.keys(temp).length
                            })
                            // 更新购物车数据
                            _this.data.goodsList = tempCart
                            _this.setData({ goodsList: _this.data.goodsList })
                            // 初始化基础配件分类
                            _this.data.chassis = res.data.arr_cate.filter(function(item) {

                                // 初始化基础配件筛选状态
                                if (item.pid == 1) {
                                    _this.data.filterObj.chassis[item.alias] = {
                                        bid: 0,
                                        level: 0,
                                        attrids: {}
                                    }
                                }

                                return item.pid == 1
                            })
                            _this.setData({ chassis: _this.data.chassis })
                            // 初始化默认选中在产品分类 goodsCateId
                            _this.data.goodsCateId = _this.data.chassis[0].id
                            _this.setData({ goodsCateId: _this.data.chassis[0].id })

                            // 初始化基础配件状态下当前选中分类的别名
                            _this.data.uniqueAlias = _this.data.chassis[0].alias
                            _this.setData({ uniqueAlias: _this.data.chassis[0].alias })

                            // 初始化默认选中商品id
                            _this.data.currentSelectedId = _this.data.chassis[0].select_id
                            _this.setData({ currentSelectedId: _this.data.chassis[0].select_id })

                            // 初始化软件配件分类
                            _this.data.system = res.data.arr_cate.filter(function(item) {
                                if (item.pid == 2) {
                                    _this.data.filterObj.system[item.alias] = {
                                        bid: 0,
                                        level: 0,
                                        attrids: {}
                                    }
                                }
                                return item.pid == 2
                            })

                            // 初始化服务支持分类
                            _this.data.guarantee = res.data.arr_cate.filter(function(item) {
                                if (item.pid == 3) {
                                    _this.data.filterObj.guarantee[item.alias] = {
                                        bid: 0,
                                        level: 0,
                                        attrids: {}
                                    }
                                }
                                return item.pid == 3
                            })

                            _this.setData({ chassis: _this.data.chassis })
                            _this.setData({ system: _this.data.system })
                            _this.setData({ guarantee: _this.data.guarantee })
                            _this.setData({ goodsCateId: _this.data.goodsCateId })
                            _this.setData({ uniqueAlias: _this.data.uniqueAlias })
                            _this.data.url.chassis.cid = _this.data.goodsCateId

                            // 初始化已选商品id
                            res.data.arr_cate.forEach(function(item) {
                                // 0 为没有已选商品， 非0为已选商品的id
                                var id = item.select_id
                                var cid = item.id
                                _this.data.selectedId[cid] = id
                                _this.setData({ selectedId: _this.data.selectedId })

                            })
                        }
                    })

                    swan.removeStorage({
                        key: 'hostinfo',
                        success: function(res) {
                            // console.log('移除成功！')
                        }
                    })
                }

            }
        })
    },

    // 清空事件
    clearSelectedSets: function() {
        // 清除总价
        this.setData({ totalPrice: 0 })
        // 清除已选商品数量
        this.setData({ selectedNum: 0 })

        // 清除已选商品id selectedId
        var temp = this.data.selectedId
        Object.keys(temp).forEach(function(key) {
            temp[key] = 0
        })
        this.setData({ selectedId: temp })

        // 清除购物车数据
        this.data.goodsList = JSON.parse(JSON.stringify(this.data.emptyCart))

        // 初始化selectedPrice
        this.data.selectedPrice = []
        // 清除url selectid
        var url = this.data.url
        Object.keys(url).forEach(function(key) {
            var item = url[key]
            item.attrids = [],
                Object.keys(item.selectid).forEach(function(key) {
                    item.selectid[key] = 0
                })
        })
    }
})