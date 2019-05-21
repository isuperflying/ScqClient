var app = getApp();
var list;
var page = 1;
var type_id;
var banner_id;
var use_id;
var mtype;
Page({
  data: {
    isShow: true,
    currentTab: 0,
    array: [],
    showModal: false,
    is_load_more: false,
  },

  onLoad: function (options){

    console.log('onLoad---->')

    page = 1
    list = null
    type_id = 0
    banner_id = 0
    use_id = 0
    mtype = 0;

    if (options != null && options.type_id != null){
      type_id = options.type_id;
    }
    if (options != null && options.banner_id != null) {
      banner_id = options.banner_id;
    }

    if (options != null && options.type != null) {
      mtype = parseInt(options.type);
    }

    console.log(typeof mtype)

    if (mtype == 1){
      use_id = type_id;
    }
    if (mtype == 2) {
      use_id = banner_id;
    }

    var Page$this = this;
    this.getData(Page$this, mtype);

    wx.setNavigationBarTitle({
      title: options.type_name
    })
    wx.showLoading({
      title: '加载中',
    })

  },
  create: function (event) {
    var data = event.currentTarget.dataset.itmedata;

    // if (data.is_vip == 1) {
    //   this.setData({
    //     showModal: true
    //   });
    //   return;
    // }
    console.log("data--->" + JSON.stringify(data));

    wx.navigateTo({
      //url: '../createbefore/createbefore?itemdata=' + encodeURIComponent(JSON.stringify(data))
      url: '../createbefore/createbefore?id=' + data.id
    })
  },
  onReachBottom: function () {
    page++;
    var Page$this = this;
    
    this.setData({
      is_load_more: true
    })
    this.getData(Page$this);
  },

  onPullDownRefresh: function () {
    page = 1;
    list = null;
    var Page$this = this;
    this.getData(Page$this,mtype);
  },

  getData: function (that,gtype) {
    //console.log("tttt "+ typeof gtype)
    //console.log("type_id ---" + type_id)
    //console.log("banner_id ---" + banner_id)
    //console.log("user_id ---" + type_id)

    console.log("page--->" + page)
    var rurl = 'https://nz.qqtn.com/zbsq/index.php?m=Home&c=zbsq&a=getCateList';
    if (gtype == 2){
      rurl = 'https://nz.qqtn.com/zbsq/index.php?m=Home&c=zbsq&a=getSlideMore';
    }
    //最新
    wx.request({
      url: rurl,
      method: 'POST',
      data: {
        'page': page,
        'id': use_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if(list != null){
          console.log("concat---->");
          list = list.concat(res.data.data);
        }else{
          console.log("new---->");
          list = res.data.data;
        }

        that.setData({
          array: list,
          is_load_more: false
        });
      },
      fail: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        Page$this.setData({
          is_load_more: false
        })
      }
    })
  },
  /**
    * 弹出框蒙层截断touchmove事件
    */
  preventTouchMove: function () { },
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