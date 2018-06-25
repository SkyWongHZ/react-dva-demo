import React from 'react';
import { Form, Input, Modal, Button, Row, Col, InputNumber, Select } from 'antd';
import './FlowChartManagementEdit.less';

const FormItem = Form.Item;
const Option = Select.Option;

let defaultLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

let defaultInputSize = 8;

class EditModal extends React.Component {
  state = {
  }
  componentWillMount() {}

  componentDidMount() {
    //初始化弹出框值  
    let defaultData = this.props.defaultModalData;
   
    this.props.modalItem.map( (data, index) => {
      if(data.type === "colorPicker"){
        for(let i = 0; i < data.options.length; i++){
          if(data.options[i] === defaultData[data.paramName]){
            this.setState({
              [data.paramName]: i
            })
          }
        }
      }else if(data.type === "input" || data.type === "range" || data.type === "select"){
        this.props.form.setFieldsValue({[data.paramName]: defaultData[data.paramName]});
        if( data.type === "select"){
          this.selectHandChange(defaultData[data.paramName], data)
        }
      }
    })
  }

  // 保存按钮
  onModalSave =() => {
    let { modalSaveBtn, modalItem } = this.props;
    //获取表单数据
    let params = this.props.form.getFieldsValue();
    console.log('params', params)
    debugger
    //单独处理 颜色选择
    let color = {};
    modalItem.map( (data, index) => {
      if(data.type === "colorPicker"){
        color[data.paramName] = data.options[this.state[data.paramName]];
      };
    });

    let data = Object.assign(params, color);
    modalSaveBtn(data, this.props.editState);
  }

  setFooter =() => {
    let { onModalCancel } = this.props;
    return (
      <div>
        <Button className="yk-btn" onClick={onModalCancel}>取消</Button>
        <Button className="yk-btn" onClick={this.onModalSave.bind(this)}>确定</Button>
      </div>
    )
  }

  //改变颜色
  changeColor(type, index) {
    console.log(type)
    this.setState({
      [type]: index
    })
  }

  //选项框改变
  selectHandChange = (value, data) => {
    let obj = data.selectChange(value);
    for(let name in obj){
      this.props.form.setFieldsValue({[name]: obj[name]});
    }
  }

  render() {
    let { modalItem, onModalCancel } = this.props;
    let layout = this.props.formItemLayout || defaultLayout;
    let inputSize = this.props.inputSize || defaultInputSize;
    let { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          {...this.props}
          className="yk-flowchart-edit-modal"
          onCancel={onModalCancel}
          footer={this.setFooter()}
        >
          <Form className="yk-flowchart-edit-modal-form">
            {modalItem &&
              modalItem.map((data, index) => {
                if (data.type === "input") {
                  console.log(data)
                  return (
                    <Col span={data.inputSize} key={index} className="yk-flowchart-edit-modal-col">
                      <FormItem key={index}>
                        <span className="span-label">{data.label}：</span>
                        {
                          getFieldDecorator(data.paramName, {
                          })(
                            <Input key={index} className="value-container" disabled={data.disabled}/>
                            )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (data.type === "colorPicker") {
                  return (
                    <Col span={data.inputSize} key={index} className="yk-flowchart-edit-modal-col">
                      <FormItem key={index}>
                        <span className="span-label">{data.label}：</span>
                        <ul className="value-container">
                          {data.options.map((data1, index) => {
                            return (
                              <li className={this.state[data.paramName] == index ? "color-list active" : "color-list"} onClick={(type, value) => (this.changeColor(data.paramName, index))} style={{ backgroundColor: data1 }}></li>
                            )
                          })}
                        </ul>
                      </FormItem>
                    </Col>
                  )
                } else if (data.type === "range") {
                  return (
                    <Col span={data.inputSize} key={index} className="yk-flowchart-edit-modal-col">
                      <span className="span-label">{data.label}：</span>
                      <div className="value-container-double">
                        <FormItem>
                          {
                            getFieldDecorator(data.paramName[0], {
                            })(
                              <InputNumber  disabled={data.disabled}/>
                            )
                          }
                          <span className="mid-span">~</span>
                        </FormItem>
                        <FormItem>
                          {
                            getFieldDecorator(data.paramName[1], {
                            })(
                              <InputNumber  disabled={data.disabled}/>
                            )
                          }
                        </FormItem>
                      </div>
                    </Col>
                  )
                } else if (data.type === "select"&& data.paramName === "factorCode" ){
                  return (
                    <Col span={data.inputSize} key={index} className="yk-flowchart-edit-modal-col">
                      <FormItem key={index}>
                        <span className="span-label">{data.label}：</span>
                        {
                          getFieldDecorator(data.paramName, {
                          })(
                            <Select style={{ width: 120 }} onChange={(value) => {this.selectHandChange(value, data)}}>
                              { data.options.map((obj, index) => {
                                return(
                                  <Option value={obj.factorCode} key={index}>{obj.factorCode}</Option>
                                )
                              })}
                            </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (data.type === "select" && data.paramName === "reverseControlButtonId"){
                  // console.log('data', data)
                  // debugger
                  return (
                    <Col span={data.inputSize} key={index} className="yk-flowchart-edit-modal-col">
                      <FormItem key={index}>
                        <span className="span-label">{data.label}：</span>
                        {
                          getFieldDecorator(data.paramName, {
                          })(
                            <Select style={{ width: 120 }} onChange={(value) => {this.selectHandChange(value, data)}}>
                              { data.options.map((obj, index) => {
                                return(
                                  // <Option value={obj.reverseControlButtonId} key={index}>{obj.name}</Option>
                                  <Option value={obj.value} key={index}>{obj.name}</Option>
                                )
                              })}
                            </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                }
              })
            }
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(EditModal);