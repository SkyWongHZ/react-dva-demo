import React, { Component } from 'react';
import { Button, Modal, Input, Table, Tree, Form ,notification,DatePicker,Checkbox,Row,Col,Upload,Select,InputNumber } from 'antd';
const { InputGroup } = Input.Group
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const Option = Select.Option
import request from '../../../utils/request';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import moment from 'moment';
import './InstrumentOperDialog.less';
const confirm = Modal.confirm;

class InstrumentOperDialog extends React.Component {
    // 初始状态
    state = {
        formData:[],//表单数据
        selectfactorType:[],//因子类型枚举值
        deviceCodeLit:[] //设备编号枚举值
	}

    componentDidMount () {
        // 在componentWillMount里使用form.setFieldsValue无法设置表单的值
        // 所以在componentDidMount里进行赋值
        // see: https://github.com/ant-design/ant-design/issues/4802
        this.selectfactorType()

        const {data, form} = this.props;
        if (data.id) {
            let formData=data
            formData.factorTypeId=String(formData.factorTypeId)
            formData.deviceId=String(formData.deviceId)
            formData.constructionTime=formData.constructionTime?moment(formData.constructionTime):null
            this.setState({
                formData
            })
            form.setFieldsValue(data);
        }

        this.selectdeviceCode()
    }

    //设备编号枚举值
    selectdeviceCode=()=>{
        request({ url: "/wl/overview/instrument/selectdeviceCode", method: 'get' })
        .then(res => {
            if(!res.rc){
                res.ret&&this.setState({
                    deviceCodeLit:res.ret
                })
            }
        })
    }

    getText=(id)=>{
        let findItem=this.props.selectfactorType.find((item,index)=>{
            return item.id==id
        })
        return findItem?findItem.type:''
    }

    onChangeCheck = (index,item,event)=> {
        let instrumentFactorDTOs=this.state.formData.instrumentFactorDTOs
        instrumentFactorDTOs[index][item]=event.target.checked
        this.setState(preState => ({
            formData: {...preState.formData, instrumentFactorDTOs: instrumentFactorDTOs}
        }))
    }

    onChangeSaveCheck = (index,item,event) => {
        let instrumentFactorDTOs=this.state.formData.instrumentFactorDTOs
        instrumentFactorDTOs[index][item]=event.target.value
        this.setState(preState => ({
            formData: {...preState.formData, instrumentFactorDTOs: instrumentFactorDTOs}
        }))
    }

    onChangeSaveSelect = (index,item,event) => {
        let instrumentFactorDTOs=this.state.formData.instrumentFactorDTOs
        instrumentFactorDTOs[index][item]=event
        this.setState(preState => ({
            formData: {...preState.formData, instrumentFactorDTOs: instrumentFactorDTOs}
        }))
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
        let data={
            instrumentDTO1:fieldsValue,
            instrumentFactorDTOs:this.state.formData.instrumentFactorDTOs
        }
        if(data.instrumentDTO1.constructionTime) data.instrumentDTO1.constructionTime=data.instrumentDTO1.constructionTime.valueOf()
        
        if(this.state.formData.id){
            data.instrumentDTO1.id=this.state.formData.id
            if(JSON.stringify(this.props.data.instrumentFactorDTOs)!=JSON.stringify(this.state.formData.instrumentFactorDTOs)){
                this.props.data.instrumentFactorDTOs.map((item,index)=>{
                    data.instrumentFactorDTOs.push({
                        instrumentFactorId:item.instrumentFactorId,
                        deleted:true
                    })
                })
            }
        }

        request({ url: "/wl/overview/instrument/saveOrUpdate", method: 'POST', data: JSON.stringify(data) })
        .then(res => {
            if(!res.rc){
                let title=data.instrumentDTO1.id?'修改':'新增'
                notification.success({
                    message: '提示',
                    description: title+'成功',
                })

                this.props.onSuccess(data.instrumentDTO1.id)
            }
        })
    }

    findMonitorFactor = (value) => {
        request({url:'/wl/overview/instrument/findMonitorFactor',method:'GET',params:{typeId:value}})
        .then(res=>{
            if(!res.rc){
                let instrumentFactorDTOs=res.ret
                instrumentFactorDTOs.map((item,index)=>{
                    item.smallRange=''
                    item.bigRange=''
                })
                this.setState(preState => ({
                    formData: {...preState.formData, instrumentFactorDTOs: instrumentFactorDTOs}
                }))
            }
        })
    }

