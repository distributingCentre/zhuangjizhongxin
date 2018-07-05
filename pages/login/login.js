//获取应用实
var app = getApp()
//获取api
var API_URL = app.globalData.login
//更新用户信息
var API_URLS = app.globalData.setUserInfo

// 获取初始化登陆凭证 login-sign
const initSign = app.globalData.initSign

Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: '',
        openid: '',
        avatarUrl: '',
        loginParams: {}
    },

    authorize: function(that) {
        swan.authorize({
            scope: 'scope.userInfo',
            success() {
                // 用户已经同意智能小程序使用定位功能
                console.log('确定授权')
                swan.showLoading({
                    title: '努力获取数据中',
                    mask: 'true',
                    success: function(res) {
                        console.log(res);
                    },
                    fail: function(res) {
                        console.log(res);
                    }
                });
                swan.getUserInfo({
                    success: function(res) {
                        var userInfo = res.userInfo
                        // 页面显示用户百度账号头像
                        that.setData({ avatarUrl: userInfo.avatarUrl })
                        swan.setStorageSync('userInfo', userInfo)
                        var params = {
                            nickname: userInfo.nickName,
                            username: userInfo.nickName,
                            avatar: userInfo.avatarUrl,
                            login_sign: initSign,
                            openid: ''
                        }
                        that.data.loginParams = params
                        console.log(that.data.loginParams)
                        // 授权成功获取code
                        that.getCode(that)

                    },

                    // 获取用户信息失败
                    fail: function(err) {
                        console.log('获取失败');
                    }
                });
            },

            // 用户拒绝授权
            fail: function() {
                swan.reLaunch({
                    url: '/pages/index/index'
                })
            }
        })
    },
    getCode: function(that) {
        swan.login({
            success: function(res) {

                var code = res.code
                if (code) {
                    console.log(res)
                    that.getOpenId(code, that)
                } else {
                    that.getCode(that)
                }
            },
            fail: function(err) {
                that.getCode(that)
            }
        });
    },

    getOpenId: function(code, that) {
        swan.request({
            url: API_URL,
            data: {
                code: code,
                login_sign: initSign
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var openid = res.data.data
                that.data.loginParams.openid = openid
                swan.hideLoading()
            }
        })
    },
    onLoad: function() {
        var that = this
        this.authorize(that)
    },

    click: function() {
        var loginParams = this.data.loginParams
        this.login(loginParams)
    },

    login: function(params) {
        swan.request({
            url: API_URLS,
            data: params,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var uid = res.data.data.uid
                var login_sign = res.data.data.login_sign
                swan.setStorageSync('uid', uid)
                swan.setStorageSync('sign', login_sign)
                swan.reLaunch({
                    url: '/pages/mine/mine'
                })
            },
            //错误处理
            fail: function(params) {

            }
        })
    },




































    // onLoad: function(options) {
    //     var that = this
    //     // 获取用户信息
    //     swan.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //             swan.getUserInfo({
    //                 success: function(res) {
    //                     var userInfo = res.userInfo
    //                     console.log(userInfo)
    //                     // 页面显示用户百度账号头像
    //                     that.setData({ avatarUrl: userInfo.avatarUrl })
    //                     var params = {
    //                         nickname: userInfo.nickName,
    //                         username: userInfo.nickName,
    //                         avatar: userInfo.avatarUrl,
    //                         login_sign: initSign,
    //                         openid: ''
    //                     }
    //                     that.data.loginParams = params
    //                     console.log(that.data.loginParams)
    //                 },
    //                 fail: function(err) {

    //                 }
    //             });
    //         }
    //     })
    //     // swan.getUserInfo({
    //     //     success: function(res) {
    //     //         var userInfo = res.userInfo
    //     //         console.log(userInfo)
    //     //         // 页面显示用户百度账号头像
    //     //         that.setData({ avatarUrl: userInfo.avatarUrl })
    //     //         var params = {
    //     //             nickname: userInfo.nickName,
    //     //             username: userInfo.nickName,
    //     //             avatar: userInfo.avatarUrl,
    //     //             login_sign: initSign,
    //     //             openid: ''
    //     //         }
    //     //         that.data.loginParams = params
    //     //         console.log(that.data.loginParams)
    //     //     },
    //     //     fail: function(err) {

    //     //     }
    //     // });
    //     // 获取code
    //     swan.login({
    //         success: function(res) {
    //             var code = res.code
    //             console.log(code)
    //             if (!code) {
    //                 swan.showModal({
    //                     title: '提示',
    //                     content: 'code获取失败,是否重试？',
    //                     cancelColor: '#999999',
    //                     confirmColor: '#0099cc',
    //                     success: function(res) {
    //                         if (res.confirm) {
    //                             swan.redirectTo({
    //                                 url: '/pages/login/login'
    //                             })
    //                         } else if (res.cancel) {
    //                             swan.reLaunch({
    //                                 url: '/pages/index/index'
    //                             })
    //                         }
    //                     },
    //                     fail: function(res) {
    //                         console.log(res)
    //                     }
    //                 })
    //             } else {

    //                 // 成功获取code
    //                 that.setData({
    //                     code: code
    //                 })
    //             }
    //         },
    //         fail: function(err) {
    //             console.log('fail:::' + JSON.stringify(err))
    //         }
    //     })
    // },
    // click: function() {
    //     this.getOpenId()
    // },

    // getOpenId: function() {
    //     var code = this.data.code
    //     var that = this

    //     // 发送code获取openid
    //     swan.request({
    //         url: API_URL,
    //         data: {
    //             code: code,
    //             login_sign: initSign
    //         },
    //         method: 'POST',
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //             var openid = res.data.data

    //             var status = res.data.status
    //             if (status === 1) {
    //                 that.data.loginParams.openid = openid
    //                 that.login(that)
    //                 var loginParams = that.data.loginParams
    //                 // swan.showModal({
    //                 //     title: '提示',
    //                 //     content: loginParams.nickname,
    //                 //     cancelColor: '#999999',
    //                 //     confirmColor: '#0099cc',
    //                 //     success: function(res) {
    //                 //         if (res.confirm) {
    //                 //             console.log('确定')
    //                 //         } else if (res.cancel) {
    //                 //             console.log('取消')
    //                 //         }
    //                 //     },
    //                 //     fail: function(res) {
    //                 //         console.log(res);
    //                 //     }
    //                 // });
    //                 // swan.request({
    //                 //     url: API_URLS,
    //                 //     data: loginParams,
    //                 //     method: 'POST',
    //                 //     header: {
    //                 //         'Content-Type': 'application/json'
    //                 //     },
    //                 //     success: function(res) {
    //                 //         console.log('登录成功！')
    //                 //         console.log(res)
    //                 //         var uid = res.data.data.uid
    //                 //         var login_sign = res.data.data.login_sign
    //                 //         swan.setStorageSync('uid', uid)
    //                 //         swan.setStorageSync('sign', login_sign)
    //                 //         swan.reLaunch({
    //                 //             url: '/pages/mine/mine'
    //                 //         })
    //                 //     },
    //                 //     //错误处理
    //                 //     fail: function(params) {

    //                 //     }
    //                 // })
    //             } else {
    //                 swan.showModal({
    //                     title: '提示',
    //                     content: '未成功获取openId',
    //                     cancelColor: '#999999',
    //                     confirmColor: '#0099cc',
    //                     success: function(res) {

    //                     },
    //                     fail: function(res) {
    //                         console.log(res)
    //                     }
    //                 })
    //             }
    //         },
    //         //错误处理
    //         fail: function(params) {
    //             swan.showModal({
    //                 title: '提示',
    //                 content: 'openId请求接口异常',
    //                 cancelColor: '#999999',
    //                 confirmColor: '#0099cc',
    //                 success: function(res) {
    //                     if (res.confirm) {
    //                         swan.navigateTo({
    //                             url: '/pages/login/login'
    //                         })
    //                     } else if (res.cancel) {
    //                         swan.reLaunch({
    //                             url: '/pages/index/index'
    //                         })
    //                     }
    //                 },
    //                 fail: function(res) {
    //                     console.log(res)
    //                 }
    //             })
    //         }
    //     })
    // },
    // login: function(that) {
    //     var loginParams = that.data.loginParams
    //     console.log(API_URLS)
    //     swan.request({
    //         url: API_URLS,
    //         data: loginParams,
    //         method: 'POST',
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //             console.log('登录成功！')
    //             console.log(res)
    //             var uid = res.data.data.uid
    //             var login_sign = res.data.data.login_sign
    //             swan.setStorageSync('uid', uid)
    //             swan.setStorageSync('sign', login_sign)
    //             swan.reLaunch({
    //                 url: '/pages/mine/mine'
    //             })
    //         },
    //         //错误处理
    //         fail: function(params) {

    //         }
    //     })
    // },
    //登录
    // logins: function(res) {
    //     var code = this.data.code
    //     // var users = this.data.user
    //     var that = this

    //     // 发送code获取openid
    //     swan.request({
    //         url: API_URL,
    //         data: {
    //             code: code,
    //             login_sign: initSign
    //         },
    //         method: 'POST',
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //             var openid = res.data.data

    //             var status = res.data.status
    //             if (status === 1) {
    //                 that.data.loginParams.openid = openid
    //                 console.log(that.data.loginParams)
    //                 that.setData({
    //                     openid: openid
    //                 })

    //                 // 获取用户信息
    //                 that.getUser(that)
    //             } else {
    //                 swan.showModal({
    //                     title: '提示',
    //                     content: '登录失败请重新登录',
    //                     cancelColor: '#999999',
    //                     confirmColor: '#0099cc',
    //                     success: function(res) {

    //                     },
    //                     fail: function(res) {
    //                         console.log(res)
    //                     }
    //                 })
    //             }
    //         },
    //         //错误处理
    //         fail: function(params) {
    //             swan.showModal({
    //                 title: '提示',
    //                 content: '请求失败',
    //                 cancelColor: '#999999',
    //                 confirmColor: '#0099cc',
    //                 success: function(res) {
    //                     if (res.confirm) {
    //                         swan.navigateTo({
    //                             url: '/pages/login/login'
    //                         })
    //                     } else if (res.cancel) {
    //                         swan.reLaunch({
    //                             url: '/pages/home/home'
    //                         })
    //                     }
    //                 },
    //                 fail: function(res) {
    //                     console.log(res)
    //                 }
    //             })
    //         }
    //     })
    // },
    // //获取个人信息
    // getUser: function(that) {
    //             var loginParams = that.data.loginParams
    //             swan.request({
    //                 url: API_URLS,
    //                 data: loginParams,
    //                 method: 'POST',
    //                 header: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 success: function(res) {
    //                     console.log('登录成功！')
    //                     console.log(res)
    //                     var uid = res.data.data.uid
    //                     var login_sign = res.data.data.login_sign
    //                     swan.setStorageSync('uid', uid)
    //                     swan.setStorageSync('sign', login_sign)
    //                     swan.reLaunch({
    //                         url: '/pages/mine/mine'
    //                     })
    //                 },
    //                 //错误处理
    //                 fail: function(params) {

    //                 }
    //             })
    // },
    // 下拉刷新
    // onPullDownRefresh() {
    //     swan.stopPullDownRefresh()
    // }
})