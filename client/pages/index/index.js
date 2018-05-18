//index.js
//获取应用实例
const app = getApp()

const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");

Page({
  data: {
    shareTitle: "分享筋英汇",
    shareTo: "/pages/index/index"
  },

  onLoad: function(opts) {
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
