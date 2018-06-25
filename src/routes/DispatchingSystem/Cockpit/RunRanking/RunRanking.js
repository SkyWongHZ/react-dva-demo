import React from 'react'
import request from '../../../../utils/request';
import IndexTable from '../../../../components/PublicComponents/IndexTable';
import IndexFiltrate from '../../../../components/PublicComponents/IndexFiltrate';
import config from '../../../../config';
import './RunRanking.less';
import moment from 'moment';
import MyIcon from '../../../../components/PublicComponents/MyIcon';
import { connect } from 'dva';

@connect(({ cockpit, loading }) => ({
  cockpit,
  // submitting: loading.effects['login/login'],
}))
class RunRanking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.getData(this.filtrate.props.form.getFieldsValue());
  }

  getData = (params) => {
    params.pageSize = config.pageSize;
    params.time = params.time.format('x');
    params.sort = params.sort || this.props.cockpit.sort;

    if (!params.pageNo) params.pageNo = 1;
    this.props.dispatch({
      type: 'cockpit/getRankData',
      payload: params
    });
  }

  toggleRankType = () => {
    let params = this.filtrate.props.form.getFieldsValue();
    params.sort = this.props.cockpit.sort === 1 ? 0 : 1;
    this.getData(params);
    this.props.dispatch({
      type: 'cockpit/save',
      payload: {
        sort: params.sort,
      }
    });
  }

  handChange = (pageNo, pageSize) => {
    let params = this.filtrate.props.form.getFieldsValue();
    params.pageNo = pageNo;
    this.getData(params);
  }

  render() {
    const { cockpit,type } = this.props;
    const rankTableHeader = [[
      {
        name: '排名',
        render: (index, data) => {
          return (<div>{cockpit.params.pageNo * (index + 1)}</div>)
        }
      },
      {
        name: '项目名称',
        key: 'siteName',
      },
      {
        name: '设计规模（吨/天）',
        key: 'scale',
      },
      {
        name: '进水COD',
        key: 'value1',
      },
      {
        name: '出水COD',
        key: 'value2',
      },
      {
        name: '去除率/%',
        key: 'value3',
        icon: this.props.cockpit.sort === 1 ? "icon-plus-select-down" : "icon-plus-select-up",
        headerClick: () => { this.toggleRankType() }
      }
    ], [
      {
        name: "排名",
        render: (index, data) => {
          return (<div>{cockpit.params.pageNo * (index + 1)}</div>)
        }
      }, {
        name: "项目名称",
        key: "siteName",
      }, {
        name: "设计规模（吨/天）",
        key: "scale",
      }, {
        name: "测点类型",
        key: "type",
      }, {
        name: "实际处理量/吨",
        key: "value1",
      }, {
        name: "用电量/度",
        key: "value2",
      }, {
        name: "吨水电耗（度/吨）",
        key: "value3",
        icon: this.props.cockpit.sort === 1 ? "icon-plus-select-down" : "icon-plus-select-up",
        headerClick: () => { this.toggleRankType() }
      },
    ], [
      {
        name: "排名",
        render: (index, data) => {
          return (<div>{cockpit.params.pageNo * (index + 1)}</div>)
        }
      },
      {
        name: "项目名称",
        key: "siteName",
      },
      {
        name: "设计规模（吨/天）",
        key: "value1",
      },
      {
        name: "测点类型",
        key: "value2",
      },
      {
        name: "累计流量/吨",
        key: "value3",
        icon: this.props.cockpit.sort === 1 ? "icon-plus-select-down" : "icon-plus-select-up",
        headerClick: () => { this.toggleRankType() }
      },
    ], [
      {
        name: "排名",
        render: (index, data) => {
          return (<div>{cockpit.params.pageNo * (index + 1)}</div>)
        }
      }, {
        name: "项目名称",
        key: "siteName",
      }, {
        name: "设计规模（吨/天）",
        key: "value1",
      }, {
        name: "测点类型",
        key: "value2",
      }, {
        name: "累计运行时间/h",
        key: "value3",
        icon: this.props.cockpit.sort === 1 ? "icon-plus-select-down" : "icon-plus-select-up",
        headerClick: () => { this.toggleRankType() }
      },
    ]];

    const filtrateItem = [{
      label: "时间",
      type: "monthPicker",
      paramName: "time",
      initialValue: null
    }, {
      label: "排名类型",
      type: "select",
      paramName: "type",
        options: [{ text: "COD", value: "1" }, { text: "吨水电耗", value: "2" }, { text: "累计流量", value: "3" }, { text: "累计运行时间", value: "4" }]
    }];
    const titleList = ['COD去除效果统计','吨水电耗统计排名','累计流量统计','累计运行时间统计']
    return (
      <div className="runRanking-container">
        <MyIcon type=" icon-guanbi " className="runRanking-closeIcon" onClick={this.props.closeClick} />
        <img className="runRanking-leftBorder" src={require("../../../../assets/images/leftbarkk.png")} />
        <img className="runRanking-rightBorder" src={require("../../../../assets/images/rightbar.png")} />
        <div className="runRanking-content">
          <IndexFiltrate
            items={filtrateItem}
            defaultValue={this.props.type}
            searchBtnShow={true}
            submit={this.getData}
            wrappedComponentRef={ref => this.filtrate = ref}
          />
          <div className="runRanking-table">
            <div className="runRanking-tableTitle">
              <i className="iconfont icon-shouqi"></i>
              {moment(Number(cockpit.params.time)).format("YYYY年MM月")}{titleList[cockpit.params.type - 1]}
            </div>
            <IndexTable
              total={cockpit.rowCount}
              pageSize={config.pageSize}
              header={rankTableHeader[cockpit.params.type - 1]}
              tableData={cockpit.runRankData}
              handChange={this.handChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default RunRanking

// { moment(Number(cockpit.params.time)).format("YYYY年MM月") } { filtrateItem[1].options[cockpit.params.type - 1].text } 效果统计
