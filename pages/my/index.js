// pages/my/index.js
var app = getApp();
function init(that){
  that.setData({
    userInfo: app.globalData.userInfo
  })
}

/**
 * 取得购物车商品数量
 */
function get_sum(that) {
  var cartCount;
  var info = {
    session_id: wx.getStorageSync('session_id'),
    token: wx.getStorageSync('token')
  }

  app.func.post('Cart/cart_count', info, function (res) {
    if (res.isError) {
      cartCount = res.result.count
    }

    that.setData({
      cartCount
    })
  })
}

Page({
  data: {
    orderList:[
      {
        name:"待付款",
        index:"1"
      },
      {
        name: "待发货",
        index: "2"
      },
      {
        name: "待收货",
        index: "3"
      },
      {
        name: "已完成",
        index: "4"
      }
    ],
    userInfo:{}
  },
  onLoad: function (options) {
    var that = this;
    init(that);
    get_sum(that);
  },
  onShow:function(){
    get_sum(this)   //检测购物车数量
  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '15081630312'
    })
  }
  
})