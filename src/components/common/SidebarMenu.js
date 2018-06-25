import React, {PureComponent} from 'react';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;

import CustomMenu from './CustomMenu'
import './SiderbarMenu.less'

class SidebarMenu extends PureComponent {
  constructor (props) {
  	super(props)
  	this.state = {
      collapsed: false
  	}
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const {collapsed} = this.state;
    return (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          width={224}
          className="fwq-sidebar-menu"
          trigger={<div className={`menu-trigger-${collapsed ? '': 'un'}fold`}><i className={`iconfont icon-cebianlan${collapsed ? 'zhankai' : 'shouqi'}`}></i></div>}
        >
          {/*<div className={`menu-trigger-${collapsed ? '': 'un'}fold`} onClick={this.onCollapse}><i className={`iconfont icon-cebianlan${collapsed ? 'zhankai' : 'shouqi'}`}></i></div>*/}
          <CustomMenu {...this.props}/>
        </Sider>
    )
  }
}

export default SidebarMenu
