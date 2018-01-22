//index.js
//获取应用实例
var app = getApp(); 
// function getUserInfo(){
//   //获取用户信息,显示到页面上
//   app.getUserInfo(function (userInfo) {
//     // 将用户信息存 放到userinfo对象中,
//     // wx.setStorageSync("userInfo", userInfo);
//     // console.log(userInfo)
//     // var appid = app.globalData.appid;
//     // var secret = app.globalData.secret;
//     // var code = app.globalData.code;
//     // app.func.getOpenId(appid, secret, code, function (res) {
//     //   console.log(res.data)
//     //   wx.setStorageSync("openid", res.data.openid);
//     //   var user = {
//     //     "open_id": res.data.openid,
//     //     "nick_name": userInfo.nickName,
//     //     "avatar": userInfo.avatarUrl
//     //   }
//     //   app.func.post('User/login', user, function (res) {
//     //     console.log(res.result.token);
//     //     wx.setStorageSync("token", res.result.token);
//     //     wx.setStorageSync("session_id", res.result.session_id);
//     //   })
//     // });
//   })
// }

/**
 * 取得商品列表
 */
// 引入SDK核心类

function getData(that, index){
  console.log(index)
  var shopList = that.data.shopList;
  var loadingFlag = that.data.loadingFlag;
  if (shopList[index].length == 0){
    var data = {
      type: index
    }
    that.setData({
      loadingFlag: true
    })
   
    
    app.func.post('Shop/goods_list', data, function (res) {
      console.log(res.result);
     
      //if (res.isError) {
        shopList[index] = res.result;
      //}
      that.setData({
        shopList,
        loadingFlag: false
      })
    })
  }
}

/**
 * 取得商品数量
 */
function getNums(that) {
  var nums;
  var data = {
    type: 0
  }
  app.func.post('Shop/goods_count', data, function (res) {
   // if (res.isError) {
      nums = res.result;
     
    //}

    that.setData({
      nums
    })
  })
}
/**通告 */
function g(that) {
 wx.request({
   url: 'https://qubing.net.cn/ly/api/Shop/g',
   method: "post",
   success(res){
     that.setData({
      text:res.data
     })
   }
 })
}

Page({
 
  data: {
    text:[],
    imageUrl:'../../common/img/spa.jpg',
    //全部上新热销
    tabList: ['全部', '上新', '热销'],
    shopList:[[],[],[]],
    address:"邯郸市丛台区丛台路489号",
    lx: "联系商家",
    tabIndex: 0,
    loadingFlag:false,
    base_url: app.globalData.base_url
  },
  clikmap: function (e) {
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          name:"邯郸市丛台区丛台路489号"
        })
      },
    })
  },
  calling:function(){
    wx.makePhoneCall({
      phoneNumber: '15081630312',
    })
  },
 
  onLoad: function (options) {
    // 实例化API核心类

    // 调用接口
    
    //new
    // wx.getLocation({
    //   type:'wgs84',
    //   success: function(res) {},
    // })
    wx.authorize({
      //对应接口：用户信息
      scope: 'scope.userInfo',
      success: function (res) {
        console.log("认证")
        app.getUserInfo();
      }
    })
    //检查用户登录是否有效
    wx.checkSession({
      fail: function() {
        console.log("失效了")
        app.getUserInfo();
      }
    })

/**调用通告 */
    g(this);
  
    // 取得各类型商品数量
    getNums(this);

    // 初始化时，加载商品列表
    getData(this, this.data.tabIndex);
  },
  tab: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
  
    
    that.setData({
      tabIndex: index
    })
    getData(that,index);
  },
  //转发
  onShareAppMessage:function(){
    return{
      title:'良一科技',
      path: '/pages/index/index',
      success: function (res) {
        app.func.showToast('转发成功!')
      }
    }
  }
})
