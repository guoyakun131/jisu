// pages/assess/index.js
var app = getApp();
Page({
  data:{
    starIndex:0,
    content:'',
    orderId:'',
    id: '',
    shopImg: '',
    spec: '',
    base_url: app.globalData.base_url
  },
  onLoad:function(options){
    this.setData({
      orderId: options.orderId,
      id: options.id,
      shopImg: options.img,
      spec: options.spec,
    })
  },
  setStarIndex:function(event){
    var starIndex = event.currentTarget.dataset.index;
    this.setData({
      starIndex: starIndex + 1
    })
  },
  // 输入
  input:function(event){
    this.setData({
      content: event.detail.value
    })
  },
  // 评价提交
  submit:function(){
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      order_id: this.data.orderId,
      goods_id: this.data.id,
      spec: this.data.spec,
      content: this.data.content
    }
    console.log(data)
    app.func.post('User/goods_comment',data,function(res){
      console.log(res)
      if (res.isError){
        app.func.showToast('商品评价成功!');
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }
    })
  }
})