var qcloud = require("./vendor/wafer2-client-sdk/index");
var config = require("./config");

App({
  onLaunch() {
    qcloud.setLoginUrl(config.service.loginUrl);
  },

  onShow() {},
  onHide() {},
  globalData: {
    userInfo: null
  },

  renderImage(path) {
    if(!path) return "";
    if(path.indexOf("http") !== -1 || path.indexOf("https") !== -1) {
      return path;
    }

    return config.service.host;
  }
});