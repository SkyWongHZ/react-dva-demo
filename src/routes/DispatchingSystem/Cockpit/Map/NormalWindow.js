import React from 'react';
import moment from 'moment';
import Trend from './Trend'

const Normal = ({normal, name, time, detailList, url, data, factorList, close}) => {
  return (
    <div className="information-window">
      <div className="information-window-header">
        <i className="iconfont icon-shouqi" />
        <div className="title">
          <span className="title-name">{name}</span>
        </div>
        <div className="close" onClick={close}>
          <i className="iconfont icon-ego-close" />
        </div>

      </div>
      <div className="information-window-body">
        <span className="bodyName">实时数据</span>
        <div className={`states ${normal ? 'good' : 'bad'}`} />
        <div className="information-window-time">
          {moment(time).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
      <div className="information-window-table">
        {url && <iframe src={url}/>}
        {detailList &&
         detailList.map(({ factorName, value, unit }, index) => {
           const length = detailList.length;
           const widthDivisor = length / 4 < 1 ? length : 4;
           if (value !== '——' && unit) {
             value += unit;
           }
           return (
             <div className="factor" key={index}>
               <div
                 className="factorName"
                 style={{ width: 400 / widthDivisor }}
               >
                 【{factorName}】
               </div>
               <div
                 className="factorValue"
                 style={{ width: 400 / widthDivisor }}
               >
                 {value}
               </div>
             </div>
           );
         })}
      </div>
      <Trend data={data}/>
      <div className="information-window-body">
        <span className="bodyName">基础信息</span>
      </div>
      <div className="information-window-table information-window-table-basic">
        {factorList.map((value, index) => {
          return (
            <div className="factor" key={index}>
              <div
                className="factorName"
              >
                【{value}】
              </div>
              <div
                className="factorValue"
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Normal
