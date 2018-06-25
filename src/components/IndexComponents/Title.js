import React from 'react';
import ReactSVG from 'react-svg';
import './Title.less';

import smallCircle from '../../svg/smallCircle.svg'
import arrowForTitle from '../../svg/arrowForTitle.svg'
import polylineForArrow from '../../svg/polylineForArrow4.svg'

class Title extends React.Component {
  state = {
    menuList: this.props.list || []
  }

  menuClick = (data, index, e) => {
    let list = this.state.menuList;
    list.map((menuData, menuIndex) => menuIndex == index ? menuData.selected = true : menuData.selected = false)
    //this.props.menuClick(data, index ,this.state.menuList)
    this.setState({
      //list
    }, () => {
      this.props.menuClick(data, index, this.state.menuList)
    })
  }

  render() {
    // const titleLength = this.props.title.length;
    const arrow = this.props.size === "large" ? require('../../assets/images/bg-title2.png') : require('../../assets/images/bg-title1.png');
    return (
      <div className="titleComponents">
        <div className="normal" style={this.props.size === "large" ? { width: 137 } : { width: 105 }}>
          <img className="normal-img" src={arrow} alt="" />
          <span className="text">{this.props.title}</span>
        </div>

        <div className="title-tab">
          {this.state.menuList && this.state.menuList.map((data, index) => {
            return (
              <p className={`title-tab-p ${data.selected && "active"}`} key={index} onClick={e => this.menuClick(data, index, e)}>
                <img src={require("../../assets/images/line1.png")} className="title-tab-border before" />{data.name}{data.total && `（${data.total}）`}{this.state.menuList.length === index + 1 && <img src={require("../../assets/images/line1.png")} className="title-tab-border after" />}
              </p>
            )
          }
          )}
          {this.props.more && <p className="title-tab-p more1"><a href="/wl_web/#/alarmInformation" style={{ color: "#00EAFF" }}>更多<i className="iconfont icon-shouqi"></i></a></p>}
        </div>
      </div>
    )
  }
}

export default Title
