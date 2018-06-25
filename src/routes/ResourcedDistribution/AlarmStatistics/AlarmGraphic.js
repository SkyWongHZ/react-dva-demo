import React from 'react'
import { connect } from 'dva';
import MyFiltrate from "../../../components/PublicComponents/MyFiltrate"
import MyPagination from "../../../components/PublicComponents/MyPagination";
import MyModal from "../../../components/PublicComponents/MyModal";
import MyTable from "../../../components/PublicComponents/MyTable";
import Container from "../../../components/PublicComponents/Container";
import { Row, Col, Icon, Tooltip, Layout } from 'antd';
import request from '../../../utils/request';
import moment from 'moment';
import MyIcon from '../../../components/PublicComponents/MyIcon';
import './AlarmGraphic.less';
import TitleBar from './TitleBar';

const img1 = require('../../../assets/images/show1.png')
const img2 = require('../../../assets/images/show2.png')
const img3 = require('../../../assets/images/show3.png')
const img4 = require('../../../assets/images/show4.png')
const img5 = require('../../../assets/images/show5.png')
const img = '../../../assets/images/show'
const png='.png'
const  pictureImg=[
    {'name':'本月报警总数',path:1},
    {'name':'本月设备故障报警总数',path:3},
    {'name':'本月数据超标报警总数',path:4},
    {'name':'本月运行异常报警总数',path:2},
    {'name':'本月维养提醒报警总数',path:5},
   
]
class AlarmGraphic extends React.Component {
    state = {
       
    }
    componentDidMount() {

    }
    render() {
        for(let i=0;i<this.props.lastMonthData.length;i++){
            for(let j=0;j<pictureImg.length;j++){
                if(this.props.lastMonthData[i].name===pictureImg[j].name){
                    this.props.lastMonthData[i].path=pictureImg[j].path
                }
            }
        }
        return (
            <div className="alarmGraphic-container">
                <TitleBar iconType={'icon-shuxingliebiaoxiangqing2'} showTitle={'7月报警统计'} />
                <ul className="alarmGraphic-list">
                    {
                        this.props.lastMonthData && this.props.lastMonthData.map((item, index) => {
                            return (
                                    <li className="last-month">
                                        {/* <img src={require(`../../../assets/images/show${index+1}.png`)} alt="" /> */}
                                        <img src={require(`../../../assets/images/show${item.path}.png`)} alt="" />
                                        <div className="alarmGraphic-show">
                                            <p className="first-show">{item.name}</p>
                                            <p  className="second-show">{item.count}</p>
                                            <p  className="three-show">{item.percent} <span>环比上月</span></p>
                                        </div>
                                    </li>
                                
                            )

                        })
                    }
                </ul>
            </div>
        )
    }
}
export default AlarmGraphic
