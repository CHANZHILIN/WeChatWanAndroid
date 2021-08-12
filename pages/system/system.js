// pages/system/system.js
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        toView: "",
        systemHeaderList: [],
        currentSelected: 0,
        dataArray: []
    },

    /**
 * 公众号作者列表数据
 */
    getOfficicalTitleListData: function () {
        let that = this
        let suffixUrl = '/wxarticle/chapters/json'
        app.wxRequest("GET", suffixUrl, null,
            (res) => {
                let list = new Array()
                list.push({
                    id: 'system',
                    name: "体系",
                    isCheck: true
                })
                list.push({
                    id: 'nav',
                    name: "导航",
                    isCheck: false
                })

                that.setData({
                    systemHeaderList: list
                })

                let id = that.data.systemHeaderList[that.data.currentSelected].id
                that.getDataList(id)
            },
            (err) => { })
    },
    /**
    * 获取数据
    * @param {类型，1为体系，2为导航} type
    */
    getDataList: function (type) {
        let that = this
        let suffixUrl = type == 'system' ? '/tree/json' : '/navi/json'
        app.wxRequest("GET", suffixUrl, null,
            (res) => {
                let list = new Array()
                res.forEach((item, index, array) => {
                    var subName = ""
                    item.children.forEach((childItem, childIndex, childArray) => {
                        subName =subName+ (childIndex+1) +":"+ childItem.name + "\t"
                    }
                    ),
                        //添加数据
                        list.push({
                            title: item.name,
                            content: subName
                        })
                })

                that.setData({
                    ["dataArray[0]"]: list
                })
                wx.stopPullDownRefresh()
            },
            (err) => { })
    },
    //头部导航点击选中
    onSystemHeaderClick: function (event) {
        var toughtIndex = event.currentTarget.dataset.index
        var oldSelected = this.data.currentSelected


        let moveToMiddleIndex = toughtIndex - 2 < 0 ? 0 : toughtIndex - 2
        this.setData({
            ["systemHeaderList[" + oldSelected + "].isCheck"]: false,
            ["systemHeaderList[" + toughtIndex + "].isCheck"]: true,
            currentSelected: toughtIndex,
            toView: this.data.systemHeaderList[moveToMiddleIndex].viewId
        })
        let id = this.data.systemHeaderList[toughtIndex].id
        this.getDataList(id)

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOfficicalTitleListData();
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
        let id = this.data.systemHeaderList[this.data.currentSelected].id
        this.getDataList(id)
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