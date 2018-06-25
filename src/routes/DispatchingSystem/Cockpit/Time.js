import React from 'react';
import moment from 'moment'

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
	  return <span>{moment(this.state.time).format("YYYY-MM-DD HH:mm:ss")}</span>
  }
}

export default Time
