import React from 'react';
import { Button } from 'antd';

const SearchButton = ({handleClick}) => {
  return <Button type="primary" onClick={handleClick} className='fwq-search-button'>查询</Button>
}

export default SearchButton
