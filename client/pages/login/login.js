// pages/login/login.js

const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");

App = getApp();

Page({
  data: {
    userMember: {},
    logged: false

  },

  doLogin: function() {
    msg.showBusy("努力加载中");
    const that = this; 
    qcloud.login({
      success(userMember) {
        msg.hideBusy();

        console.log("加载成功", userMember);
        that.setData({
          userMember: userMember,
          logged: true
        });
        try {
          wx.setStorageSync("userMember", userMember);
        } catch(e) {
          msg.showModal("ERROR", "存储信息失败，请重试");
        }
      },
  
      fail(error) {
        //msg.showModal("登陆失败", error);
        console.log("登陆失败", error);
        msg.hideBusy();
      }
    })
  },
 
  onLoad: function (options) {
    try {
      var value = App.globalData.userMember || wx.getStorageSync("userMember");
      if(value) {
        wx.setNavigationBarTitle({
          title: "会员中心"
        })
        this.setData({
          logged: true
        })
      }
    } catch (e) {
      wx.showModal({
        title: "提示",
        content: "获取缓存失败，近期无登录活动",
        showCancel: false
      });
    }
  },
  

  onReady: function () {

  },

  
  onShow: function () {
  },

  
  onHide: function () {
  
  },

  
  onUnload: function () {
  
  },

  
  onPullDownRefresh: function () {
  
  },

  
  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
});