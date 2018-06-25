import React from 'react';
import { Table, Pagination } from 'antd';
import './CockpitTable.less'

const CockpitTable = ({ columns, dataSource, pageSize, total, tableClick, title }) => {
  return (
    <div onClick={tableClick}>
      <Table
        style={{overflow:'hidden'}}
        columns={columns}
        dataSource={dataSource}
        className="cockpitTable"
        title={() => title}
        // pagination={{ pageSize, total, size: 'small' }}
        pagination={false}
      />
    </div>
  )
}

export default CockpitTable
