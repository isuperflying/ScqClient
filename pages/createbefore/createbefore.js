var dateUtil = require('../../utils/util.js');
var scInfo;
var data_files;
var crop_path = '/pages/image/add_img_icon.png';
var item_id;
var pre_img;
const app = getApp()
var width;
var height;
var baseUrl = 'http://192.168.80.97:8899/'
Page({
  data: {
    cimg: '',
    position: 0,
    cinput: false,
    flag_input: false,
    add_img: crop_path,
    swidth: 0,
    sheight: 0,
    baseUrl: baseUrl,
    pindex:0
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

    console.log('id--->' + options.id)
    var that = this;
    wx.request({
      url: 'http://192.168.80.97:8899/queryscinfobyid',
      method: 'POST',
      data: {
        'sid': options.id
      },
      success: function (res) {
        console.log(res.data.data)
        wx.hideLoading()

        scInfo = res.data.data;
        data_files = scInfo.fields;

        item_id = scInfo.id;
        pre_img = scInfo.sc_before_img;

        wx.setNavigationBarTitle({
          title: scInfo.sc_name
        })

        that.initData();
        // that.setData({
        //   params: data_files,
        //   cimg: res.data.data.sc_pre_img
        // })
      },
      fail: function (res) {
        wx.hideLoading()
        console.log('fail--->')
      }
    })

  },

  initData: function () {
    if (data_files == null) {
      wx.showToast({
        title: '数据有误，请重试',
      })
      return;
    }
    
    //console.log(data_files.template[0].width);

    //console.log("itemdata--->" + data_files.field);

    if (data_files != null) {
      //console.log(data_files.sc_before_img)
      data_files.forEach(obj => {
        if (obj['input_type'] == 1) {
          // obj['select_value'] = []
          // obj['select'].forEach(selectObj => {
          //   var opt_text = selectObj['opt_text']
          //   obj['select_value'].push(opt_text)
          // })

          // //设置默认值
          // obj['position'] = 0;
          // obj['sval'] = obj['select_value'][0]

          let ranges = obj.option_txt.split('#');
          obj['range'] = ranges;
          //默认赋值
          obj['sval'] = ranges[0]
        }
        if (obj['input_type'] > 1) {
          width = obj.second_pointx - obj.first_pointx;
          height = obj.second_pointy - obj.first_pointy;
          console.log(width + "---" + height)
        }

        // var itype = parseInt(obj['restrain'])
        // switch (itype) {
        //   case 0:
        //     obj['itype'] = 'text'
        //     break
        //   case 1:
        //     obj['itype'] = 'number'
        //     break
        //   case 2:
        //     obj['itype'] = 'text'
        //     break
        //   case 3:
        //     obj['itype'] = 'text'
        //     break
        // }
        console.log(obj)
      })

      var tempheight = scInfo.sc_img_height
      var tempwidth = scInfo.sc_img_width
      if (tempheight > 1200) {
        tempwidth = tempwidth / tempheight * 860
        tempheight = 860
      }

      console.log(tempwidth + "--->" + tempheight)

      this.setData({
        cimg: baseUrl + scInfo.sc_before_img,
        params: data_files,
        add_img: crop_path,
        swidth: parseInt(tempwidth),
        sheight: parseInt(tempheight),
        author_name: 'xxx'
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
    let findex = e.currentTarget.dataset.index
    let range = e.currentTarget.dataset.range
    
    var pos = e.detail.value;
    console.log("pos--->" + pos)
    this.setData({
      pindex: pos
    })
    console.log("picker select value--->" + range[pos])
    data_files[findex]['sval'] = range[pos]
  },
  selectImage: function (event) {
    console.log('select image --->' + width + '---' + height);
    wx.navigateTo({
      url: '../cutInside/cutInside?width=' + width + '&height=' + height
    })
  },
  bindKeyInput(e) {
    console.log(e)
    let i = e.currentTarget.dataset.i
    console.log(scInfo['fields'])
    scInfo['fields'][i]['sval'] = e.detail.value
    console.log('input--->' + scInfo['fields'][i]['sval'])

  },

  create1: function (event) {
    console.log(data_files)
    var img = ''
    let inputs = []
    for (var i = 0; i < data_files.length; i++) {
      var sval = data_files[i]["sval"] || "";
      let is_visable = data_files[i].is_visable;
      let hide_type = data_files[i].hide_type
      let input_type = data_files[i].input_type
      
      if (input_type == 4){
        img = crop_path
      }else{
        if (is_visable == 0) {
          inputs.push(sval)
        } else {
          if (hide_type == 0) {//姓名
            let getFieldIndex = parseInt(data_files[i].hide_value);

            inputs.push(data_files[getFieldIndex]["sval"])
          }

          if (hide_type == 1) {//时间
            let hideValue = data_files[i].hide_value;
            let timestamp = Date.parse(new Date());
            console.log('timestamp--->' + timestamp)
            let dateStr = dateUtil.formatTimeTwo(timestamp, hideValue);
            inputs.push(dateStr)
          }
        }
      }
    }
    console.log(inputs)
    console.log('img path --->' + img)
    if (img) {
      wx.uploadFile({
        url: 'http://192.168.80.97:8899/createzbimage2',
        name: 'file',
        filePath: crop_path,
        formData: {
          'in_data': inputs == null || inputs.length == 0 ? '':JSON.stringify(inputs),
          'sid': item_id
        },
        success: function (res) {
          var obj = JSON.parse(res.data)
          console.log(obj.data);
          wx.navigateTo({
            url: '../result/result?rimg=' + obj.data.file_name + '&title=' + scInfo.sc_name
          })
        },
        fail: function (res) {
          console.log("create fail--->" + JSON.stringify(res));
        }
      })
    } else {
      wx.request({
        url: 'http://192.168.80.97:8899/createzbimage1',
        method: 'POST',
        data: {
          'in_data': inputs,
          'sid': item_id
        },
        success: function (res) {

          console.log(res.data.data.file_name);
          wx.navigateTo({
            url: '../result/result?rimg=' + res.data.data.file_name + '&title=' + data_files.title
          })
        },
        fail: function (res) {
          console.log("fail2--->" + JSON.stringify(res));
        }
      })
    }
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

    if (requestData.indexOf(',,') > -1) {
      requestData = requestData.replace(',,', ',');
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