Page({
	link: function(event) {
		var page = event.currentTarget.dataset.page
		var url = '/pages/'+page+'/'+page
		swan.navigateTo({
			url: url
		})
	},
	logout: function () {
		swan.clearStorage()
		console.log('推出')
		swan.reLaunch({
			url: '/pages/index/index'
		})
	}
})