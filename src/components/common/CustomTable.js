import React from 'react';
import { Table } from 'antd';
import './Custom.less'

const CustomTable = ({dataSource, columns, pagination, onRowClick, rowSelection, rowClassName, title,x, y1, y2, id='key', loading=false}) => {
  if(screen.width >= 1920) {
    columns && columns.forEach((column) => {
     	delete column.fixed
    })
  }
 	return (
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={pagination || false}
        className='fwq-custom-table'
        onRowClick={onRowClick}
        rowSelection={rowSelection || null}
        rowClassName={rowClassName}
        title={title}
        rowKey={(record) => {
         	return record[id]
        }}
        loading={loading}
        scroll={{x: x !== undefined ? x : 1653, y: screen.width < 1920 ? y1 : y2}}
      />
  )
}

export default CustomTable
