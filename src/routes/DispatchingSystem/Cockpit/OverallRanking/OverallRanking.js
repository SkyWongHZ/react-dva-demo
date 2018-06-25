// import IndexTable from '../../../../components/PublicComponents/IndexTable';
import request from '../../../../utils/request';
import { Table, Pagination, Tooltip, Carousel } from 'antd';
import  "./OverallRanking.less"
import CockpitTable from  '../../../../components/PublicComponents/CockpitTable';
import Title from '../../../../components/IndexComponents/Title';
import moment from 'moment';
import MyIcon from '../../../../components/PublicComponents/MyIcon';



const dataSource = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
}, {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
}];

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
}, {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
}];

class OverallRanking  extends  React.Component{
    state={
        columns: [
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-paiming" />排名</div>,
                'dataIndex': 'reportTime',
                render: (data,text,index) => {return index+1}
            },
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-xiangmu" />项目名称</div>,
                'dataIndex': 'siteName',
            },
            {
                'title': <div><MyIcon className="t-ML10 t-MR4" type="icon-gongshuaiquxian" />去除率/%</div>,
                'dataIndex': 'value3',
            },
        ],
        columns1: [
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-paiming" />排名</div>,
                'dataIndex': 'reportTime',
                render: (data,text,index) => {return index+1}
            },
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-xiangmu" />项目名称</div>,
                'dataIndex': 'siteName',
            },
            {
                'title': <div><MyIcon className="t-ML10 t-MR4" type="icon-gongshuaiquxian" />吨水电耗（度/吨）
                </div>,
                'dataIndex': 'value3',
            },
        ],
        columns2: [
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-paiming" />排名</div>,
                'dataIndex': 'reportTime',
                render: (data,text,index) => {return index+1}
            },
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-xiangmu" />项目名称</div>,
                'dataIndex': 'siteName',
            },
            {
                'title': <div><MyIcon className="t-ML10 t-MR4" type="icon-gongshuaiquxian" />累计流量/吨 </div>,
                'dataIndex': 'value3',
            },
        ],
        columns3: [
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-paiming" />排名</div>,
                'dataIndex': 'reportTime',
                render: (data,text,index) => {return index+1}
            },
            {
                'title':<div><MyIcon className="t-ML10 t-MR4" type="icon-xiangmu" />项目名称</div>,
                'dataIndex': 'siteName',
            },
            {
                'title': <div><MyIcon className="t-ML10 t-MR4" type="icon-gongshuaiquxian" />累计运行时间/h </div>,
                'dataIndex': 'value3',
            },
        ],

    }
    componentDidMount(){
        // 表格一
        let obj={
            pageNo:1,
            pageSize:4,
            sort:0,
            time: 1519833600000,
            type:1
        }
        request({ url: '/wl/overview/runRank/getRank', method: 'GET', params: obj })
            .then((res) => {
                this.setState({
                    dataSource:res.ret.items,
                })
            })

        // 表格二
        let obj1 = {
            pageNo: 1,
            pageSize: 4,
            sort: 0,
            time: 1519833600000,
            type: 2
        }
        request({ url: '/wl/overview/runRank/getRank', method: 'GET', params: obj1 })
            .then((res) => {
                this.setState({
                    dataSource1: res.ret.items,
                })
            })

        // 表格三
        let obj2 = {
            pageNo: 1,
            pageSize: 4,
            sort: 0,
            time: 1519833600000,
            type: 3
        }
        request({ url: '/wl/overview/runRank/getRank', method: 'GET', params: obj2 })
            .then((res) => {
                this.setState({
                    dataSource2: res.ret.items,
                })
            })
        // 表格四
        let obj3 = {
            pageNo: 1,
            pageSize: 4,
            sort: 0,
            time: 1519833600000,
            type: 4
        }
        request({ url: '/wl/overview/runRank/getRank', method: 'GET', params: obj3 })
            .then((res) => {
                this.setState({
                    dataSource3: res.ret.items,
                })
            })
    }

    render(){
        return(
            <div className="OverallRankingContainer">
                <Title title="运行排名" size="large" />
                <Carousel autoplay>
                    <CockpitTable
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                        tableClick={() => {this.props.tableClick('1')}}
                        pageSize={3}
                        title={`${moment().format('M')}月COD去除效果统计`}
                    />
                    <CockpitTable
                        dataSource={this.state.dataSource1}
                        columns={this.state.columns1}
                        tableClick={() => {this.props.tableClick('2')}}
                        pageSize={3}
                        title={`${moment().format('M')}月吨水电耗统计排名`}
                    />
                    <CockpitTable
                        dataSource={this.state.dataSource2}
                        columns={this.state.columns2}
                        tableClick={() => {this.props.tableClick('3')}}
                        pageSize={3}
                        title={`累计流量统计`}
                    />
                    <CockpitTable
                        dataSource={this.state.dataSource3}
                        columns={this.state.columns3}
                        tableClick={() => {this.props.tableClick('4')}}
                        pageSize={3}
                        title={`累计运行时间统计`}
                    />
                </Carousel>
                {/* <CockpitTable
                    dataSource={this.state.dataSource}
                    columns={this.state.columns}
                /> */}
            </div>
        )
    }
}
export default OverallRanking;
