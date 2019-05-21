
var sid
var page = 1
var list =
  [
    { 'title': '为所欲为', 'url':'https://soy.qqtn.com/sorry/'},
    { 'title': '王境泽', 'url': 'https://soy.qqtn.com/wangjingze/' },
    { 'title': '土拨鼠', 'url': 'https://soy.qqtn.com/marmot/' },
    { 'title': '偷电动车', 'url': 'https://soy.qqtn.com/diandongche/' },
    { 'title': '打工', 'url': 'https://soy.qqtn.com/dagong/' },
    { 'title': '金坷垃', 'url': 'https://soy.qqtn.com/jinkela/' }
  ]
Page({
  data: {
  },
  onLoad: function (e) {
    
    var index = e.index
    console.log(index)

    wx.setNavigationBarTitle({
      title: list[index].title
    })
    console.log(list[index].url)
    this.setData({
      url: list[index].url
    });
  },

  imagedetail: function (e) {
    var index = e.currentTarget.dataset.index

    wx.navigateTo({
      url: '../gifgenerate/gifgenerate'
    })
  }
})