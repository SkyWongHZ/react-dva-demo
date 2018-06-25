import React from 'react';
import ReactSVG from 'react-svg';
import classNames from 'classnames';
import { Link } from "dva/router";

import styles from './LeftSVGPolylineBorderHOC.css';

import circle from '../../svg/circle.svg'
import smallCircle from '../../svg/smallCircle.svg'
import arrowForTitle from '../../svg/arrowForTitle.svg'
import polylineForArrow from '../../svg/polylineForArrow4.svg'

function SVGPolylineBorderHOC({title,position='left', isFirstColumn=false, bottomSvgPosition='left', path}) {
  const titleLength = title.length;

  const polylineForArrowWidthList = {
    2: 78,
    3: 93,
    4: 112,
    5: 121
  }
  const polylineForArrowWidth = polylineForArrowWidthList[titleLength]

  const normal = classNames({
    [styles.normal]: true,
    [styles.marginRight28]: isFirstColumn
  })

  const firstUpperPosition = position[0].toUpperCase() + position.slice(1)
  const contentBorderPath = `leftContent${firstUpperPosition}Border.svg`;
  const contentBorder = require('../../svg/' + contentBorderPath);

  const arrowPath = `arrow${titleLength-1}`;
  const arrow = require('../../svg/' + arrowPath + '.svg')

  const firstUpperBottomPosition = bottomSvgPosition[0].toUpperCase() + bottomSvgPosition.slice(1)
  const trianglePath = `turnTo${firstUpperBottomPosition}Triangle.svg`;
  const triangle = require('../../svg/' + trianglePath);

  const arrowClass = [styles[arrowPath]]
  const polylineForArrowClass = styles[`polylineForArrow${titleLength-1}`];
  const bottomCircleClass = styles[`bottom${firstUpperBottomPosition}Circle`];
  const triangleClass = styles[`turnTo${firstUpperBottomPosition}Triangle`];
  const smallestCircle = styles[`smallest${firstUpperPosition}Circle`]

  return function HOCFactory(WrappedComponent) {
    return class HOC extends WrappedComponent {
      render() {
        return (
          <div className={normal}>
            <ReactSVG
              path={contentBorder}
              className={styles.contentBorder}
            />
            <Link className={styles.title} style={{width: polylineForArrowWidthList[titleLength]}} to={`/${path}`}>
              <img src={arrow} alt="" className={arrowClass}/>
              <ReactSVG
                path={polylineForArrow}
                className={polylineForArrowClass}
                callback={svg => {
                  svg.setAttribute('width', polylineForArrowWidth)
                  svg.setAttribute('viewBox', `0 0 ${polylineForArrowWidth} 33`)
                }}
              />
              <span className={styles.text}>{title}</span>
            </Link>

            <ReactSVG
              path={smallCircle}
              className={styles.smallCircle}
            />

            <ReactSVG
              path={arrowForTitle}
              className={styles.arrowForTitle}
            />
            <ReactSVG
              path={circle}
              className={styles.topRightCircle}
            />
            <ReactSVG
              path={circle}
              className={bottomCircleClass}
            />
            <ReactSVG
              path={triangle}
              className={triangleClass}
            />

            <WrappedComponent {...this.props}/>
            <div className={smallestCircle}></div>
          </div>
        )
      }
    }
  }
}
export default SVGPolylineBorderHOC
