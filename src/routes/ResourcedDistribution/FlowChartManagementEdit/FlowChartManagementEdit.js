import React from 'react';
import './FlowChartManagementEdit.less';
import { Form, Input, Modal, Upload, Popconfirm, notification } from 'antd';
import Filtrate from '../../../components/PublicComponents/FlowChartFiltrate';
/* import Filtrate from '../../../components/PublicComponents/Filtrate'  */
import EditModal from './EditModal';
import request from '../../../utils/request';
import config from '../../../config'
const confirm = Modal.confirm;
const img = require('../../../assets/factory.jpg'),
  close = require('../../../assets/close.png'),
  switchImg = require("../../../assets/btn-switch-on.png"),
  signImg = require("../../../assets/btn-sign-green.png"),
  add = require("../../../assets/add.png");

//图片地址
// const imgBaseUrl = "http://192.168.1.197/upload/";
// const imgBaseUrl = "http://10.26.250.162:9004/upload/";
// const imgBaseUrl = "http://192.168.1.115:8079/upload/";
// const imgBaseUrl = "http://192.168.2.134:10250/upload/";
const imgBaseUrl = "http://183.129.170.220:8079/upload/"

//需要去掉的4个按钮
const oCoordsHide = ["mb", "mr", "mt", "ml"]

//搜索栏按钮
const extraBtnItem = [
  {
    name: '保存',
    funName: 'canvasSaveBtn',
  },
  {
    name: '取消',
    funName: 'canvasCancelBtn',
  }
];
//弹出框的item

