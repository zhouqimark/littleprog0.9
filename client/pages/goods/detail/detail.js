const qcloud = require("../../../vendor/wafer2-client-sdk/index");
const config = require("../../../config");
const msg = require("../../../messages/normal");

const App = getApp()

Page({

    data: {
        url: {
          goodsUrl: config.service.goodsUrl,
          cartUrl: config.service.cartUrl,
        },
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        current: 0,
        goods: {
            item: {}
        }
    },
    swiperchange(e) {
        this.setData({
            current: e.detail.current, 
        })
    },
    onLoad(option) {
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },

    addCart() {
        const goods = this.data.goods.item._id
        const user = App.globalData.userNormal._id;
        console.log(goods, user)
        qcloud.request({
            url: this.data.url.cartUrl,
            login: false,
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            data: {
                goods: goods,
                user: user
            },

            success: res => {
                console.log(res.data);
                if(res.data.code === 200) {
                    msg.showSuccess(res.data.message);
                }

                if(res.data.code === 400) {
                    msg.showWarning(res.data.message);
                }
            },

            fail: err => {
                console.log(err);
            }
        })
        /* App.HttpService.addCartByUser(goods)
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                this.showToast(data.meta.message)
            }
        }) */
    },
    previewImage(e) {
        const urls = this.data.goods.item && this.data.goods.item.images;
        const index = e.currentTarget.dataset.index;
        const current = urls[Number(index)];
        
        wx.previewImage({
            current: current, 
            urls: urls, 
        })
    },
    showToast(message) {
        wx.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },
    getDetail(id) {
      const constr_url = this.data.url.goodsUrl + "/" + id;
      qcloud.request({
        url: constr_url,
        method: "GET",
        success: res => {
          const data = res.data;
          console.log(data);
          if(data.code === 200) {
            const images = JSON.parse(data.data.images);
            images.forEach(n => n = App.renderImage(n));

            this.setData({
              "goods.item": Object.assign(data.data, {images: images}),
              total: images.length
            })
          }
        }
      })
    	// App.HttpService.getDetail(id)
        /* this.goods.getAsync({id: id})
        .then(res => {
            const data = res.data
            console.log(data)
        	if (data.meta.code == 0) {
                data.data.images.forEach(n => n.path = App.renderImage(n.path))
        		this.setData({
                    'goods.item': data.data, 
                    total: data.data.images.length, 
                })
        	}
        }) */
    },
})