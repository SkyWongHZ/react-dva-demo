import React from 'react';
import Echarts from 'echarts-for-react';

const TableCharts = ({option, className, style, showChart}) => {
  return (
    <div style={{position: 'relative', ...style}}>
      {showChart && <div style={{width: '5px', height: '16px', backgroundColor: '#3996ff', position: 'absolute', left: 0, top: screen.width < 1920 ? '10px': '25px'}}></div>}
      {option && <Echarts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className={className}
        style={{height: '100%', width: '100%'}}
      />}
    </div>
  )
}

export default TableCharts
