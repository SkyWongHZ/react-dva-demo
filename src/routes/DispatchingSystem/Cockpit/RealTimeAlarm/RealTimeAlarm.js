import React from 'react'
import  './RealTimeAlarm.less';
import Title from '../../../../components/IndexComponents/Title';
import request from '../../../../utils/request';
import moment from 'moment';
import CustomCarousel  from './CustomCarousel';

// 实时报警
const menuList = [{
  key: null,
  name: "全部",
  selected: true,
},{
  key: 1,
  name: "故障"
},{
  key: 2,
  name: "超标"
},{
  key: 3,
  name: "维养"
},{
  key: 4,
  name: "运行"
}]

class RealTimeAlarm extends React.Component {
  state = {
    menuList: null,
    dataList: null,
    startTime: null,
    endTime: null,
  }

  toggleList = (data, index, e) => {
    console.log('data', data)
    this.showDetail(this.state.startTime,this.state.endTime, 0,data.key)
  }
  // 时间初始化
  changeDate = (date) => {
    const currentDate = moment(date);
    currentDate.set({ 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0 });
    return currentDate;
  }

  showDetail = (startTime,endTime, state,type)=>{
    let obj = {
      startTime: startTime,
      endTime: endTime,
      pageNo: 1,
      pageSize: 5,
      siteId: null,
      state: state,
      type: type,     
    }
    request({ url: '/wl/overview/alarm/getAlarm', method: 'get', params: obj }).then(res => {
     /*  console.log('实时报警', res) */
      this.setState({
        menuList: res.ret.items
      })
    })
   
  }
  componentDidMount() {
    let startTime = this.changeDate(moment()).format('x');
    let endTime = this.changeDate(moment()).add(1, 'd').format('x')
    // let startTime = 1519833600000;
    // let endTime = 1522512000000;
   
    this.showDetail(startTime, endTime,0,null)
    this.setState({
      startTime: startTime,
      endTime: endTime
    })
  }

  // componentWillUnmount() {
  //   clearInterval(this.state.navTimes)
  //   clearInterval(this.state.navTimesOther)
  // }


  getDataList = (params) => {
    console.log('params', params)
    // this.showDetail()
  }

  //  //执行滚动
  //  scrollable = (data, timeType, scrollType) => {
  //   this.state[timeType] = setInterval(() => {
  //     let maxTop = data.length * 61;
  //     let nowTop = Math.abs(this.state[scrollType]) > maxTop ? 0 : this.state[scrollType] - 1;
  //     this.setState({
  //       [scrollType]: nowTop
  //     })
  //   }, 50)
  // }

  // stopScroll = (timeType) => {
  //   clearInterval(this.state[timeType])
  // }

  render() {
    return (
      <div className="boxBlockz">
        {menuList && <Title title="实时报警" list={menuList} more={true} menuClick={this.toggleList}/>}
        <div className="content-alarm">
          <ul className="realTimeList">
          {this.state.menuList&&<CustomCarousel autoplay={true}>
            {this.state.menuList.map((data, index) => {
              return (
                <li key={index}>
                  <img src={require("../../../../assets/images/water.png")} className="water" />
                  <div className="right-content">
                    <p><span className="alarm">{data.alarmType}</span>
                      <span className="time">{moment(data.time).format('YYYY-MM-DD HH:mm:ss')}</span>
                     {/*  <span className="time">{moment(data.timeString)}</span> */}
                    </p>
                    <p><span>【{data.siteName}】</span><span>{data.factorName}：</span><span className="rain">{data.value}{data.normal?data.normal:''}</span></p>
                  </div>
                  <img src={require("../../../../assets/images/bottom-border.png")} className="bottom-border" />
                </li>
              )
            })}
          </CustomCarousel>}
          </ul>
        </div>
      </div>
    )
  }
}

export default RealTimeAlarm
