import React from 'react';
import { Menu } from 'antd';
const { SubMenu } = Menu;
import { Link } from 'dva/router';
import CustomIcon from './CustomIcon'

// 目前最多可显示3级菜单，每隔一级增加一个 - 作为父子分隔符。
class CustomMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      openKeys: [],
    };
  }
  onClick = ({ item, key, keyPath }) => {
    this.setState({
      selectedKeys: [key],
    });
  };
  onOpenChange = openKeys => {
    const currentOpenKeys = openKeys.slice(-1);
    const lastOpenKeys = openKeys.slice(-1);
    if (openKeys.length > 1 && lastOpenKeys[0] && lastOpenKeys[0].indexOf('-') > -1) {
      currentOpenKeys.unshift(lastOpenKeys[0].split('-')[0]);
    }

    this.setState({ openKeys: currentOpenKeys });
  };
  render() {
    const { menuItems } = this.props;
    return (
      // <Menu
      //   theme="dark"
      //   mode="inline"
      //   selectedKeys={this.state.selectedKeys}
      //   onClick={this.onClick}
      //   onOpenChange={this.onOpenChange}
      //   openKeys={this.state.openKeys}
      // >
      //   {menuItems &&
      //     menuItems.map(item => {
      //       // console.log(item.hasAuthority === null)
      //       let isShow = false;
      //       item.sub.map((firstData, firstIndex) => {
      //         if(firstData.hasAuthority){
      //           isShow = true;
      //           item.hasAuthority = true;
      //         }
      //       })

      //       if(!isShow) item.hasAuthority = false;
      //       if (!item.sub.length) {
      //         //console.log(item)
      //         //debugger
      //         if (!item.hasAuthority && item.hasAuthority !== null) {
      //           return null
      //         }
      //         return (
      //           <Menu.Item key={item.key} className="level-2">
      //             <Link to={item.url}>
      //               {item.title}
      //             </Link>
      //           </Menu.Item>
      //         );
      //       } else {
      //         if (!item.hasAuthority && item.hasAuthority !== null) {
      //           return null
      //         }
      //         return (
      //           <SubMenu
      //             key={item.key}
      //             title={
      //               item.url
      //                 ? <Link className="level-1" to={item.url}>
      //                   <span>
      //                     <CustomIcon className="menu-item-icon" icon={item.icon} style={{ marginRight: 8 }} />
      //                     <span>{item.title}</span>
      //                   </span>
      //                 </Link>
      //                 : <span>
      //                   <CustomIcon className="menu-item-icon" icon={item.icon} style={{ marginRight: 8 }} />
      //                   <span>{item.title}</span>
      //                 </span>
      //             }
      //           >
      //             {item.sub.map(subItem => {
      //               if (!subItem.sub.length) {
      //                 if (!subItem.hasAuthority && subItem.hasAuthority !== null) {
      //                   return null
      //                 }
      //                 return (
      //                   <Menu.Item key={subItem.key} className="level-2">
      //                     <Link to={subItem.url}>
      //                       {subItem.title}
      //                     </Link>
      //                   </Menu.Item>
      //                 );
      //               } else {
      //                 if (!subItem.hasAuthority && subItem.hasAuthority !== null) {
      //                   return null
      //                 }
      //                 return (
      //                   <SubMenu
      //                     key={subItem.key}
      //                     title={<span>{subItem.title}</span>}
      //                     className="level-2"
      //                   >
      //                     {subItem.sub.map(subItem2 => {
      //                       if (!subItem2.hasAuthority && subItem2.hasAuthority !== null) {
      //                         return null
      //                       }
      //                       return (
      //                         <Menu.Item key={subItem2.key} className="level-3">

      //                           <Link to={subItem2.url}> {subItem2.title} </Link>
      //                         </Menu.Item>
      //                       );
      //                     })}
      //                   </SubMenu>
      //                 );
      //               }
      //             })}
      //           </SubMenu>
      //         );
      //       }
      //     })}
      // </Menu>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={this.state.selectedKeys}
        onClick={this.onClick}
        onOpenChange={this.onOpenChange}
        openKeys={this.state.openKeys}
      >
        {menuItems &&
          menuItems.map(item => {
            if (!item.sub) {
              return (
                <Menu.Item key={item.key} className="level-2">
                  <Link to={item.url}>
                    {item.title}
                  </Link>
                </Menu.Item>
              );
            } else {
              return (
                <SubMenu
                  key={item.key}
                  title={
                    item.url
                      ? <Link className="level-1" to={item.url}>
                        <span>
                          <CustomIcon className="menu-item-icon" icon={item.icon} style={{ marginRight: 8 }} />
                          <span>{item.title}</span>
                        </span>
                      </Link>
                      : <span>
                        <CustomIcon className="menu-item-icon" icon={item.icon} style={{ marginRight: 8 }} />
                        <span>{item.title}</span>
                      </span>
                  }
                >
                  {item.sub.map(subItem => {
                    if (!subItem.sub) {
                      return (
                        <Menu.Item key={subItem.key} className="level-2">
                          <Link to={subItem.url}>
                            <CustomIcon className="menu-item-icon" icon={subItem.icon} style={{ marginRight: 8 }} />
                            {subItem.title}
                          </Link>
                        </Menu.Item>
                      );
                    } else {
                      return (
                        <SubMenu
                          key={subItem.key}
                          title={<span>{subItem.title}</span>}
                          className="level-2"
                        >
                          {subItem.sub.map(subItem2 => {
                            return (
                              <Menu.Item key={subItem2.key} className="level-3">
                                <CustomIcon className="menu-item-icon" icon={subItem.icon} style={{ marginRight: 8 }} />
                                <Link to={subItem2.url}> {subItem2.title} </Link>
                              </Menu.Item>
                            );
                          })}
                        </SubMenu>
                      );
                    }
                  })}
                </SubMenu>
              );
            }
          })}
      </Menu>
    );
  }
}

export default CustomMenu;
