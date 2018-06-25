// 用户管理
import React, { Component } from 'react'
import { Cascader, Checkbox, Row, Col, Radio, Button, Pagination, Modal, message, Icon, DatePicker, Input, Table, Select, Calendar, Upload, Menu,Tree,notification} from 'antd';
const { InputGroup } = Input.Group
const Option = Select.Option
const Search = Input.Search
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

const TreeNode = Tree.TreeNode;

import Filtrate from '../../../components/MyPublic/InspectionFiltrate'


import util from '../../../utils/Util'
import Container from '../../../components/MyPublic/OfficialContainer'
import MyIcon from '../../../components/PublicComponents/MyIcon'
import MyModal from "../../../components/MyPublic/OfficialModal"
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request'
import requestTwo from '../../../utils/requestTwo'
import config from '../../../config'
import PublicService from '../../../services/PublicService'
import moment from 'moment'
import Crumbs from '../../../components/PublicComponents/Crumbs'
import './UserManagement.less'
const confirm = Modal.confirm

import UserOperDialog from './UserOperDialog'

export default
class UserManagement extends React.Component {
    // 初始状态
    state = {
        roleListOptions:[],//角色列表下拉框
        roleList:[],//角色列表
        roleTreeData:[],//角色树数据
        tableList:[],//用户列表
        searchValue:{ //搜索条件
            userName:'',
            roleCode:''
        },
        currentPage: 1,//当前页
        expandedKeys: [],
        selectedKeys:[],
        searchValue: '',
        autoExpandParent: true,
        selectRoleModalList:[],//已选角色
        selectRoleModalListCopy:[],
        roleInfo:{},
        isView:false,//查看详情

        selectedRowKeys:[],//表格选中数据

        myModalVisibleDel: false,
        myModalVisibleRole: false
    }


