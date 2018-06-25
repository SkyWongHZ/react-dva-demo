import React from 'react'
import './ThematicMap.less';
import Title from '../../../../components/IndexComponents/Title';
import echarts from 'echarts';
import Chart from 'echarts-for-react';
import request from '../../../../utils/request';
import { Carousel, Tabs,Form, DatePicker,Select,Button,notification } from 'antd';
import IndexFiltrate from './component/IndexFiltrate';
// import util from '../../utils/Util';
import Map from './Map';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import moment from 'moment';

import PollutantReductionRate from './PollutantReductionRate'
import EquipmentFailureRate from './EquipmentFailureRate'
import WaterMount from './WaterMount'

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class ThematicMap extends React.Component {
    state = {
      resAllSiteOptions:[],
      allSiteOptions:[],
      maxMap:'1'
    }

    // tabs切换
    callback=(key)=> {
      this.setState({
        maxMap:key
      })
    }

    //获取所有测点
    getAllSite=()=>{
      request({ url: '/wl/alarm/getAllSite', method: 'get'}).then(res => {
        if(res.ret){
          this.setState({
              resAllSiteOptions:res.ret
          });
          let siteOptions=[]   
          this.state.resAllSiteOptions.map((item,index)=>{
            siteOptions.push({
              text:item.name,
              value:String(item.id)
            })
          })      
          this.setState({
              allSiteOptions:siteOptions
          });
        }  
      });
    }

    componentDidMount() {
        this.getAllSite()
    }

    render() {
      return (
        <div className="ThematicMap-main-container">
          <div className="ThematicMap-container">
              <img className="ThematicMap-leftBorder" src={require("../../../../assets/images/leftbar3.png")} />
              <img className="ThematicMap-rightBorder" src={require("../../../../assets/images/rightbar3.png")} />
              <div className={this.state.maxMap==="2"?`ThematicMap-main-content no-bg`:"ThematicMap-main-content"} style={{height:(this.state.maxMap==='1')||(this.state.maxMap==='2')?'600px':'630px'}}>
                  <Tabs defaultActiveKey="1" className="ThematicMap-tab" onChange={this.callback}>
                      <TabPane tab="项目分布" key="1"></TabPane>
                      <TabPane tab="污染物削减率" key="2"></TabPane>
                      <TabPane tab="设备故障率" key="3"></TabPane>
                      <TabPane tab="处理水量" key="4"></TabPane>
                  </Tabs>
                  <MyIcon type=" icon-guanbi " className="ThematicMap-closeIcon" onClick={this.props.closeClick}/>
                    {
                      this.state.maxMap === '1' &&
                      <div className="cockpitMap">
                        <Map 
                        />
                      </div>
                    }
                    { 
                      this.state.maxMap === '2' &&
                      <PollutantReductionRate 
                      allSiteOptions={this.state.allSiteOptions} />
                    }
                    { 
                      this.state.maxMap === '3' &&
                      <EquipmentFailureRate />
                    }
                    { 
                      this.state.maxMap === '4' &&
                      <WaterMount resAllSiteOptions={this.state.resAllSiteOptions} allSiteOptions={this.state.allSiteOptions} />
                    }
                                     
              </div>
          </div>
        </div>
        )
    }
}

export default ThematicMap
