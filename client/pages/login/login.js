// pages/login/login.js

const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");

App = getApp();

Page({
  data: {
    user: {},
    logged: false,
    url: config.service.memberUserUrl
  },

  doLogin: function() {
    msg.showBusy("努力加载中");
    const that = this; 
    qcloud.login({
      success(userMember) {
        msg.hideBusy();

        console.log("加载成功", userMember);
        that.setData({
          user: userMember,
          logged: true
        });

        const constr_url = {
          url: that.data.url + "/" + App.globalData.user._id
        }
        Object.assign(userMember, constr_url);
        App.syncUserInfo(Object.assign(userMember));

        /* try {
          wx.setStorageSync("userMember", userMember);
        } catch(e) {
          msg.showModal("ERROR", "存储信息失败，请重试");
        } */
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
      const value = App.globalData.user.member_ship;
      if(value) {
        wx.setNavigationBarTitle({
          title: "会员中心"
        })
        this.setData({
          logged: true
        })
      }
    } catch (e) {
      console.log(e)
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