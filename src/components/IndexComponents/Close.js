import React from 'react';
import classNames from 'classnames'
import styles from './Close.css'

const Close = ({className, onClose}) => {
  const close = classNames({
    [className]: true,
    [styles.close]: true
  })

 	return (
 	  <div className={close} onClick={onClose}>
      <i className="iconfont icon-guanbi"></i>
    </div>
  )
}

export default Close
