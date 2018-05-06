const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");
const util = require("../../utils/util");

// pages/infopublish/infopublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoPublish: config.service.infoPublish,
    currentNavTab: "p2g",
    indicatorDots: false,
    autoplay: false,
    duration: 1000,

    additionInfo: false,

    //添加描述图片
    images: [],

    //field
    field: {
      focus: true,
      error: false,
      mode: "normal",
      right: true
    },

    //texterea
    textereea: {
      autoFocus: true,
      autoHeight: true,
      showConfirmBar: true,
      adjustPosition: true
    },

    //tab
    tab: {
      list: [{
        id: "p2g",
        title: '项目找班组'
      }, {
        id: "g2p",
        title: '班组找项目'
      }, {
        id: "i2j",
        title: '个人找工作'
      }, {
        id: "a4g",
        title: "棒棒棒团队"
      }],
      scroll: true,
      fixed: false,
      selectedId: 1
    },

    //icon
    icon: {
      projectName: "check",
      projectType: "check",
      projectArea: "check",
      projectIntro: "edit",
      projectContact: "check",
      projectPhone: "check",
      projectMail: "check"
    },

    //actionsheet
    projects: ["开发商直接发包", "建筑公司分包", "大劳务分包", "实体劳务分包", "PC预制厂分包", "开票总承包分包", "开票劳务分包"],
    checkedProject: "开发商直接发包",
    showAS: false,
    actions: [{
      name: "开发商直接发包",
      loading: false
    }, {
      name: "建筑公司分包",
      loading: false
    }, {
      name: "大劳务分包",
      loading: false
    }, {
      name: "实体劳务分包",
      loading: false
    }, {
      name: "PC预制厂分包",
      loading: false
    }, {
      name: "开票总承包分包",
      loading: false
    }, {
      name: "开票劳务分包",
      loading: false
    }],
    cancelWithMask: false,
    cancelText: "取消",
  
  },

  onFieldBlur: function(e) {
    console.log(e)
    const currentTarget = e.currentTarget;
    const val = e.detail.detail.value;
    if (currentTarget.id === "project_name") {
      if (val.length !== 0) {
        this.setData({
          "icon.projectName": "checked"
        })
      } else {
        this.setData({
          "icon.projectName": "check"
        })
      }
    } else if (currentTarget.id === "project_area") {
      if (val.length !== 0) {
        this.setData({
          "icon.projectArea": "checked"
        })
      } else {
        this.setData({
          "icon.projectArea": "check"
        })
      }
    } else if (currentTarget.id === "project_contact") {
      if(val.length !== 0) {
        this.setData({
          "icon.projectContact": "checked"
        })
      } else {
        this.setData({
          "icon.projectContact": "check"
        })
      }
    } else if (currentTarget.id === "project_phone") {
      if(val.length !== 0) {
        this.setData({
          "icon.projectPhone": "checked"
        })
      } else {
        this.setData({
          "icon.projectPhone": "check"
        })
      }
    } else if (currentTarget.id === "project_mail") {
      if(val.length !== 0) {
        this.setData({
          "icon.projectMail": "checked"
        })
      } else {
        this.setData({
          "icon.projectMail": "check"
        })
      }
    }
  },

  onTextareaBlur: function(e) {
    const currentTarget = e.currentTarget;
    const val = e.detail.value
    if(currentTarget.id === "projcet_intro") {
      if (val.length > 0) {
        this.setData({
          "icon.projectIntro": "records"
        })
      } else {
        this.setData({
          "icon.projectIntro": "edit"
        })
      }
    }
  },

  onTabChange: function(e) {
    this.setData({
      currentNavTab: e.detail
    })
  },

  switchTab: function(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      currentNavTab: idx
    })
  },

  openActionSheet: function(e) {
    this.setData({
      showAS: true
    })
  },

  handleActionClick: function(e) {
    const index = e.detail.index;
    const p = this.data.projects[index];
    this.setData({
      checkedProject: p,
      showAS: false,
      "icon.projectType": "checked"
    })
  },

  closeActionSheet: function(e) {
    this.setData({
      showAs: false
    })
  },

  //添加图片
  addImage: function(e) {
    wx.chooseImage({
      count: 6,
      sourceType: ["album", "camera"],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths);
        this.setData({
          images: images
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    qcloud.request({
      url: this.data.infoPublish,
      login: true,
      method: "GET",
      success: result => {
        if(result.data.data.status === 0){
          wx.redirectTo({
            url: "/pages/login/login",
          });
        } else {
          msg.showSuccess("欢迎回来 " + wx.getStorageSync("userInfo").nickName);
        }
      },

      fail: err => {
        console.log(err);
      }
    })
    */
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
    //具体是checkUserInfoSettingStatu
    util.checkSettingStatus();
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