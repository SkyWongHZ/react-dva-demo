import React from 'react'
import './StatisticAnalysis.less';
import Title from '../../../../components/IndexComponents/Title';
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import request from '../../../../utils/request';
import { Carousel, Tabs  } from 'antd';
import IndexFiltrate from '../../../../components/PublicComponents/IndexFiltrate';
// import util from '../../utils/Util';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import moment from 'moment';

const TabPane = Tabs.TabPane;
class StatisticAnalysis extends React.Component {
    state = {
        chartData: null,
        filtrateItem : [{
            label: "项目名称",
            type: "select",
            paramName: "id",
           /*  options: [
                { text: "全部", value: "" }, 
                { text: "户县秦渡镇污水处理站建设项目", value: "1" }, 
                { text: "麻黄梁工业区污水处理站项目", value: "2" },
                { text: "洛川县凤栖镇谷咀村处理项目", value: "3" }, 
                { text: "西安秦岭朱雀太平国家森林旅游发展", value: "4" }
            ] */
            options:[
                { text: "全部", value: "" }, 
            ],
        }],
    }
    // 查询
    submitClick=(params)=>{
        this.chartList(params.id, this.props.type)
    }
    // tabs切换
    callback=(params)=> {
        // console.log('params', params)
        this.chartList('', params)
    }
    // 显示图表
    chartList = (id,type) => {
        //运行负荷
        let obj = {
            id: id,
            type:type,
        }
        request({ url: '/wl/overview/analysis/getAnalysis', method: 'get', params: obj }).then(res => { 
            this.setState({
                chartData: res.ret,
                // unit: res.ret.unit,
            });
        });
    }

    componentDidMount() {
        this.chartList('', this.props.type)
        /* 获取项目 */
        request({ url: '/wl/chart/getSiteList', method: 'get'}).then(res => { 
            res.ret&&res.ret.map(item=>{
                this.state.filtrateItem[0].options.push(
                    { text: item.siteName , value: item.siteId }, 
                )
            })
            this.setState({
                filtrateItem:this.state.filtrateItem
            })
        });
    }

    render() {
        let t = this;
        let chartsOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (obj) {
                    let unit = t.state.chartData&&t.state.chartData.name==='处理量'? ['m³', 'm³', '%',]:t.state.chartData.name==='吨水电耗'?['kwh/t', 'kwh/t', '%',]:['L/t', 'L/t', '%',],
                        arr = obj.map((data, index) => `<div>${data.seriesName} ${data.value} ${unit[index]}</div>`);
                    return arr.join("")
                }
            },
            // legend: {
            //   data: [{ name: '紧水滩水库水位' }, { name: '汛限水位' }],
            //   textStyle: {
            //     color: "#fff",
            //   },
            //   right: 70,
            // },
            xAxis: {
                // data: new Array(12).fill(true).map((data, index) => `${(index + 1)}月`),
                data: this.state.chartData && this.state.chartData.timeAndValueDTOList.map((data) => { return `${moment(data.time).format('M')}月`}),
               
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#B9C6D4"
                    },
                }
            },
            yAxis: [
                {
                    name: this.state.chartData && (this.state.chartData.name+this.state.chartData.unit) ,
                    nameTextStyle: {
                        color: '#fff'
                    },
                    type: 'value',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: "dashed"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                        },
                        formatter: function (value) {
                            console.log('value', value)
                            // return `${value}m`;
                            return `${value}`;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#56D6D8"
                        },
                    },
                    itemStyle: { normal: { label: { show: false, position: 'insideRight' }, color: '#F88296' } },
                    min: 0,
                    max: this.state.chartData &&  this.state.chartData.avgValue*1.5
                       
                    // max: 'dataMax',
                }
            ],
            series: [
                {
                    name: this.state.chartData && this.state.chartData.name,
                    type: 'bar',
                    data: this.state.chartData && this.state.chartData.timeAndValueDTOList.map(v => v.value),
                    // data: [184, 184.1, 184.2, 184, 183.5, 183.9, 183.8, 183.9, 183.6, 184.2, 184.1, 184.5],
                    symbolSize: 15,
                    yAxisIndex: 0,
                    lineStyle: {
                        normal: {
                            color: "#62DFD1"  //连线颜色
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#2ec7c9",
                            lineStyle: {
                                color: "#2ec7c9"
                            }
                        }
                    },
                }, {
                    name: this.state.chartData&&this.state.chartData.name==='处理量'?'设计值':'平均值',
                    type: 'line',
                    // his.state.chartData
                    data: new Array(12).fill(this.state.chartData && this.state.chartData.avgValue),
                    symbolSize: 0,
                    lineStyle: {
                        normal: {
                            color: "#F98D90"  //连线颜色
                        }
                    },
                }
            ]
        };
        return (
            <div className="StatisticAnalysis-container">
                <img className="StatisticAnalysis-leftBorder" src={require("../../../../assets/images/leftbar1.png")} />
                <img className="StatisticAnalysis-rightBorder" src={require("../../../../assets/images/rightbar.png")} />
                <div className="StatisticAnalysis-content">
                    <Tabs defaultActiveKey={String(this.props.type)} onChange={this.callback}>
                        <TabPane tab="运行负荷" key="1"></TabPane>
                        <TabPane tab="吨水电耗" key="2"></TabPane>
                        <TabPane tab="吨水药耗" key="3"></TabPane>
                    </Tabs>
                    <MyIcon type=" icon-guanbi " className="StatisticAnalysis-closeIcon" onClick={this.props.closeClick}/>
                    <IndexFiltrate
                        items={this.state.filtrateItem}
                        searchBtnShow={true}
                        submit={this.submitClick}                       
                    />
                    <div className="StatisticAnalysis-content">                      
                        <div>
                            {this.state.chartData&&<p style={{ color: "#45FFE7", fontSize: 14, textAlign: "center" }}>{this.state.chartData.title}</p>}
                            <Chart
                                echarts={echarts}
                                option={chartsOption}
                                notMerge
                                lazyUpdate
                                style={{ height: 641 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StatisticAnalysis
