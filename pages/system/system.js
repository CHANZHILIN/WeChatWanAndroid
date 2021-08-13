// pages/system/system.js
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //TabLayout数据
        systemHeaderList: [],
        //TabLayout当前选择
        currentSelected: 0,
        // 体系数据
        dataArray: [],
        //导航数据
        navDataArray: [],
        //导航-左侧栏选择位置
        navCurrentSelected: 0,
        //内容高度
        contentheight: 0,
        //滑动到导航右侧指定位置
        scrollToRightId: ""
    },
    //头部导航点击选中
    onSystemHeaderClick: function (event) {
        let toughtIndex = event.currentTarget.dataset.index
        this.setData({
            currentSelected: toughtIndex
        })
    },
    //绑定swiper
    bindChange(e) {
        let position = e.detail.current
        this.setData({
            currentSelected: position
        })

        let id = this.data.systemHeaderList[position].id
        this.getDataList(id)
    },
    //导航页-左侧导航选择
    onNavClick: function (event) {
        let toughtIndex = event.currentTarget.dataset.index
        let oldSelected = this.data.navCurrentSelected
        this.setData({
            ["navDataArray[" + oldSelected + "].isCheck"]: false,
            ["navDataArray[" + toughtIndex + "].isCheck"]: true,
            navCurrentSelected: toughtIndex,
            scrollToRightId: this.data.navDataArray[toughtIndex].titleId
        })
    },
    /**
     * 右侧item点击
     */
    onNavRightClick: function (event) {
        let link = event.currentTarget.dataset.link
        if (link != null) {
            wx.navigateTo({
                url: '../web_view/webView?artUrl=' + link
            })
        }
    },
    /**
     * 滑动监听
     */
    scrollListener: function (event) {
        let that = this
        let dy = event.detail.deltaY
        let scrollTop = event.detail.scrollTop
        let current = that.data.navCurrentSelected
        let data = that.data.navDataArray
        if (dy < 0) { //上滑
            let nextIndex = current >= data.length ? current : current + 1
            let downDistance = data[nextIndex].topDistance - 35 //35是marginTop的高度
            if (scrollTop >= downDistance) {
                that.setData({
                    ["navDataArray[" + current + "].isCheck"]: false,
                    ["navDataArray[" + nextIndex + "].isCheck"]: true,
                    navCurrentSelected: nextIndex
                })
            }
        } else {
            //下滑
            let lastIndex = current == 0 ? current : current - 1
            let upDistance = data[lastIndex].topDistance
            if (scrollTop <= upDistance) {
                that.setData({
                    ["navDataArray[" + current + "].isCheck"]: false,
                    ["navDataArray[" + lastIndex + "].isCheck"]: true,
                    navCurrentSelected: lastIndex
                })
            }
        }
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
                that.data.systemHeaderList.forEach((item, index, array) => {
                    that.getDataList(item.id)
                })
                //                 let id = that.data.systemHeaderList[that.data.currentSelected].id
                //                 that.getDataList(id)
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
                            titleId: 'nav' + item.cid,
                            topDistance: 0, //保存title到顶部的距离
                            articles: item.articles
                        })
                    })
                    that.setData({
                        navDataArray: list
                    })
                    //遍历计算距离
                    this.data.navDataArray.forEach((item, index, array) => {
                        wx.createSelectorQuery().select('#' + item.titleId).boundingClientRect(res => { //获取每个title距离顶部高度
                            that.setData({
                                ["navDataArray[" + index + "].topDistance"]: res.top
                            })
                        }).exec()
                    })
                }

                wx.stopPullDownRefresh()

            },
            (err) => {})
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOfficicalTitleListData();
        //减号前面是获取当前窗体的高度单位为px，40是头部tab的高度，单位是rpx
        var contentH = wx.getSystemInfoSync().windowHeight - 35;
        this.setData({
            contentheight: contentH
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
        // let id = this.data.systemHeaderList[this.data.currentSelected].id
        // this.getDataList(id)
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