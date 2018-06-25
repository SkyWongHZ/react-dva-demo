
/***
 * modal 组件 定义了样式
 */
import React, {Component}from 'react';
import {Modal, Form, Input, Button, Select, DatePicker} from 'antd';
import moment from 'moment';
import MyTable from '../components/MyTable';
import config from '../config';
import Util from '../utils/Util';
import './components-css.less';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};


class MyModal extends Component {

  state = {
    modalKey: 1
  };

  componentDidMount () {

  }

  // 保存按钮
  onModalSave () {
    let t = this;
    let {modalSaveBtn} = t.props;
    let params = t.props.form.getFieldsValue();
    modalSaveBtn(params);
  }


  render () {
    let t = this;
    let {getFieldDecorator} = t.props.form;
    let {onModalCancel, modalItems} = t.props;
    return (
      <div>
        <Form layout="inline">
          <Row>
            {
              myModalItems.sub.map((item,index)=>{
                if(item.type === 'select'){
                  return(
                    <Col span={item.colSize}>
                      <FormItem {...formItemLayout} label={item.label}
                                key={index}>
                        {
                          (
                            <Select
                              size={config.size}
                              showSearch
                              style={{width:'145'}}
                              onChange={item.selectOnChange}
                              optionFilterProp="children"
                              dropdownMatchSelectWidth={true}
                            >
                              {
                                item.options.map(option => {
                                  return (
                                    <Select.Option key={option.value}
                                                   value=''
                                    >
                                      {option.text}
                                    </Select.Option>

                                  )
                                })
                              }
                            </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                }else if(item.type === 'input'){
                  return (
                    <Col span={item.colSize}>
                      <FormItem {...formItemLayout} label={item.label}
                                key={index}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: ''
                          })(
                            <Input key={index} size={config.size}
                                   placeholder={item.placeholder}/>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                }else if(item.type === 'button'){
                  return(
                    <Button className="wp-btn">添加</Button>
                  )
                }
              })
            }
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()(MyModal);












