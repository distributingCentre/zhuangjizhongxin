const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        addressList: null
    },
    addAddress: function() {
        swan.navigateTo({
            url: '/pages/addaddress/addaddress?type=0'
        })
    },
    editAddress: function(event) {
        var type = event.currentTarget.dataset.type
        var data = event.currentTarget.dataset.data
        swan.navigateTo({
            url: '/pages/addaddress/addaddress?type=' + type + "&data=" + JSON.stringify(data)
        })
    },
    delAddress: function(event) {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var id = event.currentTarget.dataset.id
        var _this = this
        swan.request({
            url: baseUrl + 'api/user/deladdress',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                id: id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                    console.log('ok')
                    swan.showToast({
                        title: '删除成功！',
                        icon: 'success',
                        duration: 1000,
                        success: function(res) {
                            _this.data.addressList.forEach(function(item, key) {
                                if (item.id == id) {
                                    _this.data.addressList.splice(key, 1)

                                }
                            })
                            _this.setData({ addressList: _this.data.addressList })
                        },
                        // fail: function(res) {
                        //     console.log(res);
                        // }
                    });
                }

            },
            fail: function(res) {
                console.log(res);
            }
        });
        console.log(id)
    },
    onLoad: function() {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/order/getaddress',
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
                console.log(res);
                _this.data.addressList = res.data
                _this.setData({ addressList: res.data })
                console.log(_this.data.addressList)
            },
            fail: function(res) {
                console.log(res);
            }
        });
    },

    // 设置默认地址
    checkboxChange: function(event) {
        
            
        var addressId = event.detail.value[0]
        if (addressId) {
            var addressList = this.data.addressList
            addressList.forEach(function(item) {
                item.is_default = 0
                if (item.id == addressId) {
                    item.is_default = 1
                }
            })
            this.setData({ addressList: addressList })
            console.log(addressList)
            var uid = swan.getStorageSync('uid')
            var login_sign = swan.getStorageSync('sign')
            var _this = this
            swan.request({
                url: baseUrl + 'api/user/setUserDefaultAddress',
                method: 'POST',
                dataType: 'json',
                data: {
                    uid: uid,
                    login_sign: login_sign,
                    id: addressId
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    if (res.data.status == 1) {
                        var msg = res.data.msg
                        swan.showToast({
                            title: msg,
                            icon: 'success',
                            duration: 1000,
                            success: function(res) {

                            },
                            // fail: function(res) {
                            //     console.log(res);
                            // }
                        })
                    }

                },
                fail: function(res) {
                    console.log(res);


                }
            });
        }
    }
})