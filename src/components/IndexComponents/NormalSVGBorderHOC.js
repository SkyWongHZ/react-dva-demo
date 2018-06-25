import React from 'react';
import ReactSVG from 'react-svg';
import styles from './NormalSVGBorderHOC.css';

import circle from '../svg/smallCircle.svg'
import arrowForTitle from '../svg/arrowForTitle.svg'
import contentBorder from '../svg/centerContentBorder.svg'

function SVGPolylineBorderHOC({title, orientation, circles, position, style, textStyle}) {
  const { width, height } = style;
  // position: up down
  const bottomRightLackLength = orientation === 'left' ? 28 : 15;
  const bottomLeftLackLength = orientation === 'left' ? 15 : 28;

  const positionFirstLetterUpper = position[0].toUpperCase() + position.slice(1)
  const orientationFirstLetterUpper = orientation[0].toUpperCase() + orientation.slice(1)
  const trianglePath = `turnTo${orientationFirstLetterUpper}Triangle.svg`;
  const triangle = require('../svg/' + trianglePath);

  const bottomCircleClass = styles[`bottom${orientationFirstLetterUpper + positionFirstLetterUpper}Circle`];
  const triangleClass = styles[`turnTo${orientationFirstLetterUpper}Triangle`];

 	return function HOCFactory(WrappedComponent) {
 	  return class HOC extends WrappedComponent {
 	  	render() {
 	  	  const { year, monitorName } = this.props;
 	  	  return (
 	  	    <div className={styles.normal} style={style}>
            <ReactSVG
              path={contentBorder}
              className={styles.contentBorder}
              callback={svg => {
                svg.setAttribute('width', width);
                svg.setAttribute('height', height);
                svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                let el = svg.getElementsByTagName("path")[0];

                const path = `M 0 0 H ${width} V ${height-bottomRightLackLength} L ${width-bottomRightLackLength} ${height} H ${bottomLeftLackLength} L 0 ${height-bottomLeftLackLength} Z`
                el.setAttribute('d', path);
                el.setAttribute('style', 'fill:rgba(4, 18, 27, 0.5);stroke:#035470;stroke-width:1px')
              }}
            />
            {title &&
              <ReactSVG
                path={arrowForTitle}
                className={styles.arrowForTitle}
              />
            }
            {circles && circles.map(({position}, index) => {
              const positionFirstLetterUpper = position[0].toUpperCase() + position.slice(1)
             	return (
                <ReactSVG
                  path={circle}
                  className={styles[`top${positionFirstLetterUpper}Circle`]}
                  key={index}
                />
              )
            })}

            <ReactSVG
              path={circle}
              className={bottomCircleClass}
            />
            <ReactSVG
              path={triangle}
              className={triangleClass}
            />
            {title && <span className={styles.text} style={textStyle}>{monitorName && year && year + monitorName + title.slice(2) || monitorName && !year && title.slice(0,2) + monitorName + title.slice(2) || !monitorName && year && year + title.slice(2) || title}</span>}
            <WrappedComponent {...this.props}/>
          </div>
        )
      }
 	  }
  }
}
export default SVGPolylineBorderHOC
