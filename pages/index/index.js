//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    infoShow:'none',
    hasUserInfo:{},
    cardInfo:{},
    icon:{"txt":'111'}
  },
  onLoad: function () {
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

    this.getCard();   //获取名片信息
   
  },
  animate: function () {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.height
    console.log(0)
  },
  //获取名片信息
  getCard:function(){
    var that=this
    app.getCardInfo(function (data) {
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
})