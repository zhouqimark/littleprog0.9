const qcloud = require("../../../vendor/wafer2-client-sdk/index")
const config = require("../../../config")

const App = getApp()

Page({
    data: {
        hidden: !0,
        address: {}
    },
    onLoad(option) {
     option.ret = JSON.parse(option.ret)
     console.log(option)
     this.setData({
         ret: option.ret
     })
     this.onPullDownRefresh()
    },
    initData() {
        this.setData({
            address: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                },
                paginate: {}
            },
            url: {
              addressUrl: config.service.addressUrl
            }
        })
    },

    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        wx.redirectTo({
          url: '/pages/order/confirm/confirm?id=' + e.detail.value
        })
    },
    getAddressList() {
        const address = this.data.address

        this.setData({ 
            hidden: !1
        })

        const constr_url = this.data.url.addressUrl + "/" + this.data.ret.item.user_id + "?page=" + this.data.address.params.page + "&limit=" + this.data.address.params.limit;

        qcloud.request({
          url: constr_url,
          method: "GET",
          success: res => {
            const data = res.data
            console.log(data)

            if(data.code === 200) {
              address.items = address.items.concat(data.data.items)
              address.items.forEach((n, i) => {
                n.checked = n._id === this.data.ret.item._id
              });

              address.params.page = data.data.paginate.page;
              address.params.limit = data.data.paginate.limit
              address.paginate = data.data.paginate;

              this.setData({
                address: address
              })
            }

            this.setData({
              hidden: !0
            })
          }
        })
    },

    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.address.paginate.hasNext) return
        const pge = this.data.address.params.page;
        this.setData({
          "address.params.page": pge + 1
        })
        this.getAddressList()
    },
    
    onPullDownRefresh() {
        this.initData()
        this.getAddressList()
    }
})