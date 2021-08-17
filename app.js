// app.js
App({
  //设置全局请求URL
  globalData: {
    base_url: 'https://www.wanandroid.com',
  },
  /**
   * 统一请求网络封装
   */
  wxRequest(method, suffixUrl, data, callback, errFun) {
   wx.showLoading({
     title: '数据加载中...',
   })
     
    let that = this
    console.log("network-request:\n" + "method：" + method + "\n" + "Url：" + this.globalData.base_url + suffixUrl + "\n" + "params：" + data);
    wx.request({
      url: this.globalData.base_url + suffixUrl,
      method: method,
      data: data,
      header: {
        'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        wx.hideLoading({
          title: '数据加载中...',
        })
        //返回的数据
        console.log("network-success-response:"+that.globalData.base_url + suffixUrl+"\n")
        let response = JSON.parse(JSON.stringify(res.data));
        console.log(response)
        if (response.errorCode == 0) {
          callback(response.data);
        } else {
          wx.showToast({
            title: '访问网络失败',
          });
          errFun(response.errorMsg);
        }
      },
      fail: function (err) {
        wx.hideLoading({
          title: '数据加载中...',
        })
        console.log("network-error-response:"+that.globalData.base_url + suffixUrl+"\n")
        let error = JSON.parse(JSON.stringify(err));
        wx.showToast({
          title: '访问网络失败',
        });
        console.log(error.errMsg)
        errFun(error);
      }
    })
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }
})
