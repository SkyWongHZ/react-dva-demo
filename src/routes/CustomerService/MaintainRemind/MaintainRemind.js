import React, { Component } from 'react';
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, Upload, message, Icon, DatePicker, Input, Form } from 'antd';
import Filtrate from '../../../components/MyPublic/OfficialFiltrate';
import util from '../../../utils/Util';
import MyTable from '../../../components/PublicComponents/MyTable';
import Container from '../../../components/MyPublic/OfficialContainer';
import MyIcon from '../../../components/PublicComponents/MyIcon';
import MonitoringSiteModal from "../../../components/MyPublic/MonitoringSiteModal";
import "../../../components/MyPublic/OfficialPublicCommon.less";
import request from '../../../utils/request';
import config from '../../../config';
import moment from 'moment';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './MaintainRemind.less';
const confirm = Modal.confirm;
// 监测点管理
class MaintainRemind extends React.Component {
    // 初始状态
    state = {
         maxMap: true,    
        myModalVisible: false,
        showPicture: false,
        isEdit:true,
        deviceName:'',
        endTime:'',
        startTime:'',
        current: 1,
        pageSize: 10,
        items :[
            {
            type: 'select',
            label: '项目名称:',
            placeholder: '请输入',
            paramName: "deviceName",
            options: [],
            }, 
            {//计划维养时间
            type: 'rangePicker',
            label: '时间:',
            placeholder: '请输入',
            paramName: "alarmType",
            options:[],
            }, 
            
        ],
    }

// 分页页面跳转
PaginationSearch = (params) => {
    let t=this;
    console.log('分页', params) 
    t.drawListing(t.state.deviceName, t.state.startTime,t.state.endTime,params)
    this.setState({
        current: params,
    })
}
// 初始化时间 天
changeDaytime = (date) => {
    const currentDate = moment(date);
    currentDate.set({ 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0 });
    return currentDate;
}
changeEndDaytime = (date) => {
    const currentDate = moment(date);
    currentDate.set({ 'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 59 });
    return currentDate;
}
// 模糊搜索查询功能
searchIncomeData = (params) => {
    let startTime = this.changeDaytime(moment(params.year[0])).format('x')
    let endTime = this.changeEndDaytime(moment(params.year[1])).format('x')
    this.drawListing(params.deviceName, startTime, endTime, 1)
    this.setState({
        deviceName: params.deviceName,
        startTime: params.year ? startTime : '',
        endTime: params.year ? endTime : '',
        current: 1,
    })
}
////表格列表渲染事件
drawListing = (siteName,endTime,startTime,params) => {
    console.log(params,777);
    let Obj = {
        siteId: siteName,
        endTime: endTime,
        startTime:startTime,
        pageNo: params,        
        pageSize: config.pageSize,
    }
    request({ url:'/wl/maintain/plan/getPlan', method: 'GET', params: Obj })
                .then((res) => {
                   console.log("REs",res.ret.items)
                   // if (res.rc !== 0) {
                        this.setState({
                            data: res.ret.items,
                            total:res.ret.rowCount,
                        })
                        //return false;
                   // }
                }).catch(err => {
                    console.log('断网喽,请检查网络连接')
                });
                this.setState(Obj)   
}
// 操作--
editClick = (record) => {
    let t=this;        
    this.setState({
        editData:record,
        myModalVisible: true,
        type: '编辑',
        showPicture: false,
        isEdit:true,
        recordId:record.id,
        title:'编辑信息'
    })

     
}
//componentdidmount
    componentDidMount() {
        let t = this;
        const listcolumns = [
            {
                'title': '序号',
                'dataIndex': 'num',
                render: (data, text, index) => {return index+1}                
            },
            {
                'title': '项目名称',
                'dataIndex': 'siteName',
            },
            {
                'title': '设备编号',
                'dataIndex': 'deviceNo',
            },
            {
                'title': '仪器名称',
                'dataIndex': 'instrumentName',
            },
            {
                'title': '维养周期/天',
                'dataIndex': 'cycle',
            },
            {
                'title': '计划维养时间',
                'dataIndex': 'plantTimeString',
            },
            {
                'title': '操作', 'dataIndex': 'operate',
                 render: (text, record, index) => {
                    return (
                        <span>
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#3996FF' }} type="icon-chakan" 
                            onClick={this.editClick.bind(this, record, '编辑')}
                             />|
                             <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#3996FF' }} type="icon-xiugai2" 
                            onClick={this.editClick.bind(this, record, '编辑')}
                             />
                        </span>
                    )
                }
            },
        ]; 
		
    //获得项目名称下拉列表
    	request({ url: '/wl/alarm/getAllSite', method: 'GET', })
                 .then((res) => {
                    console.log("res",res);
                    t.state.items[0].options = [{ text: '全部', value: '' }];
                    for (let i = 0; i < res.ret.length; i++) {
                        t.state.items[0].options.push({
                            text: res.ret[i].name, value: res.ret[i].id
                        });
                    }
                    t.setState({
                        items: this.state.items,
                    })
                    })
   
    
   //componentdidmount 初始化
    this.drawListing(t.state.deviceName, t.state.startTime,t.state.endTime,1);           
    this.setState({
        current:1,
        dataList:listcolumns
    })
 }
    render() {
        console.log(this.state.pageSize,this.state.current,666);
        let t = this;  
        return (
            <div>
                <Crumbs routes={this.props.routes} className="crumbs-content" />
                <Filtrate
                    items={this.state.items}
                    // searchBtnShow={true}
                    // submit={this.searchIncomeData}
                >
                </Filtrate>
                <Container
                    headerShow={true}
                    // addBtnShow={true}
                    // addBtn={this.addBtn}
                    // deleteBtnShow={true}
                    // deleteBtn={this.deleteBtn}
                >
                    <MyTable
                        className="yk-page"
                        bordered
                        columns={this.state.dataList}
                        dataSource={this.state.data}
                        pagination={false}
                        rowKey={'id'}
                        scroll={{ x: 1366 }}
                      //  rowSelection={rowSelection}
                    >
                    </MyTable>
                </Container>
                <div className="t-FAC t-MT10 wp-page  page-amazing">
                    {
                        this.state.total > 0 &&
                        <Pagination
                            pageSize={this.state.pageSize}
                            current={this.state.current}
                            showSizeChangerw
                            showQuickJumper
                            total={this.state.total}
                            onChange={this.PaginationSearch}
                        />
                    }
                </div>
                {this.state.myModalVisible &&
                    <MonitoringSiteModal
                        className="monitoringSite-modal"
                        title={this.state.title}
                        modalItems={this.state.myModalItems}
                        visible={this.state.myModalVisible}
                        onModalCancel={this.onModalCancel}
                        footerShow={this.state.footerShow}
                        modalSaveBtn={this.onModalSaveBtn}
                        formItemLayout={{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }}
                        inputSize={12}
                        defaultData={this.state.isEdit ? this.state.editData : null}
                        ref={ref => this.init = ref}
                        modalDisabled={{ disabled: this.state.modalDisabled }}
                        selectDisabled={this.state.modalDisabled}
                        width={644}
                    >
                </MonitoringSiteModal>
                }
                
            </div>
        )
    }
}
export default MaintainRemind;
