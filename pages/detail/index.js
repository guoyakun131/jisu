// pages/detail/index.js
var WxParse = require('../wxParse/wxParse.js');

var app = getApp();
function setAnimation(start,end,flag,that){
  var animation = wx.createAnimation({
    duration: 400,
  })
  that.animation = animation

  animation.bottom(start).step()

  if (!flag){
    that.setData({
      hidden: flag,
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.bottom(end).step();
      that.setData({
        animationData: animation.export()
      })
    }.bind(that), 100)
  }else{
    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.bottom(end).step();
      that.setData({
        hidden: flag,
        animationData: animation.export()
      })
    }.bind(that), 400)
  }
}

/**
 * 取得商品详情
 */
function getGoodsDetail(that, goods_id) {
  var goodsInfo;
  var loadingFlag = that.data.loadingFlag;

  that.setData({
    loadingFlag: true
  })
  var data = {
    id: goods_id
  }
  app.func.post('Shop/goods_info', data, function (res) {
    console.log(res)
    if (res.isError) {
      goodsInfo = res.result;
    }

    WxParse.wxParse('goodsDetail', 'html', goodsInfo.content, that, 15);

    var str = goodsInfo.spec;

    goodsInfo['spec_arr'] = str.split(',');

    that.setData({
      goodsInfo,
      loadingFlag: false,
      spec: goodsInfo['spec_arr'][0]
    })
  })
}
function getAssess(that, goods_id){
  var data = {
    id: goods_id
  }
  app.func.post('Shop/goods_comment',data,function(res){
    console.log(res)
    if (res.isError){
      that.setData({
        assess: res.result
      })
    }
  })
}
Page({
  data:{
    id:'',
    hidden:true,
    assess:{},
    animationData:{},
    base_url: app.globalData.base_url,
    sel: 0,
    buy_nums: 1,
    spec: null
  },
  onLoad:function(options){
    this.setData({
      id: options.id
    })

    // 取得商品详情
    getGoodsDetail(this, options.id);
    getAssess(this, options.id)
  },
  showAction:function(){
    var that = this;
    setAnimation("-666rpx", "100rpx", false, that);
  },
  cancel:function(){
    var that = this;
    setAnimation("-666rpx", "100rpx", true, that)
  },
  // 切换商品规格
  changeSpec: function(e) {
      this.setData({
        sel: e.target.dataset.num,
        spec: e.currentTarget.id
      });
  },
  // 增加购买数量
  addNum: function() {
      this.setData({
        buy_nums:this.data.buy_nums + 1
      })
  },
  // 减少商品数量
  delNum: function() {
    if (this.data.buy_nums <= 1) {
      this.setData({
        buy_nums: 1
      })
    } else {
      this.setData({
        buy_nums: this.data.buy_nums - 1
      })
    }
  },
  // 加入购物车
  addCart: function() {
      var that = this;
      if (this.data.hidden) { // 处于显示状态状态
        // 显示规格和数量
        setAnimation("-666rpx", "100rpx", false, that);
      } else { // 处于隐藏状态
          var info = {
            session_id: wx.getStorageSync('session_id'),
            token: wx.getStorageSync('token'),
            nums: this.data.buy_nums,
            goods_id: this.data.goodsInfo.id,
            spec: this.data.spec
          }

          app.func.post('Cart/add_cart', info, function (res) {
            if (res.isError) {
              wx.showToast({
                title: '添加购物车成功！',
                icon: 'success',
                duration: 2000
              })
            }
          })
      }
  },
  // 立即购买
  buyNow: function () {
    var that = this;
    if (this.data.hidden) { // 处于显示状态状态
      // 显示规格和数量
      setAnimation("-666rpx", "100rpx", false, that);
    } else { // 处于隐藏状态
      var info = {
        session_id: wx.getStorageSync('session_id'),
        token: wx.getStorageSync('token'),
        nums: this.data.buy_nums,
        goods_id: this.data.goodsInfo.id,
        spec: this.data.spec
      }
     

      app.func.post('Cart/add_cart', info, function (res) {
        if (res.isError) {
          var cart_id = res.result.id
          wx.setStorageSync("cart_sel", cart_id);
          wx.navigateTo({
            url: '../sureorder/index?cart_sel=' + cart_id
          })
        }
      })
    }
  },
  //转发
  onShareAppMessage: function () {
    return {
      title: '商品详情',
      path: '/pages/detail/index',
      success: function (res) {
        app.func.showToast('转发成功!')
      }
    }
  }
})
