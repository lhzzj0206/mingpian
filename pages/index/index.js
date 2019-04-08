//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    infoShow:'none',
    hasUserInfo:{},
    animationData:{},
    isShow:false,
    cardInfo:{},
  },
  onLoad: function (option) {
    var that=this
    //判断是否授权
    app.getInfo(function(res){
      if(res=="0"){  //未授权
        that.setData({
          infoShow:'block'
        })
        wx.removeStorageSync('userInfo')
      }else{
        wx.setStorageSync('userInfo', res)
      }
    })

       //获取名片信息
    wx.showShareMenu({
      withShareTicket: true
    })
    if (option.scene == undefined) {
      app.getOpenid(function (openid) {
        app.globalData.openid = openid;
        that.getCard(openid);
      })
    } else {
      app.globalData.openid = option.scene;
      app.shar_to(option.scene)
      app.addVisitLog(option.scene)
    }
   
  },
  //获取名片信息
  getCard:function(openid){
    var that=this
    app.getCardInfo(openid,function (data) {
      var imgs = []
      var avatar = data.avatar == undefined ? 'images/no.png' : data.avatar
      
      if (data.pictures.length > 0) {
        for (var i = 0; i < data.pictures.length; i++) {
          imgs.push(data.pictures[i].filePath)
        }
      }
      wx.getImageInfo({
        src: avatar,//服务器返回的图片地址
        success: function (res) {
          var obj = {
            name: app.replace(data.name),   //姓名
            company: app.replace(data.companyName),//公司名
            avatar: app.replace(res.path),  //头像----上传的头像
            weixin: app.replace(data.wxNum),//微信
            phone: app.replace(data.mobile),//手机号
            zuoji: app.replace(data.phone),//座机号
            Email: app.replace(data.email),//邮箱
            address: app.replace(data.address),//地址
            position: app.replace(data.position),//职位
            intro: app.replace(data.intro),
            people_images: imgs
          }
          that.setData({
            cardInfo: obj
          })
        }
      })
    })
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo == undefined){
      //点击拒绝授权
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '需允许授权才能创建名片',
      })
      return false
    }else{
      //同意授权
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        infoShow: 'none'
      })
    }
  },
  //保存到通讯录
  screen: function () {
    var that = this;
    // 提示呼叫号码还是将号码添加到手机通讯录
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        if (res.tapIndex === 0) {
          // 呼叫号码
          wx.makePhoneCall({
            phoneNumber: that.data.phone,
          })
        } else if (res.tapIndex == 1) {
          // 添加到手机通讯录
          wx.addPhoneContact({
            firstName: that.data.cardInfo.name,//联系人姓名
            mobilePhoneNumber: that.data.cardInfo.phone,//联系人手机号
            workAddressStreet: that.data.cardInfo.address,
            mobilePhoneNumber: that.data.cardInfo.phone,    //手机号
            photoFilePath: that.data.cardInfo.avatar,
            weChatNumber: that.data.cardInfo.weixin,
            organization: that.data.cardInfo.company,
            title: that.data.cardInfo.position,
            workPhoneNumber: that.data.cardInfo.zuoji,
            email: that.data.cardInfo.Email,
          })
        }
      }
    })
  },
  //打开名片详情
  openDetails:function(){
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.height(400).step()
    that.setData({
      animationData: animation.export(),
      // 改变显示条件
      isShow: true
    })
  },
  //关闭名片详情
  closeDetails:function(){
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.height(0).step()
    that.setData({
      animationData: animation.export(),
      // 改变显示条件
      isShow: false
    })
  },
  //复制
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  //拨号
  call: function (e) {
    var num = e.currentTarget.dataset.num
    wx.makePhoneCall({
      phoneNumber: num,
    })
  },
  //分享
  onShareAppMessage: function (res) {
    console.log(wx.getStorageSync('userInfo'))
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '疯狂吧名片',
      path: '/pages/index/index?scene=' + app.globalData.openid,
      // imagesUrl: 'http://www.grldsoft.com/miniapp/img/bg2.png',
      success: function (res) {
        // 转发成功
        // 如果这里有 shareTickets，则说明是分享到群的
        //console.log(res.shareTickets)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //名片码
  getCode:function(){
    app.saveCode(this.data.cardInfo)
  }
})
