// index.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArray:[],
    //当前页码
    pageNum: 0,
    triggered: false,
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
    this.getData(true)
  },
  /**
   * 获取数据
   * @param {是否刷新} isRefresh 
   */
  getData: function (isRefresh) {
    var that = this
    var currentPageNum = isRefresh ? 0 : that.data.pageNum + 1
    wx.request({
      url: 'https://www.wanandroid.com/article/list/' +currentPageNum + '/json',
      success: function (result) {
        var newData = JSON.parse(JSON.stringify(result.data));
        // console.log(newData.data.datas)
        //大于最大页码时候 返回
        if(currentPageNum > newData.data.pageCount) return
        var list = new Array();
        newData.data.datas.forEach((item, index, array) => {
          //添加数据
          list.push({
            author: item.shareUser,
            isSetTop: index == 0 || index == 1 ? true : false,
            time: item.niceDate,
            content: item.title,
            original: item.superChapterName + "/" + item.chapterName,
            isFocus: item.collect,
            link: item.link
          })
        })
        if (isRefresh) {
          that.setData({
            dataArray: []
          })
        }
          that.setData({
            ["dataArray["+currentPageNum+"]"]: list,
            triggered: false,
            pageNum:currentPageNum
          })
        that._freshing = false
      }
    })
  },
  /**
   * 加载更多
   */
  loadMore(e) {
    this.getData(false)
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.getData(true)
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },

  /**
   * 点击时事件
   */
  onItemClick: function (event) {
    var toughIndex = event.currentTarget.dataset.index
    if (this.data.articleList[toughIndex].link != null) {
      wx.navigateTo({
        url: this.data.articleList[toughIndex].link,
      })
    }
  },
  /**
   * 点击收藏
   */
  onFocus: function (event) {
    var toughIndex = event.currentTarget.dataset.index
    this.setData({
      ['articleList[' + toughIndex + '].isFocus']: !this.data.articleList[toughIndex].isFocus
    })

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
