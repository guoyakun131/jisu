//index.js
//获取应用实例
const app = getApp()
var Array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var contontHeigth = Array.length * 203;
var tabsheaderArray=
[
  {
    "name":"热门",
    "current":0
  },
  {
    "name": "美丽说",
    "current": 1
  },
  {
    "name": "激素脸",
    "current": 2
  },
  {
    "name": "红血丝",
    "current": 3
  },
  {
    "name": "扁平疣",
    "current": 4
  },
  {
    "name": "青春痘",
    "current": 5
  },
  {
    "name": "痤疮",
    "current": 6
  },
  {
    "name": "偏头痛",
    "current": 7
  },
  {
    "name": "黄褐斑",
    "current": 8
  },
  {
    "name": "银屑病",
    "current": 9
  },
  {
    "name": "白癜风",
    "current": 10
  },
  {
    "name": "玫瑰糠疹",
    "current": 11
  },
  {
    "name": "药疹",
    "current": 12
  },
  {
    "name": "皮肤癣",
    "current": 13
  },
  {
    "name": "杂病论",
    "current": 14
  },

]
Page({
  data: {
   
    scrollLeft: 0, //tab标题的滚动条位置
    currentTab: 0, //预设当前项的值
    array: Array,
    tabsheaderArray: tabsheaderArray,
    url:"../amoydetails/amoydetails"

  },
  switchTab: function (e) {
    var currentTab=e.detail.current
    if(currentTab==1){
      this.setData({
        url:"../patientsay/patientsay"
      })
    }else{
      this.setData({
        url:"../amoydetails/amoydetails"
      })
    }
    this.setData({
      currentTab: currentTab
    });
    this.checkCor();
  },

  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    
    var cur = e.target.dataset.current;

    if(cur==1){
      this.setData({
        url: "../patientsay/patientsay"
      })
    } else {
      this.setData({
        url: "../amoydetails/amoydetails"
      })
    }
    

    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab == 5) {
      this.setData({
        scrollLeft: 250
      })
    } 
    
    if(this.data.currentTab < 5) {
      this.setData({
        scrollLeft: 0
      })
    }
    if (this.data.currentTab == 11) {
      this.setData({
        scrollLeft: 480
      })
    }
   
    

  },
  onLoad: function () {
    console.log(this);
    this.setData({
      contontHeight: contontHeigth
    })
  }

})
