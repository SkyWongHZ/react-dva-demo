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
const confirm = Modal.confirm;

class VisitRecord extends React.Component {
    state = {
        siteCode: '',
        title: '新增',
        current: 1,
        dataSource: [],
        myModalVisible: false,
        editData: {},
        isEdit: false,
        modalDisabled: false,
        type: 'add',
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
        ],
        //定义myModal数据
        myModalItems: [{
            sub: [
                {
                    type: 'select',
                    label: '项目名称:',
                    placeholder: '请输入',
                    paramName: "siteId",
                    required: true,
                    options:[
                        {text:'全部',value:''},
                    ],
                },
            ]
        }]

    }

    // 查询
    searchIncomeData = (params) => {
        this.drawlisting(params.siteCode,1)
        this.setState({
            current: 1,
            siteCode: params.siteCode,
        })
    }
    // 新增
    addBtn = () => {
        this.setState({
            myModalVisible: true,
            isEdit: false,
            modalDisabled: false,
            type: 'add',
            title: '新增',
        })
        this.siteName();
    }

    // 下载
    downloadClick = (record) => {
        window.location.href = `${config.publicUrl} /wl/file/downloadFile?pictureId=${record.fileId}`
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
            t.drawlisting(t.state.siteCode, t.state.current)
        })

        this.setState({
            myModalVisible: false,
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
        this.drawlisting ('',  1)

        this.siteCode();

    }
    // 列表表格渲染
    drawlisting = (siteCode, pageIndex) => {
        let obj = {
            siteCode: siteCode,
            pageIndex: pageIndex,
            pageSize: config.pageSize,
        }
        request({ url: '/wl/service/visit/selectBysiteName', method: 'get', params: obj }).then((res) => {
            this.setState({
                dataSource: res.ret.items,
                total: res.ret.rowCount
            })
        })
    }
    // 分页
    PaginationSearch = (params) => {
        this.drawlisting(this.state.siteCode, params)
        this.setState({
            current: params
        })
    }


    // 查询 项目名称下拉列表
    siteCode = () => {
        let t = this;
        const options = [];
        t.state.items[0].options = t.state.items[0].options.slice(0, 1)
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

    // 新增 项目名称下拉列表
    siteName = () => {
        let t = this;
        const options = [];
        t.state.myModalItems[0].sub[0].options = t.state.myModalItems[0].sub[0].options.slice(0, 1)
        request({ url: '/wl/overview/appuserservice/selectAllSiteIdAndName', method: 'GET', params: {} })
            .then((res) => {               
                for (let i = 0; i < res.ret.length; i++) {
                    options.push({
                        text: res.ret[i].name, value: res.ret[i].id
                    });
                }
                t.state.myModalItems[0].sub[0].options.push(...options)
                t.setState({
                    myModalItems: t.state.myModalItems,
                })
            })
    }

    render() {
        let t = this;

        const columns = [
            {
                'title': '序号',
                'dataIndex': 'num',
                render: (data, text, index) => {return index+1}
            },
            {
                'title': '时间',
                'dataIndex': 'uploadTimes',
            },
            {
                'title': '项目名称',
                'dataIndex': 'siteName',
            },
            {
                'title': '回访记录',
                'dataIndex': 'backRecord',
            },
            {
                'title': '操作', 'dataIndex': 'operate', render: (text, record, index) => {
                    return (
                        <span>
                            <div>
                                {
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
                                                t.drawlisting(t.state.siteCode,t.state.current);
                                                
                                            } else if (info.file.status === 'error') {
                                                message.error(`${info.file.name} 上传失败`);
                                            }
                                        }}
                                        onSuccess={(info) => {
                                            if (info.rc !== 0) {
                                                message.error(info.err);
                                            } else {
                                                message.success('文件上传成功');
                                                t.drawlisting(t.state.siteCode,t.state.current);
                                            }
                                        }}
                                    >
                                        <Button type="primary" >{record.backRecord ? '重新上传': '上传'} </Button >
                                    </Upload>
                                }
                                {<Button type="primary" onClick={this.downloadClick.bind(this, record, '编辑')} >下载 </Button >}
                            </div>
                        </span>
                    )
                }
            },
        ];
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
                    addBtnShow={true}
                    addBtn={this.addBtn}
                >
                    <MyTable
                        className="yk-page"
                        bordered
                        columns={columns}
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
                    <MyModal
                        className="yk-custom-modal"
                        title={this.state.title}
                        modalItems={this.state.myModalItems}
                        visible={this.state.myModalVisible}
                        onModalCancel={this.onModalCancel}
                        modalSaveBtn={this.onModalSaveBtn}
                        formItemLayout={{ labelCol: { span: 6 }, wrapperCol: { span:16 } }}
                        inputSize={24}
                        defaultData={this.state.isEdit ? this.state.editData : null}
                        modalDisabled={{ disabled: this.state.modalDisabled }}
                        width={420}
                        footerShow={this.state.modalDisabled ? null : true}
                        dateDisabledDate={this.dateDisabledDate}
                    >
                    </MyModal>
                }
            </div>
        )
    }
}
export default VisitRecord;




