/**
 * Created by wadeforever on 2017/5/25.
 */
import React, {Component} from 'react';
import './MyIcon.less';

export default class MyIcon extends Component {
  render () {
    let t = this;
    let {type, text, style, onClick, className} = t.props;
    return (
      <i onClick={onClick} className={`iconfont ${className} ` + type} style={style}> {text} </i>
    )
  }
}
