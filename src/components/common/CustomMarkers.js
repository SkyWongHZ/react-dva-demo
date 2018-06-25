import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import 'react-amap'

class Page extends React.Component {
  componentWillMount() {
    const { markers, __map__ } = this.props;

    const div = document.createElement('div');
    ReactDOM.render(this.props.dom, div);

    const { AMap } = window;

    const infoWindow = new AMap.InfoWindow({
      isCustom: true,
      content: div.innerHTML,
      offset: new AMap.Pixel(16, -45)
    })

    markers.forEach(({position}) => {
     	new AMap.Marker({
        map: __map__,
        position
      }).on('mouseover', () => {
       	infoWindow.open(__map__, position)
      }).on('mouseout', () => {
       	infoWindow.close()
      })
    })
  }
	render() {
	  return null;
  }
}


export default Page;

Page.propTypes = {
  markers: PropTypes.array,
  dom: PropTypes.element
}
