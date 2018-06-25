import React from 'react';
import PropTypes from 'prop-types';

import'./AMapStateBar.less'

const StateBar = ({states, stateColors, barClassName}) => {
 	return (
      <div className={barClassName ? `mapStateBar  ${barClassName}` : 'mapStateBar'}>
      {states.map(({name, value}, index) => {
        return (
          <div className='map-state-item' key={index}>
            <span className='map-state-circle' style={{backgroundColor: stateColors[index]}}></span>
            <span>{name}：{value}</span>
          </div>
        )
      })}
    </div>
  )
}

export default StateBar;

StateBar.defaultProps = {
  stateColors: ['#ff3942', '#a9a9a9', '#1acaff', '#F9A835'],
}

StateBar.propTypes = {
  states: PropTypes.arrayOf(PropTypes.object).isRequired,
  stateColors: PropTypes.array.isRequired,
  barClassName: PropTypes.string
}



