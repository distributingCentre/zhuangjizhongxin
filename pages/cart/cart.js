const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        shops: [],
        totalPrice: 0.00,
        isSelectAll: false,
        isSelectShop: {},
        isSelectGoods: {},
        selectNum: 0,
        selectCartId: [],
        ids: null, // 用于保存参数传递给下个页面
        isDel: false
    },

    // 全部选中切换
    selectAllChange: function(event) {
        if (event.detail.value.length <= 0) {
            this.data.isSelectAll = false
            var allShops = this.data.isSelectShop
            var shopsStatus = []
            Object.keys(allShops).forEach(function(key) {
                shopsStatus.push(allShops[key])
            })
            var isSelectAll = shopsStatus.every(function(item) {
                return item == true
            })
            if (isSelectAll) {
                for (var key in this.data.isSelectShop) {
                    this.data.isSelectShop[key] = false
                }
            }
        } else if (event.detail.value.length > 0) {
            this.data.isSelectAll = true
            for (var key in this.data.isSelectShop) {
                this.data.isSelectShop[key] = true
            }
            this.data.isSelectAll = true
        }
        this.setData({ isSelectShop: this.data.isSelectShop })
        this.setData({ isSelectAll: this.data.isSelectAll })
    },

    // 店铺选中切换
    selectShopChange: function(event) {
        var shopId = event.detail.value[0]
        if (shopId) {
            this.data.isSelectShop[shopId] = true
            var allShops = this.data.isSelectShop
            var shopsStatus = []
            Object.keys(allShops).forEach(function(key) {
                shopsStatus.push(allShops[key])
            })
            var isSelectAll = shopsStatus.every(function(item) {
                return item == true
            })
            if (isSelectAll) {
                this.data.isSelectAll = true
            } else {
                this.data.isSelectAll = false
            }

            for (var key in this.data.isSelectGoods[shopId]) {
                this.data.isSelectGoods[shopId][key] = true
            }


        } else {
            var shopId = event.currentTarget.dataset.shopId
            this.data.isSelectShop[shopId] = false
            var allShops = this.data.isSelectShop
            var shopsStatus = []
            Object.keys(allShops).forEach(function(key) {
                shopsStatus.push(allShops[key])
            })
            var isSelectAll = shopsStatus.every(function(item) {
                return item == true
            })
            if (isSelectAll) {
                this.data.isSelectAll = true
            } else {
                this.data.isSelectAll = false
            }


            var allGoods = this.data.isSelectGoods[shopId]
            var goodsStatus = []
            Object.keys(allGoods).forEach(function(key) {
                goodsStatus.push(allGoods[key])
            })

            var isSelectAll = goodsStatus.every(function(item) {
                return item == true
            })
            if (isSelectAll) {
                for (var key in this.data.isSelectGoods[shopId]) {
                    this.data.isSelectGoods[shopId][key] = false
                }
            }

        }
        this.setData({ isSelectAll: this.data.isSelectAll })
        this.setData({ isSelectShop: this.data.isSelectShop })
        this.setData({ isSelectGoods: this.data.isSelectGoods })
    },
    onReady: function() {
        console.log('ready')
    },
    // 商品选中切换
    selectGoodsChange: function(event) {
        var goodsNum = event.currentTarget.dataset.goodsNum
        var goodsPrice = event.detail.value[0]
        var shopId = event.currentTarget.dataset.shopId
        var cartId = event.currentTarget.dataset.cartId
        var goodsId = event.currentTarget.dataset.goodsId
        var singleIds = event.currentTarget.dataset.singleIds
        if (goodsPrice) {
            this.data.isSelectGoods[shopId][cartId] = true
            this.data.selectNum += 1
            this.data.totalPrice += (parseFloat(goodsPrice) * parseInt(goodsNum))
            // 如果店铺中所有商品选中，则店铺默认选中
            var currentShop = this.data.isSelectGoods[shopId]
            var goodsStatus = []
            Object.keys(currentShop).forEach(function(key) {
                goodsStatus.push(currentShop[key])
            })
            var isSelectAll = goodsStatus.every(function(item) {
                return item == true
            })
            if (isSelectAll) {
                this.data.isSelectShop[shopId] = true
            } else {
                this.data.isSelectShop[shopId] = false
            }

            // 保存已选订单cart_id
            this.data.selectCartId.push(cartId)
        } else {
            this.data.isSelectGoods[shopId][cartId] = false
            this.data.selectNum -= 1
            var goodsPrice = event.currentTarget.dataset.goodsPrice
            this.data.totalPrice -= (parseFloat(goodsPrice) * parseInt(goodsNum))
            // 如果店铺中有商品未选中，则店铺不选中
            var currentShop = this.data.isSelectGoods[shopId]
            var goodsStatus = []
            Object.keys(currentShop).forEach(function(key) {
                goodsStatus.push(currentShop[key])
            })
            var isSelectAll = goodsStatus.every(function(item) {
                return item == true
            })
            if (isSelectAll) {
                this.data.isSelectShop[shopId] = true
            } else {
                this.data.isSelectShop[shopId] = false
            }

            // 去除已选订单cart_id
            var index = this.data.selectCartId.indexOf(cartId)
            this.data.selectCartId.splice(index, 1)
        }
        this.setData({ isSelectGoods: this.data.isSelectGoods })
        this.setData({ isSelectShop: this.data.isSelectShop })
        this.setData({ totalPrice: this.data.totalPrice })
        this.setData({ selectNum: this.data.selectNum })

    },
    reduceNum: function(event) {
        var shopId = event.currentTarget.dataset.shopId
        var cartId = event.currentTarget.dataset.cartId
        var price = event.currentTarget.dataset.price
        var isSelect = event.currentTarget.dataset.isSelect
        for (var i = 0; i < this.data.shops.length; i++) {
            if (this.data.shops[i].shop_id == shopId) {
                for (var j = 0; j < this.data.shops[i].list.length; j++) {
                    if (this.data.shops[i].list[j].cart_id == cartId) {
                        this.data.shops[i].list[j].goods_num -= 1
                        if (this.data.shops[i].list[j].goods_num >= 1) {
                            if (isSelect) {
                                this.data.totalPrice -= parseFloat(price)
                            }
                        }
                        if (this.data.shops[i].list[j].goods_num <= 1) {
                            this.data.shops[i].list[j].goods_num = 1
                        }

                    }
                }
            }
        }
        this.setData({ shops: this.data.shops })
        this.setData({ totalPrice: this.data.totalPrice })
    },
    plusNum: function(event) {
        var shopId = event.currentTarget.dataset.shopId
        var cartId = event.currentTarget.dataset.cartId
        var price = event.currentTarget.dataset.price
        var isSelect = event.currentTarget.dataset.isSelect
        for (var i = 0; i < this.data.shops.length; i++) {
            if (this.data.shops[i].shop_id == shopId) {
                for (var j = 0; j < this.data.shops[i].list.length; j++) {
                    if (this.data.shops[i].list[j].cart_id == cartId) {
                        this.data.shops[i].list[j].goods_num += 1
                    }
                }
            }
        }
        if (isSelect) {
            this.data.totalPrice += parseFloat(price)
        }
        this.setData({ shops: this.data.shops })
        this.setData({ totalPrice: this.data.totalPrice })
    },
    delCart: function(event) {
        var selectNum = this.data.selectNum
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        var cartId = event.currentTarget.dataset.cartId
        var shopId = event.currentTarget.dataset.shopId
        var isSelect = event.currentTarget.dataset.isSelect
        var price = event.currentTarget.dataset.price
        var goodsNum = event.currentTarget.dataset.goodsNum
        swan.showModal({
            title: '删除',
            content: '确定要删除该商品吗？',
            cancelColor: '#999999',
            confirmColor: '#0099cc',
            success: function(res) {
                if (res.confirm) {
                    swan.request({
                        url: baseUrl + 'api/cart/delCartGoods',
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            uid: uid,
                            login_sign: login_sign,
                            ids: [{ cart_id: cartId }]
                        },
                        header: {
                            'content-type': 'application/json'
                        },

                        // 删除订单请求成功
                        success: function(res) {
                            if (res.data.stauts == 1) {
                                // 如果该订单在选中状态 isSelectNum -1
                                // if (isSelect) {
                                //     selectNum  -=1
                                //     // var selectNum = _this.data.selectNum - 1
                                //     _this.setData({ selectNum: selectNum })
                                // }
                                // 遍历shop
                                // _this.data.shops.forEach(function(item, key) {
                                //     // 删除对应店铺中的订单
                                //     if (item.shop_id == shopId) {
                                //         item.list.forEach(function(list, index) {
                                //             if (list.cart_id == cartId) {
                                //                 item.list.splice(index, 1)
                                //             }
                                //         })
                                //     }

                                //     // 如果该店铺中已无订单，则在shops中删除该店铺
                                //     if (item.list.length <= 0) {
                                //         _this.data.shops.splice(key, 1)
                                //     }


                                // })
                                // // 更新试图
                                // _this.setData({ shops: _this.data.shops })
                                swan.showToast({
                                    title: '订单删除成功！',
                                    icon: 'normal',
                                    duration: 1000,
                                    success: function(res) {
                                        console.log(res);
                                        _this.onShow()
                                    },
                                    fail: function(res) {
                                        console.log(res);
                                    }
                                });

                            }
                        }
                    })
                } else if (res.cancel) {
                    console.log('quxiao')
                }
            }

        })

        //       this.data.shops.forEach(function(item) {
        //     if (item.shop_id == shopId) {
        //         item.list.forEach(function(list, key) {
        //             if (list.cart_id == cartId) {
        //                 swan.showModal({
        //                     title: '删除',
        //                     content: '确定要删除该商品吗？',
        //                     cancelColor: '#999999',
        //                     confirmColor: '#0099cc',
        //                     success: function(res) {
        //                         if (res.confirm) {
        //                             console.log('确定')
        //                             swan.request({
        //                                 url: baseUrl + 'api/cart/delCartGoods',
        //                                 method: 'POST',
        //                                 dataType: 'json',
        //                                 data: {
        //                                     uid: uid,
        //                                     login_sign: login_sign,
        //                                     ids: [{ cart_id: cartId }]
        //                                 },
        //                                 header: {
        //                                     'content-type': 'application/json'
        //                                 },
        //                                 success: function(res) {
        //                                     if (res.data.stauts == 1) {

        //                                         // 删除shops数据中该商品
        //                                         item.list.splice(key, 1)
        //                                         _this.setData({ shops: _this.data.shops })
        //                                         // 如果该商品所在在店铺没有商品信息则删除该shops中该店铺
        //                                         if (item.list.length == 0) {
        //                                             _this.data.shops.forEach(function(value, key) {
        //                                                 if (value.shop_id == shopId) {
        //                                                     _this.data.shops.splice(key, 1)
        //                                                     _this.setData({ shops: _this.data.shops })
        //                                                 }
        //                                             })
        //                                         }

        //                                         // 如果该订单在选中状态 isSelectNum -1
        //                                         if (isSelect) {
        //                                             var selectNum = _this.data.selectNum - 1
        //                                             _this.setData({ selectNum: selectNum })
        //                                         }

        //                                     }
        //                                 }
        //                             })
        //                         } else if (res.cancel) {
        //                             console.log('取消')
        //                         }
        //                     },
        //                     fail: function(res) {
        //                         console.log(res);
        //                     }
        //                 })
        //             }

        //         })
        //     }
        // })

    },
    onShow: function() {

        // 所有数据初始化
        this.setData({ shops: [], totalPrice: 0.00, isSelectAll: false, isSelectShop: {}, isSelectGoods: {}, selectNum: 0, selectCartId: [], ids: [] })
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        // 未登录
        if (!uid) {
            // 如果未登录跳转到登录页
            swan.navigateTo({
                url: '/pages/login/login'
            })
        } else {
            var _this = this
            swan.request({
                url: baseUrl + 'api/cart/cartList',
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
                    var shops = res.data
                    Object.keys(shops).forEach(function(key) {
                        // 初始化店铺及商品数据
                        _this.data.shops = []
                        _this.data.shops.push(shops[key])
                        // 初始化店铺选中状态
                        var shopId = shops[key].shop_id
                        _this.data.isSelectShop[shopId] = false

                        // 初始化商品选中状态
                        _this.data.isSelectGoods[shopId] = {}
                        shops[key].list.forEach(function(item) {
                            var cartId = item.cart_id
                            _this.data.isSelectGoods[shopId][cartId] = false

                        })
                        // 初始化selectCartId
                        _this.data.selectCartId = []

                    })
                    _this.setData({ shops: _this.data.shops, isSelectShop: _this.data.isSelectShop, isSelectGoods: _this.data.isSelectGoods })

                },
                fail: function(res) {
                    console.log(res);
                }
            });
        }

    },
    linkTo: function(event) {
        var selectOrders = []
        if (this.data.selectCartId.length <= 0) {
            swan.showToast({
                title: '未选择任何订单',
                icon: 'normal',
                duration: 1000,
                // success: function(res) {
                //     console.log(res);
                // },
                // fail: function(res) {
                //     console.log(res);
                // }
            });

        } else {
            var shops = this.data.shops
            for (var i = 0; i < shops.length; i++) {
                for (var j = 0; j < shops[i].list.length; j++) {
                    var item = shops[i].list[j]
                    if (this.data.selectCartId.indexOf(item.cart_id) != -1) {
                        selectOrders.push(item)
                    }
                }
            }

            var ids = []
            for (var i = 0; i < selectOrders.length; i++) {
                var item = selectOrders[i]
                var param = { single_id: item.single_ids, goods_id: item.goods_id, cart_id: item.cart_id, goods_num: item.goods_num }
                ids.push(param)

            }
            this.data.ids = ids
            var uid = swan.getStorageSync('uid')
            var login_sign = swan.getStorageSync('sign')
            var that = this

            swan.request({
                url: baseUrl + 'api/order/settlement',
                method: 'POST',
                dataType: 'json',
                data: {
                    uid: uid,
                    login_sign,
                    ids: ids,
                    ajax: 1
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    if (res.data.status == 1) {
                        swan.request({
                            url: baseUrl + 'api/order/settlement',
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                uid: uid,
                                login_sign: login_sign,
                                ids: ids
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function(res) {
                                if (res.data.status == 1) {
                                    var data = JSON.stringify(res.data)
                                    var ids = JSON.stringify(that.data.ids)
                                    swan.navigateTo({
                                        url: '/pages/orderdetail/orderdetail?data=' + data + '&ids=' + ids
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }

    }
})