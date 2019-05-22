//home.js

const app = getApp();
var dotsFirst = true;
var list;
var types;
var banners;
var page =1;
var baseUrl = 'http://192.168.1.3:8899/'
Page({
  data: {
    array: [],
    typedata:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    is_load_more:false,
    showModal:false,
    baseUrl:baseUrl
  },

  getHomeData: function (that){
    page = 1;
    list = null;
    var Page$this = this;
    wx.request({
      url: 'http://192.168.1.3:8899/querysourceinfolist',
      method: 'POST',
      data: {},
      success: function (res) {
        console.log(res.data);

        wx.stopPullDownRefresh();
        list = res.data.data;
        
        that.setData({
          array: list
        });
      },
      fail:function(res){
        wx.stopPullDownRefresh()
      }
    })
  },

  onLoad: function () {
    page = 1;
    list = null;
    var Page$this = this;
    this.getHomeData(Page$this);
    wx.setNavigationBarTitle({
      title: '腾牛生成神器'
    })
  },

  onPullDownRefresh:function(){
    var Page$this = this;
    this.getHomeData(Page$this);
  },

  onReachBottom:function(){
    
    var Page$this = this;
    page++;
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=Home&c=zbsq&a=client&version=3.5',
      method: 'GET',
      data: {
        'page': page
      },
      success: function (res) {
        list = list.concat(res.data.data);
        Page$this.setData({
          array: list,
          is_load_more: false
        });
      },
      fail:function(res){
        Page$this.setData({
          is_load_more: false
        })
      }
    })
    this.setData({
      is_load_more:true
    })
  },
  create:function(event){
    var sid = event.currentTarget.dataset.sid;
    console.log('sid--->' + sid)
    //加锁
    // if (data.is_vip == 1){
    //   this.setData({
    //     showModal: true
    //   });
    //   return;
    // }
    
    wx.navigateTo({
      //url: '../createbefore/createbefore?itemdata=' + encodeURIComponent(JSON.stringify(data))
      url: '../createbefore/createbefore?id=' + sid
    })
  },

  banner:function(event) {
    var banner_item = event.currentTarget.dataset.item;
    console.log(banner_item);
    var obj;
    if (typeof banner_item === "string") {
      obj = JSON.parse(banner_item)
    } else {
      obj = banner_item;
    }

    wx.navigateTo({
      url: '../category/category?banner_id=' + obj.id + '&type_name=' + obj.title +'&type=2'
    })
  },

  category:function(event){
    var index = event.currentTarget.dataset.index;
    console.log(index);
    if(index == 3){
      // this.setData({
      //   showModal: true
      // });

      wx.navigateTo({
        url: '../collection/collection'
      })

      return;
    }

    var type_item = event.currentTarget.dataset.item;
    
    var obj;
    if (typeof type_item === "string") {
      obj = JSON.parse(type_item)
    }else{
      obj = type_item;
    }

    wx.navigateTo({
      url: '../category/category?type_id=' + obj.id + '&type_name=' + obj.name + '&type=1'
    })
  },

   /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    console.log("hide");
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }
})


