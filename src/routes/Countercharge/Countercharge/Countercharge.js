import React, { Component } from 'react';
// import { Link } from 'react-router'
import { Link} from 'dva/router'
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, Upload, message, Icon, DatePicker, Input, Form } from 'antd';
import Filtrate from '../../../components/MyPublic/OfficialFiltrate';
import util from '../../../utils/Util';
import MyTable from '../../../components/PublicComponents/MyTable';
import Container from '../../../components/MyPublic/OfficialContainer';
import MyIcon from '../../../components/PublicComponents/MyIcon';
import MyModal from "../../../components/MyPublic/OfficialModal"
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request';
import config from '../../../config';
import PublicService from '../../../services/PublicService';
import moment from 'moment';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './Countercharge.less';
// rsa加密
function doRSAEncrypt(key, input) {
    if (key == '') return input;
    var rsa = new RSAKey();
    rsa.setPublic(key, "10001");
    var res = rsa.encrypt(input);
    if (res == null) return input;
    return res;
}
// const showdetail = require(`../../../assets/images/report/1.png`);
const confirm = Modal.confirm;
const lock = require('../../../assets/lock.png')
// 反控页面
class Countercharge extends React.Component {
    // 初始状态
    state = {
        items: [
            {
                type: 'select',
                label: '项目名称:',
                placeholder: '请输入',
                paramName: "siteId",
                options: [
                    { text: '全部', value: '' }
                ],
                selectChange: (value) => {
                    let t = this;
                    // 获取设备编号
                    const options = [];
                    t.state.items[1].options = t.state.items[1].options.slice(0, 1)
                    request({ url: '/wl/chart/getDeviceList', method: 'GET', params: { siteId: value } })
                        .then((res) => {
                            // console.log(' 获取设备编号', res)
                            for (let i = 0; i < res.ret.length; i++) {
                                options.push({
                                    text: res.ret[i].deviceCode, value: String(res.ret[i].deviceId)
                                });
                            }
                            t.state.items[1].options.push(...options)
                            t.setState({
                                items: t.state.items,
                            })
                        })

                }
            },
            {
                type: 'select',
                label: '设备编号:',
                placeholder: '请输入 ..',
                paramName: "deviceId",
                options: [
                    { text: '全部', value: '' }
                ]
            },
        ],
        deviceId: null,
        siteId: null,
        listcolumns : [
            {
                dataIndex: 'siteName',
                title: '项目名称',

            },
            {
                dataIndex: 'deviceCode',
                title: '设备编号',

            },
            {
                dataIndex: 'deviceName',
                title: '设备名称',

            },
            {
                dataIndex: 'edits',
                title: '反控',
                render: function (text, data) {
                    console.log('data', data)
                    let obj = {
                        id: data.id,
                        picturePath: data.picturePath,
                        deviceId: data.deviceId,
                    }
                    return (
                        <Link to={{ pathname: "/counterchargeEdit", query: obj }}><Button>反控</Button></Link>
                    )
                }
                // render: function (text, data) {
                //     console.log('data', data)
                //     let obj = {
                //         id: data.id,
                //         picturePath: data.picturePath,
                //         deviceId: data.deviceId,
                //     }
                //     return (
                //         <Link to={{ pathname: "/flowChartManagementEdit", query: obj }}><Button>编辑</Button></Link>
                //     )
                // }
            },
        ],
        cityCode: '',
        factoryId: '',
        flowChartId: '',
        regex: '',
        myModalVisible: false,
        measurePointName: '',
        monitorTypeId: '',
        modalDisabled: false,
        factorTypeCode: '',
        monitorFactorName: '',
        title: '新增',
        current: 1,
        monitorTypeCode: '',
        type: '新增',
        imgUrl: '',
        showPicture: false,
        fileId: '',
        editData: {},
        uploadButton: true,
        isEdit: true,
        isOk: true,
        fileList: [],
        uploading: false,
        yeartime: '',
        beginTime: '',
        endTime: '',
    }
    // 编辑功能
    editClick = (record) => {
        let t = this;
        console.log('record', record)
        this.setState({
            myModalVisible: true,
            flowChartId: record.flowChartId,
        })
    }
    // 模态框取消
    onModalCancel = (record) => {
        this.setState({
            myModalVisible: false
        })
    }
    // 保存密码
    savePassword = () => {
        let t = this;
        //一级加密,重要  误删
        let key = `dd6be3d4de56287b8c3616b33bc1b7a5a2bb9148252140262420ee047f83b3165
        fb7674a759d60c24b71fd5437c7810f127f2c4370c2d4bdfcb55c08f1b3c715b7b2f57228e78
        e34039d2b967f54a58e345bc91e3dd54c7bea86d73c9e2de968736bf2b97f50bea891aa3519a
        e7238d76dff57cabba7cc0d370775657f3b5c83`
        let input = t.controlPW.refs.input.value;
        let raw1 = doRSAEncrypt(key, input);
        let data = {
            flowChartId: t.state.flowChartId,
            passwords: [raw1, '']
        }
        // let data = {
        //     flowChartId: t.state.flowChartId,
        //     passwords: [t.controlPW.refs.input.value, '']
        // }

        localStorage.setItem('data', JSON.stringify(data));
        request({ url: '/sk/reverse/getFirstButton', method: 'post', data })
            .then((res) => {
                console.log('res', res)
                if (res.rc === 0) {
                    t.props.history.push({ pathname: `/CounterchargeEdit?id=${t.state.flowChartId}` });
                }
            }).catch(err => {
                console.log('err', err)
                console.log('断网喽,请检查网络连接')
            });
    }

