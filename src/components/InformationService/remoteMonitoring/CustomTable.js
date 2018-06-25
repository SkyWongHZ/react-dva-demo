import React from 'react';
import './CustomTable.less';

const CustomTable = ({columns, list, handleClick=()=>{}, tableWidth}) => {
  return (
    <div className="fwq-custom-table" style={{width: tableWidth}}>
      <div className="header">
        {columns.map((item, index) => {
          const { width, title } = item;
          return (
            <div style={{width: width}} className="header-item" key={index}>{title}</div>
          )
        })}
      </div>
      <div className="body">
        {list && list.map((item,index) => {
          return (
            <div className="body-item-group" key={index} onClick={handleClick(item)}>
              {columns.map((column, i) => {
                const { width, key, format=null, warnColor='inherit', prompt } = column;
                const pxWidth = width.indexOf('%') > -1 ? parseFloat(tableWidth) * parseFloat(width) / 100 + 'px' : width;

                let content = Array.isArray(key) ? key.reduce((prevKey, CurKey) => {
                  return item[prevKey] + item[CurKey]
                }) : (key === 'percent' ? parseFloat(item[key]) + '%' :item[key]);
                if(format) {
                  content = format(item[key])
                }
                if(i === 0) {
                  let order;
                  order = index > 8 ? index + 1 : '0' + (index+1);
                  if(format) {
                    order = format(index);
                  }
                  return <div style={{width: pxWidth}} className="body-item" key={index+i}>{order}</div>
                }
                return (
                  <div style={{width: pxWidth, color: item.over && warnColor || 'inherit'}} className="body-item" key={index+i}>
                    {content}
                    {prompt && <div className="prompt">
                      <div className="count">{item[prompt]}</div>
                    </div>}
                  </div>
                )
              })}
              <div className="hover-block"></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomTable
