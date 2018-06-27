const qcloud = require("../../vendor/wafer2-client-sdk/index");
const config = require("../../config");
const msg = require("../../messages/normal");
const util = require("../../utils/util");
const Toptips = require("../../zanui-weapp/dist/toptips/index");

App = getApp();

// pages/infopublish/infopublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoPublish: config.service.infoPublish,
    currentNavTab: "project_info",
    indicatorDots: false,
    autoplay: false,
    duration: 1000,

    additionInfo: false,

    //添加描述图片
    images: {
      project_images: [],
      group_images: [],
      individual_images: []
    },

    url: {
      informationUrl: config.service.informationUrl
    },

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
      pickedStart: false,
      dateEnd: "2018-01-01",
      pickedEnd: false,
      
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
        id: "project_info",
        title: '项目找班组'
      }, {
        id: "group_info",
        title: '班组找项目'
      }, {
        id: "individual_info",
        title: '个人找工作'
      }, {
        id: "assistance_info",
        title: "帮帮突击队"
      }],
      scroll: true,
      fixed: false,
      selectedId: "project_info"
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
      group_close: "close",

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
    checkedPaymentDays: "1天",
    paymentPrice: "¥9.8",
    showAS: false,
    showASForPayment: false,
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

      paymentdays: [{
        name: "1天",
        loading: false
      }, {
        name: "2天",
        loading: false
      }, {
        name: "3天",
        loading: false
      }]

    },
    cancelWithMask: true,

  },

  onFieldBlur: function(e) {
    console.log(e)
    const id = e.currentTarget.id;
    const val = e.detail.detail.value;
    var param = {};
    var key = "icon."+id;
    
    if(util.exist(["project_phone", "group_phone", "assists_phone"], id) && !util.checkPhone(parseInt(val))) {
      this.showToptips("手机号码格式不正确")
      param[key] = "check";
      this.setData(param);
    } else if(util.exist(["project_mail", "group_mail", "assists_mail"], id) && !util.checkEmail(val)) {
      this.showToptips("邮件格式不正确");
      param[key] = "check";
      this.setData(param);
    } else {
      if(val.length !== 0) {
        param[key] = "checked";
        this.setData(param);
      } else {
        param[key] = "check";
        this.setData(param)
      }
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
        "picker.dateStart": value,
        "picker.pickedStart": true
      })
    }
    if(extra === "dateEnd") {
      this.setData({
        "picker.dateEnd": value,
        "picker.pickedEnd": true
      })
    }
    if( this.data.picker.pickedStart && this.data.picker.pickedEnd) {
      this.setData({
        "icon.assists_date": "checked"
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

  openPaymentSheet: function(e) {
    this.setData({
      showASForPayment: true
    })
  },

  handleActionClick: function(e) {
    console.log(e)
    const index = e.detail.index;
    const id = e.currentTarget.id || "";
    const data = e.currentTarget.dataset.pass;
    var param = {};
    if(id){
      var icon = "icon."+id;
      param[icon] = "checked"
    }

    var check = "checked"+data;
    param[check] = this.data.actions[data.toLowerCase()][index].name;
    if(data === "PaymentDays") {
      if(index === 0) {
        param["paymentPrice"] = "¥9.8"
      } else if(index === 1) {
        param["paymentPrice"] = "¥58.8"
      } else {
        param["paymentPrice"] = "¥88.8"
      }
    }
    param["showASForPayment"] = false;
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
    const id = e.currentTarget.id;
    wx.chooseImage({
      count: 3,
      sourceType: ["album", "camera"],
      success: res => {
        if(id === "project_images") {
          this.setData({
            "images.project_images": this.data.images.project_images.concat(res.tempFilePaths)
          });
        }
        if(id === "group_images") {
          this.setData({
            "images.group_images": this.data.images.group_images.concat(res.tempFilePaths)
          });
        }
        if(id === "individual_images") {
          this.setData({
            "images.individual_images": this.data.images.individual_images.concat(res.tempFilePaths)
          });
        }
      }
    })
  },

  //删除照片
  onCloseImg: function(e) {
    const id = e.currentTarget.id;
    const index = e.currentTarget.dataset.index;
    if(id === "project_images") {
      var key = "images.project_images";
      var target = this.data.images.project_images;
    }
    if(id === "group_images") {
      var key = "images.group_images";
      var target = this.data.images.group_images;
    }
    if(id === "individual_images") {
      var key = "images.individual_images";
      var target = this.data.images.individual_images;
    }
    var rmImgs = target.splice(index, 1);
    var leftImgs = this.data.images;
    var param = {}
    param[key] = target;
    if(leftImgs) {
      this.setData(param);
    }
  },

  turnPayOn: function(e) {
    const checked = e.detail.value;
    if(!checked){
      this.setData({
        payOn: false
      })
    } else {
      this.setData({
        payOn: true
      })
    }
  },

  handlePayment: function(e) {

  },

  handleSubmitP2g: function(e) {
    const which = this.data.currentNavTab;
    const user_id ={
      user_id: App.globalData.user._id
    }
    const val = {
      project_images: this.data.images.project_images,
      project_type: this.data.checkedProject
    }

    Object.assign(val, e.detail.value, user_id);
    console.log(val);

    if(!this.data.payOn) {

      const constr_url = this.data.url.informationUrl + "?which=" + which;
      console.log(constr_url)
      qcloud.request({
        url: constr_url,
        login: false,
        method: "POST",
        data: val,

        success: res => {
          const data = res.data;
          console.log(data);
        },

        fail: res => {
          console.log(res)
        }
      })
    }
  },

  //非监听函数
  showToptips(content) {
    Toptips(content);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try{
      var avatarUrl = "../../images/avatar.png";
      if(App.globalData.user && App.globalData.user.avatar !== undefined) {
        avatarUrl = App.globalData.user.avatar;
      }

      this.setData({
        avatarUrl: avatarUrl,
        nickName: App.globalData.user.name
      })
    } catch(e) {
      console.log(e)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //具体是checkUserInfoSettingStatu
    //util.checkSettingStatus();
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