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

    //picker
    picker: {
      dateStart: "2018-01-01",
      dateEnd: "2018-01-01",
      
      types: ["持证焊工", "持证管理员", "持证钢筋技工", "手工翻样", "软件BIM翻样", "套丝工", "电焊工", "区域总管", "现场总代班", "专业下料工", "钢筋工普工", "临时帮工"],
      index: 0
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
      selectedId: "p2g"
    },

    //icon
    icon: {
      project_name: "check",
      project_type: "check",
      project_area: "check",
      project_intro: "edit",
      project_contact: "check",
      project_phone: "check",
      project_mail: "check",

      group_name: "check",
      group_type: "check",
      group_area: "check",
      group_intro: "edit",
      group_contact: "check",
      group_phone: "check",
      group_mail: "check",

      assists_type: "check",
      assists_date: "check",
      assists_area: "check",
      assists_amount: "check",
      assists_salary: "check",
      assists_contact: "check",
      assists_phone: "check",
      assists_experience: "edit",

      individual_name: "check",
      individual_age: "check",
      individual_area: "check",
      individual_salary: "check",
      individual_type: "check",
      individual_experience: "check"
    },

    //actionsheet
    checkedProject: "项目类型",
    checkedGroup: "班组类型",
    checkedAssists: "工种选择",
    showAS: false,
    actions: {
      project: [{
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

      group: [{
        name: "实力钢筋承包团队",
        loading: false
      }, {
        name: "专业绑扎班组",
        loading: false
      }, {
        name: "兄弟合抱班组",
        loading: false
      }, {
        name: "料场专业包租",
        loading: false
      }, {
        name: "止水钢板班组",
        loading: false
      }, {
        name: "压力焊班组",
        loading: false
      }, {
        name: "专业焊桩笼班组",
        loading: false
      }, {
        name: "PC定型作业班",
        loading: false
      }, {
        name: "桥梁专向作业班",
        loading: false
      }, {
        name: "地铁钢筋作业班",
        loading: false
      }, {
        name: "帮工突击队",
        loading: false
      }],

    },
    cancelWithMask: true,
  },

  onFieldBlur: function(e) {
    console.log(e)
    const id = e.currentTarget.id;
    const val = e.detail.detail.value;
    var param = {};
    var key = "icon."+id;
    if(val.length !== 0) {
      param[key] = "checked";
      this.setData(param);
    } else {
      param[key] = "check";
      this.setData(param)
    }
  },

  onTextareaBlur: function(e) {
    const { value } = e.detail;
    const id = e.currentTarget.id;
    var param = {};
    var key = "icon."+id;
    if(value.length !== 0) {
      param[key] = "records";
      this.setData(param);
    } else {
      param[key] = "edit";
      this.setData(param);
    }
  },

  onTabChange: function(e) {
    this.setData({
      currentNavTab: e.detail
    })
  },

  onDateChange: function(e) {
    const { value } = e.detail;
    const extra = e.currentTarget.dataset.pass;
    if(extra === "dateStart") {
      this.setData({
        "picker.dateStart": value
      })
    }
    if(extra === "dateEnd") {
      this.setData({
        "picker.dateEnd": value
      })
    }
  },

  onTypeChange: function(e) {
    console.log(e)
    const { value } = e.detail;
    const extra = e.currentTarget.dataset.pass;
    var param = {}
    if (extra === "assistsType") {
      param = {
        "picker.index": value,
        "icon.assists_type": "checked"
      }
    }
    if (extra === "individualType") {
      param = {
        "picker.index": value,
        "icon.individual_type": "checked"
      }
    }
    this.setData(param);
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
    console.log(e)
    const index = e.detail.index;
    const id = e.currentTarget.id;
    const data = e.currentTarget.dataset.pass;
    var param = {};
    var icon = "icon."+id;
    param[icon] = "checked"

    var check = "checked"+data;
    param[check] = this.data.actions[data.toLowerCase()][index].name;
    param["showAS"] = false;
    this.setData(param)
    
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