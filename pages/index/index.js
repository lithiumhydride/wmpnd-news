// pages/index/index.js

const shiftLimit = { x: 60, y: 60 }   //滑动切换新闻类型时，触发切换的位移限制

const dftImg = '/images/default-img.png'   //未获取到新闻图片时的默认图片

var touchStart   //记录触摸开始坐标

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 新闻类型
    newsType: [
      { type: 'gn', name: '国内' },
      { type: 'gj', name: '国际' },
      { type: 'cj', name: '财经' },
      { type: 'yl', name: '娱乐' },
      { type: 'ty', name: '体育' },
      { type: 'other', name: '其他' },
    ],
    currentNewsType: 'gn',   // 当前激活的新闻类型(初始默认为国内)
    newsList: [],   //新闻列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewsList()
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //下拉刷新新闻列表(通过回调函数，在列表加载完成后结束下拉动作)
    this.getNewsList(() => {
      wx.stopPullDownRefresh()
    })  
  },

  /**
   * 新闻列表点击事件的处理函数
   */
  onTapNewsList(event) {
    this.setData({
      currentNewsType: event.currentTarget.dataset.type,
    })
    this.getNewsList()
  },

  /**
   * 获取新闻列表
   */
  getNewsList(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.currentNewsType,
      },
      success: res => {
        //获取新闻列表数据
        let newsList = res.data.result
        //新闻列表数据处理
        for (let i = 0; i < newsList.length; i++) {
          //修改接口获取到的新闻时间的格式
          let newsDate = newsList[i].date.substr(0, 10)
          let newsTime = newsList[i].date.substr(11, 5)
          newsList[i].date = `${newsDate} ${newsTime}`

          //若接口未返回新闻图片，设置默认图片
          if (newsList[i].firstImage == '')
            newsList[i].firstImage = dftImg
        } 
        this.setData({
          newsList: newsList
        })
      },
      complete: res => {
        callback && callback()
      },
    })
  },

  /**
   * 点击跳转新闻详情页
   */
  onTapNewsDetial(event) {
    let newsId = event.currentTarget.dataset.newsid
    console.log(newsId)
    wx.navigateTo({
      url: `/pages/detial/detial?newsId=${newsId}`,
    })
  },

  /**
   * 滑动切换新闻类型
   */
  onSwitchTypeStart(event) {
    //记录触摸开始的位置坐标
    touchStart = event.changedTouches[0]
  },
  onSwitchTypeEnd(event) {
    //获取触摸开始及结束时的坐标
    let startX = touchStart.pageX
    let startY = touchStart.pageY
    let endX = event.changedTouches[0].pageX
    let endY = event.changedTouches[0].pageY

    //计算水平方向与垂直方向的位移
    let shiftX = endX - startX
    let shiftY = Math.abs(endY - startY)
    
    //获取当前新闻类型在列表中的索引
    let typeIndex = this.getCurrentTypeIdx()

    //判断位移是否触发切换
    if (shiftY < shiftLimit.y && shiftX > shiftLimit.x) {
      //触发左滑切换
      typeIndex -= 1
      //判断是否已经到最左边的新闻类型
      if (typeIndex < 0)
        typeIndex = 0
    } else if (shiftY < shiftLimit.y && shiftX < -shiftLimit.x) {
      //触发右滑切换
      typeIndex += 1
      //判断是否已经到最右边的新闻类型
      if (typeIndex >= this.data.newsType.length)
        typeIndex = this.data.newsType.length - 1
    }

    //获取切换后的新闻类型
    let chengedType = this.data.newsType[typeIndex].type

    //判断新闻类型是否发生变化
    if (chengedType != this.data.currentNewsType) {
      this.setData({
        currentNewsType: chengedType
       })
      this.getNewsList()
    }
  },

  /**
   * 获取当前新闻类型在列表中的索引值
   */
  getCurrentTypeIdx() {
    let currentType = this.data.currentNewsType
    let typeList = this.data.newsType
    //利用Array的findIndex函数获取当前新闻类型在新闻类型列表中的索引
    let idx = typeList.findIndex(function(tmpType) {
      return tmpType.type == currentType
    })
    return idx
  }
})