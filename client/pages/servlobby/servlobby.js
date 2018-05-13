const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");
const util = require("../../utils/util");
const Toptips = require('../../zanui-weapp/dist/toptips/index');



// pages/servlobby/servlobby.js
Page({

  /**
   * 页面的初始数据;
   */
  data: {
    userInfo: {},
    showLoginPage: false,
    showWelcomeTxt: false,
    registeredStatus: {},
    isAgree: true,
    date: util.format_date(new Date()),
    categories: ["企业类", "班组类", "个人", "材料商"],
    subCategories: [
      ["开发商直接发包", "建筑公司分包", "大劳务分包", "实体劳务分包", "PC预制厂分包", "开票总承包分包", "开票劳务分包"],
      ["实力钢筋承包团队", "专业绑扎班组", "兄弟合抱班组", "料场专业包租", "止水钢板班组", "压力焊班组", "专业焊桩笼班组", "PC定型作业班", "桥梁专向作业班", "地铁钢筋作业班", "帮工突击队"],
      ["持证焊工", "持证管理员", "持证钢筋技工", "手工翻样", "软件BIM翻样", "套丝工", "电焊工", "区域总管", "现场总代班", "专业下料工", "钢筋工普工", "临时帮工"],
      ["名称", "广告宣传页"]
    ],
    showSubCateg: ["开发商直接发包", "建筑公司分包", "大劳务分包", "实体劳务分包", "PC预制厂分包", "开票总承包分包", "开票劳务分包"],
    images: [],
    uploadPercent: 0
  },

  //事件监听函数
  doLogin: function() {
    msg.showBusy("努力加载中");
    const that = this; 
    qcloud.login({
      success(userInfo) {
        console.log("加载成功", userInfo);
        that.setData({ userInfo: userInfo });
        msg.hideBusy();
        try {
          wx.setStorageSync("userInfo", userInfo);
        } catch(e) {
          msg.showModal("ERROR", "存储信息失败，请重试");
        }
      },
  
      fail(error) {
        //msg.showModal("登陆失败", error);
        console.log("登陆失败", error);
        msg.hideBusy();
      }
    })
  },

  doRegister: function(e) {
    const registeredStatus = this.data.registeredStatus;
    if (util.isEmptyObject(registeredStatus)) {
      this.setData({ showLoginPage: true });
      wx.showToast({ title: "下拉返回页面", icon: "none" });
    }
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