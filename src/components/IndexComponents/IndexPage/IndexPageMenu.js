import React from 'react';
import { Menu, Dropdown } from 'antd';
import styles from './IndexPageMenu.css';
import { Link } from 'react-router'


const IndexPageMenu = ({ systemList }) => {
  const systemNameList = {
    1: 'icon-jichusheshifuwu',
    2: 'icon-gongcheng',
    3: 'icon-xiangmu2'
  }

  // http://183.129.170.220:8079/xcwrm_web/#/  水资源
  // http://183.129.170.220:8079/wrs_web/ 指挥调度

  const menuList = [{
    url: "http://183.129.170.220:8079/wrs_web/#/",
    name: "指挥调度中心",
    icon: "icon-jichusheshifuwu"
  }, {
    url: "http://183.129.170.220:8079/xcwrm_web/#/",
    name: "水资源管理系统",
    icon: "icon-gongcheng"
  }, {
    url: '/',
    name: "水利工程系统",
    icon: "icon-xiangmu2"
  }]

  return (
    <div className={styles.selectedSystem}>
      {Object.keys(systemList).map((systemNumber, index) => {
        return (
          <a href={menuList[index].url} key={systemNumber} target="_blank">
            <div className={styles.system}>
              <i className={`iconfont ${systemNameList[systemNumber]}`}></i>
              {systemList[systemNumber]}
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default IndexPageMenu
