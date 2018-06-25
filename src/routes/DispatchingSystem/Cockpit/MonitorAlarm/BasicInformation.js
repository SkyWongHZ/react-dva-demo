import React from 'react'
import request from '../../../../utils/request';
import  './BasicInformation.less';
import moment from "moment";
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import { hashHistory } from 'dva/router'

export default class BasicInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  runControlClick=()=>{
    hashHistory.push({ pathname:'countercharge' })
  }
  render() {
    const { cockpit } = this.props;
    if (cockpit.SiteDetail) {
      cockpit.SiteDetail.constructionTime = cockpit.SiteDetail.constructionTime && moment(cockpit.SiteDetail.constructionTime).format("YYYY-MM-DD");
      cockpit.SiteDetail.useTime = cockpit.SiteDetail.useTime && moment(cockpit.SiteDetail.useTime).format("YYYY-MM-DD");
    }

    const listObj = [{
      text: "项目名称",
      key: "name",
      icon: "icon-xiangmu2"
    }, {
      text: "项目地址",
      key: "address",
      icon: "icon-dingwei"
    }, {
      text: "设计规模",
      key: "scale",
      icon: "icon-ziyuan"
    }, {
      text: "测点类型",
      key: "monitorTypeName",
      icon: "icon-1xiangmuchanzhi"
    }, {
      text: "建造时间",
      key: "constructionTime",
      icon: "icon-jilu"
    }, {
      text: "投运时间",
      key: "useTime",
      icon: "icon-jilu"
    }, {
      text: "负责人",
      key: "chargeMan",
      icon: "icon-jiaose"
    }, {
      text: "联系方式",
      key: "telephone",
      icon: "icon-xiangmu"
    },]
    return (
      <div className="basicInformation-container">
        <div className="basicInformation-title"><i className="iconfont icon-shouqi"></i>
          <span>基础信息</span>
          <ul className="basicInformation-subTitle">
            <span className="basicInformation-bitchControl" onClick={this.runControlClick}><MyIcon type="icon-shebeiguanli" />运行反控</span>|
            <span className="basicInformation-bitchControlace"><MyIcon type=" icon-shipinhuiyi" />视频</span>
          </ul>
        </div>

        <div className="basicInformation-content">
          <ul className="basicInformation-leftNav">
            {cockpit.SiteDetail && listObj.map((data, index) => {
              return (
                <li className="basicInformation-list" key={index}>
                  <i className={`iconfont ${data.icon}`}></i><span className="basicInformation-listTitle">{data.text} ：</span><span className="basicInformation-listContent">{cockpit.SiteDetail[data.key]}</span>
                  <img className="basicInformation-line" src={require("../../../../assets/images/bottom-border.png")} />
                </li>
              )
            })}
          </ul>
          <div className="basicInformation-rightBlock" style={{ "backgroundImage": `url(${cockpit.SiteDetail && cockpit.SiteDetail.path})` }}>
            <div className="basicInformation-imgTitle">
              <span>全景图片</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}