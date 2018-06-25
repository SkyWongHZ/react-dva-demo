import React from 'react';
import './NoteSendButton.less';
import CustomIcon from '../../common/CustomIcon';

const NoteSendButton = ({handleClick}) => {
 	return (
 	  <div className="note-send-layout">
      <div className="note-send-button" onClick={handleClick}>
        <CustomIcon icon="icon-duanxinfasong1" style={{color: '#6392ff', fontSize: '20px'}}/>
        <span className="note-send-text">短信预警</span>
      </div>
    </div>

  )
}

export default NoteSendButton
