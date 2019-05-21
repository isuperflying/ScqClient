var data_files;
var crop_path = '/pages/image/add_img_icon.png';
var item_id;
var pre_img;
const app = getApp()
var width;
var height;
Page({
  data: {
    cimg: '',
    position: 0,
    cinput: false,
    flag_input: false,
    add_img: crop_path,
    swidth: 0,
    sheight: 0
  },
  onLoad: function (options) {
    //进入时设置初始图片
    app.avatar = ''
    crop_path = '/pages/image/add_img_icon.png';
    wx.showLoading({
      title: '加载中',
    })

    // if (options != null && options.itemdata != null) {
    //   data_files = JSON.parse(decodeURIComponent(options.itemdata));
    //   wx.setStorage({
    //     key: "data_files",
    //     data: data_files
    //   })
    // } else {
    //   console.log("avatar--->" + app.avatar);
    //   wx.getStorage({
    //     key: 'data_files',
    //     success: function (res) {
    //       data_files = res.data;
    //     }
    //   })
    // }

    console.log('id--->'+options.id)
    var Page$this = this;
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=home&c=zbsq&a=getItem',
      method: 'GET',
      data: {
        'id': options.id
      },
      success: function (res) {
        wx.hideLoading()
        data_files = res.data.data;
        Page$this.initData();
      },
      fail: function (res) {
        wx.hideLoading()
        console.log('fail--->')
      }
    })

  },

  initData:function(){
    if(data_files == null){
      wx.showToast({
        title: '数据有误，请重试',
      })
      return;
    }
    item_id = data_files.id;
    pre_img = data_files.front_img;

    wx.setNavigationBarTitle({
      title: data_files.title
    })

    console.log(data_files.template[0].width);

    //console.log("itemdata--->" + data_files.field);

    if (data_files != null) {
      console.log(data_files.front_img)
      data_files['field'].forEach(obj => {
        if (obj['select']) {
          obj['select_value'] = []
          obj['select'].forEach(selectObj => {
            var opt_text = selectObj['opt_text']
            obj['select_value'].push(opt_text)
          })

          //设置默认值
          obj['position'] = 0;
          obj['sval'] = obj['select_value'][0]
        }
        if (obj['input_type'] > 1) {
          width = obj.x2 - obj.x1;
          height = obj.y2 - obj.y1;
          console.log(width + "---" + height)
        }

        var itype = parseInt(obj['restrain'])
        switch (itype) {
          case 0:
            obj['itype'] = 'text'
            break
          case 1:
            obj['itype'] = 'number'
            break
          case 2:
            obj['itype'] = 'text'
            break
          case 3:
            obj['itype'] = 'text'
            break
        }
        console.log(obj)
      })

      var tempheight = data_files.template[0].height
      var tempwidth = data_files.template[0].width
      if (tempheight > 1200) {
        tempwidth = tempwidth / tempheight * 860
        tempheight = 860
      }

      console.log(tempwidth + "nnn" + tempheight)

      this.setData({
        cimg: data_files.front_img,
        params: data_files.field,
        add_img: crop_path,
        swidth: parseInt(tempwidth),
        sheight: parseInt(tempheight),
        author_name: data_files.author
      },
        function (options) {
          //console.log('done')
          wx.hideLoading()
        })
    }
  },
  onShow: function (options) {

    console.log("cccc onShow")

    if (app.avatar != null && app.avatar != '') {
      console.log("avatar--->" + app.avatar);
      crop_path = app.avatar;
      this.setData({
        add_img: crop_path
      })
    }
  },
  loadDone: function (e) {
    console.log(e.detail.width + "----" + e.detail.height)
  },
  preimage: function (e) {
    if (pre_img != null) {
      wx.previewImage({
        urls: [pre_img],
        current: pre_img
      })
    }
  },
  bindPickerChange: function (e) {
    
    var pos = e.detail.value;
    var pselects = e.currentTarget.dataset.select;
    var index = e.currentTarget.dataset.index;
    var item = data_files['field'][index];
    item['position'] = pos;
    console.log("index--->" + index)
    //自定义
    var flag_input = false;
    if (pselects[pos].indexOf("自定义") > -1) {
      item['flag_input'] = true;
    }else{
      item['flag_input'] = false;
    }
    console.log(item)
    this.setData({
      params: data_files['field'],
      flag_input: flag_input
    })

    console.log(`flag --->${flag_input}`)

    console.log('sval--->' + pselects[pos])

    data_files['field'][index]['sval'] = pselects[pos];
  },
  selectImage: function (event) {
    wx.navigateTo({
      url: '../cutInside/cutInside?width=' + width + '&height=' + height
    })
  },
  bindKeyInput(e) {
    console.log(e)
    let i = e.currentTarget.dataset.i
    
    data_files['field'][i]['sval'] = e.detail.value
    console.log(data_files['field'][i]['sval'])
    
  },
  //一键生成
  create: function (event) {
    var field = data_files['field'];
    var requestData = "{";
    var img = "";
    for (var i = 0; i < field.length; i++) {
      var type = field[i]['input_type'];
      var is_hide = field[i]['is_hide'];
      if (is_hide == "1") {
        var value = field[i]["sval"] || "";
        requestData += "\"" + i + "\":\"" + value + "\"";
      }
      else if (type == 0) {
        var maxlength = field[i]["text_len_limit"];

        var value = field[i]["sval"];
        if (!value) {
          wx.showToast({
            title: field[i]["def_val"],
            icon: 'none'
          })
          return;
        }
        console.log("字段输入--" + value.length);

        requestData += "\"" + i + "\":\"" + value + "\"";
      } else if (type == 1) {
        console.log("picker result--->" + i + "---" + field[i]["sval"])
        requestData += "\"" + i + "\":\"" + field[i]["sval"] + "\"";
      } else if (type > 1) {
        img = crop_path;
      }

      if (i < field.length - 1) {
        requestData += ",";
      }
    }

    console.log("处理前--->" + requestData + "<---start");

    if (img != '' && img != null) {
      if (requestData.lastIndexOf(",") > -1 && requestData.lastIndexOf(",") == requestData.length - 1) {
        requestData = requestData.substring(0, requestData.lastIndexOf(","));
        console.log("处理后type1--->" + requestData + "<---end");
      }

      if (requestData.indexOf("{,") > -1) {
        requestData = "{\"0\":\"\"," + requestData.substring(requestData.indexOf("{,") + 2);
        console.log("处理后type2--->" + requestData + "<---end");
      }
    }

    requestData += "}";

    if(requestData.indexOf(',,') > -1){
      requestData = requestData.replace(',,',',');
    }
    
    console.log("去除多余的值--->" + requestData);

    console.log(img ? "img" : "noimg")

    wx.showToast({
      title: '生成中···',
      icon: 'loading'
    })

    //console.log(requestData)

    if (img) {
      wx.uploadFile({
        url: 'https://nz.qqtn.com/zbsq/index.php?m=Home&c=Zbsq&a=start_zb',
        name: img ? "img" : "noimg",
        filePath: crop_path,
        formData: {
          'requestData': requestData,
          'id': item_id,
          'mime': '863062030230011'
        },
        success: function (res) {

          //console.log(res.data);
          var obj;
          if (typeof res.data === "string") {
            obj = JSON.parse(res.data)
          } else {
            obj = res.data;
          }
          wx.navigateTo({
            url: '../result/result?rimg=' + obj.data + '&title=' + data_files.title
          })
        },
        fail: function (res) {
          console.log("create fail--->" + JSON.stringify(res));
        }
      })
    } else {
      wx.request({
        url: 'https://nz.qqtn.com/zbsq/index.php?m=Home&c=Zbsq&a=start_zb',
        method: 'POST',
        data: {
          'requestData': requestData,
          'id': item_id,
          'mime': '863062030230011'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          
          console.log(res.data);
          wx.navigateTo({
            url: '../result/result?rimg=' + res.data.data + '&title=' + data_files.title
          })
        },
        fail: function (res) {
          console.log("fail2--->" + JSON.stringify(res));
        }
      })
    }

  }
})