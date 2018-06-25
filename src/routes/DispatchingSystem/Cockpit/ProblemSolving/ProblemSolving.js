import React from 'react'
import './ProblemSolving.less';
import Title from '../../../../components/IndexComponents/Title';
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import request from '../../../../utils/request';
import { Carousel } from 'antd';
import moment from 'moment'
// import util from '../../utils/Util';

class ProblemSolving extends React.Component {
  state = {
    chartData: null,
    s:'x',
    carouselIndex: 0,
    showPage: false
  }  
  componentDidMount() {
    //运行负荷
    let obj={
      id:null,
      type:1
    }
    request({ url: '/wl/overview/analysis/getAnalysis', method: 'get' ,params:obj}).then(res => {
      this.setState({
        chartData: res.ret,
      });
    });

    //吨水电耗
    let obj2 = {
      id: null,
      type: 2
    }
    request({ url: '/wl/overview/analysis/getAnalysis', method: 'get', params: obj2 }).then(res => {
      this.setState({
        chartDataTwo: res.ret
      });
    });

    // 吨水药耗
    let obj3 = {
      id: null,
      type: 3
    }
    request({ url: '/wl/overview/analysis/getAnalysis', method: 'get', params: obj3 }).then(res => {
      this.setState({
        chartDataThree: res.ret
      });
    });
  }

  // chartDetailClick=()=>{
  //   this.props.maxMap=2;
  // }

  wupeng = (e) =>{
    console.log(e.target, 'type');
  }
  wupeng2 = (type) => {
    console.log(type, 'type');
  }
  wupeng3 = (type) => {
    console.log(type, 'type');
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
          let unit = ['m³', 'm³', '%',],
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
        data: this.state.chartData && this.state.chartData.timeAndValueDTOList && this.state.chartData.timeAndValueDTOList.map((data) => { return `${moment(data.time).format('M')}月`}),
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
          name: '处理量 (m³)',
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
              return value
            }
          },
          axisLine: {
            lineStyle: {
              color: "#56D6D8"
            },
          },
          itemStyle: { normal: { label: { show: false, position: 'insideRight' }, color: '#F88296' } },
          min: 0,
          max: 35000,
        }
      ],
      series: [
        {
          name: '处理量',
          type: 'bar',
          // data: this.state.chartData && this.state.chartData.timeAndValueDTOList.map((data) => (Math.random() + 183).toFixed()),
          data: this.state.chartData && this.state.chartData.timeAndValueDTOList,
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
          name: '设计值',
          type: 'line',
          // data: this.state.chartData && [this.state.chartData.avgValue],
          data: this.state.chartData && new Array(12).fill(this.state.chartData.avgValue) ,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: "#F98D90"  //连线颜色
            }
          },
        }
      ]
    };

    let chartsOption1 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (obj) {
          let unit = [' kwh/t', ' kwh/t', '%',],
          arr = obj.map((data, index) => `<div>${data.seriesName} ${data.value} ${unit[index]}</div>`);
          return arr.join("")
        }
      },
      // legend: {
      //   data: [{ name: '滩坑水库水位' }, { name: '汛限水位' }],
      //   textStyle: {
      //     color: "#fff",
      //   },
      //   right: 70,
      // },
      xAxis: {
        data: this.state.chartDataTwo && this.state.chartDataTwo.timeAndValueDTOList && this.state.chartDataTwo.timeAndValueDTOList.map((data) => { return `${moment(data.time).format('M')}月` }),
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
          name: '吨水电耗 (kwh/t)',
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
              return value
            }
          },
          axisLine: {
            lineStyle: {
              color: "#56D6D8"
            },
          },
          itemStyle: { normal: { label: { show: false, position: 'insideRight' }, color: '#F88296' } },
          min: 0,
          max: 1,
        }
      ],
      series: [
        {
          name: '吨水电耗',
          type: 'bar',
          data: this.state.chartDataTwo && this.state.chartDataTwo.timeAndValueDTOList,
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
          name: '平均值',
          type: 'line',
          // data: new Array(12).fill(160),
          data: this.state.chartDataTwo && new Array(12).fill(this.state.chartDataTwo.avgValue),
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: "#F98D90"  //连线颜色
            }
          },
        }
      ]
    };

    let chartsOption2 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (obj) {
          let unit = ['L/t', 'L/t', '%',],
            arr = obj.map((data, index) => `<div>${data.seriesName} ${data.value} ${unit[index]}</div>`);
          return arr.join("")
        }
      },
      // legend: {
      //   data: [{ name: '丽水测点水位' }, { name: '汛限水位' }],
      //   textStyle: {
      //     color: "#fff",
      //   },
      //   right: 70,
      // },
      xAxis: {
        data: this.state.chartDataThree && this.state.chartDataThree.timeAndValueDTOList && this.state.chartDataThree.timeAndValueDTOList.map((data) => { return `${moment(data.time).format('M')}月` }),
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
          name: '吨水药耗 (L/t)',
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
              return value;
            }
          },
          axisLine: {
            lineStyle: {
              color: "#56D6D8"
            },
          },
          itemStyle: { normal: { label: { show: false, position: 'insideRight' }, color: '#F88296' } },
          min: 0,
          max: 0.3,
        }
      ],
      series: [
        {
          name: '吨水药耗',
          type: 'bar',
          // data: this.state.chartDataThree && this.state.chartDataThree.timeAndValueDTOList.map((data) => (Math.random() + 47).toFixed(2)),
          data: this.state.chartDataThree && this.state.chartDataThree.timeAndValueDTOList,
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
          name: '平均值',
          type: 'line',
          data: this.state.chartDataThree && new Array(12).fill(this.state.chartDataThree.avgValue),
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
      <div className="boxBlockqq" style={{ width: 663 }}>
        <Title title="统计分析" size="large" />
        <Carousel autoplay>
          <div style={{ width: 570 }} onClick={() => { this.props.chartDetailClick('1')}} >
            <p style={{ color: "#45FFE7", fontSize: 14, textAlign: "center" }}>运行负荷统计</p>
            <Chart
              echarts={echarts}
              option={chartsOption}
              notMerge
              lazyUpdate
              style={{ height: 240 }}
            />
          </div>
          <div style={{ width: 570 }} onClick={() => {this.props.chartDetailClick('2')}}>
            <p style={{ color: "#45FFE7", fontSize: 14, textAlign: "center" }}>吨水电耗统计</p>
            <Chart
              echarts={echarts}
              option={chartsOption1}
              notMerge
              lazyUpdate
              style={{ height: 240 }}
            />
          </div>
          <div style={{ width: 570 }} onClick={() => this.props.chartDetailClick('3')}>
            <p style={{ color: "#45FFE7", fontSize: 14, textAlign: "center" }}>吨水药耗统计</p>
            <Chart
              echarts={echarts}
              option={chartsOption2}
              notMerge
              lazyUpdate
              style={{ height: 240, width: 710 }}
            />
          </div>
        </Carousel>
      </div>
    )
  }
}

export default ProblemSolving
