import React from 'react';
import ReactSVG from 'react-svg';
import emptySvg from '../svg/customSvg.svg'
import styles from './CustomSvg.less';

import circle from '../svg/smallCircle.svg'
import arrowForTitle from '../svg/arrowForTitle.svg'
import contentBorder from '../svg/centerContentBorder.svg'

class CustomSvg extends React.Component {

  changeSvgBorder = (svg) => {
    const {orientation} = this.props;
    const {width, height} = this.props.style;
    
    const bottomRightLackLength = orientation === 'left' ? 28 : 15;
    const bottomLeftLackLength = orientation === 'left' ? 15 : 28;

    const path = `M 0 0 H ${width} V ${height-bottomRightLackLength} L ${width-bottomRightLackLength} ${height} H ${bottomLeftLackLength} L 0 ${height-bottomLeftLackLength} Z`;
    let el = svg.getElementsByTagName("path")[0];

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    el.setAttribute("d", path);
  }

  render(){
    let position = this.props.position || "up" 
    const positionFirstLetterUpper = position[0].toUpperCase() + position.slice(1)
    const orientationFirstLetterUpper = this.props.orientation[0].toUpperCase() + this.props.orientation.slice(1)
    const trianglePath = `turnTo${orientationFirstLetterUpper}Triangle.svg`;
    const triangle = require('../svg/' + trianglePath);
    const bottomCircleClass = styles[`bottom${orientationFirstLetterUpper + positionFirstLetterUpper}Circle`];
    const triangleClass = styles[`turnTo${orientationFirstLetterUpper}Triangle`];

    return (
      <div className={styles.normal} style={this.props.style}>
        <ReactSVG
					path={emptySvg}
          callback={svg => this.changeSvgBorder(svg)}
				/>
        <ReactSVG
          path={arrowForTitle}
          className={styles.arrowForTitle}
        />
        {this.props.circles && this.props.circles.map(({position}) => {
          const positionFirstLetterUpper = position[0].toUpperCase() + position.slice(1)
          return (
            <ReactSVG
              path={circle}
              className={styles[`top${positionFirstLetterUpper}Circle`]}
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
        <span className={styles.text} style={this.props.textStyle}>{this.props.title}</span>
      </div>
    )
  }
}

export default CustomSvg