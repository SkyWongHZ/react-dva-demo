/***
 * 容器组件 定制了 新增与输出按钮
 * addBtnShow 新增按钮显隐, exportBtnShow 输出按钮显隐, extraBtn 额外按钮数组
 */
import React, {Component} from 'react';
import {Icon, Dropdown, Upload, message} from 'antd';
import MyIcon from './MyIcon';
import request from '../../utils/request'
import config from '../../config'
require('./components-css.less');
const addfile = require("../../assets/images/addfile.png");
const edit = require("../../assets/images/edit.png");
let importBtnConfigDefault = {
  name: 'file',
  action: null,
  // accept: '.xls, .xlsx',
  accept: '.docx',
  onChange(info) {
    console.log(info, "onChange")
  },
  onSuccess(info) {
    // debugger
    console.log(info, "onSuccess");
    if (info.rc !== 0) {
      message.error(info.err);
    } else {
      message.success('文件上传成功');
    }
  },
  onError(info) {
    console.log(info, "onError")
  },
  onStart(info) {
    console.log(info, "onStart")
  }
};

class MyContainer  extends Component {
  state = {
    // uploadConfig: {}
  }

  componentDidMount() {

    //初始化上传设置
    let uploadConfig = this.props.importBtnConfig ? Object.assign(importBtnConfigDefault, this.props.importBtnConfig) : importBtnConfigDefault;
    uploadConfig.action = config.publicUrl + uploadConfig.action;
    this.setState({
      uploadConfig: uploadConfig,
    });
    // debugger
  }

  addfileBtn() {
    let t = this;
    t.props.addfileBtn();
  }
  editBtn() {
    let t = this;
    t.props.editBtn();
  }
  deleteBtn() {
    let t = this;
    t.props.deleteBtn();
  }

  exportBtn() {
    let t = this;
    t.props.exportBtn();
  }

  // 额外按钮的点击事件
  extraBtnClick(btnIndex ,funName) {
    let t = this;
    let funNameStr = t.props.extraBtn[btnIndex].funName;
    // console.log(funNameStr)
    // t.props.extraBtn[funName]();
    t.props[funNameStr]();
    // t.props[funName]()
    // funNameStr? t.props.extraBtn[btnIndex].funName: t.props.extraBtn[];
  }

  render() {
    let t = this;
    let url = t.props.importBtnUrl ? config.publicUrl + t.props.importBtnUrl : '';

    const uploadProps = {
      name: 'file',
      action: url,
      accept: '.xls, .xlsx',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
      onSuccess(info) {
        if (info.rc !== 0) {
          message.error(info.err);
        } else {
          message.success('文件上传成功');
        }
      }
    };

    let extraBtn = t.props.extraBtn || [];
    let menu = t.props.menu;
    return (
      <div className={`wp-container ${this.props.className}`} style={this.props.style} id={this.props.id}>
        <div className="wp1-container-header"  style={this.props.headerStyle}>
          {t.props.subTitle && <span className="wp-container-header-subtitle">{t.props.subTitle}</span>}
          {t.props.closeTitle &&
            <MyIcon onClick={this.props.closeTitleFn} className="t-ML10 t-MR4" style={{ fontSize: '16px', color: 'rgb(255, 41, 56)', float: 'right', cursor: 'pointer' }} type="icon-guanbi" />
          }
          
          {
            extraBtn.map((item, index) => {
              let iconStyle = item.iconStyle || {};
              return (
                <span key={index}>
                  <MyIcon onClick={t.extraBtnClick.bind(t, index, item.funName)} className="t-ML10 t-MR4" style={iconStyle} type={item.icon}/>
                  <span onClick={t.extraBtnClick.bind(t, index, item.funName)}>{item.name}</span>
                  {
                    (extraBtn.length - 1 !== index || menu || t.props.addfileBtnShow) &&
                    <span className="wp-line"> </span>
                  }
                </span>
              )
            })
          }
           
           {
            t.props.editBtnShow &&
            <span onClick={t.editBtn.bind(t)}>
              <img src={edit} style={{display:'inline-block',width:'13px',height:'13px',marginLeft:'13px',marginRight:'5px',marginTop:'10px', color: '#6ED1A6'}}/>
              <span>编辑类型</span>
              {
                (extraBtn.length !== 0 || menu || t.props.exportBtnShow || t.props.importBtnUrl) &&
                <span className="wp-line"> </span>
              }
            </span>
          }

          {
            t.props.addfileBtnShow &&
            <span onClick={t.addfileBtn.bind(t)}>
              <img src={addfile} style={{display:'inline-block',width:'16px',height:'13px',marginLeft:'13px',marginRight:'5px',marginTop:'10px', color: '#6ED1A6'}}/>
              {t.props.file && <span>新增文件</span>}
              {t.props.planning && <span>新增预案</span>}
              {
                (extraBtn.length !== 0 || menu || t.props.exportBtnShow || t.props.importBtnUrl) &&
                <span className="wp-line"> </span>
              }
            </span>
          }

          {
            t.props.exportBtnShow &&
            <span onClick={t.exportBtn.bind(t)}>
              <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '14px', color: '#6ED1A6' }} type="icon-daochu"/>
              <span>导出</span>
              {
                (extraBtn.length !== 0 || menu || t.props.importBtnUrl || t.props.deleteBtnShow) &&
                <span className="wp-line"> </span>
              }
            </span>
          }
         
          {
            t.props.deleteBtnShow &&
            <span onClick={t.deleteBtn.bind(t)}>
              <MyIcon className="t-ML10 t-MR4" style={{fontSize: '14px', color: '#f58989'}} type="icon-del"/>
              <span>删除</span>
              {
                (extraBtn.length == 0 || menu || t.props.importBtnUrl) &&
                <span className="wp-line"> </span>
              }
            </span>
          }
          
    
          {
            t.props.menu &&
            <Dropdown
              overlay={t.props.menuSub || []}
              trigger={['click']}
            >
              <span>
                <MyIcon className="t-ML8" style={{fontSize: '12px'}} type="icon-gongnengleixing"/> {t.props.menu.name}
                <Icon type="down"/>
              </span>
            </Dropdown>
          }
          {
            t.props.importBtn &&
            <Upload {...this.state.uploadConfig}>
              <span>
                <MyIcon className="t-ML10 t-MR4" style={{fontSize: '12px'}} type="icon-daoru"/>
                <span>导入</span>
              </span>
            </Upload>
          }
        </div>
        <div className="wp-container-content" style={{height: this.props.contentHeight}}>
          {t.props.children}
        </div>
      </div>
    )
  }
}

export default MyContainer;
