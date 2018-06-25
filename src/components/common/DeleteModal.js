import React from 'react';

import { Modal } from 'antd';
import './DeleteModal.less'

const DeleteModal = ({visible, onOk, onCancel, children, title}) => {
 	return (
    <Modal className="fwq-modal-delete"
           title={title}
           visible={visible}
           onOk={onOk}
           onCancel={onCancel}
    >
      <p style={{textAlign: 'center'}}>{children}</p>
    </Modal>
  )
}

export default DeleteModal;
