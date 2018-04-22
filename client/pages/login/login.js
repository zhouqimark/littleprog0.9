// pages/login/login.js

let date = new Date(); 
const format_date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: true,
    date: format_date
  },

  bindAgreeChange: function(e) {
    this.setData({
      isAgree: this.data.isAgree ? false : true
    });
  },

  bindDateChange: function(e) {
    var val = e.detail.value;
    this.setData({
      date: val
    });
  },
  
  bindLogin: function(e) {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  onShareAppMessage: function () {
  
  }
})