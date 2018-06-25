import { Table, Input, Icon, Button, Popconfirm, DatePicker, Select, InputNumber } from 'antd';
import moment from 'moment';

export default class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (value) => {
    this.setState({ value });
  }

  dateChange = (date) => {
    const value = date.format("YYYY-MM-DD");
    this.setState({ value });
  }

  check = () => {
    if (this.props.onChange) {
      let mark = this.props.onChange(this.state.value);
      // console.log(mark)
      if(mark === undefined){
        this.setState({ editable: false });
      }
    }
  }

  edit = () => {
    this.setState({ editable: true });
  }

  render() {
    let { value, editable } = this.state;
    
    if(editable && this.props.type === "datePicker"){
      value = value ? moment(value) : "";
    }else if(!editable && this.props.type === "datePicker"){
      value = value ? moment(value).format("YYYY-MM-DD") : "";
    }

    if(!editable && this.props.type === "select"){
      this.props.options.map( (data, index)=> {
        if(value == data.value) value = data.text;
      })
    }

    return (
      <div className="yk-editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">

              {!this.props.type &&
              <span>
                <Input
                  value={value}
                  onChange={ e=>this.handleChange(e.target.value)}
                  onPressEnter={this.check}
                  style={{width:this.props.width}}
                  className="editable-cell-input"
                />
                <Icon
                  type="check"
                  className="editable-cell-icon-check"
                  onClick={this.check}
                />
              </span>
              }

              {this.props.type === "inputNumber" &&
                <span>
                  <InputNumber
                    value={value}
                    onChange={this.handleChange}
                    onPressEnter={this.check}
                    style={{width:this.props.width}}
                    className="editable-cell-input"
                    {...this.props.config}
                  />
                  <Icon
                    type="check"
                    className="editable-cell-icon-check"
                    onClick={this.check}
                  />
                </span>
              }

              {this.props.type === "datePicker" &&
                <span>
                  <DatePicker
                    value={value}
                    onChange={this.dateChange}
                    onPressEnter={this.check}
                    style={{width:this.props.width}}
                    className="editable-cell-input"
                  />
                  <Icon
                    type="check"
                    className="editable-cell-icon-check"
                    onClick={this.check}
                  />
                </span>
              }

              {this.props.type === "select" &&
                <span>
                  <Select onChange={this.handleChange} style={{width:this.props.width}} value={value}>
                    {this.props.options.map( (data) => <Select.Option key={data.value}>{data.text}</Select.Option>)}
                  </Select>
                  <Icon
                    type="check"
                    className="editable-cell-icon-check"
                    onClick={this.check}
                  />
                </span>
              }
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {<span>{value}</span> || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}