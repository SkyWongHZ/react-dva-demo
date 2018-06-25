import React from 'react';
import './WaterPercent.less'

const WaterPercent = ({percent, width, height, fontSize='12px', color='#6392FF'}) => {
  const correctedPercent = 100 - Math.min(percent, 100);
 	return (
 	  <div className="water-percent" style={{width, height}}>
      <svg viewBox="0 0 100 100" width={width.replace(/\D/g, '')} height={height.replace(/\D/g, '')}
           xmlns="http://www.w3.org/2000/svg"
           xmlnsXlink="http://www.w3.org/1999/xlink">
        <circle  cx="50" cy="50" r="40" stroke={color} fill="none"></circle>
        <defs>
          <circle id="circleClip" cx="50" cy="50" r="40" fill="#fff"/>

          <clipPath id="clipPath">
            <use xlinkHref="#circleClip" overflow="visible"/>
          </clipPath>

        </defs>

        <g>
          <use xlinkHref="#circleClip" fill="#A4CAE1"/>
          <g clipPath="url(#clipPath)">
            <g id="waveContainer" style={{transform: `translateY(${correctedPercent}px)`}}>
              <path d="M 0 100
                    L 0 0
                    Q 25 10, 50 0
                    T 100 0
                    Q 125 10, 150 0
                    T 200 0
                    L 200 100
                    Z"
                    fill={color}
                    id="wave"
              />
            </g>
          </g>
        </g>
      </svg>
      <div className="percent" style={{width, height, fontSize}}><span>{percent}%</span></div>
    </div>
  )
}

export default WaterPercent
