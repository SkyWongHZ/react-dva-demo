import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({className, current, pageSize, total, onChange}) => {
 	return (
 	  <div className={className}>
      <Pagination
        current={current}
        pageSize={pageSize}
        showQuickJumper
        total={total}
        onChange={onChange}
      />
    </div>
  )
}

export default CustomPagination
