// index.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   // 数据源
   articleList:[]
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
    var list = new Array();
    for(var i = 0;i<100;i++){
     list.push( {
      author:"扔物线"+i,
      isSetTop:i==0 || i==1 ?true:false,
      time:"2021-08-09",
      content:"Android"+i,
      original:"WanAndroid/干货分享"+i,
      isFocus:false
     })
    }
  
    this.setData({
      articleList:list
    })
  },
  /**
   * 点击收藏
   */
  onFocus:function(event){
    var toughIndex = event.currentTarget.dataset.index
    this.setData({
      ['articleList['+toughIndex+'].isFocus']: !this.data.articleList[toughIndex].isFocus
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
