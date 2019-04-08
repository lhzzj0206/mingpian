//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    infoShow: 'none',
    hasUserInfo: {}
  },
  onLoad: function () {
    console.log(wx.getStorageSync('userInfo'))

  },
})