    //设置元数据
    setDataSource= (resData,roleList) =>{
        resData&&resData.map((item,index)=>{
            const {roleId,roleName,roleInfoDTOs}=item
            item.key=String(roleId)
            item.title=roleName
            item.isRole=roleInfoDTOs&&roleInfoDTOs.length?false:true

            roleList.push({
                roleId:String(roleId),
                roleName,
                isRole:item.isRole
            })
            if(roleInfoDTOs&&roleInfoDTOs.length){
                item.children=roleInfoDTOs
                delete item.roleInfoDTOs
                this.setDataSource(item.children,roleList)
            }else{
                delete item.roleInfoDTOs
            }
        })
    }

    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => (item.key === key)&&item.isRole)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    }


    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys =this.state.roleList.map((item) => {
            if (item.roleName.indexOf(value) > -1) {
                return this.getParentKey(item.roleId, this.state.roleTreeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);

        const selectedKeys =this.state.roleList.map((item) => {
            if ((item.roleName.indexOf(value) > -1)&&item.isRole) {
                return item.roleId
            }
        }).filter((item, i, self) => item && self.indexOf(item) === i);

        this.setState({
            expandedKeys,
            selectedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    onSelect=(selectedKeys,event)=>{//只选中当前点击的一个
        if(event.node.props.children||event.node.props.parentId==-1){
            notification.open({
                message: '提示',
                description: '不能选择角色组',
            })
            return
        }
        let key=event.node.props.roleId

        let selectRoleModalList=this.state.selectRoleModalList
        let findItem=selectRoleModalList&&selectRoleModalList.find((item,index)=>{
            return item.id==key
        })

        !findItem&&selectRoleModalList.push({
            title:event.node.props.title,
            id:key
        })

        this.setState({
            selectRoleModalList:selectRoleModalList,
            selectedKeys:[String(key)]
        })
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
          if (item.children) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode {...item} />;
        });
    }

    //获取角色列表
    getRoleList=()=>{
        request({ url: "/wl/overview/roleManagement/getRoleList", method: 'get'}).then(res => {
            if(!res.rc){
                let resData=res.ret
                let roleList=[]
                this.setDataSource(resData,roleList)
                this.setState({
                    roleTreeData: resData,
                    roleList
                })
            }
        })
    }

    //获取角色下拉列表
    getUserRole=()=>{
        request({ url: "/wl/overview/roleManagement/getUserRole", method: 'get'}).then(res => {
            if(!res.rc){
                let resData=res.ret
                let roleListOptions=resData&&resData.map((item,index)=>{
                    const { roleCode,roleName }=item
                    return {
                        key:String(roleCode),
                        text:roleName,
                        value:roleCode,
                        roleCode
                    }
                })
                let list=[{text:'全部',value:''}]
                roleListOptions=list.concat(roleListOptions)

                this.setState({
                    roleListOptions:roleListOptions
                })
            }
        })
    }


    //用户列表数据
    selectAllUser = (fromValue,page) => {
        if(!page){
            this.setState({
                currentPage:1
            })
        }
        this.setState({selectedRowKeys:[]}) //清空表格选中数据

        let obj={
            pageIndex:page|| 1,
            pageSize:config.pageSize,
            roleCode:fromValue?fromValue.roleCode:'',
            userName:fromValue?fromValue.userName:''
        }
        request({ url:'/wl/overview/userManagement/selectAllUser', method: 'GET' ,params:obj}).then((res) => {        
            if(!res.rc){
                this.setState({
                    tableList:res.ret.items,
                    total: res.ret.rowCount
                })
            }
        })
    }

    //查询
    onSearch=(fromValue)=>{
        let findItem=this.state.roleListOptions.find((item,index)=>{
            return item.value==fromValue.roleId
        })
        this.setState(preState => ({
            searchValue: {...preState.searchValue, userName: fromValue.userName}
        }))

        this.setState(preState => ({
            searchValue: {...preState.searchValue, roleCode: findItem?findItem.roleCode:''}
        }))

        this.selectAllUser({roleCode:findItem?findItem.roleCode:'',userName:fromValue.userName})
    }


    //删除按钮
    deleteBtn = () => {
        let t = this
        if (!t.state.selectedRowKeys.length) return false
        confirm({
            title: '提示',
            content: '是否删除当前选项',
            className: "yk-flowChartCancel-confirm",
            onOk() {
                let data = JSON.stringify(t.state.selectedRowKeys)
                request({ url: "/wl/overview/userManagement/deleteUserById", method: 'POST', data: data }).then(res => {
                    if(!res.rc){
                        notification.success({
                            message: '提示',
                            description: '删除成功',
                        })
                        
                        t.selectAllUser({},this.state.currentPage)
                    }
                })
            },
            onCancel() {
            },
        })
    }

    // 编辑功能
    editUser= (record) => {
        const userId = record.userId

        this.setState({
            isView:false,
            selectRoleModalList:[]
        })

        request({url:'/wl/overview/userManagement/selectByUserId',  method:'GET' ,params:{userId}})
            .then(res=>{
                if(!res.err){
                    this.setState({
                        myModalVisibleDel:true,
                        roleInfo:res.ret,
                        selectRoleModalList:res.ret.roleInfoDTOS.map(item =>{return {id:item.roleId,
                            title:item.roleName}}),
                        selectRoleModalListCopy:res.ret.roleInfoDTOS.map(item =>{return {id:item.roleId,
                            title:item.roleName}})
                    })
                }
            })
    }

    //详情
    showDetail = (record) => {
        const userId = record.userId
        this.setState({
            selectRoleModalList:[]
        })
        request({url:'/wl/overview/userManagement/selectByUserId',  method:'GET' ,params:{userId}}).then(res=>{
            if(!res.err){
                this.setState({
                    myModalVisibleDel:true,
                    roleInfo:res.ret,
                    isView:true,
                    selectRoleModalList:res.ret.roleInfoDTOS.map(item =>{return {id:item.roleId,
                            title:item.roleName}}),
                    selectRoleModalListCopy:res.ret.roleInfoDTOS.map(item =>{return {id:item.roleId,
                            title:item.roleName}})
                })

            }
        })
        
    }

    onModalDelCancel = () => {
        this.setState({
            myModalVisibleDel: false,
        })
    }


    // 分页页面跳转
    PaginationSearch = (page) => {
        this.setState({
            currentPage: page,
        })
        this.selectAllUser(this.state.searchValue,page)
    }


    // 新增用户
    addBtn = () => {
        this.setState({
            roleInfo:{},
            selectRoleModalList:[],
            isView:false,
            selectedKeys:[],
            myModalVisibleDel: true
        })
    }


    //tabel 选择事件
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }

    //新增或修改用户信息成功
    updateUserSuccess=(id)=>{
        this.setState({
            myModalVisibleDel:false
        })
        const current=id?this.state.currentPage:''
        this.selectAllUser({},current)
    }


    componentDidMount() {
        this.getRoleList()
        this.getUserRole()

        let t = this
        const listcolumns = [
            {
                'title': '姓名',
                'dataIndex': 'userName',
            },
            {
                'title': '性别',
                'dataIndex': 'sex',
            },
            {
                'title': '文化程度',
                'dataIndex': 'education',
            },
            {
                'title': '联系方式',
                'dataIndex': 'phone',
            },
            {
                'title': '角色',
                'dataIndex': 'roleName',
            },
            {
                'title': '项目名称',
                'dataIndex': 'name',
            },
            {
                'title': '操作', 'dataIndex': 'operate', 
                render: (text, record, index) => {
                    return (
                        <span className="oper-btns" key={record.useId}>
                            <i className="iconfont icon-xiugai2 edit-btn" onClick={this.editUser.bind(this,record)}></i>
                            <i className="iconfont icon-chakan view-btn" onClick={this.showDetail.bind(this,record)}></i>
                        </span>
                    )
                }
            },
        ]

        this.setState({
            dataList: listcolumns,
        })

        this.selectAllUser()
    }

    addRole = () => {
        this.setState({ 
            myModalVisibleRole:true,
            selectedKeys:[]
        })
    }

    //确认新增角色
    addCurrentRole = ()=> {
        this.setState({
            myModalVisibleRole:false
        })

    }

    //取消新增角色    
    onModalRoleCancel = () => {
        this.setState({
            selectRoleModalList:this.state.selectRoleModalListCopy
        })
        this.setState({myModalVisibleRole:false})
    }

    delChosenModalRole = (id) => {
        const findItem = this.state.selectRoleModalList.find((item,i) => {
            return item.id===id
        })
        this.setState({
            selectedKeys:[],
            selectRoleModalList:this.state.selectRoleModalList.filter(item=>item.id!=findItem.id)
        })
    }

    render() {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;

        const filtrateItem = [{
            label: "姓名",
            type: "input",
            paramName: "userName"
          },{
            label: "角色",
            type: "select",
            paramName: "roleId",
            options: this.state.roleListOptions,
            itemLayout:{
                labelCol: { span: 7 },
                wrapperCol: { span: 17 }
            }
        }];

        const _this = this
        const { selectedRowKeys, roleInfo } = this.state

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        
        return (
            <div className='user-main-content'>
                <Crumbs routes={this.props.routes} className="crumbs-content" />

                <Filtrate
                    items={filtrateItem}
                    searchBtnShow={true}
                    submit={this.onSearch}
                >
                </Filtrate>

                <Container
                    headerShow={true}
                    addBtnShow={true}
                    addBtn={this.addBtn}
                    deleteBtnShow={true}
                    deleteBtn={this.deleteBtn}
                >
                    <div className="wp-table">
                        <Table
                            bordered
                            columns={this.state.dataList}
                            dataSource={this.state.tableList}
                            rowKey="userId"
                            rowSelection={rowSelection}
                            pagination={false}
                        >
                        </Table>
                    </div>
                </Container>

                <div className="t-FAC t-MT10 wp-page  page-amazing">
                    {this.state.total > 0 &&
                        <Pagination
                            pageSize={config.pageSize}
                            current={this.state.currentPage}
                            showSizeChangerw
                            showQuickJumper
                            total={this.state.total}
                            onChange={this.PaginationSearch}
                        />
                    }
                </div>


                { this.state.myModalVisibleDel &&
                    <UserOperDialog 
                        myModalVisibleDel={this.state.myModalVisibleDel} 
                        selectRoleModalList={this.state.selectRoleModalList} 
                        addRole={this.addRole}
                        data={this.state.roleInfo}
                        onModalDelCancel={this.onModalDelCancel}
                        delChosenModalRole={this.delChosenModalRole}
                        onSuccess={this.updateUserSuccess}
                        isView={this.state.isView}
                    />
                }

                {this.state.myModalVisibleRole &&
                    <Modal
                        className='custom-modal role-choose-modal'
                        title='新增角色'
                        width={800}
                        visible={this.state.myModalVisibleRole}
                        onCancel={this.onModalRoleCancel}
                        maskClosable={false}
                        footer={
                            <div className='modal-del'>
                                <Button  key="submit" type="primary" className='button' onClick={this.addCurrentRole} >确认</Button>
                            </div>
                        }
                    >
                        <div className='modal-flex'>
                            <div className="panel-inner">
                                <div className="inner-title">
                                    <span>角色列表</span>
                                </div>
                                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                                {this.state.roleTreeData && this.state.roleTreeData.length>0 && //有数据之后再渲染，保证defaultExpandAll可用
                                    <Tree
                                        className="custom-tree"
                                        onExpand={this.onExpand}
                                        onSelect={this.onSelect}
                                        selectedKeys={this.state.selectedKeys}
                                        expandedKeys={expandedKeys}
                                        autoExpandParent={autoExpandParent}
                                        defaultExpandAll={true}
                                        multiple={true}
                                    >
                                        {this.renderTreeNodes(this.state.roleTreeData)}
                                    </Tree>
                                }
                            </div>
                            <div className="panel-inner">
                                <div className="inner-title">
                                    <span>已选角色</span>
                                </div>
                                <div className="choose-lists">
                                {
                                    this.state.selectRoleModalList.map(item => (
                                        <div key={item.id} className="choose-role">
                                            {item.title} 
                                            <i className='icon iconfont icon-close' 
                                                onClick={this.delChosenModalRole.bind(this,item.id)} 
                                            >
                                            </i>
                                        </div>
                                        )
                                    )
                                }
                                </div>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}