    //因子类型枚举值
    selectfactorType=()=>{
        request({url:'/wl/overview/instrument/selectfactorType',method:'GET'})
        .then(res=>{
            if(!res.rc){
                this.setState({
                    selectfactorType:res.ret
                })

                if(!this.props.data.id&&res.ret){
                    this.props.form.setFieldsValue({
                        factorTypeId: String(res.ret[0].id)
                    })
                    this.findMonitorFactor(res.ret[0].id)
                }
            }
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        const {formData,selectfactorType,deviceCodeLit}=this.state

        const {selectRoleModalList,isView,data}=this.props
        const selectfactorTypeOptions = selectfactorType.map(item => <Option key={item.id}>{item.type}</Option>);
        const deviceCodeLitOptions = deviceCodeLit.map(item => <Option key={item.id}>{item.deviceCode}</Option>);
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
                                      label='设备编号'
                                    >
                                        <div>
                                        {getFieldDecorator('deviceId', {
                                            rules: [{ required: true, message: '请选择设备编号！'}],
                                        })(
                                            <Select
                                              placeholder="请选择"
                                              style={{ width: '100%' }}
                                              disabled={isView}
                                            >
                                              {deviceCodeLitOptions}
                                            </Select>
                                        )}
                                        </div>
                                </FormItem>
                                
                                <FormItem
                                {...formItemLayout}
                                  label='反控编号'
                                >
                                        <div>
                                        {getFieldDecorator('reverseControllerCode', {
                                            rules: [{ 
                                                required: true, message: '请填写反控编号！'
                                            },{ 
                                                pattern: /^[^\u4E00-\u9FA5]{0,25}$/, message: '请填写25个字符以内的字母/数字/符号！' 
                                            }],
                                            validateTrigger:'onBlur'
                                        })(
                                            <Input style={{width:'100%'}} disabled={isView}/>
                                        )}
                                        </div>
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                  label='仪器型号'
                                >
                                    <div>
                                    {getFieldDecorator('type', {
                                        rules: [{ 
                                            required: true, message: '请填写仪器型号！'
                                        },{ 
                                            max: 25, message: '请填写25个字符以内的仪器型号！' 
                                        }],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input disabled={isView}/>
                                    )}
                                    </div>
                                </FormItem>
                                <FormItem
                                {...formItemLayout}
                                  label='安装时间'
                                >
                                        <div>
                                        {getFieldDecorator('constructionTime')(
                                            <DatePicker disabledDate={disabledDate} format='YYYY-MM-DD' placeholder="" style={{width:'100%'}} disabled={isView}/>
                                        )}
                                        </div>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                      label='因子类型'
                                    >
                                        {getFieldDecorator('factorTypeId', {
                                            rules: [{ required: true, message: '请选择因子类型！'}],
                                        })(
                                            <Select
                                              placeholder="请选择"
                                              onChange={this.findMonitorFactor}
                                              style={{ width: '100%' }}
                                              disabled={isView}
                                            >
                                              {selectfactorTypeOptions}
                                            </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                      label='仪器编号'
                                    >
                                        <div>
                                        {getFieldDecorator('code', {
                                            rules: [{ 
                                                required: true, message: '请填写仪器编号！'
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
                                      label='仪器名称'
                                    >
                                        <div>
                                        {getFieldDecorator('instrumentName', {
                                            rules: [{ 
                                                required: true, message: '请填写仪器名称！'
                                            },{ 
                                                max: 30, message: '请填写30个字符以内的仪器名称！' 
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
                            {<Col span={24}>
                                <FormItem>
                                    <div className='modal-condition'>
                                        <span>监测因子</span><span>报警条件</span>
                                        <div className='factor-context'>
                                        { formData.instrumentFactorDTOs&&
                                            formData.instrumentFactorDTOs.map((item,i)=> {
                                                return(
                                                    <div key={item.id} className='factor-type'>
                                                        <span><Checkbox onChange={this.onChangeCheck.bind(this,i,'choice')} checked={item.choice} disabled={isView} />{item.factorName}</span>
                                                        <span>
                                                            <Select defaultValue={false} onChange={this.onChangeSaveSelect.bind(this,i,'containSmallRange')} value={item.containSmallRange} disabled={isView}>
                                                                <Option value={false} key="1">小于</Option>
                                                                <Option value={true} key="2">小于等于</Option>
                                                            </Select>
                                                        </span>
                                                        <span><Input onChange={this.onChangeSaveCheck.bind(this,i,'smallRange')} className="condition-input" value={item.smallRange} disabled={isView}/></span>
                                                        <span className="unit">{item.unit}</span>
                                                        <span>
                                                            <Select defaultValue={false} onChange={this.onChangeSaveSelect.bind(this,i,'containBigRange')} value={item.containBigRange} disabled={isView}>
                                                                <Option value={false} key="1">大于</Option>
                                                                <Option value={true} key="2">大于等于</Option>
                                                            </Select>
                                                        </span>
                                                        <span><Input  onChange={this.onChangeSaveCheck.bind(this,i,'bigRange')} className="condition-input"value={item.bigRange} disabled={isView}/></span>
                                                        <span className="unit">{item.unit}</span>
                                                    </div>
                                                    )
                                            })
                                        }
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
export default Form.create()(InstrumentOperDialog);