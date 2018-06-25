import React from 'react';
import PropTypes from 'prop-types';

import './AMapSelector.less';

class AMapSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      index: -1
    };
  }

  handleHide = () => {
    this.setState({
      visible: false
    })
  };

  handleOpen = () => {
    this.setState({
      visible: true
    })
  };

  render() {
    const { selectors, selectorName, selectorSrc, selectorKey, formatSrc, handleSelect, isMaxMap } = this.props;

    const { visible } = this.state;
    // console.log('formatSrc', formatSrc)
    // console.log('selector', selector)
    // console.log('selectorSrc', selectorSrc)
    return (
      <div className={isMaxMap ? 'maxMapSelector mapSelector' : 'mapSelector'}>
        {(visible &&
          <div className="map-selector-bar">
            <div className="map-selector-header" onClick={this.handleHide}>
              <i className="iconfont icon-shouqi" />
              测点类型
            </div>
            <div className="map-selector-body">
              {
                selectors.map((selector, index) => {
                 	return (
                 	  <div className={index === this.state.index ? "map-selector-item-active map-selector-item" :"map-selector-item"} key={index} onClick={()=>{
                      if(index === this.state.index) {
                        this.setState({
                          index: -1
                        })
                      } else {
                        this.setState({
                          index
                        })
                      }
                 	    handleSelect(selector[selectorKey])
                    }}>
                      <img src={formatSrc(selector[selectorSrc])} alt="" className="map-selector-item-image"/>
                      {/* <div className="map-selector-item-name">{selector[selectorName]}</div> */}
                    </div>
                  )
                })
              }
            </div>
          </div>) ||
          <div className="map-selector-expand" onClick={this.handleOpen}>
            <i className="iconfont icon-shouqi" />
          </div>}
      </div>
    );
  }
}

export default AMapSelector;

AMapSelector.defaultProps = {
  formatSrc: src => src,
  handleSelect: () => {},
  selectorName: 'name',
  selectorSrc: 'src',
  selectorKey: 'id',
}

AMapSelector.propTypes = {
  selectors: PropTypes.arrayOf(PropTypes.object).isRequired,
  formatSrc: PropTypes.func,
  handleSelect: PropTypes.func,
  selectorName: PropTypes.string,
  selectorSrc: PropTypes.string,
  selectorKey: PropTypes.string
}
