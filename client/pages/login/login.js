// pages/login/login.js
const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");

let date = new Date(); 
const format_date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: true,
    date: format_date,
    categories: ["企业类", "jlsdk", "we", "fsdf"],
    subCategories: [
      ["开发商直接发包", "检出公司分包", "大商务分包", "实体商务分包"],
      ["实力钢筋承包团队", "兄弟合包班组", "小料专业班组"],
      ["持证焊工", "aa", "bb"]
    ],
    showSubCateg: ["开发商直接发包", "检出公司分包", "大商务分包", "实体商务分包"],
    currCateg: "",
    currSubCateg: ""
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
  
  bindChange: function(e) {
    var val = e.detail.value;
    
    var x = this.data.categories[val[0]];
    var y = this.data.subCategories[val[0]];
    this.setData({
      currCateg: x,
      currSubCateg: y[val[1]],
      showSubCateg: y
    })
  },

  formSubmit: function(e) {
    var infos = e.detail.value;
    var currCateg = this.data.currCateg === "" ? this.data.categories[0] : this.data.currCateg;
    var currSubCateg = this.data.currSubCateg === "" ? this.data.subCategories[0][0] : this.data.currSubCateg;
    var finalUrl = config.service.loginUrl + "?" + "category=" + currCateg + "&" + "sub_category=" + currSubCateg;
    qcloud.request({
      url: finalUrl,
      login: true,
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        console.log(res);
      },
      
      fail: err => {
        console.log(err);
      }
    });
  },
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