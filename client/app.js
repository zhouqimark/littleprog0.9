const qcloud = require("./vendor/wafer2-client-sdk/index");
const config = require("./config");
const utils = require("./utils/util");
const msg = require("./messages/normal");

App({

  globalData: {
    user: wx.getStorageSync("getUser") || null
  },

  onLaunch() {
    const constr_url = config.service.loginUrl
    qcloud.setLoginUrl(constr_url)
  },

  onShow() {},
  onHide() {},

  renderImage(path) {
    if(!path) return "";
    if(path.indexOf("http") !== -1 || path.indexOf("https") !== -1) {
      return path;
    }

    return config.service.host;
  },

  syncUserInfo: function(options) {
    console.log(options.url)
    qcloud.request({
      url: options.url,
      method: "POST",
      success: res => {
        const data = res.data;
        console.log(data);

        this.globalData.user = data.data;
        wx.setStorageSync("getUser", data.data);
      }
    })
  },

  doRegister: function() {
    qcloud.request({
      url: config.service.normalUserUrl,
      login: false,
      method:"GET",
      header: {
        "Content-Type": "application/json"
      },

      success: res => {
        const data = res.data;
        console.log(data);
        if(data.code === 200){
          msg.showSuccess(data.message);
          try {
            //this.globalData.user = res.data.data;
            if(!this.globalData.user) {
              this.globalData.user = res.data.data;
            }
            wx.setStorageSync("getUser", data.data);
          } catch (e) {
            msg.showWarning("存储cookie失败");
          }
        }

        if(res.data.code === 400){
          msg.showSuccess(res.data.message);
        }
      },

      fail: err => {
        console.log(err);
      }
    });
  }
});