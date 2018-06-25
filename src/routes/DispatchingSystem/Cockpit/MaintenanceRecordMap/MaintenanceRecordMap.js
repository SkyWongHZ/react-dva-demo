import React from 'react'
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, message, Icon, DatePicker, Input, Form, Tree, AutoComplete, notification, Upload } from 'antd';
import request from '../../../../utils/request';
import IndexTable from '../../../../components/PublicComponents/IndexTable';
import IndexFiltrate from '../../../../components/PublicComponents/IndexFiltrate';
import config from '../../../../config';
import './MaintenanceRecordMap.less';
import moment from 'moment';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import { connect } from 'dva';

@connect(({ cockpit, loading }) => ({
  cockpit,
  // submitting: loading.effects['login/login'],
}))
class MaintenanceRecordMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        myModalVisible: false,
        current: 1,
        total: '',
        dataSource: [],
    };
  }

  componentDidMount() {
    this.getData(this.filtrate.props.form.getFieldsValue());
    this.props.dispatch({
        type: 'cockpit/getSiteCode',
      });
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

    // 取消
    onModalCancel = () => {
        this.setState({
            myModalVisible: false,
        })
    }

    //详情
    checkClick = (record) => {
        let t = this;
        this.setState({
            myModalVisible: true,
            modalDisabled: true,
        })
        this.props.dispatch({
            type: 'cockpit/getMainRecordDetail',
            payload: {
                id: record.id
            }
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
    let startTime = this.changeDaytime(moment(params.finishTimes[0])).format('x')
    let endTime = this.changeEndDaytime(moment(params.finishTimes[1])).format('x')

    if (!params.pageNo) params.pageNo = this.state.current;
    let obj = {
        startTime: startTime,
        endTime: endTime,
        siteCode: params.siteCode,
        pageSize: config.pageSize,
        pageIndex: params.pageNo,
    }
    request({ url: '/wl/overview/main/getMaintainRecord', method: 'get', params: obj }).then((res) => {
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
            render: (index, data) => { return this.state.current=== 1? index+1 :index === 9? `${this.state.current*(index+1)}` : `${this.state.current-1}${index+1}`} 
        },
        {
            name: '项目名称',
            key: 'siteName',
        },
        {
            name: '设备编号',
            key: 'deviceNo',
        },
        {
            name: '仪器名称',
            key: 'instrumentName',
        },
        {
            name: '实际维养时间',
            key: 'finishTimes',
        },
        {
            name: '维养详情', 
            key: 'operate', 
            render: (index, record) => {
                return (
                    <span>
                        <div>
                            <div className='mainRecord-cankan' onClick={this.checkClick.bind(this, record, )} ><i className="iconfont icon-chakan" /></div >
                            {/* this.checkClick.bind(this, record, ) */}
                        </div>
                    </span>
                )
            }
        },
    ];

    const filtrateItem = [
            {
                type: 'select',
                label: '项目名称:',
                placeholder: '请输入',
                paramName: "siteCode",
                options: cockpit.siteCode,
            },
            {
                type: 'rangePicker',
                label: '实际维养时间:',
                placeholder: '请输入',
                paramName: "finishTimes",
                width: '390px',
                itemLayout: {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 },
                }
            }
        ];
    return (
      <div className="mainRecord-container">
        <MyIcon type=" icon-guanbi " className="mainRecord-closeIcon" onClick={this.props.closeClick} />
        <img className="mainRecord-leftBorder" src={require("../../../../assets/images/leftbar9.png")} />
        <img className="mainRecord-rightBorder" src={require("../../../../assets/images/rightbar8.png")} />
        <div className="mainRecord-content">
          
          <div className="mainRecord-table">
            <IndexFiltrate
                items={filtrateItem}
                searchBtnShow={true}
                submit={this.searchIncomeData}
                wrappedComponentRef={ref => this.filtrate = ref}
            />
            <IndexTable
              header={columns}
              tableData={this.state.dataSource}
              handChange={this.handChange}
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
            {
                this.state.myModalVisible &&
                <Modal
                    className="mainRecord-modal"
                    title={<span><i className="iconfont icon-shouqi" />维养详情</span>}
                    width={380}
                    visible={this.state.myModalVisible}
                    onCancel={this.onModalCancel}
                    maskClosable={false}
                    footer={false}
                >
                    <div className="show-content">
                        {cockpit.detail}
                    </div>
                </Modal>
            }
      </div>
    )
  }
}

export default MaintenanceRecordMap
