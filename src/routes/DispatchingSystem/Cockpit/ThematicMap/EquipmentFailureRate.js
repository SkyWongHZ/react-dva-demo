import React from 'react'
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import request from '../../../../utils/request';

class EquipmentFailureRate extends React.Component {
    state = {
      seriesData:[],
      maxFaultCount:null
    }

    // 获取设备故障率
    getFault = () => {
      request({ url: '/wl/service/theme/getFault', method: 'get'}).then(res => {        
          const resData=res.ret
          const colorList=['#EFAA4E','#00FFBC','#29BBFF','#A06CFF','#ef874e', '#9eef4e', '#ef744e', '#1595bf']
          let maxFaultCount=0
          const seriesData = resData&&resData.map((item, index) => {
            const { value, faultCount,name} = item;
            if(Number(faultCount)>maxFaultCount){
              maxFaultCount=faultCount
            }
            return{
              name:name,
              type: 'scatter',
              data:[[value*100,faultCount]],
              itemStyle:{
                color:colorList[index%colorList.length]
              }
            }  
          })
          this.setState({seriesData:seriesData})
          this.setState({maxFaultCount:maxFaultCount})
      });
    }

    componentDidMount() {
      this.getFault()
    }

    render() {
      

        //echarts option
        let failureRateChartOption={
          grid: {
              x: '10%',
              x2: '15%',
              y: '15%',
              y2: '10%'
          },
          tooltip: {
              padding: 10,
              backgroundColor: '#222',
              borderColor: '#777',
              borderWidth: 1
          },
          visualMap: [{
            dimension: 1,
            min: 0,
            max: this.state.maxFaultCount,
            show:false,
            inRange: {
                symbolSize: [10, 50]
            } 
          }],
          xAxis: {
              type: 'value',
              name: '故障率(%)',
              nameTextStyle: {
                  color: '#fff',
                  fontSize: 14
              },
              splitLine: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      color: '#43AAB0'
                  }
              },
              axisLabel:{
                  color:'#FEFEFE',
                  
              }
          },
          yAxis: {
              type: 'value',
              name: '故障次数(次)',
              nameLocation: 'end',
              nameGap: 20,
              nameTextStyle: {
                  color: '#fff'
              },
              axisLine: {
                  lineStyle: {
                      color: '#43AAB0'
                  }
              },
              splitLine: {
                  show: true,
                  lineStyle: {
                      color: '#233349',
                      type:'dashed'
                  }
              },
              axisLabel:{
                  color:'#FEFEFE',
                  
              }
          },
          series: this.state.seriesData
        }

        return (
            <Chart
              echarts={echarts}
              option={failureRateChartOption}
              notMerge
              lazyUpdate
              style={{ height: 600 }}
            />   
        )
    }
}

export default EquipmentFailureRate
