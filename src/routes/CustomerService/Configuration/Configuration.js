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
import './Configuration.less';
const confirm = Modal.confirm;
// 监测点管理
class Configuration extends React.Component {
    // 初始状态
    state = {
        myModalVisible: false,
        deviceId:'',
        deviceName:'',
        deviceCode:'',
         maxMap: true,
        dataList:[],
        nameList:[],
        numList:[],
        total:10,
        siteName:'',
        current:1,
        pageNo:1,
        pageSize:10,
        items : [
            {
            type: 'select',
            label: '项目名称:',
            placeholder: '请输入',
            paramName: "deviceName",
            options: [],
            selectChange: (value) => {
                let t = this;
               request({ url: '/wl/chart/getDeviceList', method: 'GET',params:{siteId:value} })
               .then((res) => {
                  console.log("device",res);
                  t.state.items[1].options = [{ text: '全部', value: '' }];
                  for (let i = 0; i < res.ret.length; i++) {
                      t.state.items[1].options.push({
                          text: res.ret[i].deviceCode, value: res.ret[i].deviceId
                      });
                  }
                  t.setState({
                      items: this.state.items,
                  })
                  })
             }
                // //获取设备编号下拉列表
                // request({ url: '/wl/chart/getSiteList', method: 'GET', })
                // .then((res) => {
                //     console.log("name.res",res);
                //     let numData = [{text:'全部',value:''}];
                //     res.ret.map(item => {
                //         nameData.push({
                //             text: item.siteName,
                //             value: item.siteId,
                //         })
                //     });
                //     this.state.items[0].options = nameData;
                //     this.setState({
                //         items: this.state.items,
                //     })
               // })
            }, 
            {
            type: 'select',
            label: '设备编号:',
            placeholder: '请输入',
            paramName: "deviceCode",
            options:[],
            }, 
        ],
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
                request({ url: "/wl/chart/delete", method: 'POST', data: data }).then(res => {
                    console.log('删除成功',res)
                    t.drawListing(t.state.deviceName, t.state.deviceCode,t.state.current);
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
 //tabel 选择事件
 onSelectChange = (selectedRowKeys) => {
    console.log(selectedRowKeys)
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
}

// 分页页面跳转
PaginationSearch = (params) => {
    let t=this;
    console.log('分页', params) 
    //(alarmType,alarmSite,states,startTime,endTime)
    t.drawListing(t.state.deviceName, t.state.deviceCode,params)
    this.setState({
        current: params,
    })
}
   
   // 模糊搜索查询功能
searchIncomeData = (params) => {
    let t = this;
    console.log('params',params)
    t.drawListing(
        params.deviceName,
        params.deviceCode,
        1
    )
    this.setState({
        deviceName: params.deviceName,
        deviceCode: params.deviceCode,
        current:1,
    })
  }
////表格列表渲染事件
   drawListing = (deviceName,deviceCode,params) => {
    let Obj = {
        deviceId: deviceName,//设备id
        siteId:deviceCode,
        pageNo: params,        
        pageSize: config.pageSize,
    }
    request({ url:'/wl/chart/getList', method: 'GET', params: Obj })
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
    componentDidMount() {
        let t = this;
        const columns = [
            {
                'title': '编码',
                'dataIndex': 'flowChartCode',
            },
            {
                'title': '项目名称',
                'dataIndex': 'siteName',
            },
            {
                'title': '设备编号',
                'dataIndex': 'deviceCode',
            },
            {
                'title': '操作', 'dataIndex': 'operate',
                 render: (text, record, index) => {
                    return (
                        <span>
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#3996FF' }} type="icon-xiugai2" 
                            //onClick={this.editClick.bind(this, record, '编辑')}
                             />
                        </span>
                    )
                }
            },
        ];
    
    //获得事件状态下拉列表  
            request({ url: '/wl/chart/getSiteList', method: 'GET', })
            .then((res) => {
                console.log("name.res",res);
                let nameData = [{ text: '全部', value: '' }];
                res.ret.map(item => {
                    nameData.push({
                        text: item.siteName,
                        value: item.siteId,
                    })
                });
                this.state.items[0].options = nameData;
                this.setState({
                    items: this.state.items,
                })
            })
    this.setState({
        dataList: columns,
    });
    //componentdidmount 初始化
    this.drawListing(this.state.deviceName, this.state.deviceCode,1);        
    this.setState({
        current:1,
    });
              
    }
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

       
        // this.state.numList.map((item)=> {
        //     nameData.push({text:item.stateName,value: item.code})
        // })
        
        return (
            <div>
                <Crumbs routes={this.props.routes} className="crumbs-content" />
                <Filtrate
                    items={this.state.items}
                    searchBtnShow={true}
                    submit={this.searchIncomeData}
                    onChange={this.selectChange}
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
                        columns={this.state.dataList}
                        dataSource={this.state.data}
                        pagination={false}
                        rowKey={'id'}
                        scroll={{ x: 1366 }}
                        rowSelection={rowSelection}
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
                
            </div>
        )
    }
}
export default Configuration;
