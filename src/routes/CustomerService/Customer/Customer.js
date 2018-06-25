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
import './Customer.less';
const confirm = Modal.confirm;
// 维养提醒
class Customer extends React.Component {
    // 初始状态
    state = {
         maxMap: true,
        nameList:[],
        provinceList: [],
        cityList: [],
        districtList: [],
        countryList: [],
        deviceName:'',
        province:'',
        city:'',
        district:'',
        country:'',     
        total:10,
        pageSize:5,
        items :[
            {
            type: 'select',
            label: '项目名称:',
            placeholder: '请输入',
            paramName: "deviceName",
            options: [{text:'全部', value: ''}],
            }, 
            {
            type: 'select',
            label: '项目区域:',
            placeholder: '请输入',
            paramName: "province",
            options:[],
            selectChange: (value) => {//获取市
				let t = this;
				//获取市
				request({ url: '/wl/userService/getCity', method: 'GET',params:{provinceCode:value} })
                 .then((res) => {
                    console.log("res",res);
                    t.state.items[2].options = [{ text: '全部', value: '' }];
                    for (let i = 0; i < res.ret.length; i++) {
                        t.state.items[2].options.push({
                            text: res.ret[i].name, value: res.ret[i].value
                        });
                    }
                    t.setState({
                        items: this.state.items,
                    })
                	})
			}
            }, 
            {
            type: 'select',
            label: '市:',
            placeholder: '请输入',
            paramName: "city",
            options:[],
            //获取区县
             selectChange: (value) => {
                 let t = this;
                request({ url: '/wl/userService/getDistrict', method: 'GET',params:{provinceCode:'',cityCode:value} })
                .then((res) => {
                   console.log(res);
                   t.state.items[3].options = [{ text: '全部', value: '' }];
                   for (let i = 0; i < res.ret.length; i++) {
                       t.state.items[3].options.push({
                           text: res.ret[i].name, value: res.ret[i].value
                       });
                   }
                   t.setState({
                       items: this.state.items,
                   })
                   })
              }
            },
            {
            type: 'select',
            label: '区县:',
            placeholder: '请输入',
            paramName: "district",
            options: [],
            //获取乡
            selectChange: (value) => {
                let t = this;
               request({ url: '/wl/userService/getTown', method: 'GET',params:{provinceCode:'',cityCode:'',districtCode	:value,} })
               .then((res) => {
                  console.log(res);
                  t.state.items[4].options = [{ text: '全部', value: '' }];
                  for (let i = 0; i < res.ret.length; i++) {
                      t.state.items[4].options.push({
                          text: res.ret[i].name, value: res.ret[i].value
                      });
                  }
                  t.setState({
                      items: this.state.items,
                  })
                  })
             }
            },
            {
                type: 'select',
                label: '乡:',
                placeholder: '请输入',
                paramName: "country",
                options:[],
            },
        ],

    }


// 分页页面跳转
PaginationSearch = (params) => {
    let t=this;
    console.log('分页', params) 
    //(alarmType,alarmSite,states,startTime,endTime)
    t.drawListing(t.state.deviceName, t.state.province,t.state.city,t.state.district,t.state.country,params)
    this.setState({
        current: params,
    })
}

// 模糊搜索查询功能
searchIncomeData = (params) => {
    console.log('params',params)
    this.drawListing(
        params.deviceName,
        params.province,
        params.city,
        params.district,
        params.country,
        1
    )
    this.setState({
        deviceName: params.deviceName,
        province: params.province,
        city:params.city,
        district:params.district,
        country:params.country,
        current:1,
    })
}
////表格列表渲染事件
   drawListing = (deviceName,province,city,district,country,params) => {
    let Obj = {
        siteId: deviceName,//设备id
        provinceCode:province,
        cityCode:city,
        districtCode:district,
        townCode:country,
        pageNo: params,        
        pageSize: config.pageSize,
    }
    request({ url:'/wl/userService/getUserList', method: 'GET', params: Obj })
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
        const listcolumns = [
            {
                'title': '序号',
                'dataIndex': 'num',
                render: (data, text, index) => {return index+1}                
            },
            {
                'title': '项目名称',
                'dataIndex': 'name',
            },
            {
                'title': '设计规模',
                'dataIndex': 'scale',
            },
            {
                'title': '测点类型',
                'dataIndex': 'monitorTypeName',
            },
            {
                'title': '项目区域',
                'dataIndex': 'address',
            },
            {
                'title': '建设时间',
                'dataIndex': 'constructTimeString',
            },
            {
                'title': '投运时间',
                'dataIndex': 'useTimeString',
            },
            {
                'title': '负责人',
                'dataIndex': 'chargeMan',
            },
            {
                'title': '联系方式',
                'dataIndex': 'phone',
            },
        ];
        //获取省
		request({ url: '/wl/userService/getProvince', method: 'GET', })
        .then((res) => {
            console.log("province",res);
            let provinceData = [{ text: '全部', value: '' }];
            res.ret.map(item => {
                provinceData.push({
                    text: item.name,
                    value: item.value,
                })
            });
            this.state.items[1].options = provinceData;
            this.setState({
                items: this.state.items,
            })

        })
    
    //获得项目名称下拉列表
    request({ url: '/wl/alarm/getAllSite', method: 'GET', })
    .then((res) => {
        console.log("province",res);
        let nameData = [{ text: '全部', value: '' }];
        res.ret.map(item => {
            nameData.push({
                text: item.name,
                value: item.id,
            })
        });
        this.state.items[0].options = nameData;
        this.setState({
            items: this.state.items,
        })

    })
   
   //componentdidmount 初始化
   this.drawListing(t.state.deviceName, t.state.province,t.state.city,t.state.district,t.state.country,1);        
   this.setState({
       current:1,
        dataList: listcolumns,
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
                
                
            </div>
        )
    }
}
export default Customer;
