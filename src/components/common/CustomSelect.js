import React from 'react';
import './Custom.less';

import { Select } from 'antd';
const { Option } = Select;

/*
* 如果传的是一个数组对象，如[{name:'xx',key:1}],则设置optionName为name, optionKey为key.
* 如果传的是一个数组，如['xx','yy']，则不用传optionName, optionKey*/

const CustomSelect = ({label, options, optionName, optionKey, value, handleChange}) => {
  return (
    <div className="fwq-custom fwq-selector">
      <label className="label">{label}</label>
      <Select onChange={handleChange} value={value} className='fwq-select'>
        {options.map((option) => {
          return <Option key={optionKey ? option[optionKey] : option}>{optionName ? option[optionName] : option}</Option>
        })}
      </Select>
    </div>

  )
}

export default CustomSelect;
