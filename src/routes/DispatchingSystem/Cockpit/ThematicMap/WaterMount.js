import React from 'react'
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import { notification } from 'antd';
import IndexFiltrate from './component/IndexFiltrate';
import request from '../../../../utils/request';
import moment from 'moment';

class WaterMount extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        allSiteIds:[],//所有测点id
        chartData:[],
        xAxisData:[],
        seriesData:[],
        selectDefaultValue:[]
      };
    }

    // 获取处理水量
    getWaterMount = (siteIds,time) => {
        let obj = {
            startTime:time?time[0].unix()*1000:'',
            endTime:time?time[1].unix()*1000:'',
            siteIds:siteIds
        }
        request({ url: '/wl/service/theme/getWaterMount', method: 'get', params: obj }).then(res => { 
            if(res.ret.ret){
              this.setState({chartData: res.ret.ret})
              let data=this.state.chartData
              if(data[0]&&data[0].dataDTOs){
                let list=data[0].dataDTOs.map((item,index)=>{
                  return item.time
                })
                this.setState({xAxisData: list})
              }

              if(data){
                const colorList=['#FF6970','#1BECFF']
                let seriesData=[]
                data.map((item,index)=>{
                  seriesData.push({
                    name:item.siteName,
                    type:'line',
                    data:item.dataDTOs&&item.dataDTOs.map((it,i)=>{return it.value}),
                    symbolSize:12,
                    itemStyle: {
                        normal: {
                            color: colorList[index]
                        }
                    }
                  })
                })
                this.setState({seriesData: seriesData})
              }
            }          
        })
    }

    //获取所有测点id集合
    allSiteIds=()=>{
      let allSiteIds=this.props.resAllSiteOptions&&this.props.resAllSiteOptions.map((item,index)=>{
          return String(item.id)
        })

        let selectDefaultValue=(allSiteIds.length>2)?allSiteIds.splice(0,2):allSiteIds

        this.setState({allSiteIds:allSiteIds})
        this.setState({selectDefaultValue: selectDefaultValue})
        return selectDefaultValue
    }
    //项目名称change
    onChangeClick=(value)=>{ 
      if(value.length>2){
        value=value.splice(0,1)
        notification.info({
          message: '警告',
          description: '项目名称最多只能选两项！',
        });
      }

    }
    //查询
    submitClick=(value)=>{ 
      this.getWaterMount(value.siteIds.toString(),value.rangetTme)
    }

    componentDidMount() {
      this.getWaterMount(this.allSiteIds().toString())
    }

    render() {
        let waterMountChartOption = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer:{
                  type:'none'
                }
            },
            legend: {
                data:this.state.seriesData&&this.state.seriesData.map((item)=>{
                  return item.name
                }),
                top:15,
                right:20,
                textStyle:{
                  color:'#ffffff',
                  fontSize:15,
                  padding:[0,20,0,0]
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '8%',
                top:'10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:this.state.xAxisData,
                axisLine:{
                    lineStyle:{
                        color:'#43AAB0'
                    }
                },
                axisLabel:{
                    color:'#FEFEFE'
                }
            },
            yAxis: {
                type: 'value',
                name:'吨/月',
                nameTextStyle:{
                  color:'#FEFEFE'
                },
                splitLine:{  
                  show:false  
            　　},
                axisLine:{
                    lineStyle:{
                        color:'#43AAB0'
                    }
                },
                axisLabel:{
                    color:'#FEFEFE'
                }  
            },
            dataZoom: [
                {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100,
                  bottom:0,
                  dataBackground:{
                    lineStyle:{
                      opacity:0
                    },
                    areaStyle:{
                      opacity:0
                    }
                  },
                  backgroundColor:'#003A50',
                  borderColor:'transparent',
                  fillerColor:'#07F8FF',
                  handleStyle:{
                    color:'#ffffff'
                  },
                  textStyle:{
                    color:'#ffffff'
                  }
                }
            ],
            series: this.state.seriesData
        };


        const filtrateItem = [{
            label: "时间",
            type: "rangePicker",
            paramName: "rangetTme",
            format:"YYYY-MM",
            allowClear:true
          },{
            label: "项目名称",
            type: "multiple-select",
            paramName: "siteIds",
            itemLayout:{
              labelCol: { span: 4 },
              wrapperCol: { span: 20 }
            },
            width:'480px',
            defaultValue:this.state.selectDefaultValue,
            options: this.props.allSiteOptions,
            handleChange:this.onChangeClick
        }];

        return (
          <div>
            <IndexFiltrate
              items={filtrateItem}
              searchBtnShow={true}
              submit={this.submitClick}                    
            />
            <div className="ThematicMap-content">
              <Chart
                echarts={echarts}
                option={waterMountChartOption}
                notMerge
                lazyUpdate
                style={{ height: 510 }}
              />
            </div>
          </div>
        )
    }
}

export default WaterMount
