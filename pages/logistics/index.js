// pages/logistics/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    orderNumber:'',
    Logistics:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId: options.id,
      orderNumber:options.number
    })
    this.getLogistics();
  },
  // 查看物流
  getLogistics:function(){
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      order_id: this.data.orderId
    }
    app.func.post('User/express_info',data,function(res){
      if (res.isError) {
        that.setData({
          Logistics: res.result
        })
      }
    })
  }
})