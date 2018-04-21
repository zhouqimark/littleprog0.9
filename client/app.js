var qcloud = require("./vendor/wafer2-client-sdk/index");
var config = require("./config");

App({
  onLaunch() {
    qcloud.setLoginUrl(config.service.loginUrl);
  }
});