import React from 'react'
import request from '../../../../utils/request';
import './ObservationLine.less';
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import { Select } from 'antd';
const Option = Select.Option;

export default class ObservationLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  typeToggle = (value) => {
    this.props.dispatch({
      type: 'cockpit/save',
      payload: {
        selectLineOption: value
      }
    });
  }

  render() {
    const { cockpit } = this.props;
    let chartsOption = {};
    if (cockpit.Line) {
      let lineData = cockpit.Line[cockpit.selectLineOption];
      // let abscissa = lineData.abscissa?lineData.abscissa:[];
      // let time = abscissa.map((item, index) => {
      //   const timeStr = new Date(item);
      //   return `${timeStr.getHours()}:00`
      // })
      // let date = abscissa.map((item, index) => {
      //   const timeStr = new Date(item);
      //   return `${timeStr.getHours()}:00`
      // })

      chartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (obj) {
            let arr = obj.map((data, index) =>{
              const timeStr = new Date(parseInt(data.axisValue));
              return index ===0?`<div>${timeStr.getFullYear()}.${timeStr.getMonth()+1}.${timeStr.getDate()}</div><div>${data.seriesName} ${data.value} ${lineData.unit}</div>`:`<div>${data.seriesName} ${data.value} ${lineData.unit}</div>`
            } );
            return arr.join("")
          }
        },
        xAxis: {
          data: lineData&&lineData.abscissa,
          axisLabel: {
            textStyle: {
              color: '#fff',
            },
            formatter: function (value) {
              const timeStr = new Date(parseInt(value));
              return `${timeStr.getHours()}:00`
            }
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
            name: lineData&&lineData.name,
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
                return `${value}${lineData.unit}`;
              }
            },
            axisLine: {
              lineStyle: {
                color: "#56D6D8"
              },
            },
            itemStyle: { normal: { label: { show: false, position: 'insideRight' }, color: '#F88296' } },
          }
        ],
        series: [{
          name: lineData&&lineData.name,
          type: 'line',
          data: lineData&&lineData.ordinate,
          itemStyle: {
            normal: {
              color: '#07F8FF'
            }
          },
          symbolSize: 10,
          lineStyle: {
            normal: {
              color: "#07F8FF"  //连线颜色
            }
          },
        }, {
          name: '最大值',
          type: 'line',
          data: lineData&&lineData.maxValue,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: "#F98D90"  //连线颜色
            }
          },
        }
        ],
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 100,
          backgroundColor: '#29384a',
          borderColor: '#29384a',
          fillerColor: '#54d1f4',
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '60%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          height: '25',
        }],
      };
    }
    return (
      <div className="observationLine-container">
        <span className="observationLine-title"><i className="iconfont icon-shouqi"></i>
          <span>(24h)监测曲线</span>
        </span>
        <Select className="observationLine-customOption" defaultValue={'累积流量'} onChange={this.typeToggle}>
          {cockpit.Line && cockpit.Line.map((data, index) => <Option className='observationLine-li' key={index} value={index}>{data.name}</Option>)}
        </Select>
        <img src={require("../../../../assets/images/line-index.png")} className="observationLine-line" />
        <Chart
          echarts={echarts}
          option={chartsOption}
          notMerge
          lazyUpdate
          style={{ height: 350 }}
        />
      </div>
    )
  }
}