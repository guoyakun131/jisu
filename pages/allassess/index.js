// pages/allassess/index.js
var app = getApp();
function init(that,id){
  var data = {
    id: id
  }
  app.func.post('Shop/goods_comment', data, function (res) {
    if (res.isError) {
      console.log(res)
      that.setData({
        assessList: res.result
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assessList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    init(this, options.id)
  },
  preview:function(event){
    var index = event.currentTarget.dataset.index;
    var assessList = this.data.assessList;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [] // 需要预览的图片http链接列表
    })
  }
})