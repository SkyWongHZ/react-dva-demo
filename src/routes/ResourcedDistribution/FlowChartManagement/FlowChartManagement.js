import React from 'react';
// import { Link } from 'react-router'
import {Button, Pagination, Modal} from 'antd';
import './FlowChartManagement.less';
import Filtrate from '../../../components/PublicComponents/Filtrate';
import MyTable from '../../../components/PublicComponents/MyTable';
import request from '../../../utils/request';
import config from '../../../config';
import '../../../less/common.less';
import Container from '../../../components/MyPublic/OfficialContainer';
import {Link} from 'dva/router'

const confirm = Modal.confirm;

const listcolumns = [
  {
    dataIndex: 'flowChartCode',
    title: '编码',

  },
  {
    dataIndex: 'siteName',
    title: '项目名称',

  },
  {
    dataIndex: 'deviceCode',
    title: '设备编号',

  },
  {
    dataIndex: 'edits',
    title: '操作',
    render: function (text, data) {
      let obj = {
        id: data.id,
        picturePath: data.picturePath,
        deviceId: data.deviceId,
        monitorTypeName: data.monitorTypeName,
        deviceName: data.deviceName,
        siteName: data.siteName,
        siteId: data.siteId,
      }
      return (
        <Link to={{pathname: "/flowChartManagementEdit", query: obj}}><Button>编辑</Button></Link>
      )
    }
  },
];

//filtrate额外按钮
const extraBtnItem = [
  {
    name: '查询',
    funName: 'searchBtn',
  },
 /*  {
    name: '添加',
    funName: 'addBtn',
  },
  {
    name: "删除",
    funName: "deleteBtn",
  } */
];

class FlowChartManagement extends React.Component {
  state = {
    dataSource: [],
    total: 0,
    cityCode: '',
    factoryId: '',
    flowChartId: '',
    regex: '',
    deviceId: null,
    siteId: null,
    items: [
      {
        type: 'select',
        label: '项目名称:',
        placeholder: '请输入',
        paramName: "siteId",
        options: [
          {text: '全部', value: ''}
        ],
        selectChange: (value) => {
          let t = this;

          // 获取设备编号
          const options = [];
          t.state.items[1].options = t.state.items[1].options.slice(0, 1)
          request({url: '/wl/chart/getDeviceList', method: 'GET', params: {siteId: value}})
            .then((res) => {
              // console.log(' 获取设备编号', res)
              for (let i = 0; i < res.ret.length; i++) {
                options.push({
                  text: res.ret[i].deviceCode, value: String(res.ret[i].deviceId)
                });
              }
              t.state.items[1].options.push(...options)
              t.setState({
                items: t.state.items,
              })
            })

        }
      },
      {
        type: 'select',
        label: '设备编号:',
        placeholder: '请输入 ..',
        paramName: "deviceId",
        options: [
          {text: '全部', value: ''}
        ]
      },
    ],
    current: 1,
  }

  componentWillMount () {
  }

  componentDidMount () {
    let t = this;
    this.listDrawing(this.state.deviceId, this.state.siteId, 1)
    // this.filtrateSelect('', '', '', 1, 'cityCode');

    // 获取项目
    const options = [];
    request({url: '/wl/chart/getSiteList', method: 'GET'})
      .then((res) => {
        // console.log('获取项目', res)
        for (let i = 0; i < res.ret.length; i++) {
          options.push({
            text: res.ret[i].siteName, value: res.ret[i].siteId
          });
        }
        t.state.items[0].options.push(...options)
        t.setState({
          items: t.state.items,
        })
      })

  }
  /* 查询 */
  searchBtn=(params)=>{
    this.listDrawing(params.deviceId, params.siteId, 1)
    this.setState({
      current:1,
      deviceId:params.deviceId,
      siteId:params.siteId,
    })
  }

  //下拉接口
  filtrateSelect = (cityCode, factoryId, flowChartId, type, paramName) => {
    let t = this;
    let data = {
      cityCode: cityCode,
      factoryId: factoryId,
      flowChartId: flowChartId,
      type: type,
    }
    request({url: '/sk/chart/getNavigationRevision', method: 'GET', params: data})
      .then((res) => {
        for (let i = 0; i < t.state.items.length; i++) {
          if (t.state.items[i].paramName === paramName) {
            t.state.items[i].options = t.state.items[i].options.slice(0, 1)
            const options = [];
            for (let j = 0; j < res.ret.length; j++) {
              options.push({
                text: res.ret[j].name, value: res.ret[j].code
              });
            }
            t.state.items[i].options.push(...options)
          }
        }
        t.setState({
          items: t.state.items,
        })
      })

  }
 
  // 列表渲染事件
  listDrawing = (deviceId, siteId, pageNo) => {
    let fileObj = {
      deviceId: deviceId,
      siteId: siteId,
      pageNo: pageNo,
      pageSize: config.pageSize,
    }
    request({url: '/wl/chart/getList', method: 'GET', params: fileObj})
      .then((res) => {
        // console.log('组态管理查询', res)
        this.setState({
          dataSource: res.ret.items,
          total: res.ret.rowCount,
        })
      })

  }

  //添加新按钮
  addBtn = () => {
    this.props.history.push({query: {deviceId: '', id: ''}, pathname: "/flowChartManagementEdit"});
   /*  <Link to={{pathname: "/flowChartManagementEdit", query: obj}}><Button>编辑</Button></Link> */
  }

  //删除按钮
  deleteBtn = () => {
    let t = this;
    confirm({
      title: '提示',
      content: '是否删除当前选项',
      className: "yk-flowChartCancel-confirm",
      onOk() {
        let str = JSON.stringify(t.state.selectedRowKeys)
        fetch("/wl/chart/delete", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: str
        }).then(resp => {
          return resp.json();
        }).then(json => {
          // t.onSearch(1)
          t.listDrawing(t.state.deviceId, t.state.siteId, t.state.current)

        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  //tabel 选择事件
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  //分页
  onSearch = (params) => {
    this.listDrawing(this.state.deviceId, this.state.siteId, params)
    this.setState({
      current: params,
    })
  }

  render () {
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="cl-equipmentLedger">
        <Filtrate
          clearBtnShow={false}
          items={this.state.items}
          extraBtn={extraBtnItem}
          searchBtn={this.searchBtn}
        /*   addBtn={this.addBtn}
          deleteBtn={this.deleteBtn} */
        >
          >
        </Filtrate>
        <Container
          headerShow={true}
          addBtnShow={true}
          addBtn={this.addBtn}
          deleteBtnShow={true}
          deleteBtn={this.deleteBtn}
        >
          <MyTable
            className="ykz-page"
            bordered
            columns={listcolumns}
            dataSource={this.state.dataSource}
            pagination={false}
            rowSelection={rowSelection}
            rowKey={'id'}
            scroll={{x: 1366}}
          >
          </MyTable>
        </Container>

        <div className="t-FAC t-MT10 wp-page  page-amazing">
          <Pagination 
            size={10}
            showSizeChangerw
            showQuickJumper
            onChange={this.onSearch.bind(this)}
            total={this.state.total}
            pageSize={config.pageSize}
            current={this.state.current}
          />
        </div>
      </div>
    );
  }
}
export default FlowChartManagement;

