const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");

const App = getApp()

Page({
    data: {
        url: {
          goodsSearchUrl: config.service.goodsSearchUrl
        },
        inputVal: ''
    },
    clearInput() {
        this.setData({
            inputVal: ''
        })
    },
    inputTyping(e) {
        this.setData({
            inputVal: e.detail.value
        })
        this.search()
    },
    search() {
      if (!this.data.inputVal) return
      const goodsSearchUrl = this.data.url.goodsSearchUrl + "?keyword=" + this.data.inputVal;
      qcloud.request({
        url: goodsSearchUrl,
        method: "GET",
        success: res => {
          const data = res.data;
          console.log(data);
          if(data.code === 200) {
            this.setData({
              items: data.data
            })
          }
        }
      })
      
    	/* App.HttpService.search({
            keyword: this.data.inputVal
        })
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
            	this.setData({
            		items: data.data
            	})
            }
        }) */
    },
    redirectTo(e) {
        console.log(e)
        const keyword = e.currentTarget.dataset.keyword;
        wx.redirectTo({
          url: '/pages/goods/list/list?id='+keyword.toString()
        });
    },
})