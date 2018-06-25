import React from 'react';
import moment from 'moment';
import { Icon } from 'antd';
import MyIcon from '../../../components/PublicComponents/MyIcon';
import './TitleBar.less'
// import Trend from './Trend'


const TitleBar = ({ iconType, showTitle }) => {
    return (
        <div className="titleBar-container">
            <MyIcon type={iconType} className="t-ML10 t-MR4  title-bar-head" />
            <span>{showTitle}</span>
       </div>
    );
}

export default TitleBar


