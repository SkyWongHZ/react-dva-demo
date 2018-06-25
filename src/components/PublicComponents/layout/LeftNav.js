/**
 * Created by wupeng on 2017//9.
 */
import React, {Component} from 'react';
import {Menu, Icon, Layout, Breadcrumb} from 'antd';

import { Link, hashHistory} from 'dva/router';
import {connect} from 'dva';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import './LeftNav.less';
import '../../../less/universal-css.less';
import MyIcon from "../MyIcon";

const navSettings = [
  {
    title: '调度系统',
    url: null,
    key: '1',
    icon: 'icon-tiaoduzhongxin',
    sub: [{
      title: '事件处理',
      key: '1-1',
      url: 'EventHandling',
    }, {
      title: '督促处理',
      key: '1-2',
      url: 'SupervisionTreatment',
    }]
  },
  {
    title: '应急系统',
    url: null,
    key: '2',
    icon: 'icon-shandianfahuo',
    sub: [{
      title: '应急资源管理',
      key: '2-1',
      url: 'EmergencyManagment',
    }, ]
  },
];

class LeftNav extends Component {
  state = {
    current: '1',
    openKeys: [],
    collapsed: false,
  };

  handleClick = (e) => {
    console.log(e.key)
    this.setState({current: e.key});
  };

  openChange (openKeys) {
    // const state = this.state;
    // const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    // const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
    //
    // let nextOpenKeys = [];
    // if (latestOpenKey) {
    //   nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    // }
    // if (latestCloseKey) {
    //   nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    // }
    const currentOpenKeys = openKeys.slice(-1);
    const lastOpenKeys = openKeys.slice(-1);
    if(lastOpenKeys[0] && lastOpenKeys[0].indexOf('-') > -1) {
      currentOpenKeys.unshift(lastOpenKeys[0].split('-')[0])
    }
    this.setState({openKeys: currentOpenKeys});
  }

  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  }

  render () {
    let t = this;
    return (
      <Menu
        theme="dark"
        mode='inline'
        selectedKeys={[this.state.current]}
        onClick={this.handleClick.bind(t)}
        onOpenChange={this.openChange.bind(t)}
        openKeys={this.state.openKeys}
      >
        {
          navSettings.map((item) => {
            return (
              <SubMenu
                key={item.key}
                title={item.url ?
                  <Link className="left-nav-fisrt-item" to={item.url}>
                    <span>
                      <MyIcon className="wp-anticon" type={item.icon}/><span>{item.title}</span>
                    </span>
                  </Link> : <span><MyIcon className="wp-anticon" type={item.icon}/><span>{item.title}</span></span>}>
                {
                  item.sub.map((subItem) => {
                    if (!subItem.sub) {
                      return (
                        <Menu.Item key={subItem.key} className="level-2">
                          <Link to={subItem.url}>
                            {subItem.title}
                          </Link>
                        </Menu.Item>
                      )
                    } else {
                      return (
                        <SubMenu key={subItem.key}
                                 title={<span><span>{subItem.title}</span></span>} className="level-2">
                          {
                            subItem.sub.map(subItem2 => {
                              return (
                                <Menu.Item key={subItem2.key}  className="level-3">

                                  <Link to={subItem2.url}> {subItem2.title} </Link>
                                </Menu.Item>
                              )
                            })
                          }
                        </SubMenu>
                      )
                    }
                  })
                }
              </SubMenu>
            )
          })
        }
      </Menu>
    );
  }
}

function mapStateToProps (state) {
  return {};
}

export default connect(mapStateToProps)(LeftNav);
