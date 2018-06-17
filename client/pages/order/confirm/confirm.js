const qcloud = require("../../../vendor/wafer2-client-sdk/index")
const config = require("../../../config")
const App = getApp()

Page({
    data: {
        hidden: !0,
        carts: {},
        address: {
            item: {},
        },

        url: {
            defaultAddressUrl: config.service.defaultAddressUrl,
            addressUrl: config.service.addressUrl,
            orderUrl: config.service.orderUrl
        }
    },
    onLoad(option) {
        if(option){
            console.log(option)
            this.setData({
                address_id: option.id
            })
        }

        const carts = {
            items: wx.getStorageSync('confirmOrder'),
            totalAmount: 0, 
        }

        carts.items.forEach(n => carts.totalAmount+=n.totalAmount)
        
        this.setData({
            carts: carts
        })

        console.log(this.data.carts)
    },
    onShow() {
        const address_id = this.data.address_id
        if (address_id) {
            this.getAddressDetail(address_id)
        } else {
            this.getDefalutAddress()
        }
    },
    redirectTo(e) {
        console.log(e)
        wx.redirectTo({
          url: "/pages/address/confirm/confirm?ret=" + JSON.stringify(this.data.address)
        })
    },
    getDefalutAddress() {
        qcloud.request({
            url: this.data.url.defaultAddressUrl + "/" + this.data.carts.items[0].user,
            method: "GET",
            success: res => {
                const data = res.data
                console.log(data)
                if(data.code === 200) {
                    this.setData({
                        address_id: data.data._id,
                        "address.item": data.data
                    })
                } else {
                    this.showModal()
                }
            }
        })
    },
    showModal() {
        wx.showModal({
            title: '友情提示', 
            content: '没有收货地址，请先设置', 
            success: res => {
                console.log(res)
                if (res.confirm == 1) {
                    wx.redirectTo({
                        url: '/pages/address/add/add'
                    })
                } else {
                    wx.navigateBack()
                }
            }
        })
    },
    getAddressDetail(id) {
        const detailAddressUrl = this.data.url.addressUrl + "/" + this.data.carts.items[0].user + "/" + id;
        qcloud.request({
            url: detailAddressUrl,
            method: "GET",
            success: res => {
                const data = res.data;
                console.log(data);
                if(data.code === 200) {
                    this.setData({
                        "address.item": data.data
                    })
                }
            }
        })
    },

    addOrder() {
        const address_id = this.data.address_id
        const params = {
            items: [],
            address_id: address_id
        }

        this.data.carts.items.forEach(n =>{
            params.items.push({
                id: n.goods.goods_id,
                total: n.total
            })
        })
        console.log(params);

        const constr_url = this.data.url.orderUrl + "/" + this.data.carts.items[0].user;
        qcloud.request({
            url: constr_url,
            method:"POST",
            data: params,

            success: res => {
                const data = res.data;
                console.log(data)
                if(data.code === 200) {
                    this.setData({
                        order_id: data.data._id
                    })
                    wx.redirectTo({
                        url: "/pages/order/detail/detail?id=" + data.data._id + "&user=" + this.data.carts.items[0].user
                    })
                }
            }
        })
    },
    clear() {
        const constr_url = this.data.url.orderUrl + "/" + this.data.carts.items[0].user + "/" + this.data.order_id;
        qcloud.request({
            url: constr_url,
            method: "DELETE",
            success: res => {
                const data = res.data;
                console.log(data);
            }
        })
    },
})