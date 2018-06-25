import React from 'react'
import request from '../../../../utils/request';
import './CumulativeData.less';

export default class CumulativeData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { cockpit } = this.props;
    return (
      <div className="cumulativeData-container">
        <p className="cumulativeData-title"><i className="iconfont icon-shouqi"></i>
          <span>累积数据</span>
        </p>
        <p className="cumulativeData-subTitle"><i className="iconfont icon-xiangmu"></i>时间及参数信息</p>

        {cockpit.Cumulative && cockpit.Cumulative.map((data, index) => {
          return (
            <div className="cumulativeData-block" key={index}>
              <p className="cumulativeData-blockTitle">[ {data.name} ]</p>
              <p className="cumulativeData-blockContent">{data.value}</p>
              <img className="cumulativeData-line" src={require("../../../../assets/images/bottom-border.png")} />
            </div>
          )
        })}

      </div>
    )
  }
}