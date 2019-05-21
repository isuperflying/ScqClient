
var sid
var page = 1
var list = ['g1.jpg', 'g2.jpg', 'g3.jpg', 'g4.jpg', 'g5.jpg', 'g6.jpg']

Page({
  data:{
    is_load_more: false,
    top_img: '../image/def_top_gif.jpg'
  },
  onLoad:function(e){
    wx.setNavigationBarTitle({
      title: 'gif热门图'
    })

    if (list.length % 3 > 0) {
      for (var i = 0; i < list.length; i++) {
        if (i == list.length - 1) {
          list[i].fixStyles = 'margin-right : auto;'
        }
      }
    }

    this.setData({
      array: list
    });
  },
  
  imagedetail: function (e) {
    var index = e.currentTarget.dataset.index

    wx.navigateTo({
      url: '../gifgenerate/gifgenerate?index=' + index
    })
  }
})