import React, { Component } from 'react';
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, message, Icon, DatePicker, Input, Form, Tree, AutoComplete, notification, Upload } from 'antd';
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
import './MaintenanceRecord.less';
const confirm = Modal.confirm;

class MaintenanceRecord extends React.Component {
    state = {
        siteCode: '',
        title: '详情',
        current: 1,
        dataSource: [],
        myModalVisible: false,
        modalDisabled: false,
        startTime: '',
        endTime: '',
        detail: '',
        items: [
            {
                type: 'select',
                label: '项目名称:',
                placeholder: '请输入',
                paramName: "siteCode",
                options:[
                    {text:'全部',value:''},
                ],
            },
            {
                type: 'rangePicker',
                label: '实际维养时间:',
                placeholder: '请输入',
                paramName: "finishTimes",
                marginLeft: '0'
            }
        ],
        columns: [
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
                'title': '实际维养时间',
                'dataIndex': 'finishTimes',
            },
            {
                'title': '维养详情', 'dataIndex': 'operate', render: (text, record, index) => {
                    return (
                        <span>
                            <div>
                                {<Button type="primary" onClick={this.checkClick.bind(this, record, )} >详情 </Button >}
                            </div>
                        </span>
                    )
                }
            },
        ],
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
        let startTime = this.changeDaytime(moment(params.finishTimes[0])).format('x')
        let endTime = this.changeEndDaytime(moment(params.finishTimes[1])).format('x')
        this.drawlisting(params.siteCode, startTime, endTime, 1)
        this.setState({
            siteCode: params.siteCode,
            state: params.state,
            startTime: params.year ? startTime : '',
            endTime: params.year ? endTime : '',
            current: 1,
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
        this.drawlisting ('', '', '',  1)

        this.siteCode();

    }
    // 列表表格渲染
    drawlisting = (siteCode, startTime, endTime, pageIndex) => {
        let obj = {
            siteCode: siteCode,
            startTime: startTime,
            endTime: endTime,
            pageIndex: pageIndex,
            pageSize: config.pageSize,
        }
        request({ url: '/wl/overview/main/getMaintainRecord', method: 'get', params: obj }).then((res) => {
            this.setState({
                dataSource: res.ret.items,
                total: res.ret.rowCount
            })
        })
    }
    // 分页
    PaginationSearch = (params) => {
        this.drawlisting(this.state.siteCode, this.state.startTime, this.state.endTime, params)
        this.setState({
            current: params
        })
    }


    // 查询 项目名称下拉列表
    siteCode = () => {
        let t = this;
        const options = [];
        t.state.items[0].options = t.state.items[0].options.slice(0, 1);
        request({ url: ' /wl/overview/appuserservice/selectAllSiteName', method: 'GET', params: {} })
            .then((res) => {               
                for (let i = 0; i < res.ret.length; i++) {
                    options.push({
                        text: res.ret[i].name, value: res.ret[i].code
                    });
                }
                t.state.items[0].options.push(...options)
                t.setState({
                    items: t.state.items,
                })
            })
    }

    //详情
    checkClick = (record) => {
        let t = this;
        this.setState({
            myModalVisible: true,
            modalDisabled: true,
            footerShow: false,
            title: '维养详情',
        })
        request({ url: '/wl/overview/main/selectMaintainRecordById', method: 'GET', params: { id: record.id } })
            .then((res) => {
                t.setState({
                    detail: res.ret.detail,
                })
            }).catch(err => {
                console.log('err', err)
                console.log('断网喽,请检查网络连接')
            });
    }

    render() {
        let t = this;
        
        
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
                    headerShow={false}
                >
                    <MyTable
                        className="yk-page"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 1366 }}
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
                    <Modal
                        className="maintenanceRecord-modal"
                        title={this.state.title}
                        width={380}
                        visible={this.state.myModalVisible}
                        onCancel={this.onModalCancel}
                        maskClosable={false}
                        footer={false}
                    >
                        <div className="show-content">
                            {this.state.detail}
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}
export default MaintenanceRecord;




