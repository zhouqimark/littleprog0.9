//index.js
//获取应用实例
const App = getApp()

const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");

Page({
  data: {
    shareTitle: "分享筋英汇",
    shareTo: "/pages/index/index",

    dataLists: [
      {
        type: "project_info",
        infos: [],
        params: {
          page: 1,
          limit: 20,
        }
      },
      {
        type: "group_info",
        infos: [],
        params: {
          page: 1,
          limit: 20,
        }
      },
      {
        type: "individual_info",
        infos: [],
        params: {
          page: 1,
          limit: 20,
        }
      },
      {
        type: "assistance_info",
        infos: [],
        params: {
          page: 1,
          limit: 20,
        }
      },
    ],
    topTabItems:["项目找班组","班组找项目","个人找工作","帮帮突击队"],
    currentTopItem: "0",
    swiperHeight:"0",

    url: {
      informationUrl: config.service.informationUrl
    }
  },

  onLoad: function(opts) {
    //检查用户信息
    try {
      const user = App.globalData.user;
      console.log(user || "用户初始化");
      if(!user) {
        App.doRegister();
      }
    } catch (err) {
      console.log(err);
    }

    //获悉信息数据
    this.refreshNewData();
  },

  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          swiperHeight: (res.windowHeight-37)
        });
      }
    })
  },

  switchTab:function(e){
    this.setData({
      currentTopItem:e.currentTarget.dataset.idx
    });
  },

  bindChange:function(e){
    var that = this;
    that.setData({
      currentTopItem:e.detail.current
    });

    if(this.needMoreDataAfterSwiper()) {
      this.refreshNewData();
    }
  },

  //刷新数据
  refreshNewData: function() {
    this.setData({
      loading: true
    });
    
    const that = this;
    const dataList = this.data.dataLists[this.data.currentTopItem];
    const constr_url = this.data.url.informationUrl + "?type=" + dataList.type + "&page=1" + "&limit=" + dataList.params.limit;
    console.log(constr_url)
    qcloud.request({
      url: constr_url,
      method: "GET",
      success: res => {
        const data = res.data;
        console.log(data);
        that.setNewDataWithRes(data,that);
      },

      fail: res => {
        console.log(res)
      }
    })
  },

  onShow: function () {
    console.log(this.data)
  },

  onPullDownRefresh: function () {
    this.refreshNewData();
  },

  needMoreDataAfterSwiper: function() {
    return this.data.dataLists[this.data.currentTopItem].infos.length > 0 ? false : true;
  },

  setNewDataWithRes: function(res,target) {
    var params = {};
    const dataLists = target.data.dataLists;
    const info = "dataLists[" + target.data.currentTopItem + "].infos";
    const paginate = "dataLists[" + target.data.currentTopItem + "].params"
    params[info] = res.data.items;
    params[paginate] = res.data.paginate;
    target.setData(params);
  },

  loadMoreData: function() {
    if(!this.data.dataList[this.data.currentTopItem].params.hasNext) return;
    console.log("load more");

    //加载提示框
    this.setData({
      loading: true
    });
    
    const that = this;
    const dataList = this.data.dataLists[this.data.currentTopItem];
    const constr_url = this.data.url.informationUrl + "?type=" + dataList.type + "&page=" + (dataList.params.page + 1) + "&limit=" + dataList.params.limit;
    console.log(constr_url)
    qcloud.request({
      url: constr_url,
      method: "GET",
      success: res => {
        const data = res.data;
        console.log(data);
        that.setMoreDataWithRes(data, that);
      },

      fail: res => {
        console.log(res)
      }
    })

  },

  setMoreDataWithRes: function(res, target) {
    var params = {};
    const dataLists = target.data.dataLists;
    const info = "dataLists[" + target.data.currentTopItem + "].infos";
    const paginate = "dataLists[" + target.data.currentTopItem + "].params"
    params[info] = dataLists[target.data.currentTopItem].infos.concat(res.data.items);
    params[paginate] = res.data.paginate;
    target.setData(params);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (opts) {
    return {
      title: this.data.shareTitle,
      path: this.data.shareTo,
      success: (res) => {
        wx.showToast({
          title: "转发成功",
          duration: 1900,
        })
      }
    }
  }
})
