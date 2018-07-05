const baseUrl = getApp().globalData.baseUrl
Page({
	data: {
		currentIndex: 1,
		page: 1,
		pagesize: 10,
		messages: []
	},

	// 公共请求数据方法
	httpRequest: function (index,page,pagesize,_this) {
		var nav = ''
        console.log(index)
        if (index == 1) {
        	nav = 'sysMessage'
        } else if (index == 2) {
        	nav = 'logisticsMessage'
        } else if (index == 3) {
        	nav = 'orderMessage'
        }
		console.log(nav)
		// 获取uid和签名
		var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
		swan.request({			
            url: baseUrl + 'api/message/'+nav, //开发者服务器接口地址
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
                	_this.setData({messages: res.data.data})
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })
	},
	onLoad: function (options) {
		var index = options.index
        console.log(index)
		// 更新当前导航状态
		this.setData({currentIndex: index})
		
		// 更新数据
        var page = this.data.page
        var pagesize = this.data.pagesize
        var _this = this
      	this.httpRequest(index, page, pagesize,_this)
	},
	changeNav: function (event) {
		var index = event.currentTarget.dataset.index
		// 更新当前导航状态
		this.setData({currentIndex: index})

		// 更新数据
		var page = this.data.page
        var pagesize = this.data.pagesize
        var _this = this
      	this.httpRequest(index, page, pagesize,_this)
	}
})