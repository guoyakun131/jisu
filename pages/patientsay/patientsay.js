var WxParse = require('../wxParse/wxParse.js');
var app = getApp()

function articleInfo(that, id) {
  var data = {
    id: id
  }
  app.func.post('article/articleInfo', data, function (res) {
    console.log(res)

    var content = res.article.content;
    WxParse.wxParse('articleDetail', 'html', content, that, 15);

    that.setData({
      article: res.article,
      goods: res.goods,
      user: res.user
    })
  })
}

function browse(that, id) {
  var data = {
    session_id: wx.getStorageSync('session_id'),
    id: id
  }
  app.func.post('article/browse', data, function (res) {

  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_url: app.globalData.base_url
  },

  onLoad: function (options) {
    articleInfo(this, options.id);
    browse(this, options.id);
  },
})