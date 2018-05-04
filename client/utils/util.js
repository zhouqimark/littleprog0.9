const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const checkSettingStatus = () => {
  wx.getSetting({
    success: res => {
      var authSetting = res.authSetting;
      if (!authSetting) {
        console.log("首次授权");
      } else {
        if (authSetting["scope.userInfo"] === false) {
          wx.showModal({
            title: "用户授权失败",
            content: "如需正常使用消息消息发布功能，请按确定并在授权管理中选中*用户信息*，然后点按确定。最后再重新进入小程序即可正常使用",
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    console.log("openSetting success", res.authSetting);
                  }
                })
              }
            }
          });
        }
      }
    }
  });
}

const format_date = date => {
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
}

const isEmptyObject = obj => {
  for (let t in obj) {
    return !1;
  }
  return !0;
}
module.exports = {
  formatTime: formatTime,
  checkSettingStatus: checkSettingStatus,
  format_date: format_date,
  isEmptyObject: isEmptyObject
}