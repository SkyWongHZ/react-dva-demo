import React from 'react'
import { connect } from 'dva';
import { Button, Pagination, Icon,Modal} from 'antd';
import MyFiltrate from "../../../components/PublicComponents/MyFiltrate"
import MyPagination from "../../../components/PublicComponents/MyPagination";
import MyModal from "../../../components/PublicComponents/MyModal";
import MyTable from "../../../components/PublicComponents/MyTable";
import Container from "../../../components/MyPublic/OfficialContainer";
import MyIcon from '../../../components/PublicComponents/MyIcon';
import config from '../../../config';
import styles from './AlarmInformation.less';
import request from '../../../utils/request';
import moment from 'moment';
import Crumbs from '../../../components/PublicComponents/Crumbs';

const confirm = Modal.confirm;
function onChange(pageNumber) {
    console.log('Page: ', pageNumber);

}
const extraBtn=[
    { name: '批量解除', funName:'batchRelieve',style:{'padding-right':'15px'}}
]
class AlarmInformationNew extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    'title': '报警时间',
                    'dataIndex': 'alarmTime',                
                }, {
                    'title': '报警类型',
                    'dataIndex': 'alarmType',
                }, {
                    'title': '项目名称',
                    'dataIndex': 'alarmSite',
                }, {
                    'title': '报警概要',
                    'dataIndex': 'alarmMessage',
                }, {
                    'title': '事件状态',
                    'dataIndex': 'states',
                    render: (text, record, index) => {
                        if(text==='未处理'){
                            return <div style={{color:'red'}}>{text}</div>
                        }else{
                            return <div>{text}</div>
                        }
                    }
                }, {
                    'title': '操作',
                    'dataIndex': 'corporation',
                    render: (text, record, index) => {
                        if(record.states==='未处理'){
                            return (
                                <div>
                                    <Button type="primary" onClick={this.deleteBtn.bind(this, record)} >解除 </Button >
                                </div>
                            )
                        }else{
                            return(
                                <div>--</div>
                            )
                        }
                        
                    }
                }],
            maxMap: true,
          /*   dataList: [], */
            dataList:[
                {
                    alarmTime:11111111,
                    alarmType:'报警类型',
                    alarmSite:'项目名称',
                    alarmMessage:'报警概要'
                }
            ],
            oneList: [],
            twoList: [],
            threeList: [],
            pageIndex: 1,
            pageSize: 10,
            total: 10,
            alarmMessage: '',
            endTime: '',
            startTime: '',
            alarmType: '',
            alarmTime: '',
            alarmSite: '',
            state: '',
            alarmTypeId: '',
            siteCode: '',
            id: 7,

        }
    }

   /*  deleteBtn = (record) => {       
        let t = this;
        if(record.states==='未处理'){
            request({ url: '/wl/overview/alarmMessage/updateSateById', method: 'GET', params: { id: record.id } })
                .then((res) => {
                    console.log('解绑成功',res)
                    t.listDrawing(t.state.alarmTypeId, t.state.siteCode, t.state.state, t.state.startTime, t.state.endTime, t.state.current)
                })
        }
    } */

    //tabel 选择事件
    /* onSelectChange = (ids) => {
        console.log('ids changed: ', ids);
        this.setState({ ids });
    }
 */
   /*  toggleWindow = () => {
        this.setState({

        })
    }
 */
    //多选移除按钮
   /*  oneBtn = () => {
        let t = this;
        if (!t.state.ids.length) return false;
        confirm({
            title: '提示',
            content: '是否移除当前所选选项',
            // className: "yk-flowChartCancel-confirm",
            onOk() {
                request({ url: "/wl/overview/alarmMessage/updateSate", method: 'GET', params: { ids: t.state.ids } })
                    .then(res => {
                        t.listDrawing(t.state.alarmTypeId, t.state.siteCode, t.state.state, t.state.startTime, t.state.endTime)
                        // t.gainType();
                    })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    } */

    // 分页页面跳转
    PaginationSearch = (params) => {
        /* this.listDrawing(this.state.alarmTypeId, this.state.siteCode, this.state.state, this.state.startTime, this.state.endTime, params)
        this.setState({
            current: params,
        }) */
        alert('分页')
    }
    // 初始化时间 天
    /* changeDaytime = (date) => {
        const currentDate = moment(date);
        currentDate.set({ 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0 });
        return currentDate;
    } */
    /* changeEndDaytime = (date) => {
        const currentDate = moment(date);
        currentDate.set({ 'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 59 });
        return currentDate;
    } */
    // 模糊搜索查询功能
    searchIncomeData = (params) => {
        this.props.dispatch({
            type: 'alarmInformationNew/save',
            payload:{
                alarmTypeId: null,
                siteCode: null,
                state: null,
                startTime: null,
                endTime: null,
                pageIndex: 1,
                pageSize: 5
            }
          });
       /*  let startTime = this.changeDaytime(moment(params.year[0])).format('x')
        let endTime = this.changeEndDaytime(moment(params.year[1])).format('x')
        this.listDrawing(params.alarmTypeId, params.siteCode, params.state, startTime, endTime, 1)
        this.setState({
            alarmTypeId: params.alarmTypeId,
            siteCode: params.siteCode,
            state: params.state,
            startTime: params.year ? startTime : '',
            endTime: params.year ? endTime : '',
            current: 1,
        }) */
        /* alert('search') */
    }

    //表格渲染
   /*  listDrawing = (alarmTypeId, siteCode, state, startTime, endTime, pageIndex) => {
        let obj = {
            alarmTypeId: alarmTypeId,
            siteCode: siteCode,
            state: state,
            startTime: startTime,
            endTime: endTime,
            pageIndex: pageIndex,
            pageSize: config.pageSize,

        };
        request({ url: '/wl/overview/alarmMessage/selectAlarmMessage', method: 'GET', params: obj })
            .then((res) => {
                this.setState({
                    dataList: res.ret.items,
                    total: res.ret.rowCount,
                })
            })
    } */

    componentDidMount() {
       /*  //获得事件状态下拉列表
        request({ url: '/wl/overview/alarmMessage/selectAllState', method: 'GET' })
            .then((res) => {
                this.setState({
                    oneList: res.ret
                })
            })
        // 获得所有项目名称列表 
        request({ url: '/wl/overview/appuserservice/selectAllSiteName', method: 'GET' })
            .then((res) => {
                this.setState({
                    twoList: res.ret
                })
            })
        // 获得报警类型下拉列表
        request({ url: '/wl/overview/alarmMessage/alarmTypeName', method: 'GET' })
            .then((res) => {
                this.setState({
                    threeList: res.ret
                })
            })
        this.listDrawing('', '', '', '','', 1);
        this.setState({
            current: 1,
        }) */
    }
    
    //删除按钮dd
    batchRelieve = () => {
       /*  let t = this;
        if (!t.state.selectedRowKeys.length) return false;
        confirm({
            title: '提示',
            content: '是否要批量删除当前选项',
            className: "yk-flowChartCancel-confirm",
            onOk() {
                let data = t.state.selectedRowKeys;
                request({ url: "/wl/overview/alarmMessage/updateSate", method: 'POST', data }).then(res => {
                    t.listDrawing(t.state.alarmTypeId, t.state.siteCode, t.state.state, t.state.startTime, t.state.endTime, t.state.current)
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        }); */
        alert('批量删除')
    }
    //tabel 选择事件
    /* onSelectChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    } */

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        //console.log(this.state.dataList)
        /* let oneData = [{ text: '全部', value: '' }];
        this.state.oneList.map((item) => {
            oneData.push({ text: item.stateName, value: item.code })
        })
        let twoData = [{ text: '全部', value: '' }];
        this.state.twoList.map((item) => {
            twoData.push({ text: item.name, value: item.code })
        })
        let threeData = [{ text: '全部', value: '' }];
        this.state.threeList.map((item) => {
            threeData.push({ text: item.alarmTypeName, value: item.id })
        })
 */
        const itemsFiltrate = [
            {
                type: 'rangePicker',
                label: '时间:',
                placeholder: '请输入',
                paramName: "year",
            }, {
                type: 'select',
                label: '报警类型:',
                placeholder: '请输入',
                paramName: "alarmTypeId",
              /*   options: threeData, */
                options:[],
            },
            {
                type: 'select',
                label: '项目名称:',
                placeholder: '请输入',
                paramName: "siteCode",
               /*  options: twoData, */
                options:[],
            },
            {
                type: 'select',
                label: '事件状态:',
                placeholder: '请输入',
                paramName: "state",
               /*  options: oneData, */
                options:[]
            }
        ];
        return (
            <div className="alarmInformation-content">
              {/*   <Crumbs routes={this.props.routes} className="crumbs-content" /> */}
                <MyFiltrate
                    ref={ref => this.filtrate = ref}
                    items={itemsFiltrate}                 
                    clearBtnShow={false}
                    searchBtnShow={true}
                    submit={this.searchIncomeData}
                    iconType={true}
                    extraBtn={extraBtn}
                    batchRelieve={this.batchRelieve}
                >
                </MyFiltrate>

                <Container
                    headerShow={false}
                >
                    <MyTable
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.dataList}
                        rowSelection={rowSelection}
                        pagination={false}
                        rowKey="flowChartId"
                        scroll={{ x: 1366 }}
                        rowKey="ids"
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
                <div>{this.props.price}</div>
            </div>
        )
    }

}
const mapStateToProps = ({ alarmInformationNew }) => {
    console.log(alarmInformationNew)
    return alarmInformationNew
}
export default connect(mapStateToProps)(AlarmInformationNew);

