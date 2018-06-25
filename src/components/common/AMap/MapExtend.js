import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'react-amap'

class MapExtend extends Map {
  constructor (props) {
    super(props)
  }

  renderChildren() {
    const { amapkey, children } = this.props;
    return React.Children.map(children, (child) => {
      // 过滤原生dom
      if(typeof child.type === 'string') {
        return child
      }
      return React.cloneElement(child, {amapkey})
    })
  }

  render() {
    const elementsTree = super.render()
    return React.cloneElement(elementsTree, elementsTree.props, this.renderChildren())
  }
}

export default MapExtend

MapExtend.defaultProps = {
  amapkey: 'f97efc35164149d0c0f299e7a8adb3d2'
}

MapExtend.propTypes = {
  amapkey: PropTypes.string.isRequired,
  location: PropTypes.string
}
