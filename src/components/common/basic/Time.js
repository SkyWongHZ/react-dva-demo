import React from 'react';
import moment from 'moment'
import './Time.less'

class Time extends React.Component {
  constructor (props) {
  	super(props)
  	this.state = {
  		time: Date.now(),
  	}
  }
  componentDidMount() {
    this.timeId = setInterval(() => {
      this.setState({
        time: Date.now(),
      })
    }, 1000)
  }
  componentWillUnmount() {
    clearTimeout(this.timeId)
  }
	render () {
    return <span className="navagation">{moment(this.state.time).format("YYYY-MM-DD HH:mm:ss")}</span>
  }
}

export default Time



