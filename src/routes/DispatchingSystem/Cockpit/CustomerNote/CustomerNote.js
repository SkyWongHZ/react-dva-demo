import React from 'react'
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, message, Icon, DatePicker, Input, Form, Tree, AutoComplete, notification, Upload } from 'antd';
import request from '../../../../utils/request';
import IndexTable from '../../../../components/PublicComponents/IndexTable';
import IndexFiltrate from '../../../../components/PublicComponents/IndexFiltrate';
import config from '../../../../config';
import './CustomerNote.less';
import moment from 'moment';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import MyModal from "../../../../components/MyPublic/InspectionModal"
import { connect } from 'dva';

const TreeNode = Tree.TreeNode;
const { TextArea } = Input;

@connect(({ cockpit, loading }) => ({
  cockpit,
  // submitting: loading.effects['login/login'],
}))
class CustomerNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        myModalVisible: false,
        modalDisabled: false,
        checkedKeys: [],
        checkedNodes: [],
        dataSource: [],
        total: '',
        content: '',
        siteId: '',
        siteName: '',
        current: 1,
    };
  }

  componentDidMount() {
    this.getData(this.filtrate.props.form.getFieldsValue());
    this.props.dispatch({
        type: 'cockpit/getSiteId',
      });
    this.props.dispatch({
        type: 'cockpit/getAlarmType',
    });
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

    // 下载
    downloadClick = (record) => {
        window.location.href = `${config.publicUrl} /wl/file/downloadFile?pictureId=${record.fileId}`
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

    // 新增
    addBtn = () => {
        this.setState({
            myModalVisible: true,
            modalDisabled: false,
        })
        this.props.dispatch({
            type: 'cockpit/getSiteId',
          });
    }
    // 保存
    onModalSaveBtn = (params) => {
        let t = this;
        let data = new FormData();
        data.append('siteId', params.siteId);
        var headers = new Headers({
            'Accept': '*/*',
            "Content-Type": "multipart/form-data",
        });

        request({ url: ' /wl/service/visit/addOrUpdate', method: 'post', form: data, headers }).then((res) => {
            console.log('新增请求', res)
            this.getData(this.filtrate.props.form.getFieldsValue());
        })

        this.setState({
            myModalVisible: false,
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
        alarmTypeId : params.alarmType,
        pageNO: params.pageNo,        
        pageSize: config.pageSize,
    }
    request({ url: '/wl/inform/getList', method: 'get', params: obj }).then((res) => {
        this.setState({
            dataSource: res.ret.items,
            total: res.ret.rowCount
        })
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
    
    contentChange = (e) => {
        this.setState({
            content: e.target.value
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

  render() {
    const { cockpit } = this.props;
    const columns = [
        {
            name: '序号',
            key: 'num',
            render: (index, record) => { return this.state.current=== 1? index+1 :index === 9? `${this.state.current*(index+1)}` : `${this.state.current-1}${index+1}`}                
        },
        {
            name: '时间',
            key: 'timeString',
        },
        {
            name: '项目名称',
            key: 'siteName',
        },
        {
            name: '报警类型',
            key: 'alarmType',
        },
        {
            name: '报警概要',
            key: 'detail',
        },
        {
            name: '操作', 'dataIndex': 'operate',
            render: (index, record) => {
                return (
                    <span>
                        <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#00EAFF' }} type="icon-shuaxin" 
                        onClick={this.checkClick.bind(this, record)}
                         />
                         {/* this.editClick.bind(this, record, '编辑') */}
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
                type: 'select',
                label: '报警类型:',
                placeholder: '请输入',
                paramName: "alarmType",
                options: cockpit.alarmType,
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
      <div className="customerNote-container">
        <MyIcon type=" icon-guanbi " className="customerNote-closeIcon" onClick={this.props.closeClick} />
        <img className="customerNote-leftBorder" src={require("../../../../assets/images/leftbar6.png")} />
        <img className="customerNote-rightBorder" src={require("../../../../assets/images/rightbar8.png")} />
        <div className="customerNote-content">
          
          <div className="customerNote-table">
            <IndexFiltrate
                items={filtrateItem}
                searchBtnShow={true}
                submit={this.searchIncomeData}
                wrappedComponentRef={ref => this.filtrate = ref}
            />
            <IndexTable
              /* total={cockpit.rowCount} */
              /* pageSize={config.pageSize} */
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
                    <TextArea placeholder='请输入' onChange={this.contentChange} />
                </div>
            </Modal>
        }
      </div>
    )
  }
}

export default CustomerNote
