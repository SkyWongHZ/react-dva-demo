import React from 'react'
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, message, Icon, DatePicker, Input, Form, Tree, AutoComplete, notification, Upload } from 'antd';
import request from '../../../../utils/request';
import IndexTable from '../../../../components/PublicComponents/IndexTable';
import IndexFiltrate from '../../../../components/PublicComponents/IndexFiltrate';
import config from '../../../../config';
import './CustomerFile.less';
import moment from 'moment';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import MyModal from "../../../../components/MyPublic/InspectionModal"
import { connect } from 'dva';

@connect(({ cockpit, loading }) => ({
  cockpit,
  // submitting: loading.effects['login/login'],
}))
class CustomerFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        city: [],
        district: [],
        country: [],
        current: 1,
        total: '',
        dataSource: [],
    };
  }

  componentDidMount() {
    this.getData(this.filtrate.props.form.getFieldsValue());
    this.props.dispatch({
        type: 'cockpit/getSiteId',
      });
    this.props.dispatch({
        type: 'cockpit/getProvince',
        });
    
    }

    // 分页
    PaginationSearch = (params) => {
        let formData = this.filtrate.props.form.getFieldsValue();
        formData.pageNo = params;
        this.getData(formData);
        this.setState({
            current: params
        })
    }

    // 模糊搜索查询功能
    searchIncomeData = (params) => {
        params.pageNo = 1;
        this.getData(params);
        this.setState({
            current: 1,
        })
    }
    
    getData = (params) => {
    if (!params.pageNo) params.pageNo = this.state.current;
    
    let obj = {
        siteId: params.siteId,//设备id
        provinceCode: params.province,
        pageNo: params.pageNo,        
        pageSize: config.pageSize,
        cityCode: params.city,
        districtCode: params.district,
        townCode: params.country,
    }
    request({ url: '/wl/userService/getUserList', method: 'get', params: obj }).then((res) => {
        this.setState({
            dataSource: res.ret.items,
            total: res.ret.rowCount
        })
    })
  }

  handChange = (pageNo, pageSize) => {
    let params = this.filtrate.props.form.getFieldsValue();
    params.pageNo = pageNo;
    this.getData(params);
  }

  render() {
    const { cockpit } = this.props;
    const columns = [
        {
            name: '序号',
            key: 'num',
            render: (index, record) => { return this.state.current=== 1? index+1 :index === 9? `${this.state.current*(index+1)}` : `${this.state.current-1}${index+1}`}                
        },
        {
            name: '项目名称',
            key: 'name',
        },
        {
            name: '设计规模',
            key: 'scale',
        },
        {
            name: '测点类型',
            key: 'monitorTypeName',
        },
        {
            name: '项目区域',
            key: 'address',
        },
        {
            name: '建设时间',
            key: 'constructTimeString',
        },
        {
            name: '投运时间',
            key: 'useTimeString',
        },
        {
            name: '负责人',
            key: 'chargeMan',
        },
        {
            name: '联系方式',
            key: 'phone',
        },
    ];

    const filtrateItem = [
            {
                type: 'select',
                label: '项目名称:',
                placeholder: '请输入',
                paramName: "siteId",
                options: cockpit.siteId,
            },
            {
                type: 'select',
                label: '项目区域:',
                placeholder: '请输入',
                paramName: "province",
                options: cockpit.province,
                selectChange: (value) => {//获取市
                    let t = this;
                    //获取市
                    request({ url: '/wl/userService/getCity', method: 'GET',params:{provinceCode:value} })
                     .then((res) => {
                        console.log("res",res);
                        t.state.city = [{ text: '全部', value: '' }];
                        for (let i = 0; i < res.ret.length; i++) {
                            t.state.city.push({
                                text: res.ret[i].name, value: res.ret[i].value
                            });
                        }
                        t.setState({
                            city: this.state.city,
                        })
                        })
                }
                }, 
                {
                type: 'select',
                label: '市:',
                placeholder: '请输入',
                paramName: "city",
                options:this.state.city,
                //获取区县
                 selectChange: (value) => {
                     let t = this;
                    request({ url: '/wl/userService/getDistrict', method: 'GET',params:{provinceCode:'',cityCode:value} })
                    .then((res) => {
                       console.log(res);
                       t.state.district = [{ text: '全部', value: '' }];
                       for (let i = 0; i < res.ret.length; i++) {
                           t.state.district.push({
                               text: res.ret[i].name, value: res.ret[i].value
                           });
                       }
                       t.setState({
                        district: this.state.district,
                       })
                       })
                  }
                },
                {
                type: 'select',
                label: '区县:',
                placeholder: '请输入',
                paramName: "district",
                options: this.state.district,
                //获取乡
                selectChange: (value) => {
                    let t = this;
                   request({ url: '/wl/userService/getTown', method: 'GET',params:{provinceCode:'',cityCode:'',districtCode	:value,} })
                   .then((res) => {
                      console.log(res);
                      t.state.country = [{ text: '全部', value: '' }];
                      for (let i = 0; i < res.ret.length; i++) {
                          t.state.country.push({
                              text: res.ret[i].name, value: res.ret[i].value
                          });
                      }
                      t.setState({
                        country: this.state.country,
                      })
                      })
                 }
                },
                {
                    type: 'select',
                    label: '乡:',
                    placeholder: '请输入',
                    paramName: "country",
                    options:this.state.country,
                },
        ];
    const myModalItems = [{
            sub: [
                {
                    type: 'select',
                    label: '项目名称:',
                    placeholder: '请输入',
                    paramName: "siteId",
                    required: true,
                    options: cockpit.siteId,
                },
            ]
        }]
    return (
      <div className="customerFile-container">
        <MyIcon type=" icon-guanbi " className="customerFile-closeIcon" onClick={this.props.closeClick} />
        <img className="customerFile-leftBorder" src={require("../../../../assets/images/leftbar11.png")} />
        <img className="customerFile-rightBorder" src={require("../../../../assets/images/rightbar8.png")} />
        <div className="customerFile-content">
          
          <div className="customerFile-table">
            <IndexFiltrate
                items={filtrateItem}
                searchBtnShow={true}
                submit={this.searchIncomeData}
                wrappedComponentRef={ref => this.filtrate = ref}
                style={{height:'100px'}}
            />
            <IndexTable
              header={columns}
              tableData={this.state.dataSource}
              handChange={this.handChange}
              addBtnShow={false}
            />
          </div>
          {
                this.state.total > 0 &&
                <div className="t-FAC t-MT10 wp-page page-amazing index-page">
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
        </div>
      </div>
    )
  }
}

export default CustomerFile
