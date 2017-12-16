// pages/addaddr/index.js
var app = getApp();
function init(_addr_id, that) {
    var addrInfo;
    var form = that.data.form;
    var region = that.data.region;
    var info = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      addr_id: _addr_id
    }
    app.func.post('Shop/get_addr_info', info, function (res) {
      console.log(res)
      if (res.isError) {
        addrInfo = res.result;
        form.name = addrInfo.name;
        form.mobile = addrInfo.mobile;
        form.detail = addrInfo.detail;
        form.code = addrInfo.code;
        region[0] = addrInfo.province;
        region[1] = addrInfo.city;
        region[2] = addrInfo.dis;
      }
      wx.setTopBarText({
        text: '编辑收货地址'
      })
      that.setData({
        form,
        region,
        addr_id: _addr_id
      })
      console.log(region)
      setDisabled(that)
    })
}
function setDisabled(that){
  var data = that.data.form;
  if (data.name == '' || data.mobile == '' || data.detail == ''){
    that.setData({
      disabled: true
    })
    return;
  }
  that.setData({
    disabled: false
  })
}
Page({
  data:{
    addr_id: null,
    form:{
      name: "",   // 收货人姓名
      mobile: "", // 联系电话
      detail: "", // 详细地址
      code: "",    // 邮政编码
    },
    region: ['广东省', '广州市', '海珠区'],
    disabled:true
  },
  onLoad:function(options){
    var that = this;
    if (options.addr_id){
      init(options.addr_id, this);
    }
  },
  bindRegionChange:function(event){
    var value = event.detail.value;
    this.setData({
      region: value
    })
  },
  // 获取收货人名字
  Input: function(e) {
    var type = e.currentTarget.dataset.name;
    var form = this.data.form;
    switch(type){
      case 'name': form.name = e.detail.value;
            break;
      case 'mobile': form.mobile = e.detail.value;
        break;
      case 'detail': form.detail = e.detail.value;
        break;
      case 'code': form.code = e.detail.value;
        break;
    }
    this.setData({
      form
    })
    setDisabled(this)
  },
  // 删除地址
  deleteAddr:function(){
      var data = {
        session_id: wx.getStorageSync('session_id'),
        token: wx.getStorageSync('token'),
        address_id: this.data.addr_id
      }
      app.func.showModal("", "确定要删除该地址吗?", "取消", "确定", function(res){
          app.func.post('Shop/del_address', data, function (res) {
            console.log(res)
            if (res.isError) {
              wx.navigateBack({
                url: '../addr/index'
              })
            }
          })
      })
  },
  // 保存收货人信息
  formSubmit: function(event) {
    var form = this.data.form;
    var info = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      addr_id: this.data.addr_id,
      name: form.name,
      mobile: form.mobile,
      detail: form.detail,
      code: form.code,
      province: this.data.region[0],
      city: this.data.region[1],
      dis: this.data.region[2],
    }
    app.func.post('Shop/edit_addr', info, function (res) {
      console.log(res)
      if (res.isError) {
        app.func.showToast("保存成功!")
        wx.navigateBack({
          url: '../addr/index'
        })
      }
    })
  }
})