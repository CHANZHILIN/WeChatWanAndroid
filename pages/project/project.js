// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: "",
    officialList: [],
    currentSelected: 0,
    dataArray: [],
    //当前页码
    pageNum: 0,
    //总页数
    totalPageNume: 0,
    isPull: false
  },
  //绑定swiper
  bindChange(e) {
    let position = e.detail.current
    
    let moveToMiddleIndex = position - 2 < 0 ? 0 : position - 2
    this.setData({
      currentSelected: position,
      toView: this.data.officialList[moveToMiddleIndex].viewId
    })

    let id = this.data.officialList[position].id
    this.getDataList(true, id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOfficicalTitleListData()
  },
  //头部导航点击选中
  onOfficialClick: function (event) {
    var toughtIndex = event.currentTarget.dataset.index
    let moveToMiddleIndex = toughtIndex - 2 < 0 ? 0 : toughtIndex - 2
    this.setData({
      currentSelected: toughtIndex,
      toView: this.data.officialList[moveToMiddleIndex].viewId
    })

  },
  /**
   * 项目分类列表数据
   */
  getOfficicalTitleListData: function () {
    let that = this
    let suffixUrl = '/project/tree/json'
    app.wxRequest("GET", suffixUrl, null,
      (res) => {
        let list = new Array()
        res.forEach((item, index, array) => {
          list.push({
            id: item.id,
            viewId: 'project_' + item.id,
            courseId: item.courseId,
            name: item.name,
            isCheck: index == 0 ? true : false
          })
        })

        that.setData({
          officialList: list
        })

        let id = that.data.officialList[that.data.currentSelected].id
        that.getDataList(true, id)
      },
      (err) => { })
  },

  /**
* 获取项目数据
* @param {是否刷新} isRefresh 
* @param {项目id} id
*/
  getDataList: function (isRefresh, id) {
    let that = this
    let currentPageNum = isRefresh ? 0 : that.data.pageNum + 1
    //大于最大页码时候 返回
    if (currentPageNum > that.data.totalPageNume) {
      wx.showToast({
        title: '到底了~',
      })
      return
    }
    let suffixUrl = '/project/list/' + currentPageNum + '/json?cid=' + id
    app.wxRequest("GET", suffixUrl, null,
      (res) => {
        let list = new Array()
        res.datas.forEach((item, index, array) => {
          //添加数据
          list.push({
            id: item.id,
            author: item.author != "" ? item.author : item.shareUser,
            desc: item.desc,
            picSrc: item.envelopePic,
            projectUrl: item.projectLink,
            isNew: item.fresh,
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
            totalPageNume: res.pageCount
          })
        }
        that.setData({
          ["dataArray[" + currentPageNum + "]"]: list,
          pageNum: currentPageNum,
          isPull: false
        })

   
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
        url: '../web_view/webView?artUrl=' + this.data.dataArray[arrayIndex][toughIndex].link
      })
    }
  },
  onProjectUrlClick: function (event) {
    var link = event.currentTarget.dataset.link
    if (link != null) {
      wx.navigateTo({
        url: '../web_view/webView?artUrl=' + link
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
      ["dataArray[" + arrayIndex + "][" + toughIndex + "].isFocus"]: !this.data.dataArray[arrayIndex][toughIndex].isFocus
    })

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
   * 刷新
   */
  refresh: function () {
    let that = this
    that.setData({
      isPull: true
    })
    let id = this.data.officialList[this.data.currentSelected].id
    this.getDataList(true, id)

    setTimeout(() => {
      that.setData({
        isPull: false
      })
    }, 5000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  loadMore: function () {
    let id = this.data.officialList[this.data.currentSelected].id
    this.getDataList(false, id)
  }
  ,
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})