var baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        userInfo: null,
        editActive: false,
        title: '',
        editTarget: '',
    },
    edit: function(event) {
        var info = event.currentTarget.dataset.info
        var editTarget = event.currentTarget.dataset.editTarget
        this.data.eidtTarget = editTarget
        console.log(editTarget)
        this.setData({ editActive: true, title: info, editTarget: editTarget })
    },
    cancelEdit: function() {
        this.setData({ editActive: false })
    },
    editTing: function(event) {
        var value = event.detail.value
        this.data.userInfo[this.data.eidtTarget] = value
    },
    // 禁止修改用户名
    // forbid: function() {
    //     swan.showToast({
    //         title: '禁止修改用户名',
    //         icon: 'normal',
    //         duration: 1000,
    //         success: function(res) {
    //             console.log(res);
    //         },
    //         fail: function(res) {
    //             console.log(res);
    //         }
    //     });
    // },
    confirm: function() {
        this.setData({ editActive: false, userInfo: this.data.userInfo })
        var userInfo = this.data.userInfo
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        swan.request({
            url: baseUrl + 'api/user/upconfig',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                nickname: userInfo.nickname,
                email: userInfo.email,
                mobile: userInfo.mobile
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                var msg = res.data.msg
                if (res.data.status == 1) {
                    swan.showToast({
                        title: msg,
                        icon: 'success',
                        duration: 500,
                        success: function(res) {

                        },
                        // fail: function(res) {
                        //     console.log(res);
                        // }
                    });
                } else if (res.data.status == 0) {
                    swan.showToast({
                        title: msg,
                        icon: 'normal',
                        duration: 500,
                        success: function(res) {

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
    },
    onLoad: function() {
        var _this = this
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        swan.request({
            url: baseUrl + 'api/user/userinfo',
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
                if (res.data.status == 1) {
                    _this.data.userInfo = res.data.data
                    _this.setData({ userInfo: res.data.data })
                }

            },
            fail: function(res) {
                console.log(res);
            }
        });
    }
})