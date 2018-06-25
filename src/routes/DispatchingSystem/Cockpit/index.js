import React from 'react'
import './index.less';
import SituationAwareness from './SituationAwareness/SituationAwareness';
import ProblemSolving from './ProblemSolving/ProblemSolving';
import ThematicMap from './ThematicMap/ThematicMap';
import CustomerNote from './CustomerNote/CustomerNote';
import VisitRecordMap from './VisitRecordMap/VisitRecordMap';
import MaintainRemindMap from './MaintainRemindMap/MaintainRemindMap';
import MaintenanceRecordMap from './MaintenanceRecordMap/MaintenanceRecordMap';
import ResourceChannel from './ResourceChannel/ResourceChannel';
import RealTimeAlarm from './RealTimeAlarm/RealTimeAlarm';
import TaskState from './TaskState/TaskState';
// import {Map} from 'react-amap';
import Map from './Map/Map';
import Time from './Time'
import RunRanking from './RunRanking/RunRanking';
import CustomerFile from './CustomerFile/CustomerFile';
import MonitorAlarm from './MonitorAlarm/MonitorAlarm';
import OverallRanking from './OverallRanking/OverallRanking';
import StatisticAnalysis from './StatisticAnalysis/StatisticAnalysis';
import TimeWeather from '../../../components/common/compound/TimeWeather'
import { connect } from 'dva';
import { hashHistory,Link } from 'dva/router'

@connect(({ cockpit, loading }) => ({
	cockpit,
	// submitting: loading.effects['login/login'],
}))

class Page extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			maxMap: 1,
			type: 1,
			location: '西安市',
		}
	}
	// setMapSize = () => {
	// 	this.setState((prevState) => {
	// 		return {
	// 			maxMap: !prevState.maxMap
	// 		}
	// 	})
	// }
	toggleWindow = () => {
		this.setState({

		})
	}
	chartDetailClick = (type) => {
		this.setState({
			maxMap: 2,
			type: type
		})
	}
	/**
     *  用户服务详情
     */
	userServiceDetailClick = (key) => {
		this.setState({
			maxMap: key
		})
	}
	// 統計分析關閉
	closeClick = () => {
		this.setState({
			maxMap: 1
		})
	}
	tableClick = (type) => {
		this.setState({
			maxMap: 4,
			type:type
		})
	}
	monitorAlarmClick = (equipmentList) => {
		this.setState({
			maxMap: 3,
			equipmentList: equipmentList,
		})
	}
	// 导航
	navigitionClick = () => {
		hashHistory.push({ pathname: 'monitoringSite' })

	}
	componentDidMount() {
		// window.sessionStorage.setItem("wrsToken", this.props.location.query.token);
	}
	render() {
		return (
			<div>
				{
					(this.state.maxMap === 1 || this.state.maxMap === 6 || this.state.maxMap === 7 || this.state.maxMap === 8 || this.state.maxMap === 9 || this.state.maxMap === 10 || this.state.maxMap ===11) && <div className={( this.state.maxMap === 6 || this.state.maxMap === 7 || this.state.maxMap === 8 || this.state.maxMap === 9 || this.state.maxMap === 10 || this.state.maxMap ===11 ) ? 'informationAcceptContainer blur-container' : 'informationAcceptContainer'}>
						<div className="header">
							<img src={require("../../../assets/images/title.png")} className="bigboy" />
							<ul className="headerList">
								<li>
									<i className="header-icon iconfont icon-fenping"></i>
									{/* <a href="http://183.129.170.220:8079/wl_web/#/monitoringType">
									<span>资源配置</span>
								</a> */}
									<span onClick={this.navigitionClick}>资源配置</span>
									<img src={require("../../../assets/images/gradient.png")} className="gradient" />
								</li>

								<li className="haveLine">
									<i className="header-icon icon-ordinaryvideo iconfont"></i>
									<Link to="/UserManagement"> <span>系统配置</span> </Link>
									<img src={require("../../../assets/images/line1.png")} className="split-line" />
									<img src={require("../../../assets/images/gradient.png")} className="gradient" />
								</li>

								{/* <li className="time-weather haveline">
								<TimeWeather 
									location={this.state.location}
								/>
								<img src={require("../../../assets/images/line1.png")} className="split-line" />
							</li> */}
								<TimeWeather
									location={this.state.location}
								/>
							</ul>
						</div>

						<div className="cockpitMap">
							<Map
								monitorAlarmClick={this.monitorAlarmClick}
							/>
						</div>
						<SituationAwareness />   
						<RealTimeAlarm />

						<div className="informationAcceptBottomBox">
							<OverallRanking
								tableClick={this.tableClick}
							/>
							<ProblemSolving
								chartDetailClick={this.chartDetailClick}
							/>
							<ResourceChannel
								userServiceDetailClick={this.userServiceDetailClick}
							/>
						</div>
					</div>
				}
				{	
					// 统计分析
					this.state.maxMap === 2 &&
					<StatisticAnalysis
						type={this.state.type}
						closeClick={this.closeClick}
					/>
				}
				{
					this.state.maxMap === 3 &&
					<MonitorAlarm
						closeClick={this.closeClick}
						equipmentList={this.state.equipmentList}
					/>
				}
				{
					// 运行排名
					this.state.maxMap === 4 &&
					<RunRanking	 
						closeClick={this.closeClick}
						type={this.state.type}
					/>
				}
				{
					this.state.maxMap === 11 &&
					<CustomerFile
						closeClick={this.closeClick}
					/>	
				}
				
				{
					this.state.maxMap === 6 &&
					<CustomerNote
						closeClick={this.closeClick}
					/>
				}
				{
					this.state.maxMap === 7 &&
					<MaintainRemindMap
						closeClick={this.closeClick}
					/>
				}

				{
					this.state.maxMap === 8 &&
					<ThematicMap
						closeClick={this.closeClick}
					/>
				}

				{
					this.state.maxMap === 9 &&
					<VisitRecordMap
						closeClick={this.closeClick}
					/>
				}

				{
					this.state.maxMap === 10 &&
					<MaintenanceRecordMap
						closeClick={this.closeClick}
					/>
				}

			</div>


		)
	}
}

export default Page
