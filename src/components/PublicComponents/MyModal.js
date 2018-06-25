/***
 * modal 组件 定义了样式
 */
import React, {Component}from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, Row, Col,Checkbox, notification} from 'antd';
import moment from 'moment';
import MyTable from './MyTable';
import config from '../../config';
import Util from '../../utils/Util';
import './components-css.less';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

let defaultLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

let defaultInputSize = 8;


class MyModal extends Component {
  state = {
    modalKey: 1
  };

  // 保存按钮
  onModalSave () {
    let t = this;
    let {modalSaveBtn} = t.props;
    t.props.form.validateFields((err, params) => {
      if(!err) {
        modalSaveBtn(params);
      }
      for (var prop in err) {
        notification.error({
          message: err[prop].errors[0].message
        })
        break;
      }

    });
  }

  // 额外按钮的点击事件
  extraBtnClick(btnIndex ,funName) {
    let t = this;
    let funNameStr = t.props.extraBtn[btnIndex].funName;
    t.props[funNameStr]();
  }

  setFooter () {
    let t = this;
    let {onModalCancel, footerShow, extraBtn} = t.props;
    if (footerShow) {
      return (
          <div className="roggue">
            {extraBtn && extraBtn.map( (item, index) => {
              return(
                <Button className="wp-btn ZERO" onClick={t.extraBtnClick.bind(t, index, item.funName)}>{item.name}</Button>
              )
            })}
            {/* <Button className="wp-btn" onClick={onModalCancel}>取消</Button> */}
            <Button className="wp-btn  ZERO" onClick={t.onModalSave.bind(t)}>保存</Button>
          </div>
      )
    } else {
      return null;
    }
  }

  // 多选框搜索
  onChange = (checkedValues) => {
    Array.join(checkedValues)
    // console.log('checked = '+Array.join(checkedValues));
  }

  componentDidMount (){
    if(this.props.defaultData){
      let data = this.props.defaultData;
      for(var name in data){
        let obj = {};
        obj[name] = String(data[name]);
        this.props.form.setFieldsValue(obj);
      }
    }

    // let data =
    // this.props.modalItems.map( (data, index) => {
    //   data.map( (data2, index2) => {

    //   })
    // })

    // this.props.form.setFieldsValue({"waterEnterprise": true})
  }

