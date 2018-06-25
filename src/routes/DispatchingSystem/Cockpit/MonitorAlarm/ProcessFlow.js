import React from 'react'
import request from '../../../../utils/request';
import './ProcessFlow.less';

// const img = require('../../../../assets/factory.jpg');
const close = require('../../../../assets/close.png');
const switchImg = require("../../../../assets/btn-switch-on.png");
const switchImgOther = require("../../../../assets/btn-switch-off.png");
const signImg = require("../../../../assets/btn-sign-green.png");
const signImgOther = require("../../../../assets/btn-sign-red.png");
const SwitchOn = require('../../../../assets/switch1.png');
const SwitchOff = require('../../../../assets/switch2.png');
const SwitchOpen = require('../../../../assets/switch3.png');
const SwitchDown = require('../../../../assets/switch4.png');

// const imgBaseUrl = "http://192.168.1.115:8079/upload/";
const imgBaseUrl = "http://183.129.170.220:8079/upload/";

//需要去掉的4个按钮
const oCoordsHide = ["mb", "mr", "mt", "ml"]

let objItem = {
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
          if (this.options[i].factorCode === value) {
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
      label: '工艺位号',
      paramName: "factorCode",
      size: 24,
      options: [],
      selectChange: function (value) {

        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].factorCode === value) {
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
//type字段
const canvasType = {
  background: "background",
  argumentsBtn: "argumentsBtn",
  switchBtn: "switchBtn",
  signalStateBtn: "signalStateBtn",
  textBtn: "textBtn"
}
export default class ProcessFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
          factorCode: "T002",
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
      componentId: null,
      visible: false,
      isOpen: true,
      data: null,
      opsitesBtn: [],
      editModalVisible: false,  //弹出框状态
      btnType: null,  //当前点击按钮类型
      btnItem: [],  //需要传入modal的按钮item
      defaultModalData: {},  //当前按钮数据 用于modal初始化
      editState: "",  //当前编辑框类型 "edit" 编辑  "add" 添加
      selectedGroup: null,  //被选中的图形
      bgState: false,  //是否有背景
      allFactor: [],  //所有工艺位号
      componentResp: null, //组件respData
      // needControl: false
    };
  }

  //初始化canvas
  initializeCanvas = (imageUrl, data) => {
    //初始化canvas以及canvas全局设置
    let t = this;
    let canvas = new fabric.StaticCanvas('main');

    //设置背景 以及 初始化页面各项按钮
    this.setState({
      canvas: canvas,
      bgState: true
    }, () => {
      if (data) {
        fabric.Image.fromURL(`${imgBaseUrl}${imageUrl}`, (oImg) => {
          oImg.hasControls = false;
          oImg.hasBorders = false;
          oImg.selectable = false;
          oImg.hoverCursor = 'default';
          oImg.canvasType = "backgroundImage";
          canvas.add(oImg);
          data.componentDataDTOS.map((data, index) => {
            let a = data.type;
            switch (data.type) {
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
          });

          //todofix 目前用来处理画布 无法有正确层级关系的问题 去掉这段代码 初始化时 无法正确的层级
          // let e = {
          //   keyCode: 32
          // };
          // canvas.discardActiveObject();
          // var sel = new fabric.ActiveSelection(canvas.getObjects(), {
          //   canvas: canvas,
          //   hasControls: false,
          //   hasBorders: false,
          // });
          // canvas.setActiveObject(sel);
          // canvas.requestRenderAll();
          // canvas.discardActiveObject();
          // canvas.requestRenderAll();

          //设置背景图片
          // setTimeout(() => {
          //   let src = canvas.lowerCanvasEl.toDataURL("image/png");
          //   // window.postMessage(src, "*")
          this.setState({
            imgPath: imageUrl,
            // src: src
          });
          //debugger
          // },0)

        });
      }
    });
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
    console.log(data.factorCode);
    //绘制工艺位号
    let text1Left = (130 - data.factorCode.length * 10) / 2;
    let text1 = new fabric.IText(data.factorCode, {
      left: text1Left,
      fontSize: 15,
      stroke: data.textColor,
      fill: data.textColor,
    });

    //绘制显示单位
    let text2Left = (130 - (data.unit ? data.unit.length : 0) * 10 - (data.value ? data.value.length : 0) * 10) / 2;
    let text2 = new fabric.IText((data.value || 0) + " " + data.unit + "", {
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
    });

    group.scale(data.scalex)

    //对象类型
    data.type = 1
    group.uploadData = data;
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

    let imgElement = data.openSignal === "1" ? document.getElementById('img-switch') : document.getElementById('img-switch-other');
    let imgInstance = new fabric.Image(imgElement, {
      originX: 'center',
      originY: 'center',
      opacity: 1,
    });
    imgInstance.scale(0.16)

    let group = new fabric.Group([imgInstance], {
      left: left,
      top: top,
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
    let imgElement = data.openSignal === "1" ? document.getElementById('img-sign') : document.getElementById('img-sign-other');
    //let imgElement2=data.openSignal === "1" ?  document.getElementById('img-sign-other') : document.getElementById('img-sign') ;

    let imgInstance = new fabric.Image(imgElement, {
      originX: 'center',
      originY: 'center',
      opacity: 1,
    });
    // let imgInstance2= new fabric.Image(imgElement2 , { 
    //   originX: 'center',
    //  originY: 'center',
    //  opacity:0,
    //  });
    imgInstance.scale(0.25);
    //imgInstance2.scale(0.25);
    let group = new fabric.Group([imgInstance], {
      left: left,
      top: top,
    });
    console.log(data);
    group.on('selected', (option) => {
      console.log(data);
      if (data.openSignal == 1) {

      }


      // let opacity1=group.item(0).get('opacity');
      //   if(opacity1==1)
      //   {
      //     group.item(0).set(
      //       {
      //         opacity: 0
      //       }
      //     );
      //     group.item(1).set(
      //       {
      //         opacity: 1
      //       }
      //     );
      //   }
      //   else 
      //    {
      //     group.item(0).set(
      //       {
      //         opacity: 1
      //       }
      //     );
      //     group.item(1).set(
      //       {
      //         opacity: 0
      //       }
      //     );
      //    }

      else {


        // let opacity2=group.item(1).get('opacity');
        // if(opacity2==1)
        // {
        //   group.item(0).set(
        //     {
        //       opacity: 1
        //     }
        //   );
        //   group.item(1).set(
        //     {
        //       opacity: 0
        //     }
        //   );
        // }
        // else 
        //  {
        //   group.item(0).set(
        //     {
        //       opacity: 0
        //     }
        //   );
        //   group.item(1).set(
        //     {
        //       opacity: 1
        //     }
        //   );
        //  }
      }
    });
    group.scale(data.scalex)

    oCoordsHide.map((data, index) => {
      group.setControlVisible(data, false)
    })
    data.type = 2;
    group.canvasType = 2;
    group.id = data.id;
    group.uploadData = data;

    // group.on('selected', (option) => {
    //   this.setDeleteBtn(group)
    // });

    // group.on('mousedblclick', (options) => {
    //   if (!this.deleteBtn(options, group)) {
    //     this.onModalAlert("signalStateBtn", "edit", data);
    //   };
    // });

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
      // hasControls: false,
      // hasBorders: false,
    });

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

  //弹出框取消
  onModalCancel = () => {
    this.setState({
      editModalVisible: false,
    })
  }

  //弹出框弹出 
  onModalAlert = (type, editState, data) => {
    let group = this.state.canvas.getActiveObjects();
    if (!data) {
      var data = this.state.canvasPrimary[type];
    }
    this.setState({
      editModalVisible: true,
      btnItem: objItem[type + "Items"],
      btnType: type,
      componentId: data.id,
      defaultModalData: data,
      editState: editState,
      selectedGroup: group
    })
  }

  //保存组件
  saveConponent = (opt, kind) => {
    let arr = [];
    opt.type = kind;
    opt.id = this.state.componentId;
    opt.chartId = this.state.flowChartId;
    arr.push(opt);
    fetch("/sk/chart/saveComponents", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arr)
    }).then(resp => {
      return resp.json();
    }).then(json => {
      console.log(json);
      console.log('修改成功！');
    });
  }

  //弹出框保存
  onModalSave = (obj) => {
    console.log(obj);
    let group = this.state.selectedGroup[0];
    let type = this.state.btnType;
    switch (type) {
      case "argumentsBtn":
        this.saveConponent(obj, 1);
        break;

      case "switchBtn":
        this.saveConponent(obj, 3);
        break;

      case "signalStateBtn":
        this.saveConponent(obj, 2);
        break;

      case "textBtn":
        this.saveConponent(obj, 4);
        break;
      default:
        break;
    }
    this.state.canvas.remove(group);
    this.setState({
      editModalVisible: false,
    });
  }

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

  //刷新获取数据
  updateData = () => {
    request({ url: '/sk/chart/getFlowChart', method: 'GET', params: { chartId: this.props.location.query.id } }).then((resp) => {
      console.log(this.state.canvas)
      console.log(this.state.canvas._objects);
      let len = this.state.canvas._objects.length;
      //todo fix
      for (let i = 0; i < len; i++) {
        // if(this.state.canvas._objects[i].canvasType === "backgroundImage") continue;
        if (this.state.canvas._objects[1]) this.state.canvas.remove(this.state.canvas._objects[1]);
      }

      console.log(this.state.canvas)
      for (let j = 0; j < resp.ret.componentDataDTOS.length; j++) {
        let data = resp.ret.componentDataDTOS[j];
        switch (data.type) {
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
      }
    })
  }

  //每7秒重新获取一次数据
  count() {
    this.timer = setInterval(() => {
      this.updateData()
      // window.location.reload()
    }, 7000);
  }

  //判断点击区域
  isZone = (e, item) => {
    let width = item.left + item.width;
    let height = item.top + item.height;
    if (e.pageX > item.left && e.pageX < width && e.pageY > item.top && e.pageY < height) {
      return true;
    }
    else {
      return false;
    }
  }
  //获取点击区域
  getClick = (e) => {
    // alert("进了方法")
    // alert(this.state.isControl)
    // alert(this.state.isPAC)
    // alert(this.state.times)
    // alert(this.state.isControl && this.state.times > 1)

    if (this.state.isControl && this.state.times > 1) {
      // alert(1)
      let obj1 = [];
      obj1 = this.state.canvas._objects;
      obj1.map((item, index) => {
        if (item.canvasType == 2 && this.isZone(e, item)) {
          // alert('1')
          let state = item.uploadData.openSignal == 1 ? 0 : 1;
          let data1 = {
            buttonId: item.uploadData.reverseControlButtonId,
            flowChartId: this.state.flowChartId,
            state: state,
            validPasswordDTO: {
              flowChartId: this.state.flowChartId,
              passwords: this.state.password,
            },
          };
          let data2 = JSON.stringify(data1);
          fetch("/sk/reverse/reverseControl", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: data2
          }).then(resp => {
            return resp.json();
          }).then(json => {
            // alert(JSON.stringify(json))
            if (json.rc === 0) {
              this.updateData();
            }
          });
        }
      });
      // } else if (!this.state.isControl && this.state.isPAC) {
    } else if ((this.state.isPAC && this.state.times == 1) || (this.state.times > 1 && this.state.isPAC && !this.state.isControl)) {
      // alert(2)
      let obj1 = [];
      obj1 = this.state.canvas._objects;
      obj1.map((item, index) => {
        if (item.canvasType == 2 && this.isZone(e, item) && item.uploadData.reverseControlButtonId == 4) {
          // alert("进了的第二个判断");
          let state = item.uploadData.openSignal == 1 ? 0 : 1;
          let data1 = {
            buttonId: item.uploadData.reverseControlButtonId,
            flowChartId: this.state.flowChartId,
            state: state,
            validPasswordDTO: {
              flowChartId: this.state.flowChartId,
              passwords: this.state.password,
            },
          };
          let data2 = JSON.stringify(data1);
          fetch("/sk/reverse/reverseControl1", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: data2
          }).then(resp => {
            return resp.json();
          }).then(json => {
            // alert(JSON.stringify(json))
            if (json.rc === 0) {
              this.updateData();
            }
          });
        }
      });
    }
  }

  componentDidMount() {
    // //获取所有工艺流程号
    // console.log(this.props)
    // request({ url: 'wl/overview/detail/getChartInfo', method: 'GET', params: {deviceId: 1} }).then((resp) => {
    //   let obj = this.state.canvasPrimary;
    //   obj.argumentsBtn.factorCode = resp.ret[0].factorCode;
    //   obj.switchBtn.factorCode = resp.ret[0].factorCode;
    //   obj.signalStateBtn.factorCode = resp.ret[0].factorCode;
    //   this.setState({
    //     allFactor: resp.ret,
    //     canvasPrimary: obj
    //   }, () => {
    //     if (this.props.location.query.id) {
    //       request({ url: '/sk/chart/getFlowChart', method: 'GET', params: { chartId: this.props.location.query.id } }).then((resp) => {
    //         items[3].initialValue = resp.ret.flowChartName;
    //         this.setState({
    //           flowChartId: resp.ret.flowChartId,
    //         });

    //         this.initializeCanvas(resp.ret.picturePath, resp.ret);
    //         this.count();
    //       });
    //     };
    //   })
    // });
  }

  componentWillUnmount() {
    // clearInterval(this.timer)
  }

  render() {
    return (                                                                   
      <div className="processFlow-container">
        <p className="processFlow-title"><i className="iconfont icon-shouqi"></i>
          <span>工艺流程</span>
        </p>

        <div className="processFlow-content" style={{ backgroundImage: `url(${this.props.cockpit.ChartInfo && this.props.cockpit.ChartInfo.path})`}}>
          {/* <div className="appchart">
            <div className="yk-canvas-section yk-wap-chart">
              <div style={{ left: 0 }} className="canvas-container-out active" id="canvasBox" onClick={e => this.getClick(e)}>
                <canvas id="main" width="1920" height="1020"></canvas>
              </div>
              <img src={close} id="img-close" />
              <img src={switchImg} id="img-switch" />
              <img src={switchImgOther} id="img-switch-other" />
              <img src={signImg} id="img-sign" />
              <img src={signImgOther} id="img-sign-other" />
            </div>
          </div> */}
        </div>
      </div>
    )
  }
}