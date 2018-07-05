var baseUrl = getApp().globalData.baseUrl
var initSign = getApp().globalData.initSign
Page({
	data: {
		content: '',
	},
	convertHtmlToText: function convertHtmlToText(inputText) {
     var returnText = "" + inputText;
   	returnText = returnText.replace(/<\/div>/ig, '{{');
     returnText = returnText.replace(/<\/li>/ig, '\r\n');
     returnText = returnText.replace(/<li>/ig, '  *  ');
     returnText = returnText.replace(/<\/ul>/ig, '\r\n');
     //-- remove BR tags and replace them with line break
     returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");
 
     //-- remove P and A tags but preserve what's inside of them
     returnText = returnText.replace(/<p.*?>/gi, "!!");
     returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");
 
     //-- remove all inside SCRIPT and STYLE tags
     returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
     //-- remove all else
     returnText = returnText.replace(/<(?:.|\s)*?>/g, "");
 
     //-- get rid of more than 2 multiple line breaks:
     returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");
 
     //-- get rid of more than 2 spaces:
     returnText = returnText.replace(/ +(?= )/g, '');
 
     //-- get rid of html-encoded characters:
     returnText = returnText.replace(/ /gi, " ");
     returnText = returnText.replace(/&/gi, "&");
     returnText = returnText.replace(/"/gi, '"');
     returnText = returnText.replace(/</gi, '<');
     returnText = returnText.replace(/>/gi, '>');
 
     return returnText;
   },
	onLoad: function () {
		console.log(this.convertHtmlToText("<p>fslkffkjslfjdlfjdflk</p>"))
		var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }
        var _this = this
        swan.request({
            url: baseUrl + 'api/news/newsdetails',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                id: 20
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
            	console.log(res)

            	var content = res.data.data.content
            	console.log(content)
            	_this.setData({content: content})       
                if (res.data.status == 1) {
                    

                }
            },
            fail: function(res) {}
        });
	}
})