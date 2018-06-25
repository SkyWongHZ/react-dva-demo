import Util from '../utils/Util';
import request from '../utils/request';
import config from '../config';

export default class PublicService {
  /**
   * 冒泡排序
   * @param arr 要排序的数据源
   * @param arrIndex 根据哪个字段排序
   */
  static arrSort (arr, arrIndex) {
    let len = arr.length;
    if (arrIndex) {
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j][arrIndex] > arr[j + 1][arrIndex]) {        // 相邻元素两两对比
            let temp = arr[j + 1];        // 元素交换
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    } else {
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    }
    return arr;
  }


  /**
   * @param data 需要转换结构的源数据
   * @param parentKey 父元素Key值
   * @param newKey 子元素key
   */
  static addKey (data, parentKey, newKey) {
    // 添加Key
    if (newKey) {
      for (let i = 0; i < data.length; i++) {
        // 增加唯一标识key
        data[i]['key'] = parentKey + i + '';
      }
    }
    return data;
  }

  /**
   * 传递moment对象数组转换为对象,
   * 0号位为开始时间(startTime),1号位为结果时间(endTime),
   */
  static transformDataToObj (dateArray, obj) {
    let dateObj = {};
    let defaultObj = {
      startTime: 'startTime',
      endTime: 'endTime',
      dateFormat: 'YYYY-MM-DD HH:MM:SS'
    };
    defaultObj = obj || defaultObj;
    dateObj = {
      [defaultObj.startTime]: dateArray[0].format(defaultObj.dateFormat),
      [defaultObj.endTime]: dateArray[1].format(defaultObj.dateFormat)
    };
    return dateObj
  }

  /**
   * 删除的ids需要字符串带 , 号
   * 传递一个数组, 默认后台的字段为id
   */
  static transformArrayToString (dataArray, obj={id:'id'}) {
    let ids = [];
    dataArray.forEach((item, index) => {
      ids.push(item[obj.id])
    });
    return ids.join(",")
  }

  /**
   * 删除的ids 需要传递的参数是数组
   * 传递一个数组, 默认后台的字段为id
   */
  static transformArrayToArray (dataArray, obj ={id:'id'}) {
    let ids = [];
    dataArray.forEach((item, index) => {
      ids.push(item[obj.id])
    });
    return ids
  }

  /***
   * @columns 表格的columns属性
   * @returns {number} table宽度
   */
  static getTableWidth (columns) {
    let tableWidth = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].width) {
        tableWidth = tableWidth + parseInt(columns[i].width)
      } else {
        console.log('PublicService->getTableWidth: columns 中没有配置width属性');
      }
    }
    return tableWidth;
  }

  /**
   * @param params 导出文件所需参数
   * @returns {*}   返回导出拼接字符串
   */
  static paramSerializer (params) {
    if (!params) return '';
    let urlPart = [];
    for (let k in params) {
      let value = params[k];
      if (value === null || Util.isUndefined(value)) continue;
      if (Util.isArray(value)) {
        for (let i = 0, l = value.length; i < l; i++) {
          urlPart.push(k + '=' + value[i])
        }
      } else {
        urlPart.push(k + '=' + value)
      }
    }
    return urlPart.join('&')
  }

  //去重算法
  static unique (a) {
    let ret = [];
    let hash = {};

    for (let i = 0, len = a.length; i < len; i++) {
      let item = a[i];

      let key = typeof(item) + item;

      if (hash[key] !== 1) {
        ret.push(item);
        hash[key] = 1;
      }
    }

    return ret;
  }

  /**
   * @param array为需要去重的数组 keys为指定的根据字段
   * @returns {Array} 返回筛选后的数组对象
   */
  static uniqeByKeys(array, keys) {
    let result = [], hash = {};
    for (let i = 0; i < array.length; i++) {
      let elem = array[i][keys];
      if (!hash[elem]) {
        result.push(array[i]);
        hash[elem] = true;
      }
    }
    return result
  }

  /**
   * @param  e 为判断的对象
   * @returns 返回true 为空对象,返回false为不是空对象
   */
  static isEmptyObject(e) {
    let t;
    for (t in e)
      return !1;
    return !0
  }

  /**
   * @param  ids 为后端传过来的 逗号,id
   * @returns 返回一个数组,可以在页面中的upload中展示
   */
  static changeImageFileList(ids) {
    let array = ids.split(',');
    let fileList = [];
    for (let i = 0, j = array.length; i < j; i++) {
      fileList.push({
        uid: i + 1,
        name: array[i],
        status: 'done',
        url: config.publicUrl + '/vortexfile/clientUploadFile/download/' + array[i]
      })
    }
    return fileList
  }

  /**
   * @param  array 为后端传过来的需要展示数据
   * @returns 返回一个数组,可以在页面中的upload中展示
   */
  static changeFilesList(array) {
    let fileList = [];
    for (let i = 0, j = array.length; i < j; i++) {
      fileList.push({
        uid:i+1,
        name:array[i].name,
        status:'done',
        url:config.publicUrl + '/vortexfile/clientUploadFile/download/' + array[i].id
      })
    }
    return fileList
  }

  /**
   * @param weekArr 后台传过来的每周起止时间数组
   * @returns {Array} 返回格式:[{value: "2017-04-01,2017-04-02", label: "第二周"}, ...]
   */
  static changeWeekArrToWeekSelectOpt (weekArr) {
    let weekOpt = [];
    if (weekArr && weekArr.length !== 0) {
      for (let i = 0; i < weekArr.length; i++) {
        weekOpt.push({
          value: weekArr[i].join(','),
          text: config.weekNumMatch[i + 1]
        });
      }
      console.log(weekOpt, 'opt');
    } else {
      console.info('周数组参数错误 weekArr:' + weekArr);
    }
    return weekOpt;
  }

  // 浏览器全屏方法
  static fullScreen (element) {
    if (element.requestFullScreen) {
      element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }

  static transformArrayDataXNW (data, needColNum, needKey, currentPage, pageSize) {
    // 需要添加table序号
    if (needColNum) {
      for (let i = 0; i < data.length; i++) {
        // 有分页
        if (currentPage && pageSize) {
          data[i]['numXNW'] = pageSize * (currentPage - 1) + i + 1;
          // 无分页
        } else {
          data[i]['numXNW'] = i + 1;
        }
      }
    }
    return data;
  }

  /**
   * 保存字段到cookie
   * @param c_name 要保存字段的名称
   * @param value 要保存字段的值
   * @param expireDays 过期时间
   */
  static setCookie(c_name, value, expireDays = 30) {
    document.cookie = c_name + "=" + escape(value);
    // cookie过期时间
    // let timeCode = Date.now();
    // let expireTimeCode = timeCode + (60 * 60 * 24 * expireDays);
    // if (expireDays)
    //   document.cookie = 'expireTimeCode=' + expireTimeCode
  }

  /**
   * 从cookie中取字段
   * @param c_name 要取得的字段名
   * @returns {string} 返回字段对应的值, 若字段不存在则返回空
   */
  static getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=")
      if (c_start !== -1) {
        c_start = c_start + c_name.length + 1
        let c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ""
  };

  /**
   * 清空cookie中某字段
   * @param name 要清空的字段名
   */
  static clearCookie(name) {
    this.setCookie(name, "", -1);
  }


  /**
  * @param data 需要转换结构的源数据
  * @param needColNum 需要增加table序号列数据
  * @param needKey 需要增加唯一标识key
  * @param currentPage 当前页
  * @param pageSize 每页数据数目
  * @returns {*} 转换后的数据
  */
  static transformArrayData(data, needColNum, needKey, currentPage, pageSize) {
    // 需要添加table序号
    if (needColNum) {
      for (let i = 0; i < data.length; i++) {
        // 有分页
        if (currentPage && pageSize) {
          data[i]['num'] = pageSize * (currentPage - 1) + i + 1;
          // 无分页
        } else {
          data[i]['num'] = i + 1;
        }
      }
      // 需要添加唯一标识key
    }
    // 添加Key
    if (needKey) {
      for (let i = 0; i < data.length; i++) {
        // 若数据不存在key字段,则增加唯一标识key
        if (!data[i]['key']) data[i]['key'] = i;
      }
    }
    if (!needColNum && !needColNum) {
      console.info('检查transformArrayData方法参数(needColNum,needKey),返回数据结构未改变');
    }
    return data;
  }

  static  isInteger(obj) {
    return typeof obj === 'number' && obj >=0&&obj % 1 === 0
  }
}
