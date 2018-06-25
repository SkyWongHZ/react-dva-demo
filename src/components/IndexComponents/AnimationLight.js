import React from 'react'
import styles from './AnimationLight.less';

class AnimationLight extends React.Component {
  componentDidMount() {
  }

  handClick = (index, data) => {
    if (this.props.handClick) this.props.handClick(index, data)
  }

  render() {
    return (
      <div className={styles[this.props.name]} style={this.props.position}></div>
    )
  }
}

export default AnimationLight;

