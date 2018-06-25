import React from 'react'
import './SituationAwareness.less';
import Title from '../../../../components/IndexComponents/Title';
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import request from '../../../../utils/request';

import DetailChart from './Chart';
import DetailTable from './Table';

// 态势感知
const chartsOption = {
	// tooltip: {
	// 	formatter: "{a} <br/>{b} : {c}"
	// },
	series: [
		{
			name: '业务指标',
			type: 'gauge',
			data: [{ value: 50, name: '完成率' }]
		}
	]
};

const dashBoardOption = [{
	name: "降雨强度",
	min: 0,
	max: 140,
	unit: "mm",
}, {
	name: "河湖水位",
	min: 0,
	max: 100,
	unit: "%",
}, {
	name: "闸站流量",
	min: 0,
	max: 10,
	unit: "m³/s",
}, {
	name: "取水量",
	min: 0,
	max: 150,
	unit: "%"
}, {
	name: "污水处理量",
	min: 0,
	max: 130,
	unit: "%"
}, {
	name: "管网负荷(雨)",
	min: 0,
	max: 100,
	unit: "%"
}, {
	name: "管网负荷(污)",
	min: 0,
	max: 100,
	unit: "%"
}, {
	name: "水质评价",
	min: 0,
	max: 100,
	unit: ""
}]

class SituationAwareness extends React.Component {
	state = {
		title: "态势感知",
		isDetail: false,
		type: "table",
		chartData: []
	}

	toggleDetail = (index, name, type) => {
		this.setState({
			isDetail: true,
			// type: "table",
			dataName: name,
			type: type,
			title: name
		})
	}

	cancelClick = () => {
		this.setState({
			isDetail: false,
			title: "态势感知"
		})
	}

	componentDidMount() {
		request({ url: '/wl/overview/dashboard/getAllDashboard', method: 'GET' }).then(res => {
			console.log('wwwwwww',res)
			this.setState({
				chartData: res.ret
			})
		})
	}

	render() {
		return (
			<div className="boxBlockv SituationAwarenessContainer">
				<Title title={this.state.title} />

				{!this.state.isDetail &&
					<div className="chart-list-container">
						{this.state.chartData.map((data, index) => {
							let dashBoardOptionData = dashBoardOption[index]
							const optionData = [
								{
									name: '',
									type: 'gauge',
									detail: { formatter: '{value}%' },
									pointer: { width: 3 },
									splitNumber: 2,
									radius: "100%",
									data: [{ value: parseInt(Math.random() * 100), name: '降雨等级' }],
									axisLine: {            // 坐标轴线
										lineStyle: {       // 属性lineStyle控制线条样式
											width: 3
										}
									},
									title: {
										show: true,
										offsetCenter: [0, '50px'],
										textStyle: {
											color: '#00D7EB',
											fontStyle: 'normal',
											fontWeight: 'normal',
											fontFamily: '微软雅黑',
											fontSize: 12
										}
									},
									splitLine: {
										show: false
									},
								
									axisTick: {           
										show:false,
									},
									axisLabel: {
										show: true,
										fontSize: 9,
										color: "#fff",
										distance: -25,
									},
									detail: {
										// formatter: '{value}' + dashBoardOptionData.unit, /* 单位 */
										//borderWidth: 1,
										//borderColor: "#00EAFF",
										padding: [2, 4],
										textStyle: {
											fontSize: 12,
											color: "#fff"
										},
										// formatter: function (param) {
										// 	var level = '';
										// 	if (param < 10) {
										// 		level = '较差'
										// 	} else if (param < 30) {
										// 		level = '中等'
										// 	} else if (param < 50) {
										// 		level = '良好'
										// 	} else if (param < 70) {
										// 		level = '优秀'
										// 	} else if (param <= 90) {
										// 		level = '极好'
										// 	} else {
										// 		level = '暂无';
										// 	}
										// 	return level;
										// },
									},
								}
							]
							let seriesData = Object.assign({}, optionData[0]);
							let obj = Object.assign({}, chartsOption);

							seriesData.data = [{ value: data.value, name: data.name }];
							seriesData.name = data.name;
							seriesData.min = data.low||0;
							seriesData.max = data.maxValue || 1;
							obj.series = seriesData;

							let avg = (seriesData.min + seriesData.max) / 2;
							// if (data.dialName == "水质评价") {
							// 	seriesData.detail.formatter = (e) => {
							// 		if(e >= 0 && e <= 0.2){
							// 			return "优"
							// 		}else if(e > 0.2 && e <= 0.4){
							// 			return "良"
							// 		}else if(e > 0.4 && e <= 0.6){
							// 			return "轻度污染"
							// 		}else if(e > 0.6 && e <= 0.8){
							// 			return "中度污染"
							// 		}else if(e > 0.8 && e <= 1){
							// 			return "重度污染"
							// 		}
							// 	}
							// }

						let type = data.dialName === "降雨强度" ? "chart" : "table";
							return (
								<div key={index} className="chart-list" onClick={e => this.toggleDetail(index, data.name, type)}>								
									<Chart
										echarts={echarts}
										option={obj}
										notMerge
										lazyUpdate
										style={{ height: 115, width: 110 }}
									/>
								</div>
							)
						})}

						
					</div>
				}

				{this.state.isDetail && this.state.type === "chart" &&
					<DetailChart cancelClick={this.cancelClick} />
				}

				{this.state.isDetail && this.state.type === "table" &&
					<DetailTable cancelClick={this.cancelClick} name={this.state.dataName} />
				}
			</div>
		)
	}
}

export default SituationAwareness
