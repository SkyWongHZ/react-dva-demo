import React from 'react';

const TimePeriod = ({value, onChange}) => {
  const handleClick = ({target}) => {
    const value = target.getAttribute('value');
    onChange(value)
  }
 	return (
    <div className="time-period" onClick={handleClick}>
      <div className={`time-period-item ${value == 1 ? 'time-period-item-active': ''}`} value='1'>今天</div>
      <div className={`time-period-item ${value == 2 ? 'time-period-item-active': ''}`} value="2">近一周</div>
      <div className={`time-period-item ${value == 3 ? 'time-period-item-active': ''}`} value="3">近一个月</div>
      <div className={`time-period-item ${value == 4 ? 'time-period-item-active': ''}`} value="4">近三个月</div>
    </div>
  )
}

export default TimePeriod
