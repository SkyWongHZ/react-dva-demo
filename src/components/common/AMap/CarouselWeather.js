import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import moment from 'moment';
import APILoader from 'react-amap/lib/utils/APILoader'

import './Weather.less';

class CarouselWeather extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      weather: '',
      temperature: '',
      weatherImage: '',

      weatherInfo: []
    }

    this.loader = new APILoader({key: props.amapkey}).load();
  }
  setWeatherState = ({weather, location}) => {

    weather.getForecast(location, (err, data) => {
      if (!err) {
        const images = [];
        console.log(data.forecasts);

        const weatherImage = (weather) => {
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
        }
        const weatherInfo = data.forecasts.slice(0,3).map(({dayWeather, date, dayTemp}, index) => {
          return {
            weather: dayWeather,
            temperature: dayTemp,
            weatherImage: weatherImage(dayWeather),
            date: index === 0 && '今天' || index === 1 && '明天' || index === 2 && '后天'
          }
        })
        this.setState({
          weatherInfo
        })
        // this.setState({
        //   weather: data.weather,
        //   temperature: data.temperature,
        //   weatherImage
        // })
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
    const { weatherImage, weather, temperature, weatherInfo } = this.state;
    const { location, className } = this.props;
    const containerClass = className ? className : "map-weather-container";
    return (
        <div className={containerClass}>
          {weatherInfo.length > 0 && <Carousel autoplay={true} dots={false} vertical adaptiveHeight >
            {weatherInfo.map(({weatherImage, temperature, weather, date}, index) => {
            	return (
                <div style={{height: 62}} key={index}>
                  {weatherImage !== '' && <img src={require(`../../../assets/images/weather/${weatherImage}.png`)} alt="" className="map-weather-image"/>}
                  <div className="map-weather-detail">
                    <div>
                      <span className="map-weather-temperature">{temperature}°C</span>
                      {date}
                    </div>
                    <div>
                      {/*<span>{location}</span>*/}
                      {weather}
                    </div>
                  </div>
                </div>
            	)
            })}
          </Carousel>}

        </div>
    )
  }
}

export default CarouselWeather

CarouselWeather.propTypes = {
  location: PropTypes.string.isRequired,
  interval: PropTypes.number,
  className: PropTypes.string,
  amapkey: PropTypes.string.isRequired
}
