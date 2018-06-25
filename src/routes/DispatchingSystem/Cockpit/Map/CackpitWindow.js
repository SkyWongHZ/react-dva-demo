import React from 'react';
import moment from 'moment';
import  './CackpitWindow.less';
import { Select,Icon } from 'antd';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
// import Trend from './Trend'
const guanbi=require('../../../../assets/images/guanbi.png')
const handleChanges=(e)=>{
    // alert('年后')
    console.log('e', e)
}
const CackpitWindow = ({ modalVisible, closeBtnClick, stationDetail, handleChange, pointArray, bigId, siteName}) => {
    const Option = Select.Option;     
    let  testData=pointArray.filter((item)=>{
        return item.id === bigId
    })  
    return (
        modalVisible && <div className="informationWindow">
            <span className="project">>>{siteName}</span>
            {/* <MyIcon type=" icon-guanbi " className="closeIcona" onClick={closeBtnClick}/> */}
            <img src={guanbi}  className="closeIcona"  onClick={closeBtnClick}/>
            <div className="contentss">
                <div className="realtime">实时数据 </div>
                <span className="realtime-radius" style={{backgroundColor:stationDetail&&stationDetail[0].normal===false?'red':'rgb(0, 255, 188)'}}></span> 
                <div className="showSelect">
                    <span>设备编号</span>
                    {/* {stationDetail && stationDetail["0"] && <Select className="controlSelect" defaultValue={stationDetail["0"].deviceCode} style={{ width: 200 }} onChange={handleChange}>
                        {
                            testData && testData[0].deviceInfos && testData[0].deviceInfos.map(item => {
                                return (
                                    <Option value={item.deviceId}>{item.deviceCode}</Option>
                                )
                            })
                        }
                    </Select>} */}
                    {testData && testData[0].deviceInfos && testData[0].deviceInfos && <Select className="controlSelect" defaultValue={testData[0].deviceInfos[0].deviceCode} style={{ width: 200 }} onChange={handleChange}>
                        {
                            testData && testData[0].deviceInfos && testData[0].deviceInfos.map(item => {
                                return (
                                    <Option value={item.deviceId}>{item.deviceCode}</Option>
                                )
                            })
                        }
                    </Select>}
                   
                </div>
                <ul className="userList">
                    {
                        stationDetail&&stationDetail["0"]&& stationDetail["0"].factorDataDTOS.map((item) => {
                            return(
                                <li className="userListSON" >
                                    <div style={{ color: '#00DDFF'}}>【{item.factorName}】</div>
                                    <div>{item.value}{item.unit}</div>
                                </li>
                            )
                        })
                    }
                </ul>
                {stationDetail["0"] && <div className="showtime">{stationDetail["0"].timeString}</div>}
            </div>
           
        </div>
    );
}

export default CackpitWindow


