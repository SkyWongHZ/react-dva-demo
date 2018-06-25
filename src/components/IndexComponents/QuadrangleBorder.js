import React from 'react';
import styles from './QuadrangleBorder.css'

const quadrangleBorder = ({radius=12, style}) => {
  // 调用此组件需将该组件作为其父组件的第一个子组件，且后续子组件需设置position,relative或者absolute都行，或者会被该组件覆盖。
 	return (
 	  <div className={styles.normal} style={style}>
      <div className={styles.borderSmallRightBottom} style={{width: radius, height: radius}}></div>
      <div className={styles.borderSmallLeftBottom} style={{width: radius, height: radius}}></div>
      <div className={styles.borderSmallRightTop} style={{width: radius, height: radius}}></div>
      <div className={styles.borderSmallLeftTop} style={{width: radius, height: radius}}></div>
    </div>
  )
}

export default quadrangleBorder
