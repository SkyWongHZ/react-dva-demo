import React from 'react'
import { connect } from 'dva';
import MyFiltrate from "../../../components/PublicComponents/MyFiltrate"
import MyPagination from "../../../components/PublicComponents/MyPagination";
import MyModal from "../../../components/PublicComponents/MyModal";
import MyTable from "../../../components/PublicComponents/MyTable";
import Container from "../../../components/MyPublic/OfficialContainer";
import { Row, Col, Icon, Tooltip, Layout } from 'antd';
import request from '../../../utils/request';
import moment from 'moment';
import MyIcon from '../../../components/PublicComponents/MyIcon';
import './AlarmGraphic.less';
import TitleBar from './TitleBar';
import echarts from 'echarts';
import Chart from 'echarts-for-react';


class AlarmTypeChart extends React.Component {
    state = {

    }

    // setOption = () => {
    //     let chartsOption;
    //     if (this.state.allData) {
    //         chartsOption = {
    //             tooltip: {
    //                 trigger: 'axis',
    //                 axisPointer: {
    //                     type: 'cross',
    //                     label: {
    //                         backgroundColor: '#6a7985'
    //                     }
    //                 }
    //             },
    //             legend: {
    //                 show: false
    //             },
    //             xAxis: [
    //                 {
    //                     type: 'category',
    //                     boundaryGap: false,
    //                     // data: this.state.allData.rainIntensityModels.map((data, index) => moment(data.time).format("hh:mm")),
    //                     data: moment().format("HH") >= 8 && moment().format("HH") < 20 ? new Array(13).fill(true).map((data, index) => 8 + index) : new Array(13).fill(true).map((data, index) => index + 20 <= 24 ? index + 20 : index - 4),
    //                     axisLabel: {
    //                         textStyle: {
    //                             color: '#fff',
    //                         },
    //                     },
    //                 }
    //             ],
    //             yAxis: [
    //                 {
    //                     type: 'value',
    //                     axisLabel: {
    //                         textStyle: {
    //                             color: '#fff',
    //                         },
    //                     },
    //                     splitLine: {
    //                         show: false
    //                     },
    //                 }
    //             ],
    //             series: [
    //                 {
    //                     name: '管网流速变化趋势',
    //                     type: 'line',
    //                     stack: '总量',
    //                     data: this.state.allData.rainIntensityModels.map((data, index) => data.rainfall),
    //                     smooth: true,
    //                 }
    //             ],
    //             color: ["#29C4D5"]
    //         }
    //     }
    //     return chartsOption;
    // }

    setOption =()=>{
        let chartsOption;
        let t = this;
        let valueData = [0,0,0,0];
        let echartData = t.props.nameAndValueDTOS || [];
        echartData.forEach((value,index) => {
            
        })
        chartsOption = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                right:'100',
                top:'50',
                data: [
                    {
                        name: `设备故障报警`,
                        // 强制设置图形为圆。
                        icon: 'rectangle ',
                        backgroundColor:'#71D96C',
                        // // 设置文本为红色
                        // textStyle: {
                        //     color: 'red',
                        // },
                        
                    },
                    {
                        name: '数据超标报警',
                        // 强制设置图形为圆。
                        icon: 'rectangle',
                        // 设置文本为红色
                        // textStyle: {
                        //     color: 'red'
                        // },
                    },
                    {
                        name: '维养提醒报警',
                        // 强制设置图形为圆。
                        icon: 'rectangle',
                        // 设置文本为红色
                        // textStyle: {
                        //     color: 'red'
                        // },
                    },
                    {
                        name: '运行异常报警',
                        // 强制设置图形为圆。
                        icon: 'rectangle',
                        // 设置文本为红色
                        // textStyle: {
                        //     color: 'red'
                        // },
                    }
                ]
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: function(params, ticket, callback) {
                                let total = 0;
                                let echartData = t.props.nameAndValueDTOS || [];
                                echartData.forEach((value,index) => {
                                    total += value.value; 
                                })
                                // console.log('params',params)
                                // var total = 0; //考生总数量
                                // var percent = 0; //考生占比
                                // echartData.forEach(function(value, index, array) {
                                //     total += value.value;
                                // });
                                // percent = ((params.value / total) * 100).toFixed(1);
                                // return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n{blue|' + percent + '%}';
                                return  total
                            },
                        },
                        // emphasis: {
                        //     show: true,
                        //     textStyle: {
                        //         fontSize: '15',
                        //         fontWeight: 'bold'
                        //     }
                        // }
                    },
                    itemStyle:{
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.5,
                            colorStops: [{
                                offset: 0, color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'blue' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: t.props.nameAndValueDTOS,
                    // [
                    //     {value:335, name:'设备故障报警'},
                    //     {value:310, name:'数据超标报警'},
                    //     {value:234, name:'维养提醒报警'},
                    //     {value:135, name:'运行异常报警'},
                    // ],
                }
            ],
            color:['#71D96C','#00B0F1','#FDBA5B','#FF6970'],
            title: {
                text:'报警总数(个)',
                left:'center',
                top:'45%',
                padding:[24,0],
                textStyle:{
                    color:'#777777',
                    fontSize:'12',
                    align:'center'
                }
            },
        };
        
        return chartsOption;
    };

    componentDidMount() {
        
        // this.setState(Obj)   
    }

    

    render() {

        return (
            <div>
                <Container headerShow={false}>
                    <TitleBar iconType={'icon-shuxingliebiaoxiangqing2'} showTitle={'报警类型分布'} />
                    <Chart
                        echarts={echarts}
                        option={this.setOption()}
                        notMerge
                        lazyUpdate
                        style={{ height: 260 }}
                    />
                </Container>
            </div>
        )
    }
}
export default AlarmTypeChart;