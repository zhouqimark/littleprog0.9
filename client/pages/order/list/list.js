const qcloud = require("../../../vendor/wafer2-client-sdk/index")
const config = require("../../../config")

const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        order: {},
        prompt: {
            hidden: !0,
            icon: '../../../images/iconfont-order-default.png',
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },

        url: {
            orderUrl: config.service.orderUrl
        }
    },
    onLoad() {
        this.setData({
            navList: [
                {
                    name: '全部',
                    _id: 'all',
                },
                {
                    name: '已提交',
                    _id: 'submitted',
                },
                {
                    name: '已确认',
                    _id: 'confirmed',
                },
                {
                    name: '已完成',
                    _id: 'finished',
                },
                {
                    name: '已取消',
                    _id: 'canceled',
                },
            ]
        })
        this.onPullDownRefresh()
    },
    initData() {
        const order = this.data.order
        const params = order && order.params
        const type = params && params.type || 'all'

        this.setData({
            order: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                    type : type,
                },
                paginate: {}
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/order/detail/index?id=' + e.currentTarget.dataset.id
        })
    },
    getList() {
        const order = this.data.order
        const params = order.params
        const user = App.globalData.user._id || wx.getStorageSync("user")._id;

        const constr_url = this.data.url.orderUrl + "/" + user + "?page=" + this.data.order.params.page + "&limit=" + this.data.order.params.limit + "&type=" + this.data.order.params.type;

        qcloud.request({
            url: constr_url,
            method: "GET",
            success: res => {
                const data = res.data;
                console.log(data);

                if(data.code === 200) {
                    data.data.items.map(n => {
                        n.items = JSON.parse(n.items)
                    });
                    order.items = [...order.items, ...data.data.items]
                    order.paginate = data.data.paginate;
                    order.params.page = data.data.paginate.page;
                    order.params.limit = data.data.paginate.limit;
                    this.setData({
                        order: order,
                        "prompt.hidden": order.items.length
                    })
                }
            }
        })
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.order.paginate.hasNext) return
        const pge = this.data.order.params.page;
        this.setData({
          "order.params.page": pge + 1
        })
        this.getList()
    },
    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({
            activeIndex: index,
            'order.params.type': type,
        })
        this.getList()
    },
})