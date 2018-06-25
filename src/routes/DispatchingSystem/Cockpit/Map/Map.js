import React from 'react';
import { Markers, InfoWindow } from 'react-amap';
import moment from 'moment';
import FilledArea from '../../../../components/common/AMap/FilledArea';
import FilledAreaReverse from '../../../../components/common/AMap/FilledAreaReverse';
import AMapStateBar from '../../../../components/common/basic/AMapStateBar';
import AMapSelector from '../../../../components/common/basic/AMapSelector';
import MapExtend from '../../../../components/common/AMap/MapExtend';
import request from '../../../../utils/request';
import CackpitWindow from './CackpitWindow'
import  './Map.less';

class CustomMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: null,
      status:[],
      showInfoWindow: false,
      center: [109.034213, 34.640775],
      iconPath: [],
      pointArray: [],
      modalVisible:false,
      stationDetail:[],     
    };
  }

  componentWillMount() {
    const { center } = this.state;
  

      // 测点类型
      request({ url: '/wl/overview/map/getAllMonitorType', method: 'GET'})
          .then((res) => {
              this.setState({
                iconPath: res.ret,
              })
          })

      //获取设备状态 
      request({ url: '/wl/overview/map/getState', method: 'GET' })
        .then((res) => {       
          this.setState({
            status:res.ret 
          })
        })
      
      // 获取测点
      request({ url: '/wl/overview/map/getAllSite', method: 'GET', params: { monitorTypeId:null} })
        .then((res) => {
          const pointArray = res.ret;
          const markers = pointArray&&pointArray.map((v, index) => {
            const { longitude, latitude, ...otherProp } = v;
            return {
              ...otherProp,
              position: {
                longitude,
                latitude
              }
            }
          })
          this.setState({
            pointArray,
            markers,
            allMarkers: markers
          })
        })
  }

  close = () => {
    this.setState({
      showInfoWindow: false,
    });
  };
  closeBtnClick=()=>{
    this.setState({
      modalVisible: false
    })
  }
  renderMarker = ({ id, iconPath,normal }) => {
    console.log('iconPath',iconPath)
    return (
      <div className={normal===false?'dynamic':''}>
        <img src={iconPath} alt="" className="image"/>
      </div>
    );
  };
  setDOM = marker => {
    let normal = true;
    let time = Date.now();
    const name = marker && marker.name;
    const detailList = marker && marker.detailList;
    const url = marker && marker.url;
    const data = Array(2).fill(true).map((value, index) => {
      return {
        times: Array(48).fill(true).map((value, index) => +moment().subtract(2, 'd').add(index, 'h')),
        name: index === 0 && '警戒水位' || index === 1 && '实时水位',
        values: Array(48).fill(true).map(value => index === 0 ? 10 : Math.ceil(Math.random() * 10))
      }
    })
    const rainData = Array(2).fill(true).map((value, index) => {
      return {
        times: Array(12).fill(true).map((value, index) => +moment().subtract(2, 'd').add(index, 'h')),
        name: index === 0 && '警戒阈值(12h)' || index === 1 && '实时降雨',
        values: Array(12).fill(true).map(value => index === 0 ? 120 : Math.ceil(Math.random() * 10)),
        isBar: index === 1
      }
    })
    let sum = 0;
    rainData.push({
      times: Array(12).fill(true).map((value, index) => +moment().subtract(2, 'd').add(index, 'h')),
      name: '累计降雨(12h)',
      values: rainData[1].values.map((value) => {
       	sum += value;
       	return sum;
      })
    })
    const factorList = ['监测位置', '负责人', '联系方式']
    const props = {
      normal,
      time,
      name,
      detailList,
      data: rainData,
      url,
      factorList,
      close: this.close
    }
    return null;
    // return (
    //   <MaterialWindow {...props}/>
    // );
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
      // this.state.map.setFitView(ins);
    },
    // click: (option, marker) => {
    //   const { position } = marker.getExtData();
    //   this.setState({
    //     showInfoWindow: true,
    //     position: [position.longitude, position.latitude],
    //     marker: marker.getExtData(),
    //   });
    // },
    click: (option,marker) => {
      const data = marker.getExtData()
      // 获取测点
      request({ url: '/wl/overview/map/getAllSite', method: 'GET', params: { monitorTypeId: null } })
        .then((res) => {
          const pointArray = res.ret;        
          const list = (pointArray.filter((item) => { return item.id === data.id }))[0].deviceInfos
          this.props.monitorAlarmClick(list)
        })
    },
    mouseover:(option,marker)=>{
      const data = marker.getExtData()
      if (data.deviceInfos){
        let obj = {
          deviceId: data.deviceInfos[0].deviceId,
          id: data.id
        }       
        request({ url: '/wl/overview/map/getDetail', method: 'GET',params:obj })
          .then((res) => {
            console.log('res', res)
            console.log('res.ret.deviceFactorDataDTOS', res.ret.deviceFactorDataDTOS)
            this.setState({
              modalVisible: true,
              stationDetail: res.ret.deviceFactorDataDTOS,
              bigId:res.ret.id,
              siteName: res.ret.siteName,
            })
          })
      }
    }
  };

  formatSrc = src => {
    return src;
  };
   // return require(`../../../../assets/images/monitorType/${src}.png`);
  handleSelect = key => {
    const { allMarkers, markers } = this.state;
    const filteredMarkers = allMarkers.filter(({ monitorTypeId }) => {
      // console.log(id, key)
      return monitorTypeId === key;
    });

    this.setState({
      markers: markers.length < allMarkers.length && markers.some(({ monitorTypeId }) => monitorTypeId === key)
        ? allMarkers
        : filteredMarkers,
    });
  };

  handleChange=(e)=>{
    // console.log('lucy')
    console.log('e',e)
    // let obj = {
    //   deviceId: data.deviceInfos[0].deviceId,
    //   id: data.id
    // }
    // request({ url: '/wl/overview/map/getDetail', method: 'GET', params: obj })
    //   .then((res) => {
    //     console.log('星期五', res)
    //     this.setState({
    //       modalVisible: true,
    //       stationDetail: res.ret.deviceFactorDataDTOS,
    //       bigId: res.ret.id,
    //     })
    //   })
  }

  render() {   
    const { markers, status, showInfoWindow, center, marker } = this.state;
    const { isMax } = this.props;   
    return (
      <div className={!isMax ? `fwqMaxMap fwqMapNormal` : "fwqMapNormal"}>
        <MapExtend
          amapkey="b093e2806b5b2dc88e652b8ce1dcf339"
          mapStyle="amap://styles/3471ded527b8c7d78e11699da2a3024a"
          center={center}
          events={this.events}
          zoom={6}
        >
          <FilledArea location="陕西省"/>
          <FilledAreaReverse location="陕西省"/>
          <InfoWindow
            visible={showInfoWindow}
            isCustom={true}
            position={center}
            className='hide-info-window-default-class'
          >
            {this.setDOM(marker)}
          </InfoWindow>
          <Markers
            markers={markers}
            render={this.renderMarker}
            events={this.markerEvents}
          />
          <AMapStateBar states={status} />
          <div className="fangda" onClick={this.props.setMapSize}>
            <i className="iconfont icon-fangda1" />
          </div>

          <AMapSelector
            selectors={this.state.iconPath}
            formatSrc={this.formatSrc}
            selectorSrc={'iconPath'}
            selectorKey={'monitorTypeId'}
            handleSelect={this.handleSelect}
            isMaxMap={isMax}
          />
          <CackpitWindow
            modalVisible={this.state.modalVisible}
            closeBtnClick={this.closeBtnClick}
            stationDetail={this.state.stationDetail}
            handleChange={this.handleChange}
            pointArray={this.state.pointArray}
            bigId={this.state.bigId}
            siteName={this.state.siteName}
          />
         
        </MapExtend>
      </div>
    );
  }
}

export default CustomMap;
