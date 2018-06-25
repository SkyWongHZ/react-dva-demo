import React from 'react';
import { Markers, InfoWindow } from 'react-amap';
import MapExtend from '../../../../components/common/AMap/MapExtend';
import request from '../../../../utils/request';
import CackpitWindow from './CackpitWindow'
import  './Map.less';

const colorList=['#EFAA4E','#00FFBC','#29BBFF','#A06CFF','#ef874e', '#9eef4e', '#ef744e', '#1595bf']

class CustomMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointArray:[],
      markers: null,
      maxValue:null,
      center: [109.034213, 34.640775],
      modalVisible:false,
      stationDetail:{},  
      bigId:'', 
      siteName:'',
      monitorTypeLists:[]
    };
  }

  componentWillMount() {
    this.getAllMonitorType()
    this.getTheme()
  }

  // 获取测点
  getTheme=()=>{
    request({ url: '/wl/service/theme/getTheme', method: 'GET' })
      .then((res) => {
        if(!res.rc){
          let maxValue=0
          const pointArray = res.ret;
          const markers = pointArray && pointArray.map((item, index) => {
              const { longitude, latitude, ...otherProp } = item;
              if(Number(item.value)>maxValue){
                maxValue=Number(item.value)
              }
              return {
                  ...otherProp,
                  position: {
                      longitude,
                      latitude,
                  }
              }
          })
          this.setState({
              pointArray,
              markers,
              maxValue,
              allMarkers: markers
          })
        }
    })
  }

  // 获取所有图例类型
  getAllMonitorType=(callback)=>{
    request({ url: '/wl/overview/map/getAllMonitorType', method: 'GET' })
      .then((res) => {
        if(!res.rc){
          let monitorTypeLists=res.ret&&res.ret.map((item,index)=>{
            let circleColor=colorList[index%colorList.length]
            const {monitorTypeId,monitorTypeName}=item
            return{
              monitorTypeId,
              monitorTypeName,
              circleColor
            }
          })
          this.setState({monitorTypeLists})
          if(callback) callback()
        }
    })
  }

  closeBtnClick=()=>{
    this.setState({
      modalVisible: false
    })
  }

  setRenderMarker=(extData)=>{
    var findItem=this.state.monitorTypeLists&&this.state.monitorTypeLists.find((item,index)=>{
      return item.monitorTypeId==extData.monitorTypeId
    })
    let circleColor=findItem?findItem.circleColor:''
    let maxWidth=50
    let percent=Number(extData.value)/this.state.maxValue

    return (
      <div className="circle-marker" style={{backgroundColor:circleColor,width:maxWidth*percent+'px',height:maxWidth*percent+'px'}}>
      </div>
    );
  }

  renderMarker = (extData) => {
    if(this.state.monitorTypeLists){
      return this.setRenderMarker(extData)
    }else{
      this.getAllMonitorType(()=>{
        return this.setRenderMarker(extData)
      })
    }
  };

  events = {
    created: ins => {
      this.setState({
        map: ins,
      });
    }
  };

  markerEvents = {
    created: ins => {
    },
    mouseover:(option,marker)=>{
      console.log(marker.getExtData())
      this.setState({
        modalVisible: true,
        stationDetail: marker.getExtData()
      })
    }
  };

  render() {   
    const { markers, center,monitorTypeLists } = this.state;
    const { isMax } = this.props;   
    const legendList = monitorTypeLists.map(item => <li key={item.monitorTypeId}><span className="circle-legend" style={{backgroundColor:item.circleColor}}></span>{item.monitorTypeName}</li>);
    return (
      <div className={!isMax ? `fwqMaxMap fwqMapNormal` : "fwqMapNormal"}>
        <MapExtend
          amapkey="b093e2806b5b2dc88e652b8ce1dcf339"
          mapStyle="amap://styles/3471ded527b8c7d78e11699da2a3024a"
          center={center}
          events={this.events}
          zoom={6}
        >
          <Markers
            markers={markers}
            render={this.renderMarker}
            events={this.markerEvents}
          />
          <CackpitWindow
            modalVisible={this.state.modalVisible}
            closeBtnClick={this.closeBtnClick}
            stationDetail={this.state.stationDetail}
            pointArray={this.state.pointArray}
            bigId={this.state.bigId}
            siteName={this.state.siteName}
          />
        </MapExtend>
        <ul className="mapLegend">
          {legendList}
        </ul>
      </div>
    );
  }
}

export default CustomMap;
