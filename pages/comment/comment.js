const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        order: null,
        stars: 0,
        tempPicUrl: [],
        commentContent: '',
        maxNum: 8,
        index: 0,
        is_anonymous: 0,
    },
    stars: function(event) {
        var currentStars = this.data.stars
        var stars = event.currentTarget.dataset.stars
        if (currentStars == 1) {
            stars = 0
        }
        this.setData({ stars: stars })
    },
    commentContent: function(event) {
        console.log(event)
        var value = event.detail.value
        this.data.commentContent = value
    },
    checkBoxChange: function(event) {
        console.log(event)
        if (event.detail.value.length > 0) {
            this.data.is_anonymous = 1
        } else {
            this.data.is_anonymous = 0
        }
        console.log(this.data.is_anonymous)
    },
    commit: function(event) {
        var order_id = event.currentTarget.dataset.id
        var score = this.data.stars
        var content = this.data.commentContent
        var imgs = []

        var tempPicUrl = this.data.tempPicUrl
        tempPicUrl.forEach(function(item) {
            imgs.push(item.url)
        })
        console.log(imgs)
        if (imgs.length > 0) {
            var img = imgs.join(',')
        } else {
            img = ''
        }
        var is_anonymous = this.data.is_anonymous
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var params = {
            order_id: order_id,
            score: score,
            content: content,
            img: img,
            uid: uid,
            login_sign: login_sign
        }
        console.log(params)
        swan.request({
            url: baseUrl + 'api/Myorder/addEvaluate',
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
                            swan.navigateTo({
                                url: '/pages/order/order?index=1'
                            })

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
                    });
                }
            },
            fail: function(res) {
                console.log(res)
            }
        })

    },
    delPic: function(event) {
        var id = event.currentTarget.dataset.id
        console.log(id)
        var tempPicUrl = this.data.tempPicUrl
        tempPicUrl.forEach(function(item, key) {
            if (item.id == id) {
                tempPicUrl.splice(key, 1)
            }
        })
        this.setData({ tempPicUrl: tempPicUrl })
    },
    addPic: function() {
        var _this = this
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var areadyNum = this.data.tempPicUrl.length
        var maxNum = this.data.maxNum
        var count = maxNum - areadyNum
        var index = this.data.index
        var _this = this
        swan.chooseImage({
            count: count,
            success: function(res) {
                // 成功则返回图片的本地文件路径列表 tempFilePaths
                console.log(res.tempFilePaths);
                var temp = res.tempFilePaths[0]
                var filePaths = res.tempFilePaths
                for (var i = 0; i < filePaths.length; i++) {
                    var temp = filePaths[i]
                    swan.uploadFile({
                        url: baseUrl + 'api/common/upload', //开发者服务器 url
                        filePath: temp, // 要上传文件资源的路径
                        name: 'image',
                        formData: {
                            uid: uid,
                            login_sign: login_sign
                        },
                        success: function(res) {
                            var url = res.data.url
                            var tempPicUrl = _this.data.tempPicUrl
                            tempPicUrl.push({ id: index, url: url })
                            index++
                            _this.data.index = index
                            console.log(tempPicUrl)
                            _this.setData({ tempPicUrl: tempPicUrl })
                            console.log(res);
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    });

                }
            },
            fail: function(res) {
                console.log(res);
            }
        });
    },
    onLoad: function(options) {
        console.log(options)
        var id = options.id
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/Myorder/evaluationOrder',
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
                    _this.setData({ order: res.data.data })
                }
            },
            fail: function(res) {
                console.log(res)
            }
        })
    }
})