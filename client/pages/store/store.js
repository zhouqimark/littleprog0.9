const App = getApp()
const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const util = require("../../utils/util");


Page({

  data: {
    images: [],
    activeIndex: 0,
    navList: [],
    indicatorDots: !0,
    autoplay: !1,
    current: 0,
    interval: 3000,
    duration: 1000,
    circular: !0,
    goods: {
      params: {}
    },
    prompt: {
      hidden: !0,
    },

    url: {
      classifyUrl: config.service.classifyUrl,
      goodsUrl: config.service.goodsUrl
    }
  },
  swiperchange(e) {
    // console.log(e.detail.current)
  },
  onLoad() {
    //this.getBanners(["https://wximg-1256514917.cos.ap-guangzhou.myqcloud.com/b.jpg", "https://wximg-1256514917.cos.ap-guangzhou.myqcloud.com/1524373869089-BJS_FcY3M.jpg"]);
    this.getClassify();
    
  },
  initData() {
    const type = this.data.goods.params && this.data.goods.params.type || ''
    const goods = {
      items: [],
      params: {
        page: 1,
        limit: 10,
        type: type,
      },
      paginate: {}
    }

    this.setData({
      goods: goods
    })
  },
  navigateTo(e) {
    console.log(e)
    wx.navigateTo({
      url: "../goods/detail/detail?id=" + e.currentTarget.dataset.id
    })
  },
  search() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  getBanners(urls){
    for(var url of urls){
      wx.downloadFile({
        url: url,
        success: res => {
          console.log(res)
          const imgs = this.data.images.concat(res.tempFilePath);
          this.setData({
            images: imgs
          })
        }
      })
    }
  },
  /*
  getBanners() {
    // App.HttpService.getBanners({is_show: !0})
    this.banner.queryAsync({ is_show: !0 })
      .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
          data.data.items.forEach(n => n.path = App.renderImage(n.images[0].path))
          this.setData({
            images: data.data.items
          })
        }
      })
  },
  */
  getClassify() {
    const activeIndex = this.data.activeIndex;

    qcloud.request({
      url: this.data.url.classifyUrl,
      method: "GET",
      success: res => {
        const data = res.data;
        console.log(res.data)
        if(res.data.code === 200) {
          this.setData({
            navList: data.data.items,
            "goods.params.type": data.data.items[activeIndex]._id
          })

          this.onPullDownRefresh();
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
 
  getList() {
    const goods = this.data.goods;
    const params = goods.params;
    const constr_url = this.data.url.goodsUrl + "?type=" + params.type + "&page=" + params.page + "&limit=" + params.limit; 

    qcloud.request({
      url: constr_url,
      method: "GET",
      success: res => {
        const data = res.data;
        console.log(data);
        if(data.code === 200) {
          data.data.items.forEach(n => {
            const images = JSON.parse(n.images);
            n.thumb_url = App.renderImage(images && images[0]);
          })
          goods.items = goods.items.concat(data.data.items);
          goods.paginate = data.data.paginate;
          goods.params.page = data.data.paginate.page;
          goods.params.limit = data.data.paginate.limit;
          this.setData({
            goods: goods,
            "prompt.hidden": goods.items.length
          })
          console.log(this.data.goods)
        }
      }
    })
  },
 /*
  getList() {
    const goods = this.data.goods
    const params = goods.params

    // App.HttpService.getGoods(params)
    this.goods.queryAsync(params)
      .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
          data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
          goods.items = [...goods.items, ...data.data.items]
          goods.paginate = data.data.paginate
          goods.params.page = data.data.paginate.next
          goods.params.limit = data.data.paginate.perPage
          this.setData({
            goods: goods,
            'prompt.hidden': goods.items.length,
          })
        }
      })
  },
  */
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    this.initData()
    this.getList()
  },
  onReachBottom() {
    console.info('onReachBottom')
    if (!this.data.goods.paginate.hasNext) return
    const pge = this.data.goods.params.page;
    this.setData({
      "goods.params.page": pge + 1
    })
    this.getList()
  },
  onTapTag(e) {
    const type = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    const goods = {
      items: [],
      params: {
        page: 1,
        limit: 10,
        type: type,
      },
      paginate: {}
    }
    this.setData({
      activeIndex: index,
      goods: goods,
    })
    this.getList()
  },
})