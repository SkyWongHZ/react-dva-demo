import React, { Component } from 'react';
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, Upload, message, Icon, DatePicker, Input, Form, Tree, AutoComplete, notification } from 'antd';
import Filtrate from '../../../components/MyPublic/InspectionFiltrate';
import util from '../../../utils/Util';
import MyTable from '../../../components/PublicComponents/MyTable';
import Container from '../../../components/MyPublic/OfficialContainer';
import MyIcon from '../../../components/PublicComponents/MyIcon';
import MyModal from "../../../components/MyPublic/InspectionModal"
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request';
import config from '../../../config';
import PublicService from '../../../services/PublicService';
import moment from 'moment';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './FactorManagement.less'
const confirm = Modal.confirm;


class Inspection extends React.Component {
    state = {
        factorName: '',
        factorTypeId:'',
        monitorTypeId:'',
        title: '新增',
        current: 1,
        dataSource: [],
        myModalVisible: false,
        editData: {},
        isEdit: false,
        modalDisabled: false,
        type: 'add',
        items: [
            {
                type: 'select',
                label: '监测类型:',
                placeholder: '请输入',
                paramName: "monitorTypeId",
                options:[
                    {text:'全部',value:''},
                ],
            },
            {
                type: 'select',
                label: '因子类型:',
                placeholder: '请输入',
                paramName: "factorTypeId",
                options:[
                    { text: '全部', value: '' },
                ],
            },
            {
                type: 'input',
                label: '监测因子:',
                placeholder: '请输入',
                paramName: "factorName",
            },
        ],
        columns: [
            {
                'title': '因子编码',
                'dataIndex': 'factorCode',
            },
            {
                'title': '监测因子',
                'dataIndex': 'monitorTypeName',
            },
            {
                'title': '因子类型',
                'dataIndex': 'factorTypeName',
            },
            {
                'title': '单位',
                'dataIndex': 'unit',
            },
            {
                'title': '操作', 'dataIndex': 'operate', render: (text, record, index) => {
                    return (
                        <span>
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#3996FF', cursor: 'pointer' }} type="icon-xiugai2" onClick={this.editClick.bind(this, record, )} />
                            {/* <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#29BEC3', cursor: 'pointer' }} type="icon-chakan1" onClick={this.checkClick.bind(this, record)} /> */}
                        </span>
                    )
                }
            },
        ],
        //定义myModal数据
        myModalItems: [{
            sub: [
                {
                    type: 'input',
                    label: '因子编码',
                    paramName: 'factorCode',
                    size: null,
                    required: true,
                },
                {
                    type: 'input',
                    label: '监测因子',
                    paramName: 'factorName',
                    size: null,
                    required: true,
                },
                {
                    type: 'input',
                    label: '因子类型',
                    paramName: 'factorTypeName',
                    size: null,
                    required: true,
                },
                {
                    type: 'input',
                    label: '单位',
                    paramName: 'unit',
                    size: null,
                    required: true,
                },
                {
                    type: 'select',
                    label: '是否呈现过程线',
                    paramName: 'outLine',
                    size: null,
                    options:[
                        { text: '是', value: 1 },
                        { text: '否', value: 0 },
                    ],
                    required: true,
                },
                {
                    type: 'select',
                    label: '是否呈现在驾驶舱',
                    paramName: 'showCang',
                    size: null,
                    options: [
                        { text: '是', value: 1 },
                        { text: '否', value: 0 },
                    ],
                    required: true,
                },
            ]
        }]

    }

    // 初始化时间月初
    changeDate = (date) => {
        const currentDate = moment(date);
        currentDate.set({ 'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0 });
        return currentDate;
    }
    // 初始化时间 天
    changeDaytime = (date) => {
        const currentDate = moment(date);
        currentDate.set({ 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0 });
        return currentDate;
    }
    // 查询
    searchIncomeData = (params) => {
        this.drawlisting(params.factorName, params.factorTypeId, params.monitorTypeId,1)
        this.setState({
            current: 1,
            factorName: factorName,
            factorTypeId: factorTypeId,
            monitorTypeId:monitorTypeId,
        })
    }
    // 新增
    addBtn = () => {
        this.setState({
            myModalVisible: true,
            isEdit: false,
            modalDisabled: false,
            type: 'add',
            title: '新增',
        })
    }
    //导出
    exportBtn = () => {
        console.log(`${config.publicUrl}/inspectionDay/exportList?startTime=${this.state.startTime}&&endTime=${this.state.endTime}`)
        window.location.href = `${config.publicUrl}/inspectionDay/exportList?startTime=${this.state.startTime}&&endTime=${this.state.endTime} `
    }
    // 编辑
    editClick = (record) => {
        console.log('record', record)
        let clone = Object.assign({}, record);
        clone.reportTime = moment(clone.reportTime)
        this.setState({
            editData: clone,
            myModalVisible: true,
            isEdit: true,
            modalDisabled: false,
            type: 'edit',
            inspectId: record.id,
            title: '编辑',
        })
    }
    // 详情
    checkClick = (record) => {
        // let clone = Object.assign({}, record);
        // clone.reportTime = moment(clone.reportTime)
        // this.setState({
        //     editData: clone,
        //     myModalVisible: true,
        //     isEdit: true,
        //     modalDisabled: true,
        //     title: '查看详情',
        // })
        alert('详情')
    }
    // 保存
    onModalSaveBtn = (params) => {
        // console.log('params', params)
        // debugger
        let t = this;
        let data = {
            factorCode: params.factorCode,
            factorName: params.factorName,
            factorTypeName: params.factorTypeName,
            unit: params.unit,
            outLine: Number(params.outLine),
            showCang: Number(params.showCang),
        }
     
        if (t.state.type === 'add') {
            request({ url: '/wl/monitor/factor/saveOrUpdate', method: 'post', data }).then((res) => {
                // console.log('新增请求', res)
                t.drawlisting(t.state.factorName, t.state.factorTypeId, t.state.monitorTypeId,t.state.current)
            })

        } else {
            request({ url: '/wl/monitor/factor/saveOrUpdate', method: 'post', data: { ...data, id: this.state.inspectId } }).then((res) => {
                // console.log('编辑请求', res)
                t.drawlisting(t.state.factorName, t.state.factorTypeId, t.state.monitorTypeId, t.state.current)
            })
        }
        this.setState({
            myModalVisible: false,
        })
    }
      
    
    // 取消
    onModalCancel = () => {
        this.setState({
            myModalVisible: false,
        })
    }
    componentDidMount() {
        let t=this;
        this.drawlisting ('', '', '', 1)

        // 监测类型
        request({ url: '/wl/monitor/factor/monitorTypeName', method: 'GET' })
            .then((res) => {
                let items = t.state.items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].paramName === 'monitorTypeId') {
                        items[i].options.slice(0,1);
                        for (let j = 0; j < res.ret.length; j++) {
                            items[i].options.push({
                                text: res.ret[j].typeName, value: res.ret[j].id
                            })
                        }
                    }
                }
                t.setState({
                    items: t.state.items,
                })
            })

