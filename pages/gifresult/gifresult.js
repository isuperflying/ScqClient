
var downUrl;
var pre_img;
var show_tip = true;
var res_title = '生成结果';
Page({
  data:{
    result_img:'/pages/image/no_data.png',
    showModalStatus: false
  },
  onShareAppMessage:function(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log("down--->" + downUrl)
    return {
      title: '腾牛生成神器',
      path: '/pages/gifresult/gifresult?rimg=' + pre_img ,
      imageUrl: downUrl,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },
  onLoad: function (options){

    wx.showLoading({
      title: '加载中',
    })

    var Page$this = this;
    if (options.rimg != null && options.rimg.indexOf('http') == -1) {
      options.rimg = "https://soy.qqtn.com" + options.rimg;
    }
    console.log("onLoad img --->" + options.rimg);

    downUrl = options.rimg;
    pre_img = options.rimg;
    this.setData({
      result_img: options.rimg
    })

    wx.setNavigationBarTitle({
      title: res_title
    })
    
  },

  onReady:function(e){
    wx.hideLoading()
  },
  preimage:function(e){
    if (pre_img != null) {
      wx.previewImage({
        urls: [pre_img],
        current: pre_img
      })
    }
  },
  saveImage:function(e){
    
    if(downUrl.indexOf('https') == -1){
      downUrl = downUrl.replace('http', 'https');
    }
    console.log("down img https--->" + downUrl);

    wx.showLoading({
      title: '正在保存',
    })

    //文件下载
    wx.downloadFile({
      url: downUrl,
      success:
      function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:
          function (data) {
            wx.hideLoading();
            console.log("save success--->"+data);
            wx.showToast({
              title: '图片已保存',
            })
          },
          fail:
          function (err) {
            wx.hideLoading();
            console.log(err);
            if(err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if(settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  }
                  else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  moreItem:function(e){
    wx.navigateTo({
      url: '../home/home'
    })
  },
  powerShow:function(e){
    var currentStatu = e.currentTarget.dataset.statu;
    //显示  
    if (currentStatu == "close") {
      this.setData(
        {
          showModalStatus: false
        }
      );
      wx.setStorage({
        key: "show_tip",
        data: false
      })
    }  
  }
})