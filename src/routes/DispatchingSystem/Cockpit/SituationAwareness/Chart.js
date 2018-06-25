import request from '../../../../utils/request';
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import moment from 'moment';

class ChartPage extends React.Component {
  state = {
    isDetail: true,
    allData: null,
  }

  setOption = () => {
    let chartsOption;
    if (this.state.allData) {
      chartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          show: false
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // data: this.state.allData.rainIntensityModels.map((data, index) => moment(data.time).format("hh:mm")),
            data: moment().format("HH") >= 8 && moment().format("HH") < 20 ? new Array(13).fill(true).map((data, index) => 8 + index) : new Array(13).fill(true).map((data, index) => index + 20 <= 24 ? index + 20 : index - 4),
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
            splitLine: {
              show: false
            },
          }
        ],
        series: [
          {
            name: '管网流速变化趋势',
            type: 'line',
            stack: '总量',
            data: this.state.allData.rainIntensityModels.map((data, index) => data.rainfall),
            smooth: true,
          }
        ],
        color: ["#29C4D5"]
      }
    }
    return chartsOption;
  }

  componentDidMount() {
    request({ url: "/rain/intensity/getRecentlyRainfallDatas", method: 'GET' }).then(res => {
      // console.log(res)
      this.setState({
        allData: res.ret
      })
    })
  }

  render() {
    return (
      <div className="detail-table">
        <p className="detail-table-back" onClick={this.props.cancelClick}><i className="iconfont icon-shouqi"></i>返回</p>
        <p className="detail-subtitle">降雨强度: {this.state.allData && this.state.allData.rainfallGrade}</p>
        {this.state.allData &&
          <Chart
            echarts={echarts}
            option={this.setOption()}
            notMerge
            lazyUpdate
            style={{ height: 260 }}
          />
        }
      </div>
    )
  }
}

export default ChartPage
