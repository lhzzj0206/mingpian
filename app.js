//app.js
App({
  //localhost: 'http://192.168.0.12:8080/',
  // imgPath: 'http://192.168.0.12:8080/',
  localhost: 'https://www.grldsoft.com/',
  imgPath: 'https://www.grldsoft.com/',
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
  },
  //获取token
  getToken: function (fun) {
    var that = this
    wx.request({
      url: that.localhost + 'e-card/common/getToken', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        fun(res.data.access_token)
      }
    })
  },
  getOpenid: function (cb) {
    var that = this
    // 登录
    wx.login({
      success: function (res) {
        wx.request({
          url: that.localhost + 'e-card/common/login', //仅为示例，并非真实的接口地址
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            cb(res.data.openid)
          }
        })
      }
    })
  },
  getSessionKey: function (cb) {
    var that = this
    // 登录
    wx.login({
      success: function (res) {
        wx.request({
          url: that.localhost + 'e-card/common/login', //仅为示例，并非真实的接口地址
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            cb(res.data.session_key)
          }
        })
      }
    })
  },
  getInfo:function(fun){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              fun(res.userInfo)
            }
          })
        } else {
          fun('0')
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  },
  replace: function (str) {
    if (str == undefined) {
      return '无'
    } else {
      return str
    }
  },
  getCardInfo:function(fun){
    var that=this
    that.getOpenid(function(openid){
      wx.request({
        url: that.localhost + 'e-card/card/get', //仅为示例，并非真实的接口地址
        data: {
          openid: openid,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var data = res.data.record
          
          fun(data)
          
        }
      })
    })
    
  }
})