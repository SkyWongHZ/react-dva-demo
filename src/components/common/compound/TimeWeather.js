import React from 'react';
import PropTypes from 'prop-types'

import Weather from '../AMap/Weather';
// import CarouselWeather from '../AMap/CarouselWeather';
import Time from '../basic/Time';

import styles from'./TimeWeather.less'

const TimeWeather = ({location, interval, className, weatherClassName}) => {
  const containerClass = className ? `${className} compoundTimeWeather` : `compoundTimeWeather`;
 	return (
 	  <div className={containerClass}>
      <Time/>
      <img src={require("../../../assets/images/line1.png")} className="split-line" />
        {/* <CarouselWeather location={location} interval={interval} className={weatherClassName} amapkey='b093e2806b5b2dc88e652b8ce1dcf339' /> */}
        <Weather location={location}  className={weatherClassName} amapkey='b093e2806b5b2dc88e652b8ce1dcf339' />
    </div>
  )
}

export default TimeWeather

TimeWeather.propTypes = {
  location: PropTypes.string,
  className: PropTypes.string
}