//type字段
const canvasType = {
  background: "background",
  argumentsBtn: "argumentsBtn",
  switchBtn: "switchBtn",
  signalStateBtn: "signalStateBtn",
  textBtn: "textBtn"
}
//是否为删除的坐标
class FlowChartManagementEdit extends React.Component {
  state = {
    canvas: {}, //画布对象
    spacingState: false, //按住空格时的状态 用来控制背景移动
    canvasPrimary: {    //画布按钮对象
      //工艺参数监控按钮
      argumentsBtn: {
        factorCode: "T002",
        unit: "℃",
        textColor: "#000",
        backgroundColor: "#D0CECD",
      },
      //开关按钮
      switchBtn: {
        factorCode: "T002",
        openSignal: 1,
        closeSignal: 0,
      },
      //信号灯按钮
      signalStateBtn: {
        // factorCode: "T002",
        openSignal: 1,
        closeSignal: 0,
      },
      //文本框按钮
      textBtn: {
        text: "",
        textColor: "#ffffff",
        backgroundColor: "#000000",
      }
    },
    editModalVisible: false,  //弹出框状态
    btnType: null,  //当前点击按钮类型
    btnItem: [],  //需要传入modal的按钮item
    defaultModalData: {},  //当前按钮数据 用于modal初始化
    editState: "",  //当前编辑框类型 "edit" 编辑  "add" 添加
    selectedGroup: null,  //被选中的图形
    bgState: false,  //是否有背景
    allFactor: [],  //所有工艺位号
    oppsiteState: true,  //反控按钮状态
    items: [
      {
        disabled: this.props.location.query.siteId?true:false,
        type: 'select',           //搜索栏
        label: '项目名称:',
        placeholder: '请输入 ..',
        paramName: "siteId",
        initialValue:this.props.location.query.siteId,
        flag: this.props.location.query.siteName,
        options: [
          { text: '全部', value: '' }
        ],
        selectChange: (value) => {
          let t = this;
          // 获取设备编号
          const options = [];
          /* t.state.items[1].options = t.state.items[1].options.slice(0, 1) */
          request({ url: '/wl/chart/getDeviceList', method: 'GET', params: { siteId: value } })
            .then((res) => {
              // console.log(' 获取设备编号', res)
              for (let i = 0; i < res.ret.length; i++) {
                options.push({
                  text: res.ret[i].deviceName, value: String(res.ret[i].deviceId)
                });
              }
              t.state.items[1].options.push(...options)
              t.setState({
                items: t.state.items,
              })
            })

        }
      },
      {
        type: 'select',
        label: '设备编号:',
        placeholder: '请输入 ..',
        paramName: "deviceId",
        disabled: this.props.location.query.deviceId ? true : false,
        initialValue: String(this.props.location.query.deviceId),
        flag: String(this.props.location.query.deviceName),
        options: [
          { text: '全部', value: '' }
        ],
      },
    ],
    objItem:{
      argumentsBtnItems: [
        {
          type: 'select',
          label: '工艺位号',
          paramName: "factorCode",
          size: 24,
          options: [],
          selectChange: function (value) {
            console.log(value)
            for (let i = 0; i < this.options.length; i++) {
              if (this.options[i].factorCode === value) {
                return this.options[i];
              }
            }
          }
        },
        {
          type: 'input',
          label: '显示单位',
          paramName: "unit",
          size: 24,
          disabled: true,
        },
        {
          type: 'colorPicker',
          label: '背景颜色',
          paramName: "backgroundColor",
          size: 24,
          options: ["#D0CECD", "#39455D", "#000000", "#0FA4F3", "#ffffff"]
        },
        {
          type: 'colorPicker',
          label: '字体颜色',
          paramName: "textColor",
          size: 24,
          options: ["#000000", "#ffffff"]
        },
        {
          type: 'range',
          label: '正常范围',
          paramName: ["minValue", "maxValue"],
          size: 24,
          disabled: true,
        },
      ],
      switchBtnItems: [
        {
          type: 'select',
          label: '工艺位号',
          paramName: "factorCode",
          size: 24,
          options: [],
          selectChange: function (value) {
            for (let i = 0; i < this.options.length; i++) {
              if (this.options[i].value === value) {
                return this.options[i];
              }
            }
          }
        },
        {
          type: 'input',
          label: '运行信号',
          paramName: "openSignal",
          size: 24
        },
        {
          type: 'input',
          label: '停运信号',
          paramName: "closeSignal",
          size: 24
        },
      ],
      signalStateBtnItems: [
        {
          type: 'select',
          label: '设备列表',
          paramName: "reverseControlButtonId",
          size: 24,
          options: [],
          selectChange: function (value) {
            for (let i = 0; i < this.options.length; i++) {
              if (this.options[i].reverseControlButtonId === value) {
                return this.options[i];
              }
            }
          }
        },
        {
          type: 'input',
          label: '运行信号',
          paramName: "openSignal",
          size: 24
        },
        {
          type: 'input',
          label: '停运信号',
          paramName: "closeSignal",
          size: 24
        },
      ],
      textBtnItems: [
        {
          type: 'input',
          label: '文本框',
          paramName: "text",
          size: 24
        },
        {
          type: 'colorPicker',
          label: '背景颜色',
          paramName: "backgroundColor",
          size: 24,
          options: ["#D0CECD", "#39455D", "#000000", "#0FA4F3", "#ffffff"]
        },
        {
          type: 'colorPicker',
          label: '文本颜色',
          paramName: "textColor",
          size: 24,
          options: ["#000000", "#ffffff",]
        },
      ]
    }
  };
  //左侧按钮拖拽开始
  dragStart = (e, type) => {
    e.dataTransfer.setData("type", type);
  }
  //左侧按钮拖拽结束
  dragEnd = (e) => {
    let [mouseX, mouseY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
    e.preventDefault();
    let type = e.dataTransfer.getData("type");
    // console.log(this.state.canvasPrimary[type]);
    switch (type) {
      case "argumentsBtn":
        this.addArgumentsBtn(mouseX, mouseY)
        break;
      case "switchBtn":
        this.addSwitchBtn(mouseX, mouseY)
        break;
      case "signalStateBtn":
        this.addSignalStateBtn(mouseX, mouseY)
        break;
      case "textBtn":
        this.addTextBtn(mouseX, mouseY)
        break;
      default:
        break;
    }
  }
  //左侧按钮拖拽中禁止默认事件
  allowDrop = (e) => {
    e.preventDefault();
  }
  //初始化canvas
  initializeCanvas = (imageUrl, data) => {
    //初始化canvas以及canvas全局设置
    let t = this;
    let canvas = new fabric.Canvas('main', {
      selection: false,
    });
    canvas.on({
      'object:moving': (e) => {
        e.target.opacity = 0.5;
      },
      'object:modified': (e) => {
        e.target.opacity = 1;
      }
    });
    //设置背景 以及 初始化页面各项按钮
    if (!this.props.location.query.id) {
      let oFReader = new FileReader();
      oFReader.readAsDataURL(imageUrl);
      oFReader.onload = function (oFREvent) {
        fabric.Image.fromURL(oFREvent.target.result, (oImg) => {
          // console.log('oFREvent.target.result', oFREvent.target.result)
          // console.log('oImg', oImg)
          oImg.hasControls = false;
          oImg.hasBorders = false;
          oImg.selectable = false;
          oImg.hoverCursor = 'default';
          oImg.canvasType = "backgroundImage"
          canvas.add(oImg);
        })
      };
      this.setState({
        canvas: canvas,
        bgState: true
      })
    } else {
      this.setState({
        canvas: canvas,
        bgState: true
      }, () => {
        // this.addTextBtn()
        if (data) {
          // console.log('imgBaseUrl',imgBaseUrl);
          // console.log(`${imgBaseUrl}${imageUrl}`);
          fabric.Image.fromURL(`${imageUrl}`, (oImg) => {
            oImg.hasControls = false;
            oImg.hasBorders = false;
            oImg.selectable = false;
            oImg.hoverCursor = 'default';
            oImg.canvasType = "backgroundImage";
            canvas.add(oImg);
            data.componentDTOList.map((data, index) => {
              switch (data.componentType) {
                case 1:
                  this.addArgumentsBtn(data.xValue, data.yValue, data)
                  break;
                case 2:
                  this.addSignalStateBtn(data.xValue, data.yValue, data)
                  break;
                case 3:
                  this.addSwitchBtn(data.xValue, data.yValue, data)
                  break;
                case 4:
                  this.addTextBtn(data.xValue, data.yValue, data)
                  break;
                default:
                  break;

              }
              // this.addSignalStateBtn(data.xValue, data.yValue, data)
            });
            //todofix 目前用来处理画布 无法有正确层级关系的问题 去掉这段代码 初始化时 无法正确的层级
            let e = {
              keyCode: 32
            };
            canvas.discardActiveObject();
            var sel = new fabric.ActiveSelection(canvas.getObjects(), {
              canvas: canvas,
              hasControls: false,
              hasBorders: false,
            });
            canvas.setActiveObject(sel);
            canvas.requestRenderAll();
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            //console.log(imageUrl)
            //设置背景图片
            this.setState({
              imgPath: imageUrl
            });
          });
        }
      })
    }
  }
  //按住空格拖拽画布
  spacingKeyPress = (e) => {
    if (e.keyCode != 32) return false;
    if (this.state.spacingState) return false;
    this.setState({
      spacingState: true,
    })
    let canvas = this.state.canvas;
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas,
      hasControls: false,
      hasBorders: false,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  }
  //松开空格
  spacingKeyUp = (e) => {
    if (e.keyCode != 32) return false;
    let canvas = this.state.canvas;
    this.setState({
      spacingState: false,
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
  //添加工艺参数监控按钮
  addArgumentsBtn = (mouseX = 50, mouseY = 50, argumentsBtn = this.state.canvasPrimary.argumentsBtn) => {
    let left = mouseX;
    let top = mouseY;
    const data = Object.assign({}, argumentsBtn);
    //绘制背景
    let rect = new fabric.Rect({
      fill: data.backgroundColor,
      width: 130,
      height: 50,
      stroke: "#000",
      rx: 3,
      ry: 3,
    });
    //绘制线条
    let coord = [5, 25, 120, 25];
    let line = new fabric.Line(coord, {
      fill: '#000',
      stroke: '#000',
      strokeWidth: 1,
    });
    //绘制工艺位号
    let text1Left = (130 - data.factorCode.length * 10) / 2;
    let text1 = new fabric.IText(data.factorCode, {
      left: text1Left,
      fontSize: 15,
      stroke: data.textColor,
      fill: data.textColor,
    });
    //绘制显示单位]
    data.value = '1';
    let valueLen = data.value ? data.value.length : 0;
    let text2Left = (130 - (data.unit ? data.unit.length : 0) * 10 - (data.value ? data.value.length : 0) * 10) / 2;
    let text2 = new fabric.IText("0" + data.unit, {
      left: text2Left,
      top: 30,
      fontSize: 15,
      stroke: data.textColor,
      fill: data.textColor
    });
    //进行组合
    let group = new fabric.Group([rect, line, text1, text2], {
      left: left,
      top: top,
      hasRotatingPoint: false,
    });
    //去掉4个无用的拉伸按钮
    oCoordsHide.map((data, index) => {
      group.setControlVisible(data, false)
    })
    // group.scale
    //对象类型
    data.type = 1
    group.uploadData = data;
    group.scale(data.scaleX || 1);
    group.on('mousedblclick', (options) => {
      if (!this.deleteBtn(options, group)) {
        this.onModalAlert("argumentsBtn", "edit", data);
      };
    });
    group.on('selected', (option) => {
      this.setDeleteBtn(group);
    });
    this.state.canvas.add(group);
  }
  //添加设备启停按钮
  addSwitchBtn = (mouseX = 50, mouseY = 50, switchBtn = this.state.canvasPrimary.switchBtn) => {
    let left = mouseX;
    let top = mouseY;
    const data = Object.assign({}, switchBtn);
    let imgInstance = new fabric.Image(document.getElementById('img-switch'), {});
    imgInstance.scale(0.16);
    let group = new fabric.Group([imgInstance], {
      left: left,
      top: top,
      hasRotatingPoint: false,
      // hasControls: false,
      // hasBorders: false,
    })
    oCoordsHide.map((data, index) => {
      group.setControlVisible(data, false)
    })
    //对象类型
    data.type = 3;
    group.canvasType = 3;
    group.uploadData = data;
    group.scale(data.scaleX || 1);
    group.on('selected', (option) => {
      this.setDeleteBtn(group)
    });
    group.on('mousedblclick', (options) => {
      if (!this.deleteBtn(options, group)) {
        this.onModalAlert("switchBtn", "edit", data);
      };
    });
    this.state.canvas.add(group);
  }
  //添加信号灯按钮
  addSignalStateBtn = (mouseX = 50, mouseY = 50, signalStateBtn = this.state.canvasPrimary.signalStateBtn) => {
    let left = mouseX;
    let top = mouseY;
    const data = Object.assign({}, signalStateBtn);
    let imgInstance = new fabric.Image(document.getElementById('img-sign'), {
    });
    imgInstance.scale(0.25);
    let group = new fabric.Group([imgInstance], {
      left: left,
      top: top,
      hasRotatingPoint: false,
      // hasControls: false,
      // hasBorders: false,
    });
    oCoordsHide.map((data, index) => {
      group.setControlVisible(data, false)
    })
    data.type = 2;
    group.canvasType = 2;
    group.uploadData = data;
    group.scale(data.scaleX || 1);
    // group.reverseControlButtonId =
    // group.reverseControlButtonId =
    group.on('selected', (option) => {
      this.setDeleteBtn(group)
    });
    group.on('mousedblclick', (options) => {
      if (!this.deleteBtn(options, group)) {
        this.onModalAlert("signalStateBtn", "edit", data);
      };
    });
    this.state.canvas.add(group);
  }
  //添加文本框
  addTextBtn = (mouseX = 50, mouseY = 50, textBtn = this.state.canvasPrimary.textBtn) => {
    // debugger
    // const { textBtn } = this.state.canvasPrimary;
    let left = mouseX;
    let top = mouseY;
    const data = Object.assign({}, textBtn);
    //绘制背景
    let rect = new fabric.Rect({
      fill: data.backgroundColor,
      width: data.text.length * 25 + 20,  //默认一个字符占25px像素 + 20是为了留10边距
      height: 24
    });
    //空出2个字符是为了统一处理关闭按钮的位置
    let text = new fabric.Text(data.text + "  ", {
      left: 10,
      fontSize: 24,
      stroke: data.textColor,
      fill: data.textColor
    });
    let group = new fabric.Group([rect, text], {
      left: left,
      top: top,
      hasRotatingPoint: false,
      // hasControls: false,
      // hasBorders: false,
    });
    group.scale(data.scaleX || 1);
    oCoordsHide.map((data, index) => {
      group.setControlVisible(data, false)
    })
    data.type = 4;
    group.canvasType = 4;
    group.uploadData = data;
    group.on('selected', (option) => {
      this.setDeleteBtn(group)
    });
    group.on('mousedblclick', (options) => {
      if (!this.deleteBtn(options, group)) {
        this.onModalAlert("textBtn", "edit", data);
      };
    });
    this.state.canvas.add(group);
  }
  //改变按钮属性
  // changeBtnAttribute = (type, obj) => {
  //   this.state.canvasPrimary[type] = Object.assign(this.state.canvasPrimary[type], obj);
  //   this.setState({
  //     canvasPrimary: this.state.canvasPrimary,
  //   })
  // }
  //设置删除按钮
  setDeleteBtn = (group) => {
    let imgElement = document.getElementById('img-close');
    let imgInstance = new fabric.Image(imgElement, {
      top: -(group.height / 2),
      left: group.width / 2 - 16
    });
    imgInstance.closeBtn = true;
    let arr = this.state.canvas._objects,
      sign = true;
    //遍历画布上所有对象
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length <= 1) continue; //如果只有一个canvas对象就跳过
      if (!arr[i]._objects) continue; //判断是否为背景那张图片
      if (!sign) break;
      //遍历该对象上所有item
      for (let j = 0; j < arr[i]._objects.length; j++) {
        let data = arr[i]._objects[j];
        if (data.closeBtn) {
          arr[i].remove(data);
          sign = false;
          break;
        };
      };
    };
    //添加x
    group.add(imgInstance);
  }
  //删除功能
  deleteBtn = (options, group) => {
    //判断是否在删除区域
    if (this.isCloseBox(options.target.aCoords, options.e.offsetX, options.e.offsetY, options.target)) {
      this.state.canvas.remove(group);
      return true;
    } else {
      return false;
    };
  }
  //判断删除点击区域
  isCloseBox = (aCoords, mouseX, mouseY, groupEl) => {
    let [scaleX, scaleY] = [groupEl.scaleX, groupEl.scaleY]
    var closeBox = {
      tr: { x: aCoords.tr.x, y: aCoords.tr.y },
      tl: { x: aCoords.tr.x - (15 * scaleX), y: aCoords.tr.y },
      br: { x: aCoords.tr.x, y: aCoords.tr.y + (15 * scaleY) },
      bl: { x: aCoords.tr.x - (15 * scaleX), y: aCoords.tr.y + (15 * scaleY) }
    }
    if (mouseX > closeBox.tr.x || mouseX < closeBox.tl.x || mouseY < closeBox.tr.y || mouseY > closeBox.br.y) {
      return false;
    } else {
      return true;
    }
  }
  //获取工艺位号对应ID
  getFactorId = (code) => {
    var id = null;
    this.state.allFactor.map((data, index) => {
      if (code === data.factorCode) {
        id = data.factorId;
      }
    });
    return id;
  }
  //弹出框取消
  onModalCancel = () => {
    this.setState({
      editModalVisible: false,
    })
  }
  //弹出框弹出
  onModalAlert = (type, editState, data) => {
    let t=this;
    let group = this.state.canvas.getActiveObjects();
    if (!data) {
      var data = this.state.canvasPrimary[type];
    }
    this.setState({
      editModalVisible: true,
      btnItem: t.state.objItem[type + "Items"],
      btnType: type,
      defaultModalData: data,
      editState: editState,
      selectedGroup: group
    })
  }
  //弹出框保存
  onModalSave = (obj, editState) => {
    console.log('obj')
    if (editState === "add") {
      console.log('fffffff')
      let type = this.state.btnType;
      this.state.canvasPrimary[type] = Object.assign(this.state.canvasPrimary[type], obj);
      this.setState({
        editModalVisible: false,
        canvasPrimary: this.state.canvasPrimary,
      })
    } else if (editState === "edit") {
      let group = this.state.selectedGroup[0];
      let [mouseX, mouseY, type] = [group.left, group.top, this.state.btnType];
      switch (type) {
        case "argumentsBtn":
          this.addArgumentsBtn(mouseX, mouseY, obj)
          break;
        case "switchBtn":
          this.addSwitchBtn(mouseX, mouseY, obj)
          break;
        case "signalStateBtn":
          this.addSignalStateBtn(mouseX, mouseY, obj)
          break;
        case "textBtn":
          this.addTextBtn(mouseX, mouseY, obj)
          break;
        default:
          break;
      }
      this.state.canvas.remove(group);
      this.setState({
        editModalVisible: false,
      });
    }
  }
  //保存
  canvasSaveBtn = (value) => {
    console.log('value',value)
    // console.log('this.props.location.query.id', this.props.location.query.id)
    if (value.siteId === '') {
      notification.error({
        message: '请输入系统名称',
        duration: 2,
      });
      return false;
    } else if (value.deviceId === '') {
      notification.error({
        message: '请输入设备列表',
        duration: 2,
      });
      return false;
    }

    let obj = {
      flowChartId: this.state.flowChartId || null,
      flowChartName: value.name,
      path: this.state.imgPath,
      deviceId: value.deviceId,
    }
    let data = JSON.stringify(obj)
    let arr = [];
    console.log('this.state.canvas._objects', this.state.canvas._objects)
    this.state.canvas._objects.map((data, index) => {
      if (data.canvasType != "backgroundImage") {
        data.uploadData.xValue = data.left;
        data.uploadData.yValue = data.top;
        data.uploadData.deleted = data.deleted;
        data.uploadData.chartId = this.state.chartId || this.props.location.query.id;
        // data.uploadData.factorId = this.getFactorId(data.uploadData.factorCode);
        // data.uploadData.scaleX = data.scaleX || 1;
        // data.uploadData.scaleY = data.scaleY || 1;
        data.uploadData.scaleX = 1;
        data.uploadData.scaleY = 1;
        data.uploadData.componentType=2;
        data.uploadData.instrumentId = data.uploadData.reverseControlButtonId
        // data.uploadData.chartId=
        arr.push(data.uploadData)
      };
    });
    fetch("/wl/chart/saveComponents", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(arr)
      }).then(res => {
        return res.json();
      }).then(json => {
        // console.log('json保存尼玛的信息',json);
        this.props.history.pushState(null, "/flowChartManagement");
      });

  }
  //取消
  canvasCancelBtn = () => {
    let t = this;
    confirm({
      title: '提示',
      content: '是否取消当前修改回到列表页',
      className: "yk-flowChartCancel-confirm",
      onOk() {
        t.props.history.pushState(null, "/flowChartManagement");
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //上传背景
  bgChange = () => {
    console.log('filtrate', this.filtrate.getForm().getFieldsValue())
    let filtrateData = this.filtrate.getForm().getFieldsValue()
    let data = new FormData();
    data.append('multipartFile', this.refs.canvasBgFile.files[0]);
    data.append('id', '');
    data.append('deviceId', filtrateData.deviceId);
    data.append('siteId', filtrateData.siteId);
    console.log(config)
    fetch(`/wl/chart/saveFlowChart`, {
      method: 'POST',
      body: data
    }).then(res => {
      return res.json();
    }).then(json => {
      console.log('jsonxxx',json)
      this.setState({
        // imgPath: json.ret
        chartId: json.ret.id  /* chartId */
      })
      // console.log('上传背景成功', res)
      this.initializeCanvas(this.refs.canvasBgFile.files[0]);
    });
  }
  componentDidMount() {
    let t = this;
    //绑定键盘事件 用来确定是否拖拽
    document.addEventListener('keypress', (e) => { this.spacingKeyPress(e) });
    document.addEventListener('keyup', (e) => { this.spacingKeyUp(e) });
    // console.log('this.props.location.query', this.props.location.query)
    //获取所有工艺流程号
    // request({ url: '/sk/chart/getAllFactor', method: 'GET' }).then((resp) => {
    //   objItem.argumentsBtnItems[0].options = resp.ret;
    //   objItem.switchBtnItems[0].options = resp.ret;
    //   // objItem.signalStateBtnItems[0].options = resp.ret; //去掉信号灯 factoryId

    //   let obj = this.state.canvasPrimary;
    //   obj.argumentsBtn.factorCode = resp.ret[0].factorCode;
    //   obj.switchBtn.factorCode = resp.ret[0].factorCode;
    //   // obj.signalStateBtn.factorCode = resp.ret[0].factorCode;
    //   this.setState({
    //     allFactor: resp.ret,
    //     canvasPrimary: obj
    //   }, () => {
    //     if (this.props.location.query.id) {
    //       request({ url: '/sk/chart/getFlowChart', method: 'GET', params: { chartId: this.props.location.query.id } }).then((resp) => {
    //         // items[3].initialValue = resp.ret.flowChartName;  /* 18.1.23  Sky不知道这行代码作用,注释掉 */
    //         this.setState({
    //           flowChartId: resp.ret.flowChartId
    //         });
    //         this.initializeCanvas(resp.ret.picturePath, resp.ret);
    //       });
    //     };
    //   });
    // });
    // console.log('this.props.location.query.deviceName', this.props.location.query.deviceName)
    // 编辑状态初始化图片
    if (this.props.location.query.id) {
      request({ url: '/wl/overview/detail/getChartInfo', method: 'GET', params: { deviceId: this.props.location.query.deviceId } }).then((res) => {
        t.initializeCanvas(t.props.location.query.picturePath, res.ret);
      })


    };


    // // 获取设备列表
    // request({ url: '/sk/chart/getDeviceListInfo', method: 'GET' })
    //   .then((res) => {
    //     console.log('获取设备列表', res)
    //     for (let i = 0; i < t.state.items.length; i++) {
    //       if (t.state.items[i].paramName === "deviceId") {
    //         for (let j = 0; j < res.ret.length; j++) {
    //           t.state.items[i].options.push({
    //             text: res.ret[j].deviceName, value: res.ret[j].deviceId
    //           })
    //         }
    //       }
    //       this.setState({
    //         items: t.state.items
    //       })
    //     }

    //     objItem.signalStateBtnItems[0].options = res.ret[0].reverseControlButtonDTOS;
    //     let obj = this.state.canvasPrimary;
    //     obj.signalStateBtn.reverseControlButtonId = res.ret[0].reverseControlButtonDTOS[0].reverseControlButtonId;
    //     this.setState({
    //       canvasPrimary: obj
    //     });
    //   })


    // 获取项目
    const options = [];
    request({ url: '/wl/chart/getSiteList', method: 'GET' })
      .then((res) => {
        // console.log('获取项目', res)
        for (let i = 0; i < res.ret.length; i++) {
          options.push({
            text: res.ret[i].siteName, value: res.ret[i].siteId
          });
        }
        t.state.items[0].options.push(...options)
        t.setState({
          items: t.state.items,
        })
      })


    let filtrateData = this.filtrate.getForm().getFieldsValue()
    // 获取仪器列表
    request({ url: '/wl/chart/getInstrument', method: 'GET', params: { deviceId: this.props.location.query.deviceId || filtrateData.deviceId } }).then((res) => {
      console.log('获取仪器列表', res)
      const options = [];
      for (let i = 0; i < res.ret.length; i++) {
        options.push({ 'name': res.ret[i].name, 'value': res.ret[i].id })
      }
      t.state.objItem.signalStateBtnItems[0].options.push(
        ...options
      )
      t.setState({
        objItem: t.state.objItem
      })
    })
 



  }
  render() {
    const { argumentsBtn, textBtn } = this.state.canvasPrimary;
    const argumentsBtnStyle = { backgroundColor: argumentsBtn.backgroundColor, color: argumentsBtn.textColor };
    const textBtnStyle = { backgroundColor: textBtn.backgroundColor, color: textBtn.textColor };
    return (
      <div className="cl-equipmentLedger">
        <Filtrate
          items={this.state.items}
          extraBtn={extraBtnItem}
          canvasSaveBtn={this.canvasSaveBtn.bind(this)}
          canvasCancelBtn={this.canvasCancelBtn.bind(this)}
          ref={ref => this.filtrate = ref}

        >
        </Filtrate>
        <div className="yk-canvas-section">
          <div className="btn-container">
            <p className="btn-container-title">流程图组件库</p>
            <div className="btn-block">
              <p className="btn-subtitle">工艺参数监控</p>
              <div className="btn-arguments-container" onClick={() => { this.onModalAlert("argumentsBtn", "add") }} draggable={true} onDragStart={(e, type) => { this.dragStart(e, "argumentsBtn") }} style={argumentsBtnStyle}>
                <p className="text">{argumentsBtn.factorCode}</p>
                <p className="line"></p>
                <p className="text">34{argumentsBtn.unit}</p>
              </div>
            </div>
            {/* <div className="btn-block">
              <p className="btn-subtitle">设备启停按钮</p>
              <img src={switchImg} onClick={() => { this.onModalAlert("switchBtn", "add") }} id="btn-switch-img" className="btn-switch-img" draggable={true} onDragStart={(e, type) => { this.dragStart(e, "switchBtn") }} />
            </div> */}
            <div className="btn-block">
              <p className="btn-subtitle">设备状态信号灯</p>
              <img src={signImg} onClick={() => { this.onModalAlert("signalStateBtn", "add") }} className="btn-sign-img" draggable={true} onDragStart={(e, type) => { this.dragStart(e, "signalStateBtn") }} />
            </div>
            <div className="btn-block">
              <p className="btn-subtitle">文本框</p>
              <p className="btn-text" onClick={() => { this.onModalAlert("textBtn", "add") }} draggable={true} onDragStart={(e, type) => { this.dragStart(e, "textBtn") }} style={textBtnStyle}>{textBtn.text}&nbsp;</p>
            </div>
          </div>
          <div className={this.state.bgState ? "canvas-container-out active" : "canvas-container-out"} onDrop={this.dragEnd} onDragOver={this.allowDrop}>
            <canvas id="main" width="850" height="750"></canvas>
          </div>
          <div className={this.state.bgState ? "canvas-container-file" : "canvas-container-file active"}>
            <input type="file" className="input-file" accept=".png, .jpg, .jpeg" ref="canvasBgFile" onChange={this.bgChange} />
            <div className="add-btn">
              <img src={add} />
              <p>请添加一张工艺流程图底图</p>
            </div>
          </div>
          <img src={close} id="img-close" />
          <img src={switchImg} id="img-switch" />
          <img src={signImg} id="img-sign" />
          {this.state.editModalVisible &&
            <EditModal
              title="工艺参数监控组件"
              width={380}
              visible={this.state.editModalVisible}
              modalItem={this.state.btnItem}
              onModalCancel={this.onModalCancel}
              btnType={this.state.btnType}
              modalSaveBtn={this.onModalSave}
              defaultModalData={this.state.defaultModalData}
              editState={this.state.editState}
            />
          }
        </div>
      </div>
    )
  }
}
export default FlowChartManagementEdit;
