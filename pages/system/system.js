// pages/system/system.js
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        systemHeaderList: [],
        currentSelected: 0,
        // 体系数据
        dataArray: [],
        //导航数据
        navDataArray: [],
        //导航-左侧栏选择位置
        navCurrentSelected:0
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
            (err) => {})
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
                if (type == 'system') { //体系数据
                    res.forEach((item, index, array) => {
                        var subName = ""
                        item.children.forEach((childItem, childIndex, childArray) => {
                                subName = subName + (childIndex + 1) + ":" + childItem.name + "\t"
                            }),
                            //添加数据
                            list.push({
                                title: item.name,
                                content: subName
                            })
                    })

                    that.setData({
                        ["dataArray[0]"]: list
                    })
                } else { //导航数据
                    res.forEach((item, index, array) => {
                        //添加数据
                        list.push({
                            isCheck: index == 0 ? true : false,
                            id: item.cid,
                            title: item.name,
                            articles: item.articles
                        })
                    })
                    that.setData({
                        navDataArray: list
                    })
                }
                wx.stopPullDownRefresh()
            },
            (err) => {})
    },
    //头部导航点击选中
    onSystemHeaderClick: function (event) {
        let toughtIndex = event.currentTarget.dataset.index
        let oldSelected = this.data.currentSelected

        this.setData({
            ["systemHeaderList[" + oldSelected + "].isCheck"]: false,
            ["systemHeaderList[" + toughtIndex + "].isCheck"]: true,
            currentSelected: toughtIndex
        })
        let id = this.data.systemHeaderList[toughtIndex].id
        this.getDataList(id)

    },
    //导航页-左侧导航选择
    onNavClick:function(event){
        let toughtIndex = event.currentTarget.dataset.index
        let oldSelected =  this.data.navCurrentSelected
        this.setData({
            ["navDataArray[" + oldSelected + "].isCheck"]: false,
            ["navDataArray[" + toughtIndex + "].isCheck"]: true,
            navCurrentSelected: toughtIndex
        })
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