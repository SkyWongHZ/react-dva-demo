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
import './AlarmStatistics.less';
import AlarmGraphic from './AlarmGraphic'
import TypeDistribution from './TypeDistribution'

class AlarmStatistics extends React.Component {
	state={
		lastMonthData:[],
	}
	componentDidMount(){
		// 获取上月报警数据
		request({ url: '/wl/alarm/getPreviousMonthAlarm', method: 'get'}).then((res) => {
			console.log('获取上月报警数据', res)
			this.setState({
				lastMonthData:res.ret
			})
		})
	}
	render(){
		return(
			<div className="AlarmStatistics-container">
				<Container headerShow={false}>
					<AlarmGraphic
						lastMonthData={this.state.lastMonthData}
					/>
					<TypeDistribution />
				</Container>
			</div>
		)
	}
}
export default AlarmStatistics
