import React, {Component}from 'react';
import {connect} from 'dva';
import {Layout, Icon, Dropdown, Menu} from 'antd';
const {Header, Sider, Content} = Layout;
import LeftNav from './LeftNav';
import './App.less';
import MyIcon from '../MyIcon';
import PublicService from '../../../services/PublicService';
const logo = require("../../../assets/images/logo.png");
import SidebarMenu from '../../common/SidebarMenu'

// import Crumbs from '../Crumbs';
class App extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    // let {dispatch} = this.props;
    // if(this.props.location.pathname === "/"){
    //   this.props.history.push({ pathname: `/informationAccept` });
    // }


    // 获取项目所有项目名称及相对应的字段信息
    // dispatch({type: 'public/getAllProjectInfo', payload: {}});
    // 获取人员架构树
    // dispatch({type: 'public/loadDeptUserTree', payload: {}});
  }

  state = {
    collapsed: false,
    navClass: ''
  };

  onCollapse (collapsed) {
    console.log(collapsed);
    // let navClass = collapsed ? 'ant-menu-inline-collapsed' : '';
    this.setState({collapsed});
  }

  // header 驾驶舱跳转
  goToIndexPage () {
    PublicService.fullScreen(document.documentElement);
    window.location = '#cockpit';
  }

  render () {
    let t = this;
    // console.log(t.props.user, 'user');
    const navSettings = [
      {
        title: '报警管理',
        url: null,
        key: '1',
        icon: 'icon-shezhi',
        sub: [
          {
            title: '报警信息',
            key: '1-1',
            url: 'alarmInformation',
            icon: 'icon-shouqi',
          },
          {
            title: '报警统计',
            key: '1-2',
            url: 'alarmStatistics',
            icon: 'icon-shouqi',
          },
          // {
          //   title:'管网流量',
          //   key:'1-5',
          //   url:'Flow'
          // },
          // {
          //   title:'水功能区',
          //   key:'1-6',
          //   url:'WasteWater'
          // },
          // {
          //   title:'闸站',
          //   key:'1-7',
          //   url:'BrakeStation'
          // },
        ]
      },
      {
        title: '设备反控',
        url: null,
        key: '2',
        icon: 'icon-shezhi',
        sub: [
          {
            title: '设备反控',
            key: '2-1',
            url: 'countercharge',
            icon: 'icon-shouqi',
          },
        ]
      },
      {
        title: '资源配置',
        url: null,
        key: '3',
        icon: 'icon-shezhi',
        sub: [
          {
            title: '监测类型管理',
            key: '3-1',
            url: 'monitoringType',
            icon: 'icon-shouqi',
          },
          {
            title: '监测因子管理',
            key: '3-2',
            url: 'factorManagement',
            icon: 'icon-shouqi',
          },
          {
            title: '项目管理',
            key: '3-3',
            url: 'monitoringSite',
            icon: 'icon-shouqi',
          },
          {
            title: '设备管理',
            key: '3-4',
            url: 'DeviceManagement',
            icon: 'icon-shouqi',
          },
          {
            title: '仪器管理',
            key: '3-5',
            url: 'InstrumentManagement',
            icon: 'icon-shouqi',
          },
          {
            title: '组态管理',
            key: '3-6',
            url: 'flowChartManagement',
            icon: 'icon-shouqi',
          },
        ]
      },
      {
        title: '系统管理',
        url: null,
        key: '4',
        icon: 'icon-yingjichuzhi',
        sub:[
          {
            title: '用户管理',
            key: '4-1',
            url: 'UserManagement',
            icon: 'icon-shouqi',
          },
          {
            title: '角色管理',
            key: '4-2',
            url: 'RoleManagement',
            icon: 'icon-shouqi',
          },
          {
            title: '权限管理',
            key: '4-3',
            url: 'AuthorityManagement',
            icon: 'icon-shouqi',
          },
        ]
      },
    ];
    const menu = (
      <Menu className="wp-down ">
        <Menu.Item>
          <MyIcon style={{fontSize: 12, marginRight: 4}} type="icon-mima"/>
          <span>修改密码</span>
        </Menu.Item>
        <Menu.Item>
          <MyIcon style={{fontSize: 12,  marginRight: 4}} type="icon-tuichu"/>
          <span >退出登录</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout className="wp-layout">
        <Header id="react-no-print">
          <div className="wp-logo-div">
            <img src={logo}/>
            <span className="t-ML6" style={{ fontWeight: "bold" }}>蔚蓝水务智能管理平台</span>
            <div className="wp-cockpit t-MR10">
              <Dropdown trigger="click" overlay={menu} placement="bottomCenter">
                <span className=" ant-dropdown-link">
                  {t.props.user || '蔚蓝水务源管理系统'}
                  <Icon className="t-ML2" type="down"/>
                </span>
              </Dropdown>
            </div>
            <MyIcon className="wp-cockpit-icon" type="icon-xingzhuang5kaobei2"/>
            <a onClick={t.goToIndexPage.bind(t)} className="wp-cockpit t-MR24">驾驶舱</a>
            <MyIcon className="wp-cockpit-icon" type="icon-jiankong"/>
          </div>
        </Header>
        <Layout>
          <SidebarMenu menuItems={navSettings}/>
          <Content>{this.props.children}</Content>
        </Layout>
      </Layout>

    );
  }

}
// function mapStateToProps (state) {
//   return {
//     user: state.login.user
//   };
// }
// export default connect(mapStateToProps)(App);
export default App;
