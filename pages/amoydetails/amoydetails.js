Page({


  data: {
    input: "hide",
    num: "show",
    money: "1.00",
    ranmod: "show",
    quxiao: "hide",
    dashang: "hide",
    redback: "redhide",
    focus:false,
  },

  onLoad: function () {


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
  }

})