// pages/detial/detial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsId: 0,
    content: [],
    newsTitle: '',
    source: '',
    date: '',
    readCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      newsId: options.newsId,
    })
    this.getNewsDetial(this.data.newsId)
  },

  /**
   * 获取新闻详情
   */
  getNewsDetial(newsId) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: newsId,
      },
      success: res => {
        console.log(res.data.result)
        this.setData({
          content: res.data.result.content,
          newsTitle: res.data.result.title,
          source: res.data.result.source,
          date: res.data.result.date.substr(11, 5),
          readCount: res.data.result.readCount,
        })
      }
    })
  }
})