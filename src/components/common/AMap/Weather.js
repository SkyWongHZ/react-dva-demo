import React from 'react';
import PropTypes from 'prop-types';
import APILoader from 'react-amap/lib/utils/APILoader'

import'./Weather.less';

class Weather extends React.Component {
  constructor (props) {
  	super(props)
  	this.state = {
  		weather: '',
      temperature: '',
      weatherImage: ''
  	}

    this.loader = new APILoader({key: props.amapkey}).load();
  }
  setWeatherState = ({weather, location}) => {

    weather.getLive(location, (err, data) => {
      if (!err) {
        const weatherImage = ((weather) => {
          switch (true) {
            case weather === '阴' || weather === '多云': {
              return 'cloudy'
            }
            case weather === '晴': {
              return 'sunny'
            }
            case weather.indexOf('雨') > -1: {
              return 'rainy'
            }
            case weather.indexOf('雪') > -1: {
              return 'snow'
            }
            default: {
              return 'na'
            }
          }
        })(data.weather)

        this.setState({
          weather: data.weather,
          temperature: data.temperature,
          weatherImage
        })
      }
    });
  }
  componentDidMount() {


    const self = this;
    const { location, interval = 1000 * 60 * 60 } = this.props;
    this.loader.then(() => {
      const { AMap } = window;
      AMap.service('AMap.Weather', function() {
        var weather = new AMap.Weather();

        self.intervalId = setInterval(() => {
          self.setWeatherState({weather, location})
        }, interval)

        self.setWeatherState({weather, location})
      });
    })

  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

	render() {
    const { weatherImage, weather, temperature } = this.state;
    const { location, className } = this.props;
    const containerClass = className ? className : "mapWeatherContainer";
    // console.log('this.')
    return (
     <div className={containerClass}>
        {weatherImage !== ''&&<img src={require(`../../../assets/images/cloudy.png`)} alt=""  className={'show-img'}/>}
        {/* {weatherImage !== '' && <img src={require(`../../../assets/images/weather/${weatherImage}.png`)} alt="" />} */}
       <div className="map-weather-detail">
         <div>
           <span>{temperature}°C</span>
          {weather}
         </div>
         <div> {location}</div>
       </div>
     </div>
    )
  }
}

export default Weather

Weather.propTypes = {
  location: PropTypes.string.isRequired,
  interval: PropTypes.number,
  className: PropTypes.string,
  amapkey: PropTypes.string.isRequired
}
