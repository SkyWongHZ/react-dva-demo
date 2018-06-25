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
import './MonitoringSite.less';
import PublicService from "../../../services/PublicService";
const confirm = Modal.confirm;
const handleImgPath=`http://192.168.1.197:8079/wl/file/downloadFile?pictureId=140`
// 监测点管理
class MonitoringSite extends React.Component {
    // 初始状态
    state = {
        items: [
            {
                type: 'input',
                label: '项目名称:',
                placeholder: '请输入',
                paramName: "siteName",
            },
        ],
        siteName:'',
        monitorPointName: '',
        factorTypeCode: '',
        monitorFactorName: '',
        monitorTypeId: '',
        myModalVisible: false,
        title: '新增',
        current: 1,
        monitorTypeCode: '',
        type: '新增',
        imgUrl: '',
        showPicture: false,
        fileId: '',
        editData: {},
        uploadButton: true,
        isEdit: false,
        scaleValue:null,
        //定义myModal数据
        myModalItems: [
            {
                title: '基本信息',
                sub: [
                    {
                        type: 'input',
                        label: '项目编号',
                        paramName: 'code',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入项目编号`
                        }],
                    },
                    {
                        type: 'input',
                        label: '项目名称',
                        paramName: 'siteName',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入项目名称`
                        }],
                    },
                    {
                        type: 'datePicker',
                        label: '投运时间',
                        paramName: 'useTime',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入投运时间`
                        }],
                    },
                    {
                        type: 'select',
                        label: '省',
                        paramName: 'province',
                        size: null,
                        options: [],
                        rules: [{
                            required: true,
                            message: `请输入省`
                        }],
                        selectOnChange:(value)=>{
                            let t=this;
                            request({ url: '/wl/overview/site/getCity', method: 'GET', params: { provinceName:value} })
                                .then((res) => {
                                    let items = t.state.myModalItems[0].sub;
                                    for (let i = 0; i < items.length; i++) {
                                            if (items[i].paramName === 'city') {
                                                items[i].options=[];
                                                for (let j = 0; j < res.ret.length; j++) {
                                                    items[i].options.push({
                                                        text: res.ret[j], value: res.ret[j]
                                                    })
                                                }
                                            }
                                    }
                                    t.setState({
                                        items: t.state.items,
                                    })
                                })
                        }
                    },
                    {
                        type: 'select',
                        label: '市',
                        paramName: 'city',
                        size: null,
                        options: [],
                        rules: [{
                            required: true,
                            message: `请输入市`
                        }],
                        selectOnChange: (value) => {
                            let t = this;
                            request({ url: '/wl/overview/site/getDistrict', method: 'GET', params: { cityName: value } })
                                .then((res) => {
                                    let items = t.state.myModalItems[0].sub;
                                    for (let i = 0; i < items.length; i++) {
                                        if (items[i].paramName === 'district') {
                                            items[i].options = [];
                                            for (let j = 0; j < res.ret.length; j++) {
                                                items[i].options.push({
                                                    text: res.ret[j], value: res.ret[j]
                                                })
                                            }
                                        }
                                    }
                                    t.setState({
                                        items: t.state.items,
                                    })
                                })
                        }
                    },
                    {
                        type: 'select',
                        label: '区县',
                        paramName: 'district',
                        size: null,
                        options: [],
                        rules: [{
                            required: true,
                            message: `请输入区县`
                        }],
                        selectOnChange: (value) => {
                            let t = this;
                            request({ url: '/wl/overview/site/getTown', method: 'GET', params: { districtName: value } })
                                .then((res) => {
                                    console.log('乡镇', res)
                                    let items = t.state.myModalItems[0].sub;
                                    for (let i = 0; i < items.length; i++) {
                                        if (items[i].paramName === 'town') {
                                            items[i].options = [];
                                            for (let j = 0; j < res.ret.length; j++) {
                                                items[i].options.push({
                                                    text: res.ret[j], value: res.ret[j]
                                                })
                                            }
                                        }
                                    }
                                    t.setState({
                                        items: t.state.items,
                                    })
                                })
                        }
                    },
                    {
                        type: 'select',
                        label: '乡镇',
                        paramName: 'town',
                        size: null,
                        options: [],
                        rules: [{
                            required: true,
                            message: `请输入乡镇`
                        }],
                    },
                    {
                        type: 'input',
                        label: '设计规模(m³/d)',
                        paramName: 'scale',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入设计规模`
                        }],
                    },
                    {
                        type: 'select',
                        label: '测点类型',
                        paramName: 'monitorTypeId',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入测点类型`
                        }],
                    },
                    {
                        type: 'datePicker',
                        label: '建造时间',
                        paramName: 'constructionTime',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入建造时间`
                        }],
                    },
                    {
                        type: 'input',
                        label: '负责人',
                        paramName: 'chargeMan',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入负责人`
                        }],
                    },
                    {
                        type: 'input',
                        label: '联系方式',
                        paramName: 'phone',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入联系方式`
                        }],
                    },
                    {
                        type: 'inputNumber',
                        label: '经度',
                        paramName: 'longitude',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入经度`
                        }],
                    },
                    {
                        type: 'inputNumber',
                        label: '纬度',
                        paramName: 'latitude',
                        size: null,
                        rules: [{
                            required: true,
                            message: `请输入纬度`
                        }],
                    },
                ],
            },
            {
                title:'全景图',
                custom:'全景图',
            }

        ],
        isOk: true,
        uploading: false,
        yeartime: '',
        beginTime: '',
        endTime: '',
        pointArr: [],
        current:1,
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
                request({ url: "/wl/overview/site//delete", method: 'POST', data: data }).then(res => {
                    console.log('删除成功',res)
                    t.drawListing(t.state.siteName,t.state.current);
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // 编辑功能
    editClick = (record) => {
        console.log('record', record)
        this.setState({
            modalTableValue: record.monitorTypeId
        })
        let t = this;
        this.setState({
            footerShow: true,
            modalDisabled: false,
            editData: record,
            myModalVisible: true,
            type: '编辑',
            imgUrl: '',
            showPicture: false,
            isEdit: true,
            recordId: record.id,
            marriedFlag: record.monitorTypeId, /* 区分新增和编辑的标志*/
            defaultScaleValue:record.scale,
        })
        // request({ url: '/monitor/factor/findMonitorTypes', method: 'GET', params: { monitorTypeId: record.monitorTypeId } })
        //     .then((res) => {
        //         t.setState({
        //             minidata: res.ret.items,
        //             minitotal: res.ret.rowCount,
        //         })
        //     }).catch(err => {
        //         console.log('err', err)
        //         console.log('断网喽,请检查网络连接')
        //     });
    }
    // 模态框取消
    onModalCancel = (record) => {
        this.setState({
            myModalVisible: false,
            minidata: null,
            modalTableValue: undefined
        })
    }
    // 查看功能
    checkClick = (record) => {
        let t = this;
        this.setState({
            myModalVisible: true,
            modalDisabled: true,
            editData: record,
            isEdit: true,
            footerShow: false,
            title: '查看基本信息',
            imgUrl: '',
            showPicture: false,
            recordId: record.id,
            marriedFlag: record.monitorTypeId, /* 区分新增和编辑的标志*/
        })
        // request({ url: '/monitor/factor/findMonitorTypes', method: 'GET', params: { monitorTypeId: record.monitorTypeId } })
        //     .then((res) => {
        //         t.setState({
        //             minidata: res.ret.items,
        //             minitotal: res.ret.rowCount,
        //         })
        //     }).catch(err => {
        //         console.log('err', err)
        //         console.log('断网喽,请检查网络连接')
        //     });
    }
    // 规模输入框保存
    scaleChange=(e)=>{
        this.setState({
            scaleValue: e.target.value
        })
    }
    // 模态框保存
    onModalSaveBtn = (params) => {
        console.log('params',params)
        debugger
        let t = this;
        let data = {
            chargeMan: params.chargeMan,
            city: params.city,
            code: params.code,
            constructionTime:moment(params.constructionTime).format('x'),
            district: params.district,

            latitude: params.latitude,
            longitude: params.longitude,
            monitorTypeId: params.monitorTypeId,
            pictureId: this.state.pictureId,
            phone: params.phone,

            province: params.province,
            scale: params.scale,
            siteName: params.siteName,
            town: params.town,
            useTime: moment(params.useTime).format('x')
        }      
        if (this.state.type === '编辑') {
            request({ url: '/wl/overview/site/saveOrUpdate', method: 'POST', data: { ...data, id: this.state.recordId } })
                .then((res) => {
                    console.log('编辑内容成功',res)
                    if (res.rc !== 0) {
                        this.setState({
                            myModalVisible: true
                        })
                        return false;
                    }
                    this.setState({
                        myModalVisible: false,
                        minidata: null,
                        modalTableValue: undefined
                    })
                    t.drawListing(t.state.siteName,t.state.current);
                }).catch(err => {
                    console.log('断网喽,请检查网络连接')
                });
        } else {
            request({ url: '/wl/overview/site/saveOrUpdate', method: 'POST', data: { ...data } })
                .then((res) => {
                    console.log('新增',res)
                    if (res.rc !== 0) {
                        this.setState({
                            myModalVisible: true
                        })
                        return false;
                    }
                    this.setState({
                        myModalVisible: false,
                        minidata: null,
                        modalTableValue: undefined
                    })
                    t.drawListing(t.state.siteName, t.state.current);
                })
        }
    }
    // 模态框表格下拉框
    modalSelectChange = (value, setState) => {
        request({ url: '/monitor/factor/findMonitorTypes', method: 'GET', params: { monitorTypeId: value } })
            .then((res) => {
                // console.log('表格下拉',res)
                this.setState({
                    minidata: res.ret.items,
                    minitotal: res.ret.rowCount,
                })
                const items = res.ret.items;
                items.forEach(item => item.monitorFactorId = undefined);
                setState(items);
            }).catch(err => {
                console.log('err', err)
                console.log('断网喽,请检查网络连接')
            });
        this.setState({
            modalTableValue: value
        })
    }
    // 分页页面跳转
    PaginationSearch = (params) => {
        let t = this;       
        t.drawListing(t.state.siteName, params);
        this.setState({
            current: params,
        })
    }
    // 模糊搜索查询功能
    searchIncomeData = (params) => {
        let t = this;
        t.drawListing(params.siteName, 1);
        this.setState({
            siteName: params.siteName,
            current: 1,
        })
    }
    // 新增
    addBtn = () => {
        this.setState({
            modalDisabled: false,
            myModalVisible: true,
            reimportUpload: false,
            type: '新增',
            showPicture: false,
            imgUrl: '',
            isEdit: false,
            marriedFlag: '',
            footerShow:true,
            addShow:true,
        })
        // request({ url: '/monitor/factor/findMonitorTypes', method: 'GET', params: { monitorTypeId: this.state.transferId } })
        //     .then((res) => {
        //         console.log('尼玛的', res)
        //         console.log('res.ret.items', res.ret.items)
        //         this.setState({
        //             minidata: res.ret.items,
        //             minitotal: res.ret.rowCount,
        //         })
        //     }).catch(err => {
        //         console.log('err', err)
        //         console.log('断网喽,请检查网络连接')
        //     });
    }
    //tabel 选择事件
    onSelectChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    // 表格列表渲染事件
    drawListing = (siteName,pageIndex) => {
        let fileObj = {
            siteName: siteName,
            pageIndex: pageIndex,
            pageSize: config.pageSize,
        }
        request({ url: '/wl/overview/site/selectAll', method: 'GET', params: fileObj })
            .then((res) => {
                this.setState({
                   /*  data: res.items, */
                    data:PublicService.transformArrayData(res.items, true, false, this.state.current, config.pageSize),
                    total: res.rowCount,
                })
            })
    }
     //手动上传
    handleUpload = (value) => {
        console.log('value',value)
        let t = this;
        const formData = new FormData();
        formData.append('file', this.state.file);
        
        var headers = new Headers({
          'Accept': '*/*',
          "Content-Type": "multipart/form-data",
        });
        request({ url: '/wl/overview/site/upload', method: 'POST', form: formData, headers })
          .then(res => {
            console.log('手动上传成功',res)
            if(res.rc===0){
              this.setState({
                pictureId:res.ret.id,
                handleImgPath:res.ret.path,
              })
            }
          })
    
    }
    componentDidMount() {
        let t = this;
        const listcolumns = [
            {
                'title': '序号',
                'dataIndex': 'num',
             /*    render: (data, text, index) => {return index+1} */
            },
            {
                'title': '项目编号',
                'dataIndex': 'code',
            },
            {
                'title': '项目名称',
                'dataIndex': 'siteName'
            },
            {
                'title': '项目区域',
                'dataIndex': 'siteAddress',
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
                'title': '建造时间',
                'dataIndex': 'constructionTime',
                render:(text,record,index)=>{ return text?moment(text).format("YYYY-MM-DD"):'--'}
            },
            {
                'title': '投运时间',
                'dataIndex': 'useTime',
                render:(text,record,index)=>{ return text?moment(text).format("YYYY-MM-DD"):'--'}
            },
            {
                'title': '负责人',
                'dataIndex': 'chargeMan',
            },
            {
                'title': '联系方式',
                'dataIndex': 'phone',
            },
            {
                'title': '操作', 'dataIndex': 'operate', render: (text, record, index) => {
                    return (
                        <span>
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#3996FF' }} type="icon-xiugai2" onClick={this.editClick.bind(this, record, '编辑')} />|
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '16px', color: '#3996FF' }} type="icon-chakan" onClick={this.checkClick.bind(this, record)} />
                        </span>
                    )
                }
            },
        ];
        this.drawListing(this.state.siteName, 1);

        // request({ url: '/monitor/type/findMonitorTypes', method: 'GET', params: {} })
        //     .then((res) => {
        //         for (let i = 0; i < res.ret.items.length; i++) {
        //             t.state.items[1].options.push({
        //                 text: res.ret.items[i].monitorTypeName, value: String(res.ret.items[i].id)
        //             });
        //             t.state.pointArr.push({
        //                 text: res.ret.items[i].monitorTypeName, value: String(res.ret.items[i].id)
        //             })
        //         }
        //         t.setState({
        //             items: t.state.items,
        //             transferId: res.ret.items[0].id,
        //         })
        //     })


        request({ url: '/wl/overview/site/getProvince', method: 'GET'})
            .then((res) => {
                let items = t.state.myModalItems[0].sub;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].paramName === 'province') {
                        items[i].options = [];
                        for (let j = 0; j < res.ret.length; j++) {
                            items[i].options.push({
                                text: res.ret[j], value: res.ret[j]
                            })
                        }
                    }
                }
                t.setState({
                    items: t.state.items,
                })
            })
        
        request({ url: '/wl/overview/site/selectMonitor', method: 'GET'})
            .then((res) => {
                let items = t.state.myModalItems[0].sub;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].paramName === 'monitorTypeId') {
                        items[i].options = [];
                        for (let j = 0; j < res.ret.length; j++) {
                            items[i].options.push({
                                text: res.ret[j].typeName, value: String(res.ret[j].id)
                            })
                        }
                    }
                }
                t.setState({
                    items: t.state.items,
                })
            })
        this.setState({
            dataList: listcolumns,
        })
    }
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const imgProps = {
            name: 'file',
            action: '/wl/overview/site/upload',
            data: (file) => {
              return{
                file: file,
              }
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
            beforeUpload: (file, fileList) => {
              this.setState({
                file: file,
                isOk: true,
              })
              return false
            },
        }; 
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
                            size={10}
                            current={this.state.current}
                            showSizeChangerw
                            showQuickJumper
                            total={this.state.total}
                            onChange={this.PaginationSearch}
                        />
                    }
                </div>
                {this.state.myModalVisible &&
                    <MonitoringSiteModal
                        className="monitoringSite-modal"
                        title={this.state.title}
                        modalItems={this.state.myModalItems}
                        visible={this.state.myModalVisible}
                        onModalCancel={this.onModalCancel}
                        footerShow={this.state.footerShow}
                        modalSaveBtn={this.onModalSaveBtn}
                        formItemLayout={{ labelCol: { span: 10 }, wrapperCol: { span: 14 } }}
                        inputSize={12}
                        defaultData={this.state.isEdit ? this.state.editData : null}
                        ref={ref => this.init = ref}
                        modalDisabled={{ disabled: this.state.modalDisabled }}
                        selectDisabled={this.state.modalDisabled}
                        width={644}
                        handleUpload={this.handleUpload}
                        imgProps={imgProps}
                        handleImgPath={this.state.handleImgPath}
                      /*   handleImgPath={handleImgPath} */
                    >
                    </MonitoringSiteModal>
                }
            </div>
        )
    }
}
export default Form.create()(MonitoringSite);
