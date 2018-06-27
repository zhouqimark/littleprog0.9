const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const utils = require("../../utils/util");
const msg = require("../../messages/normal");
const Toptips = require('../../zanui-weapp/dist/toptips/index');

const App = getApp();



// pages/servlobby/servlobby.js
Page({

  /**
   * 页面的初始数据;
   */
  data: {
    userInfo: {},

    items: [{
      icon: "../../images/eye.png",
      text: "我的收藏",
      path: ""
    }, {
      icon: "../../images/star.png",
      text: "我的发布",
      path: ""
    }, {
      icon: "../../images/draft.png",
      text: "我的评论/回复",
      path: ""
    }, {
      icon: "../../images/recent.png",
      text: "我的订单",
      path: "../order/list/list"
    }, {
      icon: "../../images/cart.png",
      text: "我的购物车",
      path: "../cart/cart"
    }],

    setting: [{
      icon: "../../images/clearstorage.png",
      text: "清除缓存",
      path: ""
    }, {
      icon: "../../images/aboutus.png",
      text: "关于我们",
      path: ""
    }, ],
    showLoginPage: false,
    showWelcomeTxt: false,
    registeredStatus: {},
    isAgree: true,
    date: utils.format_date(new Date()),
    images: [],
    uploadPercent: 0
  },

  onMemChck(e) {
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },

  //事件监听函数

  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path
    })
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

  getPhoneNumber: function(e) {
    wx.checkSession({
      success: () => {
        qcloud.request({
          url: config.service.decryptionUrl,
          header: {
            "Content-Type": "application/json"
          },

          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },

          method: "POST",
          success: res => {
            console.log(res.data.decryptedData);
            this.setData({
              phoneNumber: res.data.decryptedData.phoneNumber
            })
          },

          fail : err => {
            console.log(err);
            msg.showWarning("获取失败，请手动输入");
          }
        })
      },

      fail: () => {
        msg.showBusy("获取失败，正重新登录");
      }
    })
  },

  bindChange: function(e) {
    var val = e.detail.value;
    
    var x = this.data.categories[val[0]];
    var y = this.data.subCategories[val[0]];
    const len = y.length;
    const pos = val[1] > len - 1 ? len - 1 : val[1];
    this.setData({
      currCateg: x,
      currSubCateg: y[pos],
      showSubCateg: y
    })
  },

  chooseImg: function(e) {
    wx.chooseImage({
      count: 2,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths);
        if(images.length < 2) {
          msg.showWarning("照片过少");
          this.setData({
            images
          })
        } else if(images.length > 2) {
          msg.showWarning("照片过多");
        } else {
          this.setData({
            images: images
          })
        }
      }
    })
  },

  handleImagePreview: function(e) {
    var index = e.currentTarget.dataset.idx;
    var images = this.data.images;
    wx.previewImage({
      current: images[index],
      urls: images
    })
  },

  removeImage: function(e) {
    var index = e.currentTarget.dataset.idx;
    var rmImgs = this.data.images.splice(index, 1);
    var leftImgs = this.data.images;
    if(rmImgs) {
      this.setData({
        images: leftImgs
      })
    }
  },

  showToptips(content) {
    Toptips({
      content: content
    })
  },

  formSubmit: function(e) {
    var infos = e.detail.value;
    if(!infos.name ||!infos.date || !infos.w_age || !infos.tel_number || !this.data.isAgree){
      //zanui
      this.showToptips("注册信息不全");
    } else if( this.data.images.length !== 2) {
      this.showToptips("照片信息不全");
    } else {
      var currCateg = this.data.currCateg === undefined ? this.data.categories[0] : this.data.currCateg;
      var currSubCateg = this.data.currSubCateg === undefined ? this.data.subCategories[0][0] : this.data.currSubCateg;
      var requestUrl = config.service.requestUrl;
      var finalUrl = requestUrl + "/" + currCateg + "/" + currSubCateg;
      qcloud.request({
        url: finalUrl,
        login: true,
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: {
          name: infos.name,
          date: infos.date,
          wAge: infos.w_age,
          telNumber: infos.tel_number
        },
        success: res => {
          console.log(res);
          const outerCode = res.statusCode;
          for(let i = 0; i < 2; i++) {
            var uploadTask = wx.uploadFile({
              url: requestUrl,
              filePath: this.data.images[i],
              name: i === 0 ? "front_img" : "back_img",
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: res => {
                const innerCode = res.statusCode;
                this.setData({ 
                  showLoginPage: !(outerCode === 200 && innerCode === 200),
                  showWelcomeTxt: true
                });
              }
            });

            uploadTask.onProgressUpdate(res => {
              this.setData({
                uploadPercent: res.progress
              })
            });
          }
          this.setData({
            registeredStatus: res.data.registeredStatus
          })
            //wx.setStorageSync("submitted", res.data.registeredStatus);
        },
      
        fail: err => {
          console.log(err);
        },

        complete: res => {
          //console.log("complete", res);
        }
      });
    }
  },

  onViewTap: function(e) {

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
    var avatarUrl = "../../images/avatar.png";
    if(App.globalData.user && App.globalData.user.avatar !== undefined) {
      avatarUrl = App.globalData.user.avatar;
    }
    
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      "userInfo.nickName": App.globalData.user.name
    })
    utils.checkSettingStatus();
    
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
    this.setData({
      showLoginPage: false
    });
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