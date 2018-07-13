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

    allDataLists: [],
    dataLists: [
      {
        infos: [],
        params: {
          type: "project_info",
          page: 1,
          limit: 20,
        }
      },
      {
        infos: [],
        params: {
          type: "group_info",
          page: 1,
          limit: 20,
        }
      },
      {
        infos: [],
        params: {
          type: "individual_info",
          page: 1,
          limit: 20,
        }
      },
      {
        infos: [],
        params: {
          type: "assistance_info",
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
  },

  //刷新数据
  refreshNewData: function() {
    this.setData({
      loading: true
    });
    
    const dataList = this.data.dataLists[this.data.currentTopItem];
    const constr_url = this.data.url.informationUrl + "&type=" + dataList.params.type + "&page=" + dataList.params.page + "&limit=" + dataList.params.limit;
    console.log(constr_url)
    qcloud.request({
      url: constr_url,
      method: "GET",
      success: res => {
        const data = res.data;
        console.log(data);
      },

      fail: res => {
        console.log(res)
      }
    })
  },

  onShow: function () {
  },

  onPullDownRefresh: function () {
    this.refreshNewData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
