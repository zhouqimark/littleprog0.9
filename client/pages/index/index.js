//index.js
//获取应用实例
const app = getApp()

const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");

var showBusy = text => {
  wx.showToast({
    title: text,
    icon: "loading",
    duration: 10000
  })
};

var showSuccess = text => {
  wx.showToast({
    title: text,
    icon: "success"
  })
};

var showModal = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title: title,
    content: JSON.stringify(content),
    showCancel: false
  })
};

var doLogin = function() {
  showBusy("正在登陆");
  qcloud.login({
    success(result) {
      showSuccess("登陆成功");
      console.log("登陆成功", result);
    },

    fail(error) {
      showModal("登陆失败", error);
      console.log("登陆失败", error);
    }
  })
};


Page({
  data: {
    shareTitle: "分享筋英汇",
    shareTo: "/pages/index/index"
  },

  onLoad: function(opts) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scop.getUserInfo"]) {
          wx.authorize({
            scope: "scope.getUserInfo"
          })
        }
      }
    })
    doLogin();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
