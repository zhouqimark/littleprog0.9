var showBusy = text => {
    wx.showToast({
      title: text,
      icon: "loading",
      duration: 10000
    })
};

var hideBusy = () => {
    wx.hideToast();
}
  
var showSuccess = text => {
    wx.showToast({
        title: text,
        icon: "success"
    })
};

var showWarning = text => {
    wx.showToast({
        title: text
    })
}
  
var showModal = (title, content) => {
    wx.hideToast();
  
    wx.showModal({
      title: title,
      content: JSON.stringify(content),
      showCancel: false
    })
};

module.exports = ({
    showBusy: showBusy,
    hideBusy: hideBusy,
    showSuccess: showSuccess,
    showModal: showModal,
    showWarning: showWarning
});