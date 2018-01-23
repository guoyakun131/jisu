// pages/logistics/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    orderNumber:'',
    Traces:''
    // Logistics: {
    //   "LogisticCode": "475848677741",
    //   "ShipperCode": "ZTO",
    //   "Traces": [{
    //     "AcceptStation": "[宁波市] [余姚低塘]的手机配件已收件 电话:13056743088",
    //     "AcceptTime": "2018-01-19 18:10:22"
    //   }, {
    //     "AcceptStation": "[宁波市]快件离开余姚已发往邢邯转运中心",
    //     "AcceptTime": "2018-01-19 22:09:06"
    //   }],
    //   "State": "2",
    //   "EBusinessID": "1321050",
    //   "Success": true
    // }
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
  //查看物流
  getLogistics:function(){
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      //token: wx.getStorageSync('token'),
      order_id: this.data.orderId
    }
    app.func.post('User/express_info',data,function(res){

      
      console.log(res.Traces);
        that.setData({
          //是否查询成功
          Success: res.Success,
          //快递号
          LogisticCode: res.LogisticCode,
          //物流信息
          Traces:res.Traces
        })
     // }
    })
  }
})