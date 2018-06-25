/***
 * modal 组件 定义了样式
 */
import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, Button, Select, DatePicker, Row, Col, Checkbox, notification, Tabs,Popconfirm } from 'antd';
import moment from 'moment';
import MyTable from '../PublicComponents/MyTable';
import config from '../../config';
import Util from '../../utils/Util';
import './OfficialPublicCommon.less';
import MapLocation from '../common/MapLocation';
import CustomTable from './CustomTable';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const Option = Select.Option;
let defaultLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
let defaultInputSize = 8;

class MyModal extends Component {
    state = {
        modalKey: 1,
        alarmDTOList: this.props.minidata,
        modalColumns: [
            {
                title: '监测因子',
                dataIndex: 'monitorFactorName',
                width: 100,
                render: (text, record, index) => {
                    const dtos = this.props.defaultData && this.props.defaultData.monitorFactorDTOS || false;
                    const row = dtos && dtos.filter((dto) => {
                        return dto.id === record.id
                    })[0];
                    const checked = this.props.defaultData && row && row.alarmId !== null || false
                    return (
                        <Checkbox onChange={(e) => this.checkClick(e.target.checked, index, record.id)} defaultChecked={checked}  {...this.props.modalDisabled}>{text}</Checkbox>
                    )
                }
            },
            {
                title: '报警条件',
                dataIndex: 'age',
                render: (text, record, index) => {
                    const { bigParam, bigParamRange, smallParam, smallParamRange } = record;
                    record.bigParamRange = false;
                    record.smallParamRange = false;
                    const dtos = this.props.defaultData && this.props.defaultData.monitorFactorDTOS || false;
                    const row = dtos && dtos.filter((dto) => {
                        return dto.id === record.id
                    })[0];
                    const bigChecked = this.props.defaultData && row && row.bigParam || ''
                    const smallChecked = this.props.defaultData && row && row.smallParam || ''
                    const bigSelectChecked = this.props.defaultData && row && (row.bigParamRange ? '1' : '0') || '0'
                    const smallSelectChecked = this.props.defaultData && row && (row.smallParamRange ? '1' : '0') || '0'
                    // console.log('this.props.defaultData ', this.props.defaultData )                  
                    return (
                        <div>
                            <Select defaultValue={bigSelectChecked} onChange={(value) => this.modalTableMoreThanChange(value, index)} style={{ width: 100 }}  {...this.props.modalDisabled}>
                                <Option value="0">大于</Option>
                                <Option value="1">大于等于</Option>
                            </Select>
                            <Input className="custon-input" defaultValue={bigChecked} onChange={(e) => this.moreThanValueChange(e.target.value, index)}  {...this.props.modalDisabled} />{record.factorUnitCode}
                            <Select defaultValue={smallSelectChecked} onChange={(value) => this.modalTableLessThanChange(value, index)} style={{ width: 100 }}  {...this.props.modalDisabled}>
                                <Option value="0">小于</Option>
                                <Option value="1">小于等于</Option>
                            </Select>
                            <Input className="custon-input" defaultValue={smallChecked} onChange={(e) => this.lessThanValueChange(e.target.value, index)}  {...this.props.modalDisabled} />{record.factorUnitCode}
                        </div>
                    )
                }
            }
        ],
        modalDataSource: [],       
    }
    componentWillMount() {
        console.log('this.props.minidata', this.props.minidata)
        this.setState({
            alarmDTOList: this.props.minidata
        })
    }
    modalTableChange = (value, index, key, format) => {
        console.log(this.state)
        const list = this.state.alarmDTOList.map((item) => ({ ...item }));
        list[index][key] = format !== undefined ? format(value) : value;
        this.setState({
            alarmDTOList: list
        })
    }
    modalTableLessThanChange = (value, index) => {
        this.modalTableChange(value, index, 'smallParamRange', (value) => Boolean(value));
    }
    modalTableMoreThanChange = (value, index) => {
        this.modalTableChange(value, index, 'bigParamRange', (value) => Boolean(value));
    }
    moreThanValueChange = (value, index) => {
        this.modalTableChange(value, index, 'bigParam');
    }
    checkClick = (value, index, id) => {
        console.log('萌萌', value)
        this.modalTableChange(value, index, 'monitorFactorId', (value) => (value && id || undefined));
    }
    lessThanValueChange = (value, index) => {
        this.modalTableChange(value, index, 'smallParam');
    }
    // 保存按钮
    onModalSave() {
        let t = this;
        let { modalSaveBtn } = t.props;
        console.log('t.props', t.props)
        t.props.form.validateFields((err, params) => {
            if (!err) {
                console.log(this.state.alarmDTOList)
                if (this.state.alarmDTOList) {
                    params.alarmDTOList = this.state.alarmDTOList.filter(({ monitorFactorId }) => typeof monitorFactorId !== 'undefined')
                }
                console.log(params)
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
                    <Button className="wp-btn  ZERO" onClick={t.onModalSave.bind(t)}>保存</Button>
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
    //模态框表格checkbox
    checkboxOnChange = (e) => {
        console.log('this.props.form', this.props.form.getFieldsValue())
        console.log(`checked = ${e.target.checked}`);
        alert('模态框表格')
    }
   
    componentDidMount() {
        if (this.props.defaultData) {
            let { defaultData } = this.props;
            this.props.modalItems.map((data, index) => {
                data.sub && data.sub.map((data2, index2) => {
                    // if(data2.label === "取水用途") debugger                  
                    try {
                        let obj = null;
                        if (data2.type != "rangePicker" && data2.type != "select") {
                            obj = { [data2.paramName]: defaultData[data2.paramName] };
                        } else if (data2.type === "rangePicker") {
                            let arr = [moment(defaultData[data2.paramName][0]), moment(defaultData[data2.paramName][1])]
                            obj = { [data2.paramName]: arr };
                        } else if (data2.type === "select") {
                            console.log(String(defaultData[data2.paramName]))
                            let arr = [moment(defaultData[data2.paramName][0]), moment(defaultData[data2.paramName][1])]
                            obj = { [data2.paramName]: String(defaultData[data2.paramName]) };
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
                    <Form className="wp-myModal-form" layout="inline">
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
                                            <Row gutter={16}>
                                                {
                                                    item.sub.map((item2, index2) => {
                                                        // console.log(item2.endLabel)
                                                        if (item2.type === 'input') {
                                                            return (
                                                                <Col span={inputSize} key={index2}>
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
                                                                                <Input key={index2} disabled={item2.disabled || false} {...this.props.modalDisabled} />
                                                                                )
                                                                        }
                                                                        {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                                                    </FormItem>
                                                                </Col>
                                                            )
                                                        }
                                                        else if (item2.type === 'inputNumber') {
                                                            return (
                                                                <Col span={inputSize} key={index2}>
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
                                                                                <InputNumber key={index2} disabled={item2.disabled || false} {...this.props.modalDisabled} />
                                                                                )
                                                                        }
                                                                        {item2.endLabel && <span className="endLabel">{item2.endLabel}</span>}
                                                                    </FormItem>
                                                                </Col>
                                                            );
                                                        }
                                                        else if (item2.type === 'select') {
                                                            return (
                                                                <Col span={inputSize} key={index2}>
                                                                    <FormItem {...layout} label={item2.label}
                                                                        key={index2}>
                                                                        {
                                                                            getFieldDecorator(item2.paramName, {
                                                                                initialValue: item2.options[0] && String(item2.options[0].value),
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
                                                                                                <Select.Option
                                                                                                    key={index2}
                                                                                                    value={String(option.value)}
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
                                                                                initialValue: moment(),
                                                                                rules: [{
                                                                                    required: item2.required || false,
                                                                                }],
                                                                            })
                                                                                (
                                                                                <DatePicker
                                                                                    size="large"  {...this.props.modalDisabled}
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
                                                                        // rules: [{
                                                                        //     required: true,
                                                                        // }],
                                                                        // initialValue: ''
                                                                    })(
                                                                        <RangePicker size="large" className="sky-range-picker">
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
                                                                        // rules: [{
                                                                        //     required: true,
                                                                        // }],
                                                                    })
                                                                        (
                                                                        <div className="gaode-map">
                                                                            <MapLocation center={t.state.center} getPosition={(position) => {
                                                                                t.setState({ center: position })
                                                                            }} />
                                                                        </div>
                                                                        )
                                                                }
                                                            </FormItem>)
                                                        }
                                                    })
                                                }
                                            </Row>
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
                                        <div key={index} className="t-MB10 custom-table">
                                            <div className="wp-tab t-MB10">
                                                <div className="wp-tab-header">
                                                    <span>{item.title}</span>
                                                </div>
                                                <div>
                                                    测点类型:
                                                    {/* <Select style={{ width: 240 }} onChange={(value) => this.props.modalSelectChange(value, (list) => this.setState({ alarmDTOList: list }))}
                                                        defaultValue={this.props.isEdit ? String(this.props.marriedFlag) : this.props.pointArr[0] && this.props.pointArr[0].value}
                                                        {...this.props.modalDisabled}>
                                                        {
                                                            this.props.pointArr.map((item2, index2) => {
                                                                return (
                                                                    <Option key={item2.value} value={item2.value}>{item2.text}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select> */}                                                   
                                                    <Popconfirm 
                                                        title={
                                                            <div>
                                                                <Select defaultValue={this.props.mockMonitoringFactors[0] && this.props.mockMonitoringFactors[0].name} 
                                                                style={{ width: 120 }}
                                                                onChange={this.props.MakeFunOnChange}
                                                                >
                                                                    {
                                                                        this.props.mockMonitoringFactors.map((item)=>{
                                                                            return(
                                                                                <Option value={item.code}>{item.name}</Option>
                                                                            )
                                                                        })
                                                                    }                                                                   
                                                                </Select>                                                            
                                                            </div>
                                                        }
                                                        onConfirm={this.props.tabsConfirm} 
                                                        onCancel={this.props.tabsCancel} 
                                                        okText="确认"
                                                        cancelText="取消"
                                                        visible={this.props.showVisible}
                                                    >                                                       
                                                        <div style={{ marginBottom: 16 }}>
                                                            <Button onClick={this.props.showAddIcon}>+</Button>
                                                            {/* <Button onClick={this.props.tabsAdd}>+</Button> */}
                                                        </div>
                                                    </Popconfirm>
                                                    <Tabs   
                                                        onChange={this.props.onTabsChange}
                                                        activeKey={this.props.activeKey}
                                                        type="editable-card"
                                                        onEdit={this.props.onTabsEdit}
                                                        hideAdd={true}
                                                        onTabClick={this.props.onTabClick}                                                      
                                                    >
                                                        {                                                           
                                                            this.props.panes.map(pane => {
                                                                console.log('pane', pane)
                                                                return (
                                                                    <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>
                                                                )
                                                            })
                                                        }
                                                       
                                                        
                                                    </Tabs>
                                                </div>
                                                {/* <MyTable
                                                    className="sky-modal-table"
                                                    bordered
                                                    columns={this.state.modalColumns}
                                                    dataSource={this.props.minidata}
                                                    pagination={false}
                                                    rowKey={'id'}
                                                    size={'small'}
                                                >
                                                </MyTable> */}
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        }
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(MyModal);
