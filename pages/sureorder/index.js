// pages/sureorder/index.js
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cart_sel: '',
    address_id: '',
    base_url: app.globalData.base_url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cart_sel: options.cart_sel
    });
    init(options.cart_sel, this);
  },
  onShow:function(){
    init(this.data.cart_sel, this);
  },
  // 留言
  orderDes: function(e) {
    this.setData({
      des: e.detail.value
    })
  },

  // 提交订单信息
  subOrder: function() {
    var info = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      cart_sel:this.data.cart_sel,
      address_id: this.data.addrSel.id,
      sum: this.data.all_sum,
      des: this.data.des
    }
    console.log(info)
    app.func.post('Shop/add_order', info, function (res) {
      console.log(res)
      if (res.isError) {
        wx.showToast({
          title: '订单提交成功！',
          icon: 'success',
          duration: 3000
        })

        wx.redirectTo({
          url: '../order/index'
        })
      }
    })
  }
})

/**
 * 订单确认页面初始化
 */
function init(_cart_sel, that) {
  var cartListSel;
  var addrSel;
  var goods_sum;
  var express_sum;
  var all_sum;
  var info = {
    session_id: wx.getStorageSync('session_id'),
    token: wx.getStorageSync('token'),
    cart_sel: _cart_sel
  }
  app.func.post('Shop/conf_order', info, function (res) {
    console.log(res)
    if (res.isError) {
      cartListSel = res.result.cart_list_sel,
      addrSel = res.result.addr_sel,
      goods_sum = res.result.goods_sum,
      express_sum = res.result.express_sum,
      all_sum = res.result.all_sum
    }

    that.setData({
      cartListSel,
      addrSel,
      goods_sum,
      express_sum,
      all_sum
    })
  })
}
