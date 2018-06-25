// 资源通道
import React from 'react'
import './ResourceChannel.less';
import Title from '../../../../components/IndexComponents/Title';
import request from '../../../../utils/request';
import { hashHistory } from 'dva/router'

const line = require("../../../../assets/images/line.png");
const menuList = [{
  name: "客户档案",
  icon: "icon-kehu",
  href: "customer",
  key:11
},{
  name: "客户通知",
  icon: "icon-tongzhi",
  href: "clientele",
  key:6
},{
  name: "维养提醒",
  icon: "icon-tixing",
  href: "maintainRemind",
  key:7
},{
  name: "专题图",
  icon: "icon--guanzhuzhongxin",
  href: "null",
  key:8
},{
  name: "回访记录",
  icon: "icon-jilu",
  href: "visitRecord",
  key:9
},{
  name: "维养记录",
  icon: "icon-wenjian",
  href: "maintenanceRecord",
  key:10
}];
// /#/SupervisionTreatment
class ResourceChannel extends React.Component {
  state = {
    menuList: null,
  }
  // // 导航
  channelClick = (value) => {
    console.log('value', value)
    hashHistory.push({ pathname: `${value}`})
    // hashHistory.push({ pathname: 'monitoringSite' })
  }
  componentDidMount (){
    // BF
    // request({url: "/res/channel/getResChannelRes", method: "GET"}).then(res => {
    //   menuList.map((menuData, menuIndex) => {
    //     res.ret.map((data, index) => {
    //       if(menuData.name == data.name){
    //         menuData.href = `${data.url}?token=${window.sessionStorage.getItem("wrsToken")}`
    //         return false;
    //       }
    //     })
    //   })

    //   console.log(menuList)
    //   this.setState({
    //     menuList
    //   })
    // })
    this.setState({
      menuList: menuList
    })
  }

  render() {
    return (
      <div className="ResourceChannelContainer" style={{width:572,marginRight: 0}}>
        <Title title="用户服务" />

        <div className="box-content">
          {this.state.menuList && this.state.menuList.map((data, index) => {
            console.log('data', data)
            return(
              <div className="box-list" key={index} onClick={() => this.props.userServiceDetailClick(data.key)}>
                {/* onClick={this.channelClick.bind(this,data.href)} */}
                {/* onClick={() => this.props.userServiceDetailClick(data.key)} */}
                <a>
                {/* href={data.href} */}
                  <p><i className={`iconfont ${data.icon}`}></i></p>
                  <span>{data.name}</span>
                </a>
                <img className="line" src={line} />
               </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ResourceChannel
