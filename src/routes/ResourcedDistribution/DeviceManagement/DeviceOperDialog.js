import React, { Component } from 'react';
import { Button, Modal, Input, Table, Tree, Form ,notification,DatePicker,Checkbox,Row,Col,Upload,Select,InputNumber } from 'antd';
const { InputGroup } = Input.Group
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const Option = Select.Option
import request from '../../../utils/request';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import moment from 'moment';
import './DeviceOperDialog.less';
const confirm = Modal.confirm;

class DeviceOperDialog extends React.Component {
    // 初始状态
    state = {
        formData:{},//表单数据
        siteCodeLit:[], //项目编号枚举值
	}

    componentDidMount () {
        // 在componentWillMount里使用form.setFieldsValue无法设置表单的值
        // 所以在componentDidMount里进行赋值
        // see: https://github.com/ant-design/ant-design/issues/4802

        const {data, form} = this.props;
        if (data.id) {
            let formData=data
            formData.useTime=formData.useTime?moment(formData.useTime):null
            formData.monitorTypeId=String(formData.monitorTypeId)
            formData.siteId=String(formData.siteId)
            this.setState({
                formData
            })
            form.setFieldsValue(data);
        }

        this.findSiteCode()

    }

    //项目编号枚举值
    findSiteCode=()=>{
        request({ url: "/wl/overview/device/findSiteCode", method: 'get' })
        .then(res => {
            if(!res.rc){
                res.ret&&this.setState({
                    siteCodeLit:res.ret
                })
            }
        })
    }

    onChangeSaveCheck = (item,label,event) => {
        const {formData}=this.state
        formData[item]=event.target[label]
        this.setState({
            formData
        })
    }

    onChangeSaveSelect =(subName,event)=>{
        const {formData}=this.state
        formData[subName]=event
        this.setState({
            formData
        })
    }

