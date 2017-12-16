/**引用common/js/index.js */
var js = require('/common/js/index');
//app.js
App({
  //生命周期函数--监听小程序初始化
  //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

/**获取用户信息 */
  getUserInfo:function(){
    var that = this
      //调用登录接口
    wx.login({
      success: function (res) {
        //获取登录code,然后换取openid跟session_key
        if (res.code){
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              /**请求参数 */
              var data = {
                js_code: code,
                //用户名称
                nick_name: res.userInfo.nickName,
                //头像url
                avatar: res.userInfo.avatarUrl
              }
              console.log(data)
              /**发送登录请求 */
              that.func.post('User/login', data, function (res) {
                console.log(res)
                if (res.isError) {
                  //wx.setStorageSync("token", res.result.token);
                  wx.setStorageSync("session_id", res.session_id);
                }
              })
            }
          })
        }
      }
    })
  },

  globalData:{
    userInfo:null,
    // appid: "wx4274f3ea5516d94c",
    // secret: "e573bfd063761434312f473def762ecd",
    //base_url: "https://liangyi120.xin/ds/"
    base_url:"https://liangyi120.xin/"
  },
  func:{
    post:js.post,
    get: js.get,
    getOpenId: js.getOpenId,
    getData: js.getData,
    chooseImg: js.chooseImg,
    upFile: js.upFile,
    showModal: js.showModal,
    showAlert: js.showAlert,
    showToast: js.showToast
  }
})