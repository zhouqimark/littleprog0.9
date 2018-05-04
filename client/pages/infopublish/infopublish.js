const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");
const util = require("../../utils/util");

// pages/infopublish/infopublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoPublish: config.service.infoPublish,
    navTab: ["项目找班组", "班组找项目", "个人找工作", "棒棒棒团队"],
    currentNavTab: 0,
    indicatorDots: false,
    autoplay: true,
    duration: 1000,
  
  },

  switchTab: function(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      currentNavTab: idx
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    qcloud.request({
      url: this.data.infoPublish,
      login: true,
      method: "GET",
      success: result => {
        if(result.data.data.status === 0){
          wx.redirectTo({
            url: "/pages/login/login",
          });
        } else {
          msg.showSuccess("欢迎回来 " + wx.getStorageSync("userInfo").nickName);
        }
      },

      fail: err => {
        console.log(err);
      }
    })
    */
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
    //具体是checkUserInfoSettingStatu
    util.checkSettingStatus();
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
  onShareAppMessage: function () {
  
  }
})