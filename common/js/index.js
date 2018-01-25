/**服务器地址 https://liangyi120.xin/ds/api.php/*/
var allurl = "https://qubing.net.cn/ly/api/";
//var allurl = "https://liangyi120.xin/ds/api.php/";
 //var allurl = "https://192.168.1.108/api/";
//var allurl = "https://192.168.1.108/ly/api/";
/**发送POST网络请求：参数:url,data,cb */
function postReq(url,data,cb){
  wx.request({
    url: allurl + url,
    data:data,
    method:"post",
    header:{
      "content-type":"application/x-www-form-urlencoded"
    },
    success:function(res){
      return typeof cb == "function" && cb(res.data);
    },
    fail: function (res) {
      if (!res.isError && res.errorType == 1){
        console.log("过期了")
      }
      // return typeof cb == "function" && cb(false);
    }
  })
}
/**发送GET网络请求：参数:url,data,cb */
function getReq(url,data,cb){
    wx.request({
      url: allurl + url,
      data:data,
      method:"get",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(res){
          return typeof cb == "function" && cb(res.data);
      },
      fail: function () {
        return typeof cb == "function" && cb(false);
      }
    })
}
function isErrow(msg){
  this.setData({
    alertShow:true,
    alertMsg:msg
  })
}
function chooseImg(count,cb){
  wx.chooseImage({
    count: count,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function(res) {
      return typeof cb == "function" && cb(res)
    },
    fail: function(res) {
      return typeof cb == "function" && cb(false);
    }
  })
}
/**上传 */
function upFile(url,filePath,name,formData,cb){
    wx.uploadFile({
      url: allurl + url,
      filePath: filePath,
      name: name,
      header:{
        'content-type': 'multipart/form-data'
      },
      formData: formData,
      success:function(res){
        if (res.statusCode == 200 && !res.data.result_code){
          return typeof cb == "function" && cb(res.data);
        }else{
          return typeof cb == "function" && cb(false);
        }
      },
      fail:function(){
        return typeof cb == "function" && cb(false);
      }
    })
}
function sendTem(openid, templateid, page, formid, data,appid,secret,cb){
    var data = {
      touser: openid,
      template_id: templateid,
      page: page,
      form_id: formid,
      data:data
    }
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret,
      method: 'get',
      success: function(res) {
        wx.request({
          url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.access_token,
          data: data,
          method: 'post',
          success: function(res) {},
          fail: function() {
            return typeof cb == "function" && cb(false);
          }
        })
      },
      fail: function() {
        return typeof cb == "function" && cb(false);
      }
    })
}
function showModal(title, content,cct,cft,cb){
  wx.showModal({
    title: title,
    content: content,
    cancelText: cct,
    confirmText: cft,
    success: function(res) {
      if (res.confirm){
        return typeof cb == "function" && cb(res)
      }
    }
  })
} 
function showAlert(title, content) {
  wx.showModal({
    title: title,
    content: content,
    confirmText: '确定',
    showCancel:false
  })
} 
function getData(appid, secret,data,cb){
  wx.request({
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret,
    method: 'get',
    data:data,
    success: function(res) {
      wx.request({
        url: 'https://api.weixin.qq.com/datacube/getweanalysisappiddailysummarytrend?access_token=' + res.data.access_token,
        method: 'post',
        success: function(res) {
          console.log(res)
          return cb == "function" && cb(res);
        },
        fail: function() {
          return cb == "function" && cb(false);
        }
      })
    },
    fail: function(res) {}
  })
}
/**获取openid */
function getOpenId(appid, secret,code,cb){
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code+'&grant_type=authorization_code',
      method: 'post',
      success: function(res) {
        return typeof cb == "function" && cb(res)
      },
      fail: function(res) {
        return typeof cb == "function" && cb(false);
      },
    })
} 
function showToast(txt){
  wx.showToast({
    title: txt,
    icon: 'success',
    duration: 1000,
    mask: true,
  })
}
 
module.exports = {
    post:postReq,
    get:getReq,
    upFile:upFile,
    sendTem: sendTem,
    getOpenId: getOpenId,
    getData:getData,
    showToast: showToast,
    chooseImg: chooseImg,
    upFile: upFile,
    showModal: showModal,
    showAlert: showAlert
}