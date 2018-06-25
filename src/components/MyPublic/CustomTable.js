import React from 'react';
import {Table} from 'antd';

// 自定义的表格--Sky
class CustomTable extends React.Component {
  state={

  }
 
  render() {  
     return (
        <div>            
            <Table {...this.props} />
        </div>
    )
  }
}

export default CustomTable;
