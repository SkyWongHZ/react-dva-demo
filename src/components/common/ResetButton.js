import React from 'react';
import { Button } from 'antd';

const ResetButton = ({handleClick}) => {
  return <Button onClick={handleClick} className='fwq-reset-button'>重置</Button>
}

export default ResetButton
