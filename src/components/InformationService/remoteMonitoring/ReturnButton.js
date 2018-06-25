import React from 'react';
import CustomIcon from '../../common/CustomIcon';
import './ReturnButton.less';

const ReturnButton = ({handleClick}) => {
 	return (
 	  <div className="fwq-return-button" onClick={handleClick}>
      <CustomIcon style={{color: '#ff535f'}} icon="icon-fanhui1"/>
      <span className="return-text">返回</span>
    </div>
  )
}

export default ReturnButton
