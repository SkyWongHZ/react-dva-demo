import React from 'react';

import { Select } from 'antd';
const { Option } = Select;

/*
 * 如果传的是一个数组对象，如[{name:'xx',key:1}],则设置optionName为name, optionKey为key.
 * 如果传的是一个数组，如['xx','yy']，则不用传optionName, optionKey*/

const SimpleModalSelect = ({form, name, initialValue, options, optionName='text', optionKey='value'}) => {
  const { getFieldDecorator } = form;
  return (
    getFieldDecorator(name, {initialValue})(
      <Select>
        {options.map((option) => {
          return <Option key={typeof option === 'object' ? option[optionKey] : option}>{typeof option === 'object' ? option[optionName] : option}</Option>
        })}
      </Select>
    )
  );
}

export default SimpleModalSelect;
