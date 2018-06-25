/***
 * table组件 定制了表头样式
 */
import React, {Component}from 'react';
import {Table} from 'antd';
import config from '../../config';
import './PublicComponentsStyle.less';
class MyTable extends Component {

    componentDidMount () {

    }

    render () {
        if (this.props.columns && this.props.columns.length !== 0) {
            for (let i = 0; i < this.props.columns.length; i++) {
                this.props.columns[i].className =
                    this.props.columns[i].className ? this.props.columns[i].className + ' myTable' : 'myTable';
            }
        } else {
            // console.log('MyTable: columns 值为 ' + this.props.columns)
        }
        // console.log(this.props.columns, 'items');
        return (
            <div className="wp-table">
                <Table {...this.props} />
            </div>
        )
    }
}

export default MyTable;
