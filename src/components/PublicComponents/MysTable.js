import React, {Component}from 'react';
import {Table} from 'antd';
import config from '../../config';
import './PublicComponentsStyle.less';

const columns = [
    { title: '序号', dataIndex: 'number', key: '1' },
    { title: '上报时间', dataIndex: 'time', key: '2' },
    { title: '报告名称', dataIndex: 'name', key: '3',
        render: function(text, data, index){
            console.log(data)
            return(<div>{sing ? 1111: 222}</div>)
        }
},
    {
        title: '报告附件',
        key: 'attachment',
        render: () => <a href="#"><em className="download"></em></a>,
      }
  ]; 
  
  const data = [{
    key: '1',
    time:'2011-01-11',
    name: "2011年水资源表111",
    sing: true
  },{
    key: '2',
    time:'2011-01-11',
    name: "2011年水资源表222",
    sing: true
  },{
    key: '3',
    time:'2011-01-11',
    name: "2011年水资源表",
    sing: false
  }
];
class MysTable extends Component {
    state = {
        new: false,
      }
      handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
      }
     render (){
        return (
            <div>
              <Table bordered dataSource={dataSource} columns={columns} />
            </div>
          );
     }

    }
    
    export default MyTable;