    // 模态框保存
    onModalSaveBtn = (params) => {
        let t = this;
        console.log(params)
        console.log('this.controlPW.refs.input.value', this.controlPW.refs.input.value)
        this.savePassword();
    }
    // 分页页面跳转
    PaginationSearch = (params) => {
        this.listDrawing(this.state.deviceId, this.state.siteId, params)
        this.setState({
            current: params,
        })
    }
    // 模糊搜索查询功能
    searchIncomeData = (params) => {
        this.listDrawing(params.deviceId, params.siteId,1)
        this.setState({
            deviceId: params.deviceId,
            siteId: params.siteId,
            current: 1,
        })
    }
   
    // 显示密码
    showPassword = () => {
        let a = this.controlPW;
        if (this.controlPW.refs.input.type === 'password') {
            this.controlPW.refs.input.type = 'text';
        } else if (this.controlPW.refs.input.type === 'text') {
            this.controlPW.refs.input.type = 'password';
        }
    }
    // 键盘回车事件
    enterPress = (e) => {
        let t = this;
        if (e.keyCode === 13) {
            t.savePassword();
        }
    }
    // 列表渲染事件
    listDrawing = (deviceId, siteId, pageNo) => {
        let fileObj = {
            deviceId: deviceId,
            siteId: siteId,
            pageNo: pageNo,
            pageSize: config.pageSize,
        }
        request({ url: '/wl/chart/getList', method: 'GET', params: fileObj })
            .then((res) => {
                console.log('设备反控查询', res)
                this.setState({
                    dataSource: res.ret.items,
                    total: res.ret.rowCount,
                })
            })

    }

    componentDidMount() {
        let t = this;
      

        this.listDrawing(this.state.deviceId, this.state.siteId, 1)
       
        // let data = {
        //     cityCode: '',
        //     factoryId: '',
        //     flowChartId: '',          
        //     regex:'',
        //     type:'1'
        // }
        // request({ url: '/sk/chart/getNavigationRevision', method: 'GET', params: data })
        //     .then((res) => {               
        //         for (let i = 0; i < t.state.items.length; i++) {
        //             if (t.state.items[i].paramName === 'cityCode') {
        //                 for (let j = 0; j < res.ret.length; j++) {
        //                     t.state.items[i].options.push({
        //                         text: res.ret[j].name, value: res.ret[j].code
        //                     });
        //                 }
        //             }
        //         }
        //         this.setState({
        //             items: this.state.items,
        //         })
        //     })

        // 获取项目
        const options = [];
        request({ url: '/wl/chart/getSiteList', method: 'GET' })
            .then((res) => {
                // console.log('获取项目', res)
                for (let i = 0; i < res.ret.length; i++) {
                    options.push({
                        text: res.ret[i].siteName, value: res.ret[i].siteId
                    });
                }
                t.state.items[0].options.push(...options)
                t.setState({
                    items: t.state.items,
                })
            })
    }
    render() {
        const fileList = [];
        console.log(this.state.myModalItems)
        return (
            <div>
                {/* <Crumbs routes={this.props.routes} className="crumbs-content" />``1243  q1 */}
                <Filtrate
                    items={this.state.items}
                    searchBtnShow={true}
                    submit={this.searchIncomeData}
                    className='countercharge-filtrate'
                >
                </Filtrate>
                <Container
                    headerShow={true}
                >
                    <MyTable
                        className="yk-page"
                        bordered
                        columns={this.state.listcolumns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 1366 }}
                    >
                    </MyTable>
                </Container>
                {
                    this.state.total > 0 &&
                    <div className="t-FAC t-MT10 wp-page  page-amazing">
                        <Pagination
                            size={10}
                            current={this.state.current}
                            showSizeChangerw
                            showQuickJumper
                            total={this.state.total}
                            onChange={this.PaginationSearch}
                            pageSize={config.pageSize}
                        />
                    </div>
                }
                {
                    this.state.myModalVisible &&
                    <Modal
                        className="Countercharge-modal"
                        width={538}
                        visible={this.state.myModalVisible}
                        onCancel={this.onModalCancel}
                        maskClosable={false}
                        footer={null}
                    >
                        <div>
                            <img src={lock} alt="" />
                            <p className="password">
                                请输入访问密码
                            </p>
                            <div className="eye-input">
                                <Input type="password" className="count-touch" ref={ref => this.controlPW = ref} onKeyDown={(e) => { this.enterPress(e) }} />
                                <MyIcon className="eye-style" style={{ fontSize: '20px', color: '#3996FF', cursor: 'pointer' }} type="icon-ai-eye" onClick={this.showPassword} />
                            </div>
                            <div onClick={this.onModalSaveBtn} className="save" >
                                解锁
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}
export default Countercharge;
