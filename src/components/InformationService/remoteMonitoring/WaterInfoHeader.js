import React from 'react';
import CustomIcon from '../../common/CustomIcon';
import ReturnButton from './ReturnButton';

const WaterInfoHeader = ({title, hasReturn, handleClick}) => {
 	return (
    <div className="caption">
      <div className="vertical-middle">
        <CustomIcon style={{color: '#6392FF'}} icon="icon-tongji"/>
        <span className="title">{title}</span>
      </div>
      {hasReturn && <ReturnButton handleClick={handleClick}/>}
    </div>
  )
}

export default WaterInfoHeader
