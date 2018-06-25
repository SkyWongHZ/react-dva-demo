// 设备管理
import React, { Component } from 'react';
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, Upload, message, Icon, DatePicker, Input, Table, Select, Calendar, notification } from 'antd';
const { InputGroup } = Input.Group
const Option = Select.Option
import Filtrate from '../../../components/MyPublic/OfficialFiltrate';
import Container from '../../../components/MyPublic/OfficialContainer';
import MyModal from "../../../components/MyPublic/OfficialModal"
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request';
import config from '../../../config'
import moment from 'moment';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './DeviceManagement.less';
import DeviceOperDialog from './DeviceOperDialog'
const confirm = Modal.confirm;

export default
class DeviceManagement extends React.Component {
    // 初始状态
    state = {
        searchDeviceName:'',//搜索条件
        datalistContet:[],
        myModalVisibleDel: false,
        isView:false,//是否查看详情
        currentPage: 1,
        deviceInfo:{},
        typeNameList:[]
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
                request({ url: "/wl/overview/device/delete", method: 'POST', data: data }).then(res => {
                    t.deviceSelectAll('',t.state.currentPage);
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onModalDelCancel = () => {
        this.setState({
            myModalVisibleDel: false,
        })
    }

    //查询
    onSearch=(fromValue)=>{
        this.setState({searchDeviceName:fromValue.deviceName})
        this.deviceSelectAll(fromValue.deviceName)
    }

    // 分页页面跳转
    PaginationSearch = (params) => {
        this.setState({
            currentPage: params,
        })
        this.deviceSelectAll(this.state.searchDeviceName,params)
    }

    //tabel 选择事件
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    //表格数据查询
    deviceSelectAll = (searchDeviceName,page) => {
        if(!page){
            this.setState({
                currentPage:1
            })
        }

        let obj={
            pageIndex:page|| 1,
            pageSize:config.pageSize,
            deviceName:searchDeviceName?searchDeviceName:''
        }
        request({ url:'/wl/overview/device/selectAll', method: 'GET' ,params:obj}).then((res) => {        
            if(!res.rc){
                this.setState({
                    datalistContet:res.items,
                        total:res.rowCount
                })
            }
        })
    }

    //测点类型枚举值
    findMonitorType=()=>{
        request({ url:'/wl/overview/device/findMonitorType', method: 'GET'})
        .then((res) => {
            if(!res.rc){
                res.ret&&this.setState({
                    typeNameList:res.ret
                })
            }
        })
    }

    componentDidMount() {
        this.deviceSelectAll();
        this.findMonitorType()
    }

    getUseTime(time){
        return time?moment(time).format('YYYY/MM/DD'):''
    }

    onChangeSave = (item) => (e) => {
       this.setState({deviceInfo:{...this.state.deviceInfo, [item]:e.target.value}})
    }

    // 新增
    addBtn = () => {
        this.setState({
            myModalVisibleDel: true,
            deviceInfo:{},
            isView:false
        })
    }

    //编辑
    editButton = (record) => () => {
        this.setState({
            deviceInfo:record,
            isView:false,
            myModalVisibleDel:true
        })
    }

    //详情
    showDetail = (record) => () => {
        this.setState({
            isView:true,
            deviceInfo:record,
            myModalVisibleDel:true
        })
    }

    //新增或修改信息成功
    updateSuccess=(id)=>{
        this.setState({
            myModalVisibleDel:false
        })
        const current=id?this.state.currentPage:''
        this.deviceSelectAll('',current)
    }

    render() {
        const disabledDate =  (current) => {
            return current && current._d.getTime() > Date.now()
        }

        const { deviceInfo,selectedRowKeys,isView } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const filtrateItem = [{
            label: "设备名称",
            type: "input",
            paramName: "deviceName"
        }];

        const listcolumns = [
            {
                'title': '数采仪编号',
                'dataIndex': 'dataCollectorCode',
            },
            {
                'title': '数采仪名称',
                'dataIndex': 'dataCollectorName',
            },
            {
                'title': '数采仪MN号',
                'dataIndex': 'dataCollectorMn',
            },
            {
                'title': '设备编号',
                'dataIndex': 'deviceCode',
            },
            {
                'title': '设备名称',
                'dataIndex': 'name',
            },
            {
                'title': '设备型号',
                'dataIndex': 'type',
            },
            {
                'title': '生产厂家',
                'dataIndex': 'factory',
            },
            {
                'title': '测点类型',
                'dataIndex': 'monitorTypeName',
            },
            {
                'title': '投运时间',
                'dataIndex': 'useTime',render: (text, record, index) => {
                    return (
                        <span>{this.getUseTime(record.useTime)}</span>
                    )
                }
            },
            {
                'title': '维养周期',
                'dataIndex': 'cycle', 
            },
            {
                'title': '操作', 'dataIndex': 'operate', render: (text, record, index) => {
                    return (
                        <span className="oper-btns">
                            <i className="iconfont icon-xiugai2 edit-btn" onClick={this.editButton(record)}></i>
                            <i className="iconfont icon-chakan view-btn" onClick={this.showDetail(record)}></i>
                        </span>
                    )
                }
            },
        ];

        return (
            <div className='DeviceManagement'>
                <Crumbs routes={this.props.routes} className="crumbs-content" />  

                <Filtrate
                    items={filtrateItem}
                    searchBtnShow={true}
                    submit={this.onSearch}
                >
                </Filtrate>

                <Container
                    headerShow={true}
                    addBtnShow={true}
                    addBtn={this.addBtn}
                    deleteBtnShow={true}
                    deleteBtn={this.deleteBtn}
                >
                <div className="wp-table">
                    <Table
                        className="yk-page"
                        bordered
                        columns={listcolumns}
                        dataSource={this.state.datalistContet}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 1366 }}
                        size='small'
                        rowSelection={rowSelection}
                    >
                    </Table>
                </div>
                </Container>

                <div className="t-FAC t-MT10 wp-page  page-amazing">
                    {this.state.total > 0 &&
                        <Pagination
                            pageSize={config.pageSize}
                            size={10}
                            current={this.state.currentPage}
                            showSizeChangerw
                            showQuickJumper
                            total={this.state.total}
                            onChange={this.PaginationSearch}
                        />
                    }
                </div>
                {this.state.myModalVisibleDel &&
                    <DeviceOperDialog
                        myModalVisibleDel={this.state.myModalVisibleDel}
                        onModalDelCancel={this.onModalDelCancel}
                        typeNameList={this.state.typeNameList}
                        isView={this.state.isView}
                        data={this.state.deviceInfo}
                        onSuccess={this.updateSuccess}
                    />
                }
            </div>
        )
    }
}