  render () {
    let t = this;
    let {getFieldDecorator} = t.props.form;
    let {onModalCancel, modalItems, width, onDeleteDom} = t.props;

    let layout = t.props.formItemLayout || defaultLayout;
    let inputSize = t.props.inputSize || defaultInputSize;

    const modalWidth = (24 / inputSize) * 170 + (24 / inputSize + 1) * 40;

    return (
        <div>
          <Modal {...t.props}
                 key={t.state.modalKey}
                 className={"wp-modal " + t.props.className}
                 onCancel={onModalCancel}
                 footer={t.setFooter()}
                 width={width || modalWidth}
                 maskClosable={false}
          >
            {
              modalItems.map((item, index) => {
                if (item.sub) {
                  return (
                      <div key={index} className="t-MB10">
                        { item.title &&
                        <div className="wp-tab">
                          <div className="wp-tab-header">
                            <span>{item.title}</span>
                          </div>
                        </div>
                        }
                        <Form className="wp-myModal-form" key={index} layout="inline">
                          <Row gutter={this.props.gutter || 40}>
                          {
                            item.sub.map((item2, index2) => {
                              if (item2.type === 'input') {
                                  return (
                                    <Col className="col-container" span={inputSize} key={index2}>
                                    <FormItem {...layout} label={item2.label}
                                              key={index2}>
                                      {
                                        getFieldDecorator(item2.paramName, {
                                          initialValue: item2.initialValue || "",
                                          rules: item2.rules,
                                        })(
                                            <Input key={index2} disabled={item2.disabled}/>
                                        )
                                      }
                                      {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                    </FormItem>
                                    </Col>
                                  );
                              } else if (item2.type === 'select') {
                                {/* console.log(Util.isBoolean(item2.initialValue)) */}
                                return(
                                  <Col className="col-container" span={inputSize} key={index2}>
                                  <FormItem {...layout} label={item2.label}
                                                        key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                          initialValue: Util.isBoolean(item2.initialValue) ? item2.initialValue : item2.initialValue || item2.options[0] && item2.options[0].value || item2.options[0],
                                          rules: item2.rules,
                                        })
                                    (
                                      <Select
                                          size={'large'}
                                          showSearch
                                          onChange={item2.selectOnChange}
                                          optionFilterProp="children"
                                          dropdownMatchSelectWidth={true}
                                          disabled={item2.disabled}
                                      >
                                        {
                                          item2.options.map(option => {
                                            return (
                                                <Select.Option key={option.value}
                                                              value={Util.numToString(option.value)}

                                                >
                                                  {option.text}
                                                </Select.Option>
                                            )
                                          })
                                        }
                                      </Select>
                                      )
                                    }
                                    {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                  </FormItem>
                                  </Col>
                                );
                              } else if (item2.type === 'datePicker') {
                                return(
                                  <Col span={inputSize} key={index2} className="col-container">
                                  <FormItem {...layout} label={item2.label}
                                                        key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                          initialValue: item2.initialValue || "",
                                          rules: item2.rules,
                                        })
                                    (
                                      <DatePicker
                                        size="large"
                                        disabled={item2.disabled}
                                      > </DatePicker>
                                      )
                                    }
                                    {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                  </FormItem>
                                  </Col>
                                );
                              } else if (item2.type === 'monthPicker') {
                                return(
                                  <Col span={inputSize} key={index2} className="col-container">
                                  <FormItem {...layout} label={item2.label}
                                                        key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                          initialValue: item2.initialValue || "",
                                          rules: item2.rules,
                                        })
                                    (
                                      <DatePicker.MonthPicker
                                        disabledDate={item2.disabledDate || ""}
                                        size="large"
                                        disabled={item2.disabled}
                                      > </DatePicker.MonthPicker>
                                      )
                                    }
                                    {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                  </FormItem>
                                  </Col>
                                );
                              }
                              else if (item2.type === 'rangePicker') {

                                // let disabled = item.disabledDate ? disabledDate : null;

                                return (
                                <Col span={inputSize} key={index2} className="col-container">
                                <FormItem {...layout} className="range-picker" label={item2.label}
                                  key={index2}>
                                  {
                                    getFieldDecorator(item2.paramName, {
                                      // initialValue: [moment().add(-1, 'months'), moment()],
                                      initialValue: '',
                                      rules: [{
                                        required: true,
                                      }],
                                      // initialValue: ''
                                    })(
                                      <RangePicker size="large"  disabled={item2.disabled}>
                                      </RangePicker>
                                      )
                                  }
                                 </FormItem>
                                 </Col>
                                 )
                              }
                              else if (item2.type === 'checkbox') {
                                return (
                                  <Col span={inputSize} key={index2} className="col-container">
                                  <FormItem {...layout} className="sky-checkbox" label={item2.label}
                                  key={index2}>
                                  {
                                    getFieldDecorator(item2.paramName, {
                                      initialValue: '',
                                      rules: [{
                                        required: true,
                                      }],
                                    })
                                    (
                                      <CheckboxGroup disabled={item2.disabled} options={item2.options} onChange={this.onChange}></CheckboxGroup>
                                    )
                                  }
                                </FormItem>
                                </Col>
                                )
                              }
                            })
                          }
                          </Row>
                        </Form>
                      </div>
                  )
                } else if (item.table) {
                  return (
                      <div key={index} className="t-MB10">
                        <div className="wp-tab t-MB10">
                          <div className="wp-tab-header">
                            <span>{item.title}</span>
                          </div>
                        </div>
                        <MyTable bordered size={config.size}  {...item.table}> </MyTable>
                      </div>
                  )
                } else if (item.custom) {
                  return (
                      <div key={index} className="t-MB10">
                        <div className="wp-tab t-MB10 fwq-tab-extend">
                          <div className="wp-tab-header">
                            <span>{item.title}</span>
                          </div>
                          {!item.noTabDom && typeof onDeleteDom === 'function' && onDeleteDom(item.add || false, index)}
                        </div>
                        {item.custom}
                      </div>
                  );
                }
              })
            }
          </Modal>
        </div>
    )
  }
}

export default Form.create()(MyModal);
