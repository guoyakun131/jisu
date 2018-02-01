
var WxParse = require('../wxParse/wxParse.js');
var app = getApp()

function articleInfo(that,id){
  var data = {
   id:id
  }
  app.func.post('article/articleInfo', data, function (res) {
    console.log(res)
    var content = res.article.content;
    WxParse.wxParse('articleDetail', 'html', content, that, 15);

    that.setData({
      article:res.article,
      goods:res.goods,
      user:res.user
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


  data: {
    base_url: app.globalData.base_url,
    input: "hide",
    num: "show",
    money: "1.00",
    ranmod: "show",
    quxiao: "hide",
    dashang: "hide",
    redback: "redhide",
    focus:false,
    jine:0
  },

  onLoad: function (options) {
    articleInfo(this, options.id);
    browse(this, options.id);
  },



  random: function () {
    var moneys = [0.88, 1.88, 6.66, 0.99, 8.88, 0.66, 7.77, 5.55, 2.22, 3.88, 1.11];


    var id = Math.ceil(Math.random(0, 10) * 10);

    var money = moneys[id];
    this.setData({
      money: money
    })

  },
  modify: function () {
    this.setData({
      input: "show",
      num: "hide",
      ranmod: "hide",
      quxiao: "show",
      focus:true
    })
  },
  quxi: function () {
    this.setData({
      input: "hide",
      num: "show",
      ranmod: "show",
      quxiao: "hide",
      focus: false
    })
  },
  dashang: function () {
    this.setData({
      dashang: "show",
      redback: "redshow"
    })
  },
  close: function () {
    this.setData({
      dashang: "hide",
      redback: "redhide"
    })
  },

  Input: function (e) {
    var je = e.detail.value;
   this.setData({
     jine:je
   })
  },


  /**
  * 支付
  */
  wxPay: function (event) {
    var that = this;
    //订单id
    var id = event.currentTarget.dataset.id;
    var money = event.currentTarget.dataset.money;
    var focus = event.currentTarget.dataset.focus;
    console.log("订单Id" + id + money + focus)
    if (focus){
      var data = {
        session_id: wx.getStorageSync('session_id'),
        id: id,
        jine:that.data.jine
      }
    }else{
    var data = {
      session_id: wx.getStorageSync('session_id'),
      id: id,
      jine:money
    }
    }
    app.func.post('article/dashang', data, function (res) {
      that.doWxPay(res)
    })
  },
  doWxPay(res) {
    var that = this;
    console.log(res.timeStamp)
    console.log(res.nonceStr)
    console.log(res.package)
    console.log(res.paySign)
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: res.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: res.nonceStr,
      package: res.package,
      signType: 'MD5',
      paySign: res.paySign,
      success: function (event) {
        // success   
        console.log(event);
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
        that.tabs(2);
      },
      fail: function (error) {
        // fail   
        console.log("支付失败")
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          duration: 2000
        });
        console.log(error)
      },
      complete: function () {
        // complete   
        console.log("pay complete")
      }
    });
  },

})