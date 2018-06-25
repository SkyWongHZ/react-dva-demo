/***
 * modal 组件 定义了样式
 */
import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, Button, Select, DatePicker, Row, Col, Checkbox, notification } from 'antd';
import moment from 'moment';
import MyTable from '../PublicComponents/MyTable';
import config from '../../config';
import Util from '../../utils/Util';
import '../PublicComponents/SkyPublicCommon.less';
import MapLocation from '../common/MapLocation';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;


let defaultLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
let defaultInputSize = 8;


class MyModal extends Component {
  state = {
    modalKey: 1,
    center: { latitude: 30, longitude: 120 },
  };

  // 保存按钮
  onModalSave() {
    let t = this;
    let { modalSaveBtn } = t.props;
    t.props.form.validateFields((err, params) => {
      if (!err) {
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

  setFooter() {
    let t = this;
    let { onModalCancel, footerShow } = t.props;
    if (footerShow) {
      return (
        <div className="roggue">
          <Button className="wp-btn  ZERO" onClick={t.onModalSave.bind(t)}>{this.props.okText?this.props.okText:'保存'}</Button>
          {/* <Button className="wp-btn" onClick={onModalCancel}>取消</Button> */}
        </div>
      )
    } else {
      return null;
    }
  }

  // 多选框搜索
  onChange = (e, name) => {
    // console.log(this.props.form.getFieldsValue()[name])
  }

  componentDidMount() {
    if (this.props.defaultData) {
      let { defaultData } = this.props;
      this.props.modalItems.map((data, index) => {
        data.sub.map((data2, index2) => {
          // if(data2.label === "取水用途") debugger
          try {
            let obj = null;
            if (data2.type != "rangePicker") {
              obj = { [data2.paramName]: defaultData[data2.paramName] };
            } else if (data2.type === "rangePicker") {
              let arr = [moment(defaultData[data2.paramName][0]), moment(defaultData[data2.paramName][1])]
              obj = { [data2.paramName]: arr };
            }
            this.props.form.setFieldsValue(obj);
          } catch (error) {
            console.log(error)
          }

        })
      })

    }
  }
 
  render() {
    let t = this;
    let defaultData = t.props.defaultData;
    let { getFieldDecorator } = t.props.form;
    let { onModalCancel, modalItems, tabWidth } = t.props;

    let layout = t.props.formItemLayout || defaultLayout;
    let inputSize = t.props.inputSize || defaultInputSize;

    return (
      <div>
        <Modal {...t.props}
          key={t.state.modalKey}
          className={"wp-modal " + t.props.className}
          onCancel={onModalCancel}
          footer={t.setFooter()}
          maskClosable={false}
        >
          {
            modalItems.map((item, index) => {
              if (item.sub) {
                return (
                  <div key={index} className="t-MB10">
                    {item.title &&
                      <div className='wp-tab'>
                        <div className="wp-tab-header" style={tabWidth && { width: tabWidth } || {}}>
                          <span>{item.title}</span>
                        </div>
                      </div>
                    }
                    <Form className="wp-myModal-form" key={index} layout="inline">
                      <Row gutter={16}>
                        {
                          item.sub.map((item2, index2) => {
                            // console.log(item2.endLabel)
                            if (item2.type === 'input') {
                              return (
                                <Col span={item2.inputSize||inputSize} key={index2}>
                                  <FormItem {...layout} label={item2.label}
                                    key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                        initialValue: item2.initialValue || "",
                                        // initialValue: item2.options[0] ? Util.numToString(item2.options[0].value) : item2.options[0],
                                        rules: [{
                                          required: item2.required || false,
                                          message: `请输入${item2.label}`
                                        }],

                                      })(
                                        <Input key={index2} disabled={item2.disabled || false} {...this.props.modalDisabled} maxLength={20} />
                                        )
                                    }
                                    {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                  </FormItem>
                                </Col>
                              );
                            } else if (item2.type === 'inputNumber') {
                              return (
                                <Col span={inputSize} key={index2}>
                                  <FormItem {...layout} label={item2.label}
                                    key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                        initialValue: item2.initialValue || 0,
                                        // initialValue: item2.options[0] ? Util.numToString(item2.options[0].value) : item2.options[0],
                                        rules: [{
                                          required: item2.required || false,
                                          message: `请输入${item2.label}`
                                        }],


                                      })(
                                        <InputNumber key={index2} min={0} disabled={item2.disabled || false} {...this.props.modalDisabled}/>
                                        )
                                    }
                                    {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                  </FormItem>
                                </Col>
                              );
                            } else if (item2.type === 'select') {
                              return (
                                <Col span={inputSize} key={index2}>
                                  <FormItem {...layout} label={item2.label}
                                    key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                        // initialValue:null,                                                                                                                                                            
                                        // initialValue: typeof item2.options[0] === 'object' ? Util.numToString(item2.options[0].value) : item2.options[0],
                                        initialValue: typeof item2.options[0] === 'object' ? (item2.multiple === true ? [] : Util.numToString(item2.options[0].value)) : item2.options[0],
                                        rules: [{
                                          required: item2.required || false,
                                          message: `请选择${item2.label}`
                                        }],
                                      })
                                        (
                                        <Select
                                          multiple={item2.multiple}
                                          size={'large'}
                                          showSearch
                                          onChange={item2.selectOnChange}
                                          optionFilterProp="children"
                                          dropdownMatchSelectWidth={true}
                                          disabled={item2.disabled || false}
                                          {...this.props.modalDisabled}

                                        >
                                          {
                                            item2.options.map(option => {
                                              return (
                                                <Select.Option key={typeof option === 'string' ? option : option.value}
                                                  value={Util.numToString(typeof option === 'string' ? option : option.value)}

                                                >
                                                  {typeof option === 'string' ? option : option.text}
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
                              return (
                                <Col span={inputSize} key={index2}>
                                  <FormItem {...layout} label={item2.label}
                                    key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                        initialValue:'',
                                        rules: [{
                                          required: item2.required || false,
                                          message: `请选择${item2.label}`
                                        }],
                                      })
                                        (
                                        <DatePicker
                                          size="large"  {...this.props.modalDisabled}
                                          disabledDate={this.props.dateDisabledDate}
                                          onChange={this.props.dateOnChange}
                                        > </DatePicker>
                                        )
                                    }
                                    {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                  </FormItem>
                                </Col>
                              );
                            } else if (item2.type === 'monthPicker') {
                              return (
                                <Col span={inputSize} key={index2}>
                                  <FormItem {...layout} label={item2.label}
                                    key={index2}>
                                    {
                                      getFieldDecorator(item2.paramName, {
                                        initialValue: '',
                                      })
                                        (
                                        <DatePicker.MonthPicker
                                          size="large"
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

                              return (<FormItem {...layout} className="sky-range-picker" label={item2.label}
                                key={index2}>
                                {
                                  getFieldDecorator(item2.paramName, {
                                    // initialValue: [moment().add(-1, 'months'), moment()],
                                    initialValue: item2.initialValue || '',
                                    rules: [{
                                      required: item2.required || false,
                                      message: `请输入${item2.label}`
                                    }],

                                  })(
                                    <RangePicker size="large" className="sky-range-picker"  {...this.props.modalDisabled}>
                                    </RangePicker>
                                    )
                                }


                              </FormItem>)
                            }
                            else if (item2.type === 'checkbox') {
                              return (<FormItem {...layout} className="sky-checkbox" label={item2.label}
                                key={index2}>
                                {
                                  getFieldDecorator(item2.paramName, {
                                    // initialValue: ['Apple'],
                                    // rules: [{
                                    //     required: true,
                                    // }],
                                  })
                                    (
                                    <CheckboxGroup options={item2.options} onChange={(e, name) => this.onChange(e, item2.paramName)} ></CheckboxGroup>
                                    )
                                }


                              </FormItem>)
                            } else if (item2.type === 'div') {
                              return (<FormItem {...layout} className="sky-ch"
                                key={index2}>
                                {
                                  getFieldDecorator(item2.paramName, {
                                    initialValue: '',
                                  })
                                    (
                                    <div className='map-all'>
                                      <div className="gaode-map">
                                        <MapLocation center={this.props.center} getPosition={(position) => {
                                          this.setState({ center: position });
                                          item2.getPosition(position);
                                        }} />
                                      </div>
                                      <div className={`modal-map`} style={this.props.modalDisabled.disabled === true ? { display: 'inherit' } : { display: 'none' }}> </div>
                                    </div>

                                    )
                                }


                              </FormItem>)
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
                    <div className="wp-tab t-MB10">
                      <div className="wp-tab-header">
                        <span>{item.title}</span>
                      </div>
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