    //确认
    confirm=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            this.saveOrUpdate(fieldsValue)
        })
    }


    //新增和修改提交
    saveOrUpdate(fieldsValue){
        let data=Object.assign(this.state.formData,fieldsValue)

        if(data.useTime) data.useTime=data.useTime.valueOf()

        request({ url: "/wl/overview/device/saveOrUpdate", method: 'POST', data: JSON.stringify(data) })
        .then(res => {
            if(!res.rc){
                let title=data.id?'修改':'新增'
                notification.success({
                    message: '提示',
                    description: title+'成功',
                })

                this.props.onSuccess(data.id)
            }
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        const {formData,siteCodeLit}=this.state

        const {isView,data,typeNameList}=this.props
        const typeNameListOptions = typeNameList.map(item => <Option key={item.id}>{item.typeName}</Option>);
        const siteCodeLitOptions = siteCodeLit.map(item => <Option key={item.id}>{item.code}</Option>);
        
        const that=this
        const disabledDate =  (current) => {
            return current && current._d.getTime() > Date.now()
        }

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
          },
        };

        return (
            <Modal
                className="custom-modal"
                title={this.state.formData.id?(this.props.isView?'详情':'编辑'):'新增'}
                width={ 715}
                visible={this.props.myModalVisibleDel}
                onCancel={this.props.onModalDelCancel}
                maskClosable={false}
                footer={
                    !this.props.isView &&
                    <div className='modal-del'>
                        <Button  key="submit" type="primary" className='button' onClick={this.confirm.bind(this)} >保存</Button>
                    </div>
                }
            >
                <div className='modal-content'>
                    <Form className={isView?'':'block-inner'}>
                         <Row gutter={70}>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                      label='项目编号'
                                    >
                                        <div>
                                        {getFieldDecorator('siteId', {
                                            rules: [{ required: true, message: '请选择项目编号！'}],
                                        })(
                                            <Select
                                              style={{ width: '100%' }}
                                              disabled={isView}
                                            >
                                              {siteCodeLitOptions}
                                            </Select>
                                        )}
                                        </div>
                                </FormItem>
                                
                                <FormItem
                                {...formItemLayout}
                                  label='数采仪名称'
                                >
                                        <div>
                                        {getFieldDecorator('dataCollectorName', {
                                            rules: [{ required: true, message: '请填写数采仪名称！'}],
                                            validateTrigger:'onBlur'
                                        })(
                                            <Input style={{width:'100%'}} disabled={isView}/>
                                        )}
                                        </div>
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                  label='设备编号'
                                >
                                    <div>
                                    {getFieldDecorator('deviceCode', {
                                        rules: [{ 
                                            required: true, message: '请选择设备编号！'
                                        },{ 
                                            pattern: /^[^\u4E00-\u9FA5]{0,25}$/, message: '请填写25个字符以内的字母/数字/符号！' 
                                        }],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                  label='设备型号'
                                >
                                    <div>
                                    {getFieldDecorator('type', {
                                        rules: [{ 
                                            required: true, message: '请填写设备型号！'
                                        },{ 
                                            max: 25, message: '请填写25个字符以内的设备型号！' 
                                        }],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                      label='测点类型'
                                    >
                                        {getFieldDecorator('monitorTypeId', {
                                            rules: [{ required: true, message: '请选择测点类型！'}]
                                        })(
                                            <Select
                                              style={{ width: '100%' }}
                                              disabled={isView}
                                            >
                                              {typeNameListOptions}
                                            </Select>
                                        )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                      label='维养周期'
                                    >
                                    <div className="text-left">
                                    {getFieldDecorator('cycle', {
                                        rules: [{ 
                                            required: true, message: '请填写维养周期！'
                                        },{
                                            pattern: /^[1-9]\d*$/, message: '请填写整数！' 
                                        }],
                                        validateTrigger:'onBlur'
                                    })(
                                        <InputNumber min={1} disabled={isView}/> 
                                    )}
                                    <span>天</span>
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                      label='数采仪编号'
                                    >
                                    <div>
                                    {getFieldDecorator('dataCollectorCode', {
                                        rules: [{ required: true, message: '请填写数采仪编号！'}],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                      label='数采仪MN号'
                                    >
                                    <div>
                                    {getFieldDecorator('dataCollectorMn', {
                                        rules: [{ required: true, message: '请填写数采仪MN号！'}],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                      label='设备名称'
                                    >
                                    <div>
                                    {getFieldDecorator('name', {
                                        rules: [{ 
                                            required: true, message: '请填写设备名称！'
                                        },{ 
                                            max: 30, message: '请填写30个字符以内的设备名称！' 
                                        }],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                      label='生产厂家'
                                    >
                                    <div>
                                    {getFieldDecorator('factory', {
                                        rules: [{ 
                                            required: true, message: '请填写生产厂家！'
                                        },{ 
                                            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9]{0,30}$/, message: '请填写30个字符以内的汉字/字母/数字！' 
                                        }],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>

                                 <FormItem
                                {...formItemLayout}
                                  label='投运时间'
                                >
                                    <div>
                                    {getFieldDecorator('useTime')(
                                        <DatePicker disabledDate={disabledDate} format='YYYY-MM-DD' placeholder="" style={{width:'100%'}} disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>

                            </Col>
                            {<Col span={24}>
                                <FormItem>
                                    <div className='modal-condition'>
                                        <span>监测因子</span><span>报警条件</span>
                                        <div className='device-factor-context'>
                                            <div className='factor-type'>
                                                <span><Checkbox onChange={this.onChangeSaveCheck.bind(this,'dianHaoChoice','checked')} checked={formData.dianHaoChoice} disabled={isView} />吨水电耗</span>
                                                <span>
                                                    <Select defaultValue={false} onChange={this.onChangeSaveSelect.bind(this,'electricContainSmallRange')} value={formData.electricContainSmallRange}  disabled={isView}>
                                                        <Option value={false}>小于</Option>
                                                        <Option value={true}>小于等于</Option>
                                                    </Select>
                                                </span>
                                                <span><Input onChange={this.onChangeSaveCheck.bind(this,'electricSmallRange','value')} className="condition-input" value={formData.electricSmallRange} disabled={isView}/></span>
                                                <span className="unit">kw.h/t</span>
                                                <span>
                                                    <Select defaultValue={false} onChange={this.onChangeSaveSelect.bind(this,'electricContainBigRange')} value={formData.electricContainBigRange} disabled={isView}>
                                                        <Option value={false}>大于</Option>
                                                        <Option value={true}>大于等于</Option>
                                                    </Select>   
                                                </span>
                                                <span><Input  onChange={this.onChangeSaveCheck.bind(this,'electricBigRange','value')} className="condition-input"value={formData.electricBigRange} disabled={isView}/></span>
                                                <span className="unit">kw.h/t</span>
                                            </div>
                                            <div className='factor-type'>
                                                <span><Checkbox onChange={this.onChangeSaveCheck.bind(this,'yaoHaoChoice','checked')} checked={formData.yaoHaoChoice} disabled={isView} />吨水药耗</span>
                                                <span>
                                                    <Select defaultValue={false} onChange={this.onChangeSaveSelect.bind(this,'mediceContainSmallRange')} value={formData.mediceContainSmallRange} disabled={isView}>
                                                        <Option value={false}>小于</Option>
                                                        <Option value={true}>小于等于</Option>
                                                    </Select>
                                                </span>
                                                <span><Input onChange={this.onChangeSaveCheck.bind(this,'mediceSmallRange','value')} className="condition-input" value={formData.mediceSmallRange} disabled={isView}/></span>
                                                <span className="unit">kw.h/t</span>
                                                <span>
                                                    <Select defaultValue={false} onChange={this.onChangeSaveSelect.bind(this,'mediceContainBigRange')} value={formData.mediceContainBigRange} disabled={isView}>
                                                        <Option value={false}>大于</Option>
                                                        <Option value={true}>大于等于</Option>
                                                    </Select>  
                                                </span>
                                                <span><Input  onChange={this.onChangeSaveCheck.bind(this,'mediceBigRange','value')} className="condition-input"value={formData.mediceBigRange} disabled={isView}/></span>
                                                <span className="unit">kw.h/t</span>
                                            </div>
                                        </div>
                                    </div>
                                </FormItem>
                            </Col>}
                        </Row>
                    </Form>
                </div>
            </Modal>
        )
    }
}
export default Form.create()(DeviceOperDialog);