import React from 'react';
import { Table } from 'antd';

class ThreeLevelTable extends React.Component {
    state = {

    }

    render() {
        if (this.props.columns && this.props.columns.length !== 0) {
            for (let i = 0; i < this.props.columns.length; i++) {
                this.props.columns[i].className =
                    this.props.columns[i].className ? this.props.columns[i].className + ' myTable' : 'myTable';
            }
        } else {
            // console.log('MyTable: columns 值为 ' + this.props.columns)
        }
        return (
            <div className="sky-threeLevel-table">
                <Table {...this.props} />
            </div>
        )
    }
}

export default ThreeLevelTable;
