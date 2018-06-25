import React, { Component } from 'react';
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, Upload, message, Icon, DatePicker, Input } from 'antd';
import Filtrate from '../../../components/MyPublic/OfficialFiltrate';
import util from '../../../utils/Util';
import MyTable from '../../../components/PublicComponents/MyTable';
import Container from '../../../components/MyPublic/OfficialContainer';
import MyIcon from '../../../components/PublicComponents/MyIcon';
import MyModal from "../../../components/MyPublic/OfficialModal"
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request';
import requestTwo from '../../../utils/requestTwo';
import config from '../../../config'
import PublicService from '../../../services/PublicService';
import moment from 'moment';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './MonitoringType.less';
const showdetail = require(`../../../assets/images/report/1.png`);
const confirm = Modal.confirm;
/* 测试地址 */
const serverUrl = 'http://192.168.2.125:10300';
const logo = require("../../../assets/images/logo.png");
class MonitoringType extends React.Component {
    // 初始状态
    state = {
        items: [
            {
                type: 'select',
                label: '监测类型:',
                placeholder: '请输入',
                paramName: "id",
                options: [
                    { text: '全部', value: '' },
                ],
            },
        ],
        myModalVisible: false,
        title: '新增',
        current: 1,
        id: '',
        type: '新增',
        imgUrl: '',
        showPicture: false,
        fileId: '',
        missLemon: false,

        //定义myModal数据
        myModalItems: [
            {
                sub: [
                    // 基本信息
                    {
                        type: 'yearPicker',
                        label: '供水所',
                        paramName: 'waterSupplyStation',
                        size: null,
                    }

                ],
            },
        ],
        baseImg: [],              // 基础图标
        myImg: [],          // 自定义图标列表
        uploading: false,

        yeartime: '',
        beginTime: '',
        endTime: '',
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
                request({ url: "/wl/monitor/type/delete", method: 'POST', data: data }).then(res => {
                    t.listDrawing(t.state.id, t.state.current)
                    t.gainType();
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // 编辑功能
    editClick = (record) => { 
        this.setState({
            myModalVisible: true,
            title: '编辑',
            type: '编辑',
            imgUrl: record.path,
            fileId: record.id,
            recordId: record.id,
            imageCode: record.imageCode,
            monitorTypeNameValue: record.typeName,
            missLemon: true,

        })
        this.searchImglist()
    }

    // 模态框取消
    onModalCancel = () => {
        // if (this.state.type === '编辑'){
        //     if (monitorCode === '' || t.state.imgUrl === ''){

        //     }
        // }
        if ((this.state.type === '编辑') && (monitorCode === '' || this.state.imgUrl === '')) {
            message.error('请确认填写信息')
            return false
        }


        this.setState({
            myModalVisible: false,
            monitorTypeNameValue: ''
        })
    }

    // 模态框保存
    onModalSaveBtn = () => {
        let t = this;
        let typeName = document.getElementById("monitorCode").value;
        let data = {
            pictureId: this.state.fileId,
            typeName: typeName
        }
        console.log('data', data)
        if (typeName === '' || t.state.imgUrl === '') {
            message.error('请确认填写信息')
            return false
        } else {
            if (this.state.type === '编辑') {
                request({
                    url: '/wl/monitor/type/saveOrUpdate',
                    method: 'POST',
                    data: { ...data, id: this.state.recordId}
                })
                    .then((res) => {
                        console.log('监测图标编辑成功',res)
                        t.listDrawing(t.state.id, t.state.current)
                    })
            } else {
                request({
                    url: '/wl/monitor/type/saveOrUpdate',
                    method: 'POST',
                    data: { ...data },
                })
                    .then((res) => {
                        t.listDrawing(t.state.id, t.state.current)
                    })
            }
        }

        this.onModalCancel()
    }

    // 分页页面跳转
    PaginationSearch = (params) => {
        let fileObj = {
            typeName: this.state.typeName,
            pageIndex: params,
            pageSize: config.pageSize,
        }
        this.setState({
            current: params,
        })
        request({ url: '/wl/monitor/type/findMonitorTypes', method: 'GET', params: fileObj })
            .then((res) => {
                this.setState({
                    data: PublicService.transformArrayData(res.items, true, false, params, 10),
                    total: res.rowCount
                })
            })
    }

    // 模糊搜索查询功能
    searchIncomeData = (params) => {
        this.listDrawing(params.id, 1)
        this.setState({
            typeName: params.id,
            current: 1,
        })
    }

    // 新增
    addBtn = () => {
        this.setState({
            myModalVisible: true,
            reimportUpload: false,
            type: '新增',
            title: '新增',
            showPicture: false,
            imgUrl: '',
            missLemon: true,
        })
        this.searchImglist()
        this.gainType();
    }

    // 查询图标列表
    searchImglist = () => {
        request({ url: '/wl/monitor/type/notUse', method: 'GET' })
            .then((res) => {
                console.log('查询图标成功',res)
                this.setPictureFilelist(res.ret)
            }).catch(err => {
                console.log('断网喽,请检查网络连接')
            });
    }

    // 删除模态框选中图片
    // deleteImg = (type, item) => {
    //     console.log(item, '66')
    //     if (type === 'checkImg') {
    //         this.setState({ imgUrl: '', fileId: '' })
    //     } else {
    //         requestTwo({
    //             url: '/fileManagement/deleteFileByIds',
    //             method: 'POST',
    //             data: [item.fileId]
    //         }).then(data => {
    //             if (data.rc !== 0) {
    //                 message.error(data.err)
    //             } else {
    //                 this.searchImglist()
    //                 if (item.fileId === this.state.fileId) {
    //                     this.setState({ imgUrl: '', fileId: '' })
    //                 }
    //             }
    //         })
    //     }
    // }

    // 删除模态框选中图片
    deleteImg = (type, item) => {
        // 西安项目的删除基于checkImg
        if (type === 'checkImg') {
            request({ url: '/wl/monitor/type/unbund', method: 'GET', params: { id: this.state.fileId } })
                .then((res) => {
                    // console.log('删除接口', res)
                    // for (let i = 0; i < res.ret.items.length; i++) {
                    //     options.push({
                    //         text: res.ret.items[i].monitorTypeName, value: res.ret.items[i].id
                    //     });
                    // }
                    // t.state.items[0].options.push(...options)
                    // t.setState({
                    //     items: t.state.items,
                    // })
                    this.setState({ imgUrl: '', fileId: '', })
                    this.searchImglist()
                })

        } else {
            requestTwo({
                url: '/fileManagement/deleteFileByIds',
                method: 'POST',
                data: [item.fileId]
            }).then(data => {
                if (data.rc !== 0) {
                    message.error(data.err)
                } else {
                    this.searchImglist()
                    if (item.fileId === this.state.fileId) {
                        this.setState({ imgUrl: '', fileId: '' })
                    }
                }
            })
        }
    }

    //tabel 选择事件
    onSelectChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    // 监测类型下拉列表
    gainType = () => {
        let t = this;
        const options = [];
        t.state.items[0].options = t.state.items[0].options.slice(0, 1)
        request({ url: '/wl/monitor/type/findAll', method: 'GET', params: {} })
            .then((res) => {               
                for (let i = 0; i < res.ret.length; i++) {
                    options.push({
                        text: res.ret[i].typeName, value: res.ret[i].id
                    });
                }
                t.state.items[0].options.push(...options)
                t.setState({
                    items: t.state.items,
                })
            })
    }

    // 列表内容渲染
    listDrawing = (id, pageIndex) => {
        let t = this;
        let fileObj = {
            id: id,
            pageIndex: pageIndex,
            pageSize: config.pageSize,
        }
        request({ url: '/wl/monitor/type/findMonitorTypes', method: 'GET', params: fileObj })
            .then((res) => {
                t.setState({
                    data: PublicService.transformArrayData(res.items, true, false, t.state.current, 10),
                    total: res.rowCount,
                })
            })
    }

    // 整理图标数据结构
    setPictureFilelist = (fileList) => {
        let t = this, baseImg = [], myImg = [];
        for (let i = 0, l = fileList.length; i < l; i++) {
            // if (fileList[i].flag === null) {
            //     myImg.push({
            //         filePath: fileList[i].filePath,
            //         fileId: fileList[i].fileId
            //     })
            // } else {
            //     baseImg.push({
            //         filePath: fileList[i].filePath,
            //         fileId: fileList[i].fileId
            //     })
            // }
            baseImg.push({
                filePath: fileList[i].path,
                fileId: fileList[i].id
            })
        }
        t.setState({ baseImg, myImg })
    }
    // 绑定图标
    checkImg = (item) => {
        this.setState({ imgUrl: item.filePath, fileId: item.fileId })
    }

    componentDidMount() {
        let t = this;
        const listcolumns = [
            {
                'title': '序号',
                'dataIndex': 'num',
            },
            {
                'title': '监测类型',
                'dataIndex': 'typeName',
            },
            {
                'title': '监测图标',
                'dataIndex': 'path',
                render: (text, record, index) => {
                    return (
                        <div>
                            {
                                <img src={`${record.path}`} style={{ width: '20px' }} />}
                        </div>
                    )
                }
            },
            {
                'title': '操作', 'dataIndex': 'operate', render: (text, record, index) => {
                    return (
                        <span>
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#3996FF', cursor: 'pointer' }} type="icon-xiugai2" onClick={t.editClick.bind(this, record)} />
                        </span>
                    )
                }
            },
        ];
        this.setState({
            dataList: listcolumns,
        })
        this.listDrawing(this.state.id, 1)
        this.gainType();

    }



    render() {
        const { selectedRowKeys, baseImg, myImg, imgUrl, type } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const props = {
            action: '/xcwrm/fileManagement/uploadFile',
            showUploadList: false,
            data: (file) => {
                return {
                    multipartFile: file,
                    fileType: 15,
                }
            },
            onSuccess: (ret, file, aa) => {
                console.log(file, 'file--66')
                if (ret.rc !== 0) {
                    message.error(ret.err)
                } else {
                    this.searchImglist()
                }

            },
            onError: (file) => {
                message.error('上传失败')
            },
        };
        console.log('imgUrl',imgUrl)
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
                    deleteBtnShow={true}
                    deleteBtn={this.deleteBtn}
                >

                    <MyTable
                        className="yk-page"
                        bordered
                        columns={this.state.dataList}
                        dataSource={this.state.data}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 1366 }}
                        rowSelection={rowSelection}
                    >
                    </MyTable>
                </Container>

                <div className="t-FAC t-MT10 wp-page  page-amazing">
                    {this.state.total > 0 &&
                        <Pagination
                            size={10}
                            current={this.state.current}
                            showSizeChangerw
                            showQuickJumper
                            total={this.state.total}
                            onChange={this.PaginationSearch}
                        />
                    }
                </div>
                {
                    this.state.myModalVisible &&
                    <Modal
                        className="monitoringType-modal"
                        title={this.state.title}
                        width={380}
                        visible={this.state.myModalVisible}
                        onCancel={this.onModalCancel}
                        maskClosable={false}
                        footer={
                            <Button onClick={this.onModalSaveBtn} key="submit" type="primary" size="large" className="save">保存</Button>
                        }
                    >
                        <div className="show-content">
                            <div className="monitor">
                                <span>监测类型:</span>
                                <Input id="monitorCode" defaultValue={this.state.missLemon ? this.state.monitorTypeNameValue : ''} />
                            </div>
                            <div className="monitor-picture">
                                <span>监测图标:</span>
                                {
                                    imgUrl && imgUrl.length !== 0 &&
                                    <div className="check-img show-img">
                                        <img src={`${imgUrl}`}></img>
                                        <Icon type="close-circle-o" className="my-icon" onClick={this.deleteImg.bind(this, 'checkImg')} />
                                    </div>
                                }
                            </div>
                            <div className="deposit">
                                {/* 基础图标 */}
                                {
                                    baseImg && baseImg.map((item) => {
                                        return (
                                            <div className="check-img base-img">
                                                <img
                                                    onClick={this.checkImg.bind(this, item)}
                                                    src={`${item.filePath}`}></img>
                                            </div>
                                        )
                                    })
                                }
                                {/* 自定义图标 */}
                                {
                                    myImg && myImg.map((item) => {
                                        return (
                                            <div className="check-img base-img">
                                                <img
                                                    onClick={this.checkImg.bind(this, item)}
                                                    src={`${serverUrl}/xcwrm/fileManagement/downloadFile?fileName=test.png&filePath=${item.filePath}`}>
                                                </img>
                                                <Icon type="close-circle-o" className="my-icon" onClick={this.deleteImg.bind(this, 'deleteImg', item)} />
                                            </div>
                                        )
                                    })
                                }
                                {/* <Upload {...props}>
                                    <MyIcon className="age" style={{
                                        fontSize: '28px',
                                        color: '#C3C3C3',
                                        cursor: 'pointer'
                                    }} type="icon-zengjia1" />
                                </Upload> */}
                            </div>
                        </div>
                    </Modal>
                }

            </div>
        )
    }
}
export default MonitoringType;
