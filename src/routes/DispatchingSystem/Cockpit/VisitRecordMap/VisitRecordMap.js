import React from 'react'
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, message, Icon, DatePicker, Input, Form, Tree, AutoComplete, notification, Upload } from 'antd';
import request from '../../../../utils/request';
import IndexTable from '../../../../components/PublicComponents/IndexTable';
import IndexFiltrate from '../../../../components/PublicComponents/IndexFiltrate';
import config from '../../../../config';
import './VisitRecordMap.less';
import moment from 'moment';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import MyModal from "../../../../components/MyPublic/InspectionModal"
import { connect } from 'dva';

@connect(({ cockpit, loading }) => ({
  cockpit,
  // submitting: loading.effects['login/login'],
}))
class VisitRecordMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        myModalVisible: false,
        modalDisabled: false,
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

    // 取消
    onModalCancel = () => {
        this.setState({
            myModalVisible: false,
        })
    }

    // 下载
    downloadClick = (record) => {
        record.fileId?window.location.href = `${config.publicUrl} /wl/file/downloadFile?pictureId=${record.fileId}`:message.error('文件不存在');;
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
        siteCode: params.siteCode,
        pageSize: config.pageSize,
        pageIndex: params.pageNo,
    }
    request({ url: ' /wl/service/visit/selectBysiteName', method: 'get', params: obj }).then((res) => {
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
            name: '时间',
            key: 'uploadTimes',
        },
        {
            name: '项目名称',
            key: 'siteName',
        },
        {
            name: '回访记录',
            key: 'backRecord',
        },
        {
            name: '操作', 
            key: 'operate', 
            render: (index, record) => {
                return (
                    <span>
                        <div>
                        <Upload 
                            name='file'
                            action='/wl/service/visit/addOrUpdate'           
                            accept='.doc, .docx, .txt'
                            showUploadList={false}
                            
                            data={(file) => {
                                
                                return {
                                    multipartFile: file,
                                    fileId: record.fileId?record.fileId:'',
                                    id: record.id,
                                    siteId: record.siteId,
                                }
                            }}
                            onChange={(info)=> {
                                if (info.file.status !== 'uploading') {
                                    console.log(info.file, info.fileList);
                                }
                                if (info.file.status === 'done') {
                                    message.success(`${info.file.name} 上传成功`);
                                    this.getData(this.filtrate.props.form.getFieldsValue());
                                    
                                } else if (info.file.status === 'error') {
                                    message.error(`${info.file.name} 上传失败`);
                                }
                            }}
                            onSuccess={(info) => {
                                if (info.rc !== 0) {
                                    message.error(info.err);
                                } else {
                                    message.success('文件上传成功');
                                    this.getData(this.filtrate.props.form.getFieldsValue());
                                }
                            }}
                        >
                            <span className='mainRecord-cankan'><i className="iconfont icon-upload" /></span >
                        </Upload>
                            <img src={require("../../../../assets/images/line1.png")} className="visitRecord-line" />
                            <span className='mainRecord-cankan'onClick={this.downloadClick.bind(this, record)} ><i className="iconfont icon-xiazai-" /></span >
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
      <div className="visitRecord-container">
        <MyIcon type=" icon-guanbi " className="visitRecord-closeIcon" onClick={this.props.closeClick} />
        <img className="visitRecord-leftBorder" src={require("../../../../assets/images/leftbar8.png")} />
        <img className="visitRecord-rightBorder" src={require("../../../../assets/images/rightbar8.png")} />
        <div className="visitRecord-content">
          
          <div className="visitRecord-table">
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
              addBtnShow={true}
              addBtn={this.addBtn}
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
            <MyModal
                className="visit-record-map-modal"
                title={<span><i className="iconfont icon-shouqi" />新增</span>}
                modalItems={myModalItems}
                visible={this.state.myModalVisible}
                onModalCancel={this.onModalCancel}
                modalSaveBtn={this.onModalSaveBtn}
                formItemLayout={{ labelCol: { span: 8 }, wrapperCol: { span:16 } }}
                inputSize={24}
                defaultData={null}
                modalDisabled={{ disabled: this.state.modalDisabled }}
                width={330}
                footerShow={this.state.modalDisabled ? null : true}
                okText='添加记录'
            >
            </MyModal>
        }
      </div>
    )
  }
}

export default VisitRecordMap
