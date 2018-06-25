import React from 'react'
import request from '../../../../utils/request';
import './MonitorAlarm.less';
import BasicInformation from './BasicInformation';
import ProcessFlow from './ProcessFlow';
import CumulativeData from './CumulativeData';
import ObservationLine from './ObservationLine';
import { connect } from 'dva';
import MyIcon from '../../../../components/PublicComponents/MyIcon';

@connect(({ cockpit, loading }) => ({
  cockpit,
  // submitting: loading.effects['login/login'],
}))
class MonitorAlarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // console.log('this.props.equipmentList',this.props.equipmentList)
    this.toggleMenuType(0, this.props.equipmentList[0].deviceId,this.props.equipmentList[0].siteId);
  }

  toggleMenuType = (index, deviceId,id) => {
    this.props.dispatch({
      type: 'cockpit/getMonitorAlarmData',
      payload: {
        id: id,
        deviceId: deviceId,
        index: index
      }
    });
  }

  render() {
    const { cockpit } = this.props;
    return (
      <div className="monitorAlarm-container">
        <MyIcon type=" icon-guanbi " className="monitorAlarm-closeIcon" onClick={this.props.closeClick} />
        <img className="monitorAlarm-leftBorder" src={require("../../../../assets/images/leftbar2.png")} />
        <img className="monitorAlarm-rightBorder" src={require("../../../../assets/images/rightbar.png")} />
        <ul className="monitorAlarm-menuList">
          {this.props.equipmentList && this.props.equipmentList .map((data, index) => {
            return (
              <li className={cockpit.selectLineOption === index ? "active" : null} key={index} onClick={e => this.toggleMenuType(index,data.deviceId,data.siteId)}>
                {cockpit.selectLineOption === index && <i className="iconfont icon-jiantou" style={{fontSize:12,marginRight:5}}></i>}
                <span>设备{data.deviceCode}概况</span>
              </li>
          )
          })}
        </ul>
        <div className="monitorAlarm-content">
          <div className="monitorAlarm-block1 monitorAlarm-block">
            <BasicInformation {...this.props} />
          </div>
          <div className="monitorAlarm-block2 monitorAlarm-block">
            <ProcessFlow {...this.props} id={cockpit.deviceId || this.props.equipmentList[0].deviceId} />
          </div>
          <div className="monitorAlarm-block3 monitorAlarm-block">
            <CumulativeData {...this.props} />
          </div>
          <div className="monitorAlarm-block4 monitorAlarm-block">
            <ObservationLine {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

export default MonitorAlarm
