const qcloud = require("../../../vendor/wafer2-client-sdk/index")
const config = require("../../../config")

Page({
    data: {
        order: {
            item: {},
        },

        url: {
          orderUrl: config.service.orderUrl
        }
    },
    onLoad(option) {
      this.setData({
          id: option.id,
          user_id: option.user
      })
    },
    onShow() {
        this.getOrderDetail(this.data.user_id, this.data.id)
    },
    getOrderDetail(user, id) {
      const constr_url = this.data.url.orderUrl + "/" + user + "/" + id;
      qcloud.request({
        url: constr_url,
        method: "GET",
        success: res => {
          const data = res.data;
          console.log(data);
          if(data.code === 200) {
            data.data.items = JSON.parse(data.data.items);
            this.setData({
              "order.item": data.data
            })
          }
        }
      })
    }
})