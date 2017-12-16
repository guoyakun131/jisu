// pages/cart/index.js
var app = getApp();
function init(that){
  var editList = that.data.editList;
  var cartList = that.data.cartList;
  for (var i = 0; i < cartList.length;i++){
    editList[i] = false;
  }
  that.setData({
    editList
  })
  check1(that);
}

/**
 * 计算购物车商品价格
 */
function getSum(that) {
  var cartList = that.data.cartList;
  var sum = 0;
  var shopNumber = 0;
  sum = 0;
  for (var i = 0; i < cartList.length; i++) {
    if (cartList[i].select) {
      sum += cartList[i].price * cartList[i].nums
    }
  }

  that.setData({
    sum
  })
}

/**
 * 初始化全选
 */
function check1(that) {
  var allCheck = that.data.allCheck;
  var cartList = that.data.cartList;
  var checkNumber = that.data.checkNumber;
  if (allCheck) {
    for (var i = 0; i < cartList.length; i++) {
      cartList[i].select = true;
      checkNumber = cartList.length;
      console.log(checkNumber);
    }
  } else {
    for (var i = 0; i < cartList.length; i++) {
      cartList[i].select = false;
      checkNumber = 0;
    }
  }
  that.setData({
    cartList,
    checkNumber
  })
  getSum(that);
}

/**
 * 单个勾选事，判断
 */
function check2(that, carItem) {
  var checkNumber = that.data.checkNumber;
  var cartList = that.data.cartList;
  var allCheck = that.data.allCheck;
  if (carItem.select) {
    checkNumber++
  } else {
    checkNumber--
  }
  if (checkNumber == cartList.length) {
    allCheck = true;
  } else {
    allCheck = false;
  }
  that.setData({
    allCheck,
    checkNumber
  })
  getSum(that);
}

/**
 * 购物车列表
 */
function cart_list(that) {
  var _cartList;
  var info = {
    session_id: wx.getStorageSync('session_id'),
    token: wx.getStorageSync('token'),
  }
  that.setData({
    loading:false
  })
  app.func.post('Cart/cart_list', info, function (res) {
    console.log(res)
    if (res.isError) {
      _cartList = res.result;
    }

    that.setData({
      cartList: _cartList,
      loading: true
    })

    init(that);
  })
}

/**
 * 删除购物车商品
 */
function delCart(that, _cart_id, index) {
    var cartListOrg = that.data.cartList
    var info = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      cart_id: _cart_id
    }

    app.func.post('Cart/del_cart', info, function (res) {
      if (res.isError) {
        cartListOrg.splice(index, 1)
      }

      that.setData({
        cartList: cartListOrg
      })

      getSum(that)
    })
}

/**
 * 计算购物车商品价格
 */
function count_price(that) {
    var cartList = that.data.cartList;
    var cart_count = 0;

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i]['select']) {
        cart_count += cartList[i]['price']
      }
    }

    that.setData({
      cartCount: cart_count
    })
}

Page({
  data:{
    editFlag:true,
    sliderFlag:true,
    allCheck:true,
    cartList:[],
    sum:0,
    checkNumber:0,
    editList:[],
    base_url: app.globalData.base_url,
    del_cart_id: 0,
    cartCount: 0,
    loading:true
  },
  onLoad: function (){
    cart_list(this);
    // init(this);
  },
  onShow:function(){
    console.log(this.data.editFlag)
    cart_list(this);
  },
  edit:function(){
    var editFlag = this.data.editFlag;
    var editList = this.data.editList;
    var cartList = this.data.cartList;
    var sliderFlag = this.data.sliderFlag;
    for (var i = 0; i < cartList.length;i++){
      editList[i] = false;
    }
    this.setData({
      editFlag: !editFlag,
      sliderFlag: !sliderFlag,
      editList
    })
  },
  addNum:function(event){
    var that = this;
    var index = event.currentTarget.dataset.index;
    var cart_id = event.currentTarget.dataset.id;
    var cartList = this.data.cartList;
    cartList[index].nums ++;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      token: wx.getStorageSync('token'),
      cart_id: cart_id,
      nums: cartList[index].nums
    }
    console.log(data)
    app.func.post('Cart/edit_cart',data,function(res){
      console.log(res)
      if (res.isError){
        that.setData({
          cartList
        })
        getSum(that)
      }else{
        app.func.showToast(res.errorMessage)
      }
    })
  },
  delNum:function(event){
    var that = this;
    var index = event.currentTarget.dataset.index;
    var cart_id = event.currentTarget.dataset.id;
    var cartList = this.data.cartList;
    if (cartList[index].nums>=2){
      cartList[index].nums--;
      var data = {
        session_id: wx.getStorageSync('session_id'),
        token: wx.getStorageSync('token'),
        cart_id: cart_id,
        nums: cartList[index].nums
      }
      app.func.post('Cart/edit_cart', data, function (res) {
        console.log(res)
        if (res.isError) {
          getSum(that)
          that.setData({
            cartList
          })
        } else {
          app.func.showToast(res.errorMessage)
        }
      })
    }
  },
  touchStart: function (event) {
    var editList = this.data.editList;

    var editFlag = this.data.editFlag;
    if (!editFlag) return;

    for (var i = 0; i < editList.length;i++){
      editList[i] = false;
    }
    this.setData({
      startX: event.changedTouches[0].clientX,
      startY: event.changedTouches[0].clientY,
      editList
    })
  },
  touchMove: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var startX = this.data.startX;
    var startY = this.data.startY;
    var touchMoveX = event.changedTouches[0].clientX;
    var touchMoveY = event.changedTouches[0].clientY;
    var editList = this.data.editList;

    var editFlag = this.data.editFlag;
    if (!editFlag) return;

    var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    if (Math.abs(angle) > 30) return;
    for (var i = 0; i < editList.length; i++) {
      editList[i] = false;
      if (touchMoveX > startX) {
        editList[index] = false
      } else {
        editList[index] = true
      }
    }
    that.setData({
      editList: editList
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  allCheck: function () {
    var that = this;
    var allCheck = this.data.allCheck;
    this.setData({
      allCheck: !allCheck
    })
    check1(that)
  },
  check: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var cartList = this.data.cartList;
    cartList[index].select = !cartList[index].select;
    this.setData({
      cartList: cartList
    })
    check2(that, cartList[index]);
  },
  delete: function (event){
    var that = this
    var index = event.currentTarget.dataset.index;
    app.func.showModal("", "确认要删除该宝贝吗？", "再等等", "狠心抛弃", function(res){
      if (res.confirm){
        delCart(that, event.currentTarget.id, index);
      }
    })
  },
  deleteMuch:function(){
    var cartList = this.data.cartList;
    app.func.showModal("", "确认要删除选中的宝贝吗？", "再等等", "狠心抛弃", function (res) {
      if (res.confirm) {
        
      }
    })
  },
  submit:function(){
    // 购物车列表
    var list = this.data.cartList;
    // 被选中的商品
    var cart_sel = '';
    for (var i = 0; i < list.length; i++) {
      if (list[i]['select']) {
        if (cart_sel) {
          cart_sel += ',' + list[i]['cart_id']
        } else {
          cart_sel += list[i]['cart_id']
        }
      }
    }
    wx.setStorageSync("cart_sel", cart_sel);
    wx.navigateTo({
      url: '../sureorder/index?cart_sel=' + cart_sel
    })
  }
})