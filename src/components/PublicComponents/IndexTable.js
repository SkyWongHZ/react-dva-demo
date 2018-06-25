import { Pagination, Tooltip } from 'antd';
//import "./IndexTable.less"
import './IndexTable.less';

class DetailTable extends React.Component {
  state = {
  }

  // getData = (option = this.state.option, pageSize = 4, pageIndex = 1) => {
    // console.log(option)
    // if (option.name != "取水量") {
    //   request({ url: option.url, method: 'GET', params: { pageSize: pageSize, pageIndex: pageIndex } }).then(res => {
    //     this.setState({
    //       tableData: res.ret.items,
    //       option: option,
    //       total: res.ret.rowCount
    //     })
    //   })
    // } else {
    //   let data = JSON.stringify({ pageSize: pageSize, pageNo: pageIndex, states: [0, 1], percent: null })
    //   requestTwo({ url: option.url, method: 'POST', data }).then(res => {
    //     this.setState({
    //       tableData: res.ret.items,
    //       option: option,
    //       total: res.ret.rowCount
    //     })
    //   })
    // }
  // }

  getData = (pageNo, pageSize) => {
    let { handChange } = this.props;
    handChange(pageNo, pageSize);
  }

  headerClick = () => {
    // console.log("click");
  }

  render() {
    let t = this;
    let len = this.props.header ? this.props.header.length : 0;
    console.log('this.props', this.props)
    return (
      <div className="detail-table">
        {/* <p className="detail-table-back" onClick={this.props.cancelClick}><i className="iconfont icon-shouqi"></i>返回</p> */}
        <div className="contentContainer">
          <ul className="contentNav" >
            {this.props.header && this.props.header.map((data, index) => {
              return (
                <li key={index} className="contentList" style={{ width: `${100 / len}%` }} onClick={data.headerClick || null}>
                  {this.props.header.length - 1 > index && <img src={require("../../assets/images/line1.png")} className="line" />}
                  <i className={`iconfont ${data.icon}`}></i>{data.name}
                </li>
              )
            })}

            <span className="borderSmall borderSmallLeftTop"></span>
            <span className="borderSmall borderSmallRightTop"></span>
            <span className="borderSmall borderSmallLeftBottom"></span>
            <span className="borderSmall borderSmallRightBottom"></span>
          </ul>

          {this.props.tableData.map((data, index) => {
            let name = "dataNav";
            return (
              <ul className={name} key={index} style={this.props.select && { "cursor": "pointer" }}>
                {this.props.tableData && this.props.header.map((data1, index1) => {
                  if (data[data1.key] && !data1.render) {
                    return (
                      //<Tooltip title={data[data1.key]} key={index1}>
                        <li className="dataList" style={{ width: `${100 / len}%` }} key={index1}>{data[data1.key]}</li>
                      //</Tooltip>
                    )
                  } else {
                    return (
                      //<Tooltip title={data1.render && data1.render(index, data)} key={index1}>
                        <li className="dataList" style={{ width: `${100 / len}%` }}  key={index1}>{(data1.render && data1.render(index, data))}&nbsp;</li>
                      //</Tooltip>
                    )
                  }
                })}
              </ul>
            )
          })}
        </div>
        {
          t.props.addBtnShow &&
          <span onClick={t.props.addBtn.bind(t)} className='addbtn'>
            <i className="iconfont icon-zengjia1" />
            <span className='addtext'>新增</span>
          </span>
        }
        
        {
          this.props.total>0 &&
          <Pagination
            defaultCurrent={1}
            total={this.props.total}
            defaultPageSize={this.props.pageSize}
            pageSize={this.props.pageSize}
            className="table-pagination"
            size="small"
            showQuickJumper={true}
            onChange={(page, pageSize) => this.getData(page, pageSize)}
          />
        }
      </div>
    )
  }
}

export default DetailTable