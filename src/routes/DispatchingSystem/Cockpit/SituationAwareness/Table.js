import { Pagination, Tooltip } from 'antd';
import request from '../../../../utils/request';
import requestTwo from '../../../../utils/requestTwo';



class DetailTable extends React.Component {
  state = {
    isDetail: true,
    option: null,
    tableData: [],
    total : 0,
    pageSize: 4,
    pageIndex: 1,
  }

  componentDidMount() {
    const tableOption = [
      {
        name: "正常运行率",
        url: "/wl/overview/dashboard/getDashboard",
        type:1,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render:(index)=>{
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name',
        }, {
          name: '正常运行率(%)',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
      {
        name: "吨水电耗",
        url: "/wl/overview/dashboard/getDashboard",
        type:5,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render: (index) => {
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name'
        }, {
          name: '吨水电耗（kw.h/m3)',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
      {
        name: "出水达标率",
        url: "/wl/overview/dashboard/getDashboard",
        type:2,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render: (index) => {
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name'
        }, {
          name: '出水达标率（%）',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
      {
        name: "吨水药耗",
        url: "/wl/overview/dashboard/getDashboard",
        type:6,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render: (index) => {
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name'
        }, {
          name: '吨水药耗(L/t)',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
      {
        name: "流量",
        url: "/wl/overview/dashboard/getDashboard",
        type:3,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render: (index) => {
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name'
        }, {
          name: '产水流量（m³/s）',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
      {
        name: "运行负荷",
        url: "/wl/overview/dashboard/getDashboard",
        type:7,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render: (index) => {
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name'
        }, {
          name: '运行负荷(%)',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
      {
        name: "污水处理量",
        url: "/wl/overview/dashboard/getDashboard",
        type:4,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render: (index) => {
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name'
        }, {
          name: '处理水量(m³)',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
      {
        name: "故障率",
        url: "/wl/overview/dashboard/getDashboard",
        type:8,
        header: [{
          name: '排名',
          icon: 'icon-paiming',
          key: 'top',
          render: (index) => {
            return index+1+(this.state.pageIndex-1)*4
          }
        }, {
          name: '项目名称',
          icon: 'icon-xiangmu',
          key: 'name'
        }, {
          name: '故障率（%）',
          icon: 'icon-ziyuan',
          key: 'value'
        }]
      },
    ]
    let option;
    tableOption.map((data, index) => {
      if (data.name == this.props.name) {
        option = data;
        return false;
      };
    });
    this.getData(option);
  }

  getData = (option = this.state.option, pageSize = 4, pageIndex = 1) => {
    console.log(pageIndex,777);
    if (option.name != "取水量") {
      request({ url: option.url, method: 'GET', params: { pageSize: pageSize, pageNo: pageIndex,type:option.type } }).then(res => {
        this.setState({
          tableData: res.ret.items,
          option: option,
          total: res.ret.rowCount,
          pageIndex: pageIndex
        })
      })
    } else {
      let data = JSON.stringify({ pageSize: pageSize, pageNo: pageIndex, states: [0, 1], percent: null })
      requestTwo({ url: option.url, method: 'POST', data }).then(res => {
        this.setState({
          tableData: res.ret.items,
          option: option,
          total: res.ret.rowCount,
          pageIndex: pageIndex
        })
      })
    }
  }

  render() {
    
    let len = this.state.option ? this.state.option.header.length : 0;
    return (
      <div className="detail-table">
        <p className="detail-table-back" onClick={this.props.cancelClick}><i className="iconfont icon-shouqi"></i>返回</p>
        <div className="contentContainer">
          <ul className="contentNav" >
            {this.state.option && this.state.option.header.map((data, index) => {
              return (
                <li key={index} className="contentList" style={{ width: `${100 / len}%` }}><i className={`iconfont ${data.icon}`}></i>{data.name}</li>
              )
            })}

            <span className="borderSmall borderSmallLeftTop"></span>
            <span className="borderSmall borderSmallRightTop"></span>
            <span className="borderSmall borderSmallLeftBottom"></span>
            <span className="borderSmall borderSmallRightBottom"></span>
          </ul>

          {this.state.tableData.map((data, index) => {
            let name = "dataNav";
            return (
              <ul className={name} onClick={(e) => this.handClick(index, data)} key={index} style={this.props.select && { "cursor": "pointer" }}>
                {this.state.option && this.state.option.header.map((data1, index1) => {
                  //console.log(data[data1.key])
                  if (data[data1.key] && !data1.render) {
                    return (
                      <Tooltip title={data[data1.key]}>
                        <li key={index1} className="dataList" style={{ width: `${100 / len}%` }}>{data[data1.key]}</li>
                      </Tooltip>
                    )
                  } else {
                    return (
                      <Tooltip title={data1.render && data1.render(index, data)}>
                        <li key={index1} className="dataList" style={{ width: `${100 / len}%` }}>{(data1.render && data1.render(index, data))}&nbsp;</li>
                      </Tooltip>
                    )
                  }
                })}
              </ul>
            )
          })}
        </div>

        <Pagination
          defaultCurrent={1}
          total={this.state.total}
          defaultPageSize={this.state.pageSize}
          className="table-pagination"
          size="small"
          onChange={(page, pageSize) => this.getData(this.state.option, this.state.pageSize, page)}
        />
      </div>
    )
  }
}

export default DetailTable