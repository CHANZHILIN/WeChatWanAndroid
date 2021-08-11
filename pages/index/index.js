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
    //总页数
    totalPageNume:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(true)
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
  },
  /**
   * 获取数据
   * @param {是否刷新} isRefresh 
   */
  getData: function (isRefresh) {
    let that = this
    let currentPageNum = isRefresh ? 0 : that.data.pageNum + 1
    //大于最大页码时候 返回
    if(currentPageNum > that.data.totalPageNume) return
    let suffixUrl = '/article/list/' +currentPageNum + '/json'
    app.wxRequest("GET", suffixUrl, null,
        (res) => {
            let list = new Array()
            res.datas.forEach((item, index, array) => {
              //添加数据
              list.push({
                id:item.id,
                author: item.author != ""? item.author:item.shareUser,
                isSetTop: index == 0 || index == 1 ? true : false,
                isNew:item.fresh,
                time: item.niceDate,
                content: item.title,
                original: item.superChapterName + "/" + item.chapterName,
                isFocus: item.collect,
                link: item.link
              })
            })
            if (isRefresh) {
              that.setData({
                dataArray: [],
                totalPageNume:res.pageCount
              })
            }
              that.setData({
                ["dataArray["+currentPageNum+"]"]: list,
                pageNum:currentPageNum
              })
              wx.stopPullDownRefresh()
        },
        (err) => { })
  },

  /**
   * 点击时事件
   */
  onItemClick: function (event) {
    var arrayIndex = event.currentTarget.dataset.array
    var toughIndex = event.currentTarget.dataset.index
    if (this.data.dataArray[arrayIndex][toughIndex].link != null) {
      wx.navigateTo({
        // url: this.data.dataArray[arrayIndex][toughIndex].link,
        url: '../web_view/webView?artUrl='+this.data.dataArray[arrayIndex][toughIndex].link
      })
    }
  },
  /**
   * 点击收藏
   */
  onFocus: function (event) {
    var arrayIndex = event.currentTarget.dataset.array
    var toughIndex = event.currentTarget.dataset.index
    this.setData({
      ["dataArray["+arrayIndex+"]["+toughIndex+"].isFocus"]:!this.data.dataArray[arrayIndex][toughIndex].isFocus
      // ['articleList[' + toughIndex + '].isFocus']: !this.data.articleList[toughIndex].isFocus
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
    this.getData(true)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 5000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
