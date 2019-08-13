//home.js

const app = getApp();
var dotsFirst = true;
var list;
var types;
var banners;
var page =1;
var baseUrl = 'https://xxx/scqapi/'
var is_vip = 0;
let userInfo;

Page({
  data: {
    array: [],
    typedata: [
      {'id':'1','ico':'../image/t1.png','name':'表白'},
      { 'id': '2','ico': '../image/t2.png', 'name': '恶搞' },
      { 'id': '3','ico': '../image/t3.png', 'name': '炫富' },
      { 'id': '4','ico': '../image/t4.png', 'name': '证书' }],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    is_load_more:false,
    showModal:false,
    baseUrl:baseUrl,
    is_vip: is_vip
  },

  getHomeData: function (that){
    page = 1;
    list = null;
    var Page$this = this;
    wx.request({
      url: 'https://xxx/scqapi/querysourceinfolist',
      method: 'POST',
      data: {
        page:1
      },
      success: function (res) {
        console.log(res.data);

        wx.stopPullDownRefresh();
        list = res.data.data.sourcelist;
        banners = res.data.data.specials;
        console.log(banners);
        that.setData({
          array: list,
          banner: banners
        });
      },
      fail:function(res){
        wx.stopPullDownRefresh()
      }
    })
  },

  onLoad: function () {
    console.log('onLoad--->');
    page = 1;
    list = null;
    var Page$this = this;
    this.getHomeData(Page$this);
    wx.setNavigationBarTitle({
      title: '趣图生成器'
    })
  },
  
  onShow:function(){
    console.log('on show--->')
    userInfo = app.globalData.userInfo || wx.getStorageSync('user_info')
    if (userInfo){
      is_vip = userInfo.is_vip;
      this.setData({
        is_vip: is_vip,
      });
    }
  },

  onPullDownRefresh:function(){
    var Page$this = this;
    this.getHomeData(Page$this);
  },

  onReachBottom:function(){
    
    // var Page$this = this;
    // page++;
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   data: {
    //     'page': page
    //   },
    //   success: function (res) {
    //     list = list.concat(res.data.data);
    //     Page$this.setData({
    //       array: list,
    //       is_load_more: false
    //     });
    //   },
    //   fail:function(res){
    //     Page$this.setData({
    //       is_load_more: false
    //     })
    //   }
    // })
    // this.setData({
    //   is_load_more:true
    // })
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
      url: '../category/category?banner_id=1' + '&type_name=趣味表白&type=2'
    })
  },

  category:function(event){
    var index = event.currentTarget.dataset.index;
    console.log(index);
    // if(index == 3){
    //   // this.setData({
    //   //   showModal: true
    //   // });

    //   wx.navigateTo({
    //     url: '../collection/collection'
    //   })

    //   return;
    // }

    var type_item = event.currentTarget.dataset.item;
    
    var obj;
    if (typeof type_item === "string") {
      obj = JSON.parse(type_item)
    }else{
      obj = type_item;
    }
    console.log(obj.id + '---' + obj.name)
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
  },
  onShareAppMessage: function () {
    return {
      title: '不装逼的人生是没有意义的!',
      path: '/pages/home/home',
      imageUrl: '../image/share_img.jpg'
    }
  },
})


