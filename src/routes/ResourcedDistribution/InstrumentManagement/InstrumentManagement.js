// 仪器管理
import React, { Component } from 'react';
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, Upload, message, Icon, DatePicker, Input, Table, Select, Calendar, notification } from 'antd';
const { InputGroup } = Input.Group
const Option = Select.Option
import Filtrate from '../../../components/MyPublic/OfficialFiltrate';
import util from '../../../utils/Util';
import Container from '../../../components/MyPublic/OfficialContainer';
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request';
import config from '../../../config'
import moment from 'moment';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import '../DeviceManagement/DeviceManagement.less';
import InstrumentOperDialog from './InstrumentOperDialog'
const confirm = Modal.confirm;

export default
class InstrumentManagement extends React.Component {
    // 初始状态
    state = {
        searchInstrumentName:'',//查询条件
        isView:false,//是否查看详情
        instrumentDetailInfo:{},//具体数据详情
        datalistContet:[],
        myModalVisibleDel: false,
        currentPage: 1,
        selectfactorType:[],//因子类型枚举值
    }

    //表格数据查询
    instrumentSelectAll = (searchInstrumentName,page) => {
        if(!page){
            this.setState({
                currentPage:1
            })
        }

        let obj={
            pageIndex:page|| 1,
            pageSize:config.pageSize,
            instrumentName:searchInstrumentName?searchInstrumentName:''
        }
        request({ url:'/wl/overview/instrument/selectAll', method: 'GET' ,params:obj}).then((res) => {        
            if(!res.rc){
                let datalistContet=res.items&&res.items.map((item,index)=>{
                    const {instrumentDTO1,...otherProp}=item
                    return {
                        ...instrumentDTO1,
                        ...otherProp
                    }
                })

                this.setState({
                    datalistContet,
                    total: res.rowCount
                })
            }
        })
    }

    //查询
    onSearch=(fromValue)=>{
        this.setState({searchInstrumentName:fromValue.instrumentName})
        this.instrumentSelectAll(fromValue.instrumentName)
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
                request({ url: "/wl/overview/instrument/delete", method: 'POST', data: data }).then(res => {
                    t.instrumentSelectAll('',t.state.currentPage);
                })
            },
            onCancel() {
            }
        });
    }

    onModalDelCancel = () => {
        this.setState({
            myModalVisibleDel: false,
        })
    }

    // 分页页面跳转
    PaginationSearch = (params) => {
        this.setState({
            currentPage: params,
        })
        this.instrumentSelectAll(this.state.searchInstrumentName,params)
    }

    // 新增
    addBtn = () => {
        this.setState({
            isView:false,
            myModalVisibleDel: true,
            instrumentDetailInfo:{},
        })
    }

    //tabel 选择事件
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }


    //因子类型枚举值
    selectfactorType=()=>{
        request({url:'/wl/overview/instrument/selectfactorType',method:'GET'})
        .then(res=>{
            this.setState({
                selectfactorType:res.ret
            })
        })
    }

    componentDidMount() {
        this.instrumentSelectAll();
        this.selectfactorType()
    }

    editButton = (record) => {
        this.setState({
            isView:false,
            myModalVisibleDel:true,
            instrumentDetailInfo:record
        })
        
    }

    showDetail = (record) => {
        this.setState({
            isView:true,
            myModalVisibleDel:true,
            instrumentDetailInfo:record
        }) 
    }

    //新增或修改信息成功
    updateSuccess=(id)=>{
        this.setState({
            myModalVisibleDel:false
        })
        const current=id?this.state.currentPage:''
        this.instrumentSelectAll('',current)
    }

    getConstructionTime(time){
        return time?moment(time).format('YYYY/MM/DD'):''
    }

    render() {
        const { selectedRowKeys, selectfactorType  } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const listcolumns = [
            {
                'title': '仪器编号',
                'dataIndex': 'code',
            },
            {
                'title': '仪器名称',
                'dataIndex': 'instrumentName',
            },
            {
                'title': '反控编号',
                'dataIndex': 'reverseControllerCode',
            },
            {
                'title': '仪器型号',
                'dataIndex': 'type',
            },
            {
                'title': '生产厂家',
                'dataIndex': 'factory',
            },
            {
                'title': '安装时间',
                'dataIndex': 'constructionTime',render: (text, record, index) => {
                    return (
                        <span>{this.getConstructionTime(record.constructionTime)}</span>
                    )
                }

            },
            {
                'title': '维养周期',
                'dataIndex': 'cycle',
            },
            {
                'title': '监测类型',
                'dataIndex': 'monitorTypeName',
            },
            {
                'title': '操作', 'dataIndex': 'operate', render: (text, record, index) => {
                    return (
                        <span className="oper-btns">
                            <i className="iconfont icon-xiugai2 edit-btn" onClick={this.editButton.bind(this,record)}></i>
                            <i className="iconfont icon-chakan view-btn" onClick={this.showDetail.bind(this,record)}></i>
                        </span>

                    )
                }
            },
        ];

        const filtrateItem = [{
            label: "仪器名称",
            type: "input",
            paramName: "instrumentName"
        }];
  
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
                            rowKey="id"
                            size='small'
                            rowSelection={rowSelection}
                            pagination={false}
                            pageSize={7}
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
                    <InstrumentOperDialog 
                        myModalVisibleDel={this.state.myModalVisibleDel}
                        onModalDelCancel={this.onModalDelCancel}
                        isView={this.state.isView}
                        selectfactorType={this.state.selectfactorType}
                        data={this.state.instrumentDetailInfo}
                        onSuccess={this.updateSuccess}
                    />
                }
            </div>
        )
    }
}
