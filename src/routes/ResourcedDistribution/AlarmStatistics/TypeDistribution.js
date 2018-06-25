import React from 'react'
import { connect } from 'dva';
import MyFiltrate from "../../../components/PublicComponents/alarmStatisticsFiltrate"
import MyPagination from "../../../components/PublicComponents/MyPagination";
import MyModal from "../../../components/PublicComponents/MyModal";
import MyTable from "../../../components/PublicComponents/MyTable";
import Container from "../../../components/PublicComponents/Container";
import { Row, Col, Icon, Tooltip, Layout } from 'antd';
import request from '../../../utils/request';
import moment from 'moment';
import './TypeDistribution.less';
import  AlarmTypeChart  from './AlarmTypeChart.js';
import  StandardTimeChart  from './StandardTimeChart.js';


class TypeDistribution extends React.Component {
    state = {
        nameAndValueDTOS: [],
        radarDTO: {},        
        items: [
            {
                type: 'rangePicker',
                label: '时间:',
                placeholder: '请输入',
                paramName: "time",
            },
            {
                type: 'select',
                label: '测点类型:',
                placeholder: '请输入',
                paramName: "monitorTypeId",
                options:[
                    {text:'全部',value:''}
                ],
            },
            {
                type: 'select',
                label: '项目区域 省:',
                placeholder: '请输入',
                paramName: "provinceCode",
                options:[
                    { text: '全部', value: '' }
                ],
                itemLayout: {
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 },
                  },
                selectChange: (provinceCode)=>{
                    let t=this;
                    // 获取市
                    request({ url: '/wl/alarm/getCity', method: 'GET', params: { provinceCode: provinceCode} })
                        .then((res) => {
                            console.log('获取市', res)
                            let items = t.state.items;
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].paramName === 'cityCode') {
                                    items[i].options.slice(0, 1)
                                    for (let j = 0; j < res.ret.length; j++) {
                                        items[i].options.push({
                                            text: res.ret[j].name, value: String(res.ret[j].value)
                                        })
                                    }
                                }
                            }
                            t.setState({
                                items: t.state.items,
                                provinceCode: provinceCode
                            })
                        })
                }
            },
            {
                type: 'select',
                label: '市:',
                placeholder: '请输入',
                paramName: "cityCode",
                options:[
                    { text: '全部', value: '' }
                ],
                selectChange: (cityCode) => {
                    let t = this;
                    // 获取区县
                    let  obj={
                        cityCode: cityCode,
                        provinceCode: t.state.provinceCode
                    }
                    request({ url: '/wl/alarm/getDistrict', method: 'GET', params:obj})
                        .then((res) => {
                            console.log('获取区县', res)
                            let items = t.state.items;
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].paramName === 'districtCode') {
                                    items[i].options.slice(0, 1)
                                    for (let j = 0; j < res.ret.length; j++) {
                                        items[i].options.push({
                                            text: res.ret[j].name, value: String(res.ret[j].value)
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
                label: '区县:',
                placeholder: '请输入',
                paramName: "districtCode",
                options:[
                    { text: '全部', value: '' }
                ],
            },
        ],
    }
    componentDidMount() {
        this.getData(this.filtrate.props.form.getFieldsValue());
        let t=this;
        // 获取测点类型
        request({ url: '/wl/alarm/getAllAlarmType', method: 'GET' })
            .then((res) => {
                let items = t.state.items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].paramName === 'monitorTypeId') {
                        items[i].options.slice(0,1)
                        for (let j = 0; j < res.ret.length; j++) {
                            items[i].options.push({
                                text: res.ret[j].name, value: String(res.ret[j].id)
                            })
                        }
                    }
                }
                t.setState({
                    items: t.state.items,
                })
            })

        // 获取省份
        request({ url: '/wl/alarm/getProvince', method: 'GET' })
            .then((res) => {
                let items = t.state.items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].paramName === 'provinceCode') {
                        items[i].options.slice(0, 1)
                        for (let j = 0; j < res.ret.length; j++) {
                            items[i].options.push({
                                text: res.ret[j].name, value: String(res.ret[j].value)
                            })
                        }
                    }
                }
                t.setState({
                    items: t.state.items,
                })
            })
            
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

    getData = (params) => {
        let startTime = this.changeDaytime(moment(params.time[0])).format('x')
        let endTime = this.changeEndDaytime(moment(params.time[1])).format('x')
        let Obj = {
            cityCode: params.cityCode,
            districtCode: params.districtCode,
            monitorTypeId: params.monitorTypeId,
            startTime: startTime,
            endTime: endTime,
        }
        request({ url:'/wl/alarm/getStatistics', method: 'GET', params: Obj })
        .then((res) => {
        //    console.log("REs",res.ret.items)
        //    if (res.rc !== 0) {
                this.setState({
                    nameAndValueDTOS: res.ret.nameAndValueDTOS,
                    radarDTO: res.ret.radarDTO,                    
                    // total:res.ret.rowCount,
                })
                // return false;
        //    }
        }).catch(err => {
            console.log('断网喽,请检查网络连接')
        });
      }

    searchIncomeData=(params)=>{
        console.log('params', params)
        // debugger
        let obj={
            cityCode: cityCode,
            districtCode: districtCode,
            monitorTypeId: monitorTypeId,
            provinceCode: provinceCode,
            startTime: params.time[0].format('x'),
            endTime: params.time[1].format('x'),
        }
        request({ url: '/wl/alarm/getStatistics', method: 'GET',params:obj })
            .then((res) => {
               console.log('查询接口',res)
            })
    }
    render() {
        
        return (
            <div className="alarmGraphic-container">
                <MyFiltrate
                    items={this.state.items}
                    searchBtnShow={true}
                    submit={this.getData}
                    wrappedComponentRef={ref => this.filtrate = ref}
                >
                </MyFiltrate>
                <div className="alarmGraphic-container-list">
                    <AlarmTypeChart
                    nameAndValueDTOS={this.state.nameAndValueDTOS}>
                    </AlarmTypeChart>
                </div>
                <div className="alarmGraphic-container-list">
                    <StandardTimeChart radarDTO={this.state.radarDTO}>

                    </StandardTimeChart>
                </div>
            </div>
        )
    }
}
export default TypeDistribution
