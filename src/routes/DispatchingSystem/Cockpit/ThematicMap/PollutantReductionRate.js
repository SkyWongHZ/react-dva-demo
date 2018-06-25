import React from 'react'
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import IndexTable from '../../../../components/PublicComponents/IndexTable';
import IndexFiltrate from './component/IndexFiltrate';
import config from '../../../../config';
import { Row, Col } from 'antd';
import request from '../../../../utils/request';

class EquipmentFailureRate extends React.Component {
    state = {
      rowCount:null,
      pageSize:10,
      tableData:[],
      chartData:{
        indicatorList:[],
        dataList:[]
      }
    }

    //分页
    handChange = (pageNo, pageSize) => {
      let params = this.refs.filtrate.getFieldsValue();
      params.pageNo = pageNo;
      this.getTableData(params);
    }

    getTableData = (params) => {
      let obj={
        pageNo:params.pageNo||1,
        pageSize:this.state.pageSize,
        type:params.type||1
      }
      request({ url: '/wl/service/theme/getCut', method: 'get',params: obj}).then(res => {        
          const resData=res.ret
          if(resData&&resData.items){
            this.setState({tableData:resData.items})
            this.setState({rowCount:resData.rowCount})
          }
      });
    }

    getChartData = (siteId) => {
      if(!siteId){return}
      request({ url: '/wl/service/theme/getSiteCut', method: 'get',params: {siteId:siteId}}).then(res => {        
          const resData=res.ret
          let indicatorList=[]
          let dataList=[]
          resData&&resData.map((item,index)=>{
            indicatorList.push({
              name:item.name,
              max:100
            })
            dataList.push(item.value)
          })
          this.setState(preState => ({
            chartData: {...preState.chartData, indicatorList: indicatorList,dataList:dataList}
          }))
      });
    }

    //表格查询
    tableSubmitClick=(value)=>{
      this.getTableData(value)
    }

    //雷达图查询
    chartSubmitClick=(value)=>{
      this.getChartData(value.siteId)
    }

    componentDidMount() {
      console.log('ddddd')
      this.getTableData({})
      this.props.allSiteOptions&&this.getChartData(this.props.allSiteOptions[0].value)
    }

    render() {
      let rankTableHeader = [
        {
          name: '排名',
          key: 'number'
        },
        {
          name: '项目',
          key: 'name'
        },
        {
          name: '削减率%',
          key: 'value'
        }
      ]

      const tableFiltrateItem = [{
          label: "监测因子",
          type: "select",
          paramName: "type",
          options:[{
            value:'1',
            text:"cod"
          },{
            value:'2',
            text:"氨氮"
          },{
            value:'3',
            text:"总氮"
          },{
            value:'4',
            text:"总磷"
          },{
            value:'5',
            text:"浊度"
          }]
      }];

      const chartFiltrateItem = [{
          label: "项目",
          type: "select",
          paramName: "siteId",
          options:this.props.allSiteOptions,
          width:"320px",
          itemLayout:{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }
      }];

      let chartOption={
          tooltip: {
            trigger: 'item'
          },
          radar: {
            name: {
                textStyle: {
                    color: '#fff',
                    borderRadius: 3,
                    padding: [3, 5]
               }
            },
            radius:'50%',
            indicator: this.state.chartData.indicatorList,
            axisLine:{
                show:false
            },
            splitArea:{
                show:false
            }
        },
        series: [{
            type: 'radar',
            symbolSize:12,
            itemStyle: {normal: { color: '#00BFD6',borderWidth:2}},
            lineStyle: {normal: { color: '#0E4786'}},
            areaStyle: {normal: { color: '#026C80'}},
            data : [
                {
                    value : this.state.chartData.dataList
                }
            ]
        }]
      }
      return (
        <Row className="pollutant-main-content">
          <Col span={13} className="content-col">
            <div className="pollutant-panel-content">
              <IndexFiltrate
                items={tableFiltrateItem}
                searchBtnShow={true}
                submit={this.tableSubmitClick}
                style={{paddingLeft:0}}
                ref="filtrate"                   
              />
              <IndexTable
                total={this.state.rowCount}
                pageSize={this.state.pageSize}
                header={rankTableHeader}
                tableData={this.state.tableData}
                handChange={this.handChange}
              />
            </div>
          </Col>
          <Col span={11} className="content-col">
            <div className="pollutant-panel-content">
              <IndexFiltrate
                items={chartFiltrateItem}
                searchBtnShow={true}
                submit={this.chartSubmitClick}
                style={{paddingLeft:0}}
                ref="filtrate"                  
              />
              {this.state.chartData.indicatorList.length>0 &&
                <Chart
                  echarts={echarts}
                  option={chartOption}
                  notMerge
                  lazyUpdate
                  style={{ height: 480 }}
                />
              }
            </div>
          </Col>
        </Row>
      )
    }
}

export default EquipmentFailureRate
