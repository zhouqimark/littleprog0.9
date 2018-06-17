const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");

const App = getApp()

Page({
    data: {
        url: {
          cartUrl: config.service.cartUrl,
          cartClearUrl: config.service.cartClearUrl
        },

        canEdit: false,
        carts: {
            items: []
        },
        prompt: {
            hidden: !1,
            icon: '../../images/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '来挑几件好货吧',
            buttons: [
                {
                    text: '随便逛',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    bindtap(e) {
        const index = e.currentTarget.dataset.index
        
        switch(index) {
            case 0:
                wx.switchTab({
                  url: '/pages/store/store'
                })
                break
            default:
                break
        }
    },
    onLoad() {
    },
    onShow() {
        this.getCarts()
    },
    getCarts() {
      qcloud.request({
        url: this.data.url.cartUrl + "/" + App.globalData.userNormal._id || wx.getStorageSync("userNormal")._id,
        method: "GET",
        success: res => {
          const data = res.data;
          console.log(data);

          if(data.code === 200) {
            data.data.forEach(n => {
              const images = JSON.parse(n.goods.images);
              n.goods.thumb_url = App.renderImage(images && images[0]);
            });

            this.setData({
              "carts.items": data.data,
              "prompt.hidden": data.data.length
            })
          }
        }
      })
    },
    onPullDownRefresh() {
        this.getCarts()
    },
    navigateTo(e) {
        console.log(e)
        wx.navigateTo({
          url: '/pages/goods/detail/index' + "?id=" + e.currentTarget.dataset.id
        })
    },
    confirmOrder(e) {
        console.log(e)
        wx.setStorageSync('confirmOrder', this.data.carts.items)
        wx.navigateTo({
          url: '/pages/order/confirm/confirm?'
        })
    },
    del(e) {
        const id = e.currentTarget.dataset.id

        wx.showModal({
            title: '友情提示', 
            content: '确定要删除这个宝贝吗？',
            success: res => {
              if(res.confirm) {
                const user = App.globalData.userNormal._id || wx.getStorageSync("userNormal")._id;

                qcloud.request({
                  url: this.data.url.cartUrl + "/" + user + "/" + id,
                  method: "DELETE",
                  success: res => {
                    const data = res.data;
                    console.log(data);
                    if(data.code === 200) {
                      this.getCarts();
                    }
                  }
                })
              }
            }
        })
    },
    clear() {
        wx.showModal({
            title: '友情提示', 
            content: '确定要清空购物车吗？',
            success: res => {
              const user = App.globalData.userNormal._id || wx.getStorageSync("userNormal")._id;

              if(res.confirm) {
                qcloud.request({
                  url: this.data.url.cartClearUrl + "/" + user,
                  method: "POST",
                  header: {
                    "Content-Type": "application/json"
                  },

                  success: res => {
                    const data = res.data;
                    console.log(data);
                    if(data.code === 200) {
                      this.getCarts();
                    }
                  }
                })
              }
            }
        })
    },
    onTapEdit(e) {
        this.setData({
            canEdit: e.currentTarget.dataset.value
        })
    },
    bindKeyInput(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.detail.value)
        if (total < 0 || total > 100) return
        this.putCartByUser(id, {
            total: total
        })
    },
    putCartByUser(id, params) {
      const user = App.globalData.userNormal._id || wx.getStorageSync("userNormal")._id;

      qcloud.request({
        url: this.data.url.cartUrl + "/" + user + "/" + id,
        method: "PUT",
        header: {
          "Content-Type": "application/json"
        },

        data: params,

        success: res => {
          const data = res.data;
          console.log(data);
          if(data.code === 200) {
            this.getCarts();
          }
        }
      })
    },
    decrease(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1) return
        this.putCartByUser(id, {
            total: total - 1
        })
    },
    increase(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 100) return
        this.putCartByUser(id, {
            total: total + 1
        })
    },
})
