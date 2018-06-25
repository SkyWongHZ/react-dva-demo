import React from 'react';
import { Modal, Table, Input } from 'antd';
const { TextArea } = Input;

import CustomIcon from '../../common/CustomIcon';
import WordNumber from './WordNumber'
import './NoteInfoModal.less'

class NoteInfoModal extends React.Component {
  // handleKeyPress = (e) => {
  //   console.log(e);
  // }

  componentDidMount() {
    // document.querySelector('.content').addEventListener('keydown', this.handleKeyPress);
    // setTimeout(() => {
    //   document.querySelector('.content').addEventListener('keypress', this.handleKeyPress)
    // })

  }
  render() {
    const {width, title, visible, onClose, message, columns, dataSource, operation, handleOperate, handleSend, handleChange} = this.props;
    const messageInfo = message.content;
    const messageSign = message.name;
    const messageTime = message.time;
    const { icon, operationName, isEdit } = operation;

    return (
      <Modal
        title={title}
        maskClosable={false}
        footer={null}
        width={width}
        visible={visible}
        onCancel={onClose}
        wrapClassName='fwq-note-info-modal'
      >
        <div className="send">
          <div className="send-content">
            <div className="send-title">发送内容 <WordNumber number={messageInfo && messageInfo.length || 0}/></div>
            <div className="send-content-message">
              {!isEdit ? <TextArea className="content" value={messageInfo} onChange={handleChange}/> : <div className="content">{messageInfo}</div>}
              <div className="send-content-inscribe">
                <div className="sign">{messageSign}</div>
                <div className="time">{messageTime}</div>
              </div>
            </div>
          </div>
          <div className="send-list">
            <div className="send-title">发送列表</div>
            <Table columns={columns} dataSource={dataSource} pagination={false}/>
          </div>
        </div>
        <div className="operate">
          <div className="edit-or-save" onClick={handleOperate(isEdit)}>
            <CustomIcon icon={icon} style={{color: '#6392ff', fontSize: '14px'}}/>
            <span className="operation-name">{operationName}</span>
          </div>
          <div className="send-button" onClick={handleSend}>发送</div>
        </div>
      </Modal>
    )
  }

}

export default NoteInfoModal
