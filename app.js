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
  getCardInfo:function(openid,fun){
    var that=this
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
  },
  //递名片
  shar_to: function (open_id) {
    app.getOpenid(function (openid) {
      wx.request({
        url: app.localhost + 'e-card/card/share', //仅为示例，并非真实的接口地址
        data: {
          shareOpenid: open_id,  //分享人的openid（谁递的名片）
          acceptOpenid: openid//接受人的openid（递给谁）
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'succes',
          //   duration: 2000
          // })
        }
      })
    })
  },
  //名片日志
  addVisitLog: function (visitOpenid) {
    app.getOpenid(function (openid) {
      wx.request({
        url: app.localhost + 'e-card/card/addVisitLog', //仅为示例，并非真实的接口地址
        data: {
          visitOpenid: visitOpenid,  //分享人的openid（谁递的名片）
          masterOpenid: openid//接受人的openid（递给谁）
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'succes',
          //   duration: 2000
          // })
        }
      })
    })
  },
  //将名片生成图片保存至相册
  getCode: function (fun) {
    var that=this
    that.getOpenid(function (openid) {
      wx.request({
        url: that.localhost + 'e-card/common/getWXACode', //仅为示例，并非真实的接口地址
        data: {
          openid: openid,
          token: '',
          width: 300,
          autoColor: false,
          lineColor: '{"r":"94","g":"242","b":"255"}',
          isHyaline: true,

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.getImageInfo({
            src: that.imgPath + res.data.codePath,//服务器返回的图片地址
            success: function (res) {
              fun(res)
            }
          })
        }
      })
    })
  },
  saveCode:function(data){
    var that = this
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    that.getCode(function (res) {
      var codePath = res.path
      var width = 800
      var height = 1070
      var ctx = wx.createCanvasContext('myCanvas')
      ctx.drawImage('../../images/canvas.jpg', 0, 0, width, height)
      ctx.drawImage(data.avatar, width - 200, 60, 160, 160)
      ctx.drawImage(codePath, (width - 200) / 2, 500, 240, 240)
      ctx.setFontSize(32)
      ctx.setFillStyle("#333333")
      ctx.fillText(data.company, 40, 80)
      ctx.fillText(data.position, 240, 180)
      ctx.fillText(data.phone, 40, 260)
      ctx.fillText(data.Email, 40, 320)
      ctx.setFontSize(40)
      ctx.fillText(data.name, 40, 180)
      ctx.setFontSize(28)
      var str = '微信扫码或长按识别小程序码'
      var str1 = '长按图片保存名片到相册，分享微信或朋友圈'
      ctx.fillText(str, (width - ctx.measureText(str).width) / 2, 790)
      ctx.fillText(str1, (width - ctx.measureText(str1).width) / 2, 900)


      ctx.draw(false, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: width,
          height: height,
          destWidth: width * 2,
          destHeight: height * 2,
          canvasId: 'myCanvas',
          success(res) {
            wx.hideLoading()
            var arr = [res.tempFilePath]
            wx.previewImage({
              //当前显示图片
              current: arr[0],
              //所有图片
              urls: arr
            })
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })

                setTimeout(function () {
                  wx.hideLoading()
                }, 3000)

              },
              fail: function (err) {
                wx.hideLoading()
              }
            })
          }
        })
      })
    })
  }
})