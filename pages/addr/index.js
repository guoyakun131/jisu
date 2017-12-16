var app = getApp();

// pages/addr/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      getAddrList(this);
  },
  onShow:function(){
    getAddrList(this);
  },
  // 修改收货地址
  addrUp: function(e) {
    var addr_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../addaddr/index?addr_id=' + addr_id
    })
  },
  // 选择收货地址
  addrSel: function(e) {
      var that = this;
      var addrList = this.data.addrList;
      var index = e.currentTarget.dataset.index;
      var info = {
        session_id: wx.getStorageSync('session_id'),
        token: wx.getStorageSync('token'),
        addr_id: e.currentTarget.dataset.id
      }

      app.func.post('User/save_addr_sel', info, function (res) {
        if (res.isError) {
          for (var i in addrList){
            addrList[i].sel = 0
          }
          addrList[index].sel = 1;
          that.setData({
            addrList
          })
          wx.navigateBack({
            url: '../sureorder/index?cart_sel=' + wx.getStorageSync('cart_sel')
          })
        }
      })
  }
})

/**
 * 取得收货地址列表
 */
function getAddrList(that) {
  var addrList;
  var info = {
    session_id: wx.getStorageSync('session_id'),
    token: wx.getStorageSync('token')
  }

  app.func.post('Shop/addr_list', info, function (res) {
    console.log(res)
    if (res.isError) {
      addrList = res.result;
    }

    that.setData({
      addrList
    })
  })
}