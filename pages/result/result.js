
var downUrl;
var pre_img;
var show_tip = true;
var res_title;
var baseUrl = 'http://192.168.1.3:8899/'
Page({
  data:{
    result_img:'/pages/image/no_data.png',
    showModalStatus: false,
    baseUrl:baseUrl
  },
  onShareAppMessage:function(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log("down--->" + downUrl)
    return {
      title: '趣图生成器',
      path: '/pages/result/result?title=' + res_title + '&rimg=' + pre_img ,
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
    console.log('result options --->' + options.rimg)
    var Page$this = this;
    if (options.rimg != null && options.rimg.indexOf('https') == -1) {
      options.rimg = options.rimg.replace('http', 'https');
    }
    console.log("onLoad img --->" + options.rimg);

    downUrl = baseUrl + options.rimg;
    pre_img = baseUrl + options.rimg;
    res_title = options.title;
    this.setData({
      result_img: baseUrl + options.rimg,
      swidth: options.swidth,
      sheight: options.sheight
    })

    // wx.getImageInfo({
    //   src: options.rimg,
    //   success:function(res){
    //     Page$this.setData({
    //       result_img: res.path
    //     }) 
    //   }
    // })

    wx.setNavigationBarTitle({
      title: options.title
    })
    
    wx.getStorage({
      key: 'show_tip',
      success: function (res) {
        show_tip = res.data;
        console.log(show_tip);
        Page$this.setData(
          {
            showModalStatus: show_tip
          }
        );
      }
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
            console.log("save success--->"+data);
            wx.showToast({
              title: '图片已保存',
            })
          },
          fail:
          function (err) {
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