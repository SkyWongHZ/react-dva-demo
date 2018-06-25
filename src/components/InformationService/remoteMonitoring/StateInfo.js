import React from 'react';
import CustomIcon from '../../common/CustomIcon';
import './StateInfo.less'

const StateInfo = ({stateList, handleClick}) => {
 	return (
 	  <div className="fwq-state-info">
      {stateList.map((item, index) => {
        const { icon, name, number, iconColor, iconSize='14px', selected } = item;
        const fontColor = {color: selected && '#6392ff' || '#333'}
        return (
          <div key={index} className="fwq-state-info-item" onClick={handleClick(index)}>
            <CustomIcon icon={icon} style={{color: iconColor, fontSize: iconSize}}/>
            <span style={fontColor}>{name}：</span>
            <span style={fontColor}>{number}</span>
          </div>
        )
      })}
    </div>
  )
}

export default StateInfo
