// pages/order/index.js
var app = getApp();

/**
 * 订单列表初始化
 */
function init(that, index){
  var tabIndex = that.data.tabIndex;
  that.setData({
    tabIndex: index
  })
}

/**
 * 取得订单列表
 */
function getOrder(that){
  var info = {
    session_id: wx.getStorageSync('session_id'),
    token: wx.getStorageSync('token'),
    status: that.data.tabIndex
  }
  that.setData({
    loadingFlag:true
  })
  app.func.post('User/order_list', info, function(res){
    console.log(res)
    if (res.isError) {
        that.setData({
          orderList: res.result,
          loadingFlag:false
        })
    }
  })
}
Page({
  data:{
    tabList:["全部","待发货","待收货","待评价","已完成"],
    statusList:['待付款','待发货','待收货','待评价','已完成','订单关闭'],
    buttonList: ['取消订单', '取消订单', '确认收货', '删除订单', '删除订单', '删除订单'],
    tabIndex:0,
    orderList:[],
    loadingFlag:false,
    base_url: app.globalData.base_url
  },
  onLoad:function(options){
    var that = this;
    var index = options.index;
    if(index){
      init(that, index);
    }
    getOrder(that);
  },
  onShow:function(){
    getOrder(this);//检测订单
  },
  // tab切换
  tab:function(event){
    var index = event.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    })
    getOrder(this)
  },
  // 订单操作
  handle:function(event){
    var that = this;
    var status = event.currentTarget.dataset.status;
    var index = event.currentTarget.dataset.index;
    var orderList = this.data.orderList;
    var id = event.currentTarget.dataset.id;
    var txt = '';
    var type;
    if (status == 0 || status == 1){
      txt = '取消订单资金将原路返回';
      type = 1;
    } else if (status == 2){
      txt = '您确定货物已收到';
      type = 2;
    } else if (status == 3 || status == 4 || status == 5){
      txt = '您将删除该订单';
      type = 3;
    }
    var data = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      type: type ,
      order_id:id
    }
    console.log(data)
    app.func.showModal("", txt, "取消","确定",function(){
      app.func.post('User/change_order_status',data,function(res){
        console.log(res)
        if (res.isError){
          if (res.result.status == 6){
            orderList.splice(index,1);
          }else{
            orderList[index].status = res.result.status;
          }
          that.setData({
            orderList
          })
        }
      })
    })
  },
  // 查看物流
  goLogistics:function(event){
    var id = event.currentTarget.dataset.id;
    var number = event.currentTarget.dataset.number;
    wx.navigateTo({
      url: '../logistics/index?id=' + id + '&number=' + number
    })
  },
  // 去评价
  goAssess: function (event){
    var orderid = event.currentTarget.dataset.orderid;
    var id = event.currentTarget.dataset.id;
    var img = event.currentTarget.dataset.img;
    var spec = event.currentTarget.dataset.spec;
    wx.navigateTo({
      url: '../assess/index?orderId=' + orderid + '&id=' + id + '&img=' + img + '&spec=' + spec
    })
  }
})