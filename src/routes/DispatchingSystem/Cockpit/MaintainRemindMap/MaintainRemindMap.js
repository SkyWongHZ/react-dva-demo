import React from 'react'
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, message, Icon, DatePicker, Input, Form, Tree, AutoComplete, notification, Upload } from 'antd';
import request from '../../../../utils/request';
import IndexTable from '../../../../components/PublicComponents/IndexTable';
import IndexFiltrate from '../../../../components/PublicComponents/IndexFiltrate';
import config from '../../../../config';
import './MaintainRemindMap.less';
import moment from 'moment';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import { connect } from 'dva';
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
@connect(({ cockpit, loading }) => ({
  cockpit,
  // submitting: loading.effects['login/login'],
}))


class MaintainRemindMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        myModalVisible: false,
        editModalVisible: false,
        checkedKeys: [],
        checkedNodes: [],
        siteId:'',
        siteName: '',
        content: '',
        time: '',
        detail: '',
        id: '',
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
            modalDisabled: false,
            checkedKeys: [],
            checkedNodes: [],
            content: '',
        })
    }

    // 取消
    onEditModalCancel = () => {
        this.setState({
            editModalVisible: false,
        })
    }

    //操作
    checkClick = (record) => {
        let t = this;
        this.setState({
            myModalVisible: true,
            modalDisabled: true,
            siteId: record.siteId,
            siteName: record.siteName,
        })
        this.props.dispatch({
            type: 'cockpit/getUserTree',
            payload: {
                siteId: record.siteId
            }
          });
    }

    //编辑
    editClick = (record) => {
        let t = this;
        this.setState({
            editModalVisible: true,
            modalDisabled: true,
            siteId: record.siteId,
            siteName: record.siteName,
            id: record.id,
        })
        // this.props.dispatch({
        //     type: 'cockpit/getUserTree',
        //     payload: {
        //         siteId: record.siteId
        //     }
        //   });
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
        siteId: params.siteId,
        endTime: endTime,
        startTime: startTime,
        pageNo: params.pageNo,        
        pageSize: config.pageSize,
    }
    request({ url: '/wl/maintain/plan/getPlan', method: 'get', params: obj }).then((res) => {
        this.setState({
            dataSource: res.ret.items,
            total: res.ret.rowCount
        })
    })
  }
  	//tree checkbox选中
	onCheck = (checkedKeys, info) => {
        
	    this.setState({
            checkedNodes:info.checkedNodes,
            checkedKeys:checkedKeys,
	    })

    }
    
    onSubmit = () => {
        let phone = this.state.checkedNodes&&this.state.checkedNodes.map((item,index)=>{
            return item.props.dataRef
        })
        let phoneNumber = phone.filter((value) => {
            return value !== undefined
        })
        phoneNumber = phoneNumber.join(',');
        let obj = {
            phoneNumber: phoneNumber,
            content: this.state.content
        }
        request({ url: '/wl/phone/sendMessage', method: 'get', params: obj }).then((res) => {
            if(!res.err){
                this.setState({
                    phoneNumber: phoneNumber,
                    content: this.state.content
                })
                this.getData(this.filtrate.props.form.getFieldsValue());
            }
            
        })
    }

    onEditSubmit = () => {
        let obj = {
            detail: this.state.detail,
            id: this.state.id,
            time: this.state.time,
        }
        request({ url: '/wl/maintain/plan/finishPlan', method: 'get', params: obj }).then((res) => {
            if(!res.err){
                this.setState({
                    editModalVisible: false,
                    siteId:'',
                    siteName: '',
                    content: '',
                    time: '',
                    detail: '',
                    id: '',
                })
                this.getData(this.filtrate.props.form.getFieldsValue());
            }
            
        })
    }
    
    renderTreeNodes = (data) => {
        return (
            <TreeNode title={this.state.siteName} key={`${this.state.siteId}-${this.state.siteId}`}>
            {
                data.userInfoDTOS &&
                data.userInfoDTOS.map((item) => {
                        return (
                            <TreeNode title={item.userName} key={item.userId} dataRef={item.phone} />
                            );
                    })
                  
            }
            </TreeNode>
        )
        // });
    }

  handChange = (pageNo, pageSize) => {
    let params = this.filtrate.props.form.getFieldsValue();
    params.pageNo = pageNo;
    this.getData(params);
  }

  contentChange = (e, name) => {
    name === 'detail' && this.setState({
        detail : e.target.value
    })
    name === 'content' && this.setState({
        content : e.target.value
    })

    name === 'time' && this.setState({
        time : moment(e).format('x')
    })
    }

  render() {
      console.log(this.state.time,5656);
    const { cockpit } = this.props;
    const columns = [
        {
            name: '序号',
            key: 'num',
            render: (index) => { return this.state.current=== 1? index+1 :index === 9? `${this.state.current*(index+1)}` : `${this.state.current-1}${index+1}`}               
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
            name: '维养周期/天',
            key: 'cycle',
        },
        {
            name: '计划维养时间',
            key: 'plantTimeString',
        },
        {
            name: '操作', 'dataIndex': 'operate',
            render: (index, record) => {
                return (
                    <span>
                        <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#00EAFF' }} type="icon-shuaxin" 
                        onClick={this.checkClick.bind(this, record)}
                         />|
                         <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#00EAFF' }} type="icon-xiugai2" 
                        onClick={this.editClick.bind(this, record)}
                         />
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
                paramName: "siteId",
                options: cockpit.siteId,
            },
            {
                type: 'rangePicker',
                label: '计划维养时间:',
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
      <div className="maintainRemind-container">
        <MyIcon type=" icon-guanbi " className="maintainRemind-closeIcon" onClick={this.props.closeClick} />
        <img className="maintainRemind-leftBorder" src={require("../../../../assets/images/leftbar7.png")} />
        <img className="maintainRemind-rightBorder" src={require("../../../../assets/images/rightbar8.png")} />
        <div className="maintainRemind-content">
          
          <div className="maintainRemind-table">
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
                    className="maintainRemind-modal"
                    title={<span><i className="iconfont icon-shouqi" />操作</span>}
                    width={422}
                    visible={this.state.myModalVisible}
                    onCancel={this.onModalCancel}
                    maskClosable={false}
                    onOk={this.onSubmit}
                    okText='发送'
                    /* footer={true} */
                >
                    <img className="maintainRemind-title1" src={require("../../../../assets/images/index_modal_title1.png")} />
                    <div className="show-content">
                        
                        <Tree
                            checkable
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            defaultExpandAll={true}
                        >
                            {this.renderTreeNodes(cockpit.userTree)}
                        </Tree>
                    </div>
                    <img className="maintainRemind-title2" src={require("../../../../assets/images/index_modal_title2.png")} />
                    <div className="show-content2">
                        <TextArea placeholder='请输入' onChange={e => this.contentChange(e,'content')} />
                    </div>
                </Modal>
            }
            {
                this.state.editModalVisible &&
                <Modal
                    className="maintainRemind-editmodal maintainRemind-modal"
                    title={<span><i className="iconfont icon-shouqi" />编辑</span>}
                    width={422}
                    visible={this.state.editModalVisible}
                    onCancel={this.onEditModalCancel}
                    maskClosable={false}
                    onOk={this.onEditSubmit}
                    okText='保存'
                    footer={<Button onClick={this.onEditSubmit}>保存</Button>}
                >
                    <img className="maintainRemind-title1" src={require("../../../../assets/images/index_modal_title3.png")} />
                    <div className='maintainRemind-time'>
                        <span>实际维养时间：</span>
                        <DatePicker
                        size={config.size}
                        onChange={e => this.contentChange(e, 'time')}
                         />
                    </div>
                    
                    {/* <div className="show-content">
                    </div> */}
                    <img className="maintainRemind-title2" src={require("../../../../assets/images/index_modal_title4.png")} />
                    <div className="show-content2">
                        <TextArea placeholder='请输入' onChange={e => this.contentChange(e,'detail')} />
                    </div>
                </Modal>
            }
      </div>
    )
  }
}

export default MaintainRemindMap
