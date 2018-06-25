import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import './CustomCarousel.less';

class CarouselExtend extends React.Component {
  render() {
    const count = React.Children.count(this.props.children);
    if(count > 3) {
      return (
        <div className="customCarouselContainer">
          <Carousel
            vertical
            autoplay={this.props.autoplay}
            speed={1000}
            autoplaySpeed={2000}
            dots={false}
          >
            {this.props.children}
          </Carousel>
        </div>
      );
    }
    return (
      <div className="custom-carousel-container">
        {this.props.children}
      </div>
    )
  }
}

export default CarouselExtend;

CarouselExtend.propTypes = {
  children: PropTypes.array,
};
