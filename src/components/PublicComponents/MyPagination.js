import React from 'react';
import { Pagination } from 'antd';
import config from '../../config';

const MyPagination = WrappedComponent => {
  return class extends WrappedComponent {
    componentWillMount() {
      console.log(this.instanceComponent, 'instanceComponent');
      this.setState({
        pageSize: config.pageSize,
        pageNo: 1,
      });
    }

    onChangePage = (page, size) => {
      this.instanceComponent.onChangePage(page, size)
      this.setState({
        pageNo: page,
        pageSize: config.pageSize
      })
    }

    setPageNo = (num) => {
      this.setState({
        pageNo: num,
        pageSize: config.pageSize
      })
    }

    render() {
      // return super.render(
        // console.log(this.instanceComponent)
        return(
        <div>
          <WrappedComponent
            {...this.props}
            {...this.state}
            setPageNo={this.setPageNo}
            ref={instanceComponent => this.instanceComponent = instanceComponent}
          />
          <div onClick={this.handClick}>fdfa</div>
          <Pagination 
              className="yk-custom-pagination"
              showQuickJumper={this.onChangePage} 
              showQuickJumper={true}
              current={this.state.pageNo} 
              total={this.state.total} 
              onChange={this.onChangePage}
          />
        </div>
      )
    }
  }
}

export default MyPagination;

