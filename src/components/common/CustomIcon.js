import React from 'react'

const CustomIcon = ({icon, style, handleClick}) => {
 	return <i className={`fwq-custom-icon iconfont ${icon}`} style={style} onClick={handleClick}></i>
}

export default CustomIcon
