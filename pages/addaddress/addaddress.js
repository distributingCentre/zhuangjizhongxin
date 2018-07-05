const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        regionData: ['省', '市', '区'],
        addressData: {},
        type: 0

    },

    // 获取收货人姓名
    changeUserName: function(event) {
        this.data.addressData['consignee'] = event.detail.value
    },

    // 获取区域地址
    regionChange: function(event) {
        this.setData('regionData', event.detail.value)
        this.data.addressData['region'] = this.data.regionData.join(',')
    },

    // 获取收货人手机号
    changeMobile: function(event) {
        this.data.addressData['mobile'] = event.detail.value
    },

    // 获取详细地址
    changeAddress: function(event) {
        console.log(event)
        this.data.addressData['address'] = event.detail.value
    },

    // 获取地址标签
    changeTag: function(event) {
        var tap = event.currentTarget.dataset.tap
        this.data.addressData['title'] = tap
        this.setData({ addressData: this.data.addressData })
    },
    submit: function() {
        var param = this.data.addressData
        var _this = this
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        swan.request({
            url: baseUrl + 'api/user/addaddress',
            method: 'POST',
            dataType: 'json',
            data: {
                type: _this.data.type,
                title: param.title,
                consignee: param.consignee,
                mobile: param.mobile,
                address: param.address,
                region: param.region,
                uid: uid,
                login_sign: login_sign,
                id: param.id
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
                            swan.redirectTo({
                                url: '/pages/addresslist/addresslist',
                                success: function(res) {
                                    console.log(res);
                                },
                                fail: function(res) {
                                    console.log(res);
                                }
                            });
                        },
                        fail: function(res) {

                        }
                    });
                } else if (res.data.status == 0) {
                    var msg = res.data.msg
                    swan.showToast({
                        title: msg,
                        icon: 'normal',
                        duration: 1000,
                        success: function(res) {},
                        fail: function(res) {

                        }
                    });
                }
            },

            fail: function(res) {
                swan.showToast({
                    title: '添加地址失败',
                    icon: 'normal',
                    duration: 1000
                })
            }
        });
    },
    onLoad: function(options) {

        var type = options.type
        if (options.data) {
            var data = JSON.parse(options.data)
        }
        if (type == 1) {
            this.data.type = 1
            this.data.addressData = data
            this.setData({ addressData: data })
            this.data.regionData = data.region.split(',')
            this.setData({ regionData: this.data.regionData })
        } else if (type == 0) {
            this.data.type = 0
            this.data.addressData = {
                title: '',
                consignee: '',
                mobile: '',
                address: '',
                region: ''
            }
        }
    }
})