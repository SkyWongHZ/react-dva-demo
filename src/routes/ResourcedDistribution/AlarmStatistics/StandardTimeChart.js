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


class StandardTimeChart extends React.Component {
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
        let echartsData = this.props.radarDTO.nameAndValuesDTOS || [];  
        echartsData = echartsData.map((nameAndValuesDTO,index) => {
            nameAndValuesDTO.value = nameAndValuesDTO.count;
            return nameAndValuesDTO
        })      
        chartsOption = {
            // title: {
            //     text: '基础雷达图'
            // },
            tooltip: {},
            legend: {
                orient: 'vertical',
                right:'100',
                top:'50',
                data: ['设备故障报警', '设备超标报警', '维养提醒报警', '运行异常报警']
            },
            radar: {
                // shape: 'circle',
                indicator: [
                   { name: '00:00-04:00', max: 6500},
                   { name: '04:00-08:00', max: 30000},
                   { name: '08:00-12:00', max: 38000},
                   { name: '12:00-16:00', max: 52000},
                   { name: '16:00-20:00', max: 25000},
                   { name: '20:00-24:00', max: 25000},
                //    { name: 'c++', max: 25000},
                //    { name: 'react', max: 25000},
                //    { name: 'vue', max: 25000},
                //    { name: 'angular', max: 26000}
                ]
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                // areaStyle: {normal: {}},
                data : 
                echartsData
                // [
                //     {
                //         value : [4300, 10000, 28000, 35000, 20000, 19000, 19000, 19000, 19000, 19000],
                //         name : '设备故障报警'
                //     },
                //      {
                //         value : [5000, 14000, 28000, 31000, 22000, 21000, 19000, 19000, 19000, 19000],
                //         name : '设备超标报警'
                //     },
                //      {
                //         value : [3000, 4000, 2800, 3100, 4200, 2100, 19000, 19000, 19000, 19000],
                //         name : '维养提醒报警'
                //     },
                //      {
                //         value : [1000, 13000, 21000, 22000, 22000, 21000, 19000, 19000, 19000, 19000],
                //         name : '运行异常报警'
                //     },
                //      {
                //         value : [5000, 11000, 18000, 11000, 12000, 21000, 19000, 19000, 19000, 19000],
                //         name : '平均'
                //     }
                // ]
            }],
            color:['#71D96C','#00B0F1','#FDBA5B','#FF6970'],
        };
        return chartsOption;
    };

    componentDidMount() {

    }
    render() {
        return (
            <div>
                <Container headerShow={false}>
                    <TitleBar iconType={'icon-shuxingliebiaoxiangqing2'} showTitle={'超标时段统计'} />
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
export default StandardTimeChart;