        // 因子类型
        request({ url: '/wl/monitor/factor/factorName', method: 'GET' })
            .then((res) => {
                let items = t.state.items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].paramName === 'factorTypeId') {
                        items[i].options.slice(0, 1);
                        for (let j = 0; j < res.ret.length; j++) {
                            items[i].options.push({
                                text: res.ret[j].type, value: res.ret[j].id
                            })
                        }
                    }
                }
                t.setState({
                    items: t.state.items,
                })
            })
    }
    // 列表表格渲染
    drawlisting = (factorName, factorTypeId, monitorTypeId,pageIndex) => {
        let obj = {
            factorName: factorName,
            factorTypeId: factorTypeId,
            monitorTypeId: monitorTypeId,
            pageIndex: pageIndex,
            pageSize: config.pageSize,
        }
        request({ url: '/wl/monitor/factor/selectAll', method: 'get', params: obj }).then((res) => {
            this.setState({
                dataSource: res.items,
                total: res.rowCount
            })
        })
    }
    // 分页
    PaginationSearch = (params) => {
        this.drawlisting(this.state.factorName, this.state.factorTypeId, this.state.monitorTypeId,params)
        this.setState({
            current: params
        })
    }
    // datepicker日期禁用
    dateDisabledDate = (current) => {
        return current && current.valueOf() > Date.now();
    }
    // datepicker日期回调事件
    dateOnChange = (dates, dateStrings, setFieldsValue) => {
        let startTime = this.changeDaytime(dates).format('x')
        let endTime = this.changeDaytime(dates).add(1, 'd').format('x')
        let obj = {
            startTime: startTime,
            endTime: endTime,
            pageIndex: 1,
            pageSize: config.pageSize,
        }
        request({ url: '/inspectionDay/getInspectionList', method: 'get', params: obj }).then((res) => {
            console.log('日期查询', res)
            if (res.ret.rowCount !== 0) {
                notification.error({
                    message: '该日期已被上报,请选择其他日期',
                    duration: 3
                })
                setFieldsValue({ reportTime: '' })
            }
        })
    }
    //tabel 选择事件
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
     //删除按钮
    deleteBtn = () => {
        let t = this;
        if (!t.state.selectedRowKeys.length) return false;
        confirm({
            title: '提示',
            content: '是否删除当前选项',
            className: "yk-flowChartCancel-confirm",
            onOk() {
                let data = t.state.selectedRowKeys;
                request({ url: "/wl/monitor/factor/delete", method: 'POST', data: data }).then(res => {
                    t.drawlisting(t.state.factorName, t.state.factorTypeId, t.state.monitorTypeId,t.state.current)
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <Crumbs routes={this.props.routes} className="crumbs-content" />
                <Filtrate
                    items={this.state.items}
                    searchBtnShow={true}
                    submit={this.searchIncomeData}
                >
                </Filtrate>
                <Container
                    headerShow={true}
                    addBtnShow={true}
                    addBtn={this.addBtn}
                    deleteBtnShow={true}
                    deleteBtn={this.deleteBtn}
                >
                    <MyTable
                        className="yk-page"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 1366 }}
                        rowSelection={rowSelection}
                    >
                    </MyTable>
                </Container>
                {
                    this.state.total > 0 &&
                    <div className="t-FAC t-MT10 wp-page page-amazing">
                        <Pagination
                            size={10}
                            current={this.state.current}
                            showSizeChangerw
                            showQuickJumper
                            total={this.state.total}
                            onChange={this.PaginationSearch}
                        />
                    </div>
                }


                {
                    this.state.myModalVisible &&
                    <MyModal
                        className="yk-custom-modal"
                        title={this.state.title}
                        modalItems={this.state.myModalItems}
                        visible={this.state.myModalVisible}
                        onModalCancel={this.onModalCancel}
                        modalSaveBtn={this.onModalSaveBtn}
                        formItemLayout={{ labelCol: { span: 0 }, wrapperCol: { span: 24 } }}
                        inputSize={12}
                        defaultData={this.state.isEdit ? this.state.editData : null}
                        modalDisabled={{ disabled: this.state.modalDisabled }}
                        width={520}
                        footerShow={this.state.modalDisabled ? null : true}
                        dateDisabledDate={this.dateDisabledDate}
                        dateOnChange={this.dateOnChange}
                    >
                    </MyModal>
                }
            </div>
        )
    }
}
export default Inspection;




