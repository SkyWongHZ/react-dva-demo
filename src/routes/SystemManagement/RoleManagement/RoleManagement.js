import React, { Component } from 'react';
import { Modal, Table ,notification} from 'antd';
import Container from '../../../components/MyPublic/OfficialContainer';
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './RoleManagement.less';
import RoleOperDialog from './RoleOperDialog'
const confirm = Modal.confirm;

export default
class RoleManagement extends React.Component {
    // 初始状态
    state = {
        height:document.body.clientHeight-220+'px',
    	chartData:[], //表格数据
    	roleDialogInfo:{},
    	roleDialogShow: false,//是否显示弹框
    	roleDialogType:null,//类型 1新增 2修改 
	   }


    //设置元数据
    setDataSource= (resData) =>{
    	resData&&resData.map((item,index)=>{
    		item.key=item.roleId
    		item.title=item.roleName
    		if(item.roleInfoDTOs&&item.roleInfoDTOs.length){
    			item.children=item.roleInfoDTOs
    			delete item.roleInfoDTOs
    			this.setDataSource(item.children)
    		}else{
    			delete item.roleInfoDTOs
    		}
    	})
    }

    //查询树形表格数据
    getTableData = () => {
        request({ url: '/wl/overview/roleManagement/getRoleList', method: 'get'}).then(res => {            
            let resData=res.ret
            resData&&this.setDataSource(resData)
            this.setState({
                chartData: resData
            })
        });
    }


    //删除
    deleteBtn = (record) => {
    	let that=this
    	let name=record.parentId===-1?'角色组':'角色'
        confirm({
            title: '提示',
            content: `是否删除${record.roleName}${name}`,
            className: "yk-flowChartCancel-confirm",
            onOk() {
                request({ url: "/wl/overview/roleManagement/deleteRole", method: 'get', params: {roleId:record.roleId} }).then(res => {
                    if(!res.rc){
                    	that.getTableData()
                    	notification.success({
		                    message: '提示',
		                    description: '删除成功',
		                })
                    }else{
                    	notification.error({
		                    message: '提示',
		                    description: res.messge,
		                })
                    }
                })
            },
            onCancel() {
            }
        });
    }

    // 新增角色组
    addRoleGroup = () => {
    	let roleDialogInfo={
    		parentId:-1,
    		roleName:''
    	}

    	this.setState({
            roleDialogInfo: Object.assign({},roleDialogInfo)
        })

    	this.setState({
            roleDialogType: 1,
        })
        this.setState({
            roleDialogShow: true,
        })
    }

    // 新增角色
    addRole= (record) => {
    	let roleDialogInfo={
    		parentId:record.roleId,
    		roleName:'',
    		description:''
    	}

    	this.setState({
            roleDialogInfo: Object.assign({},roleDialogInfo)
        })

    	this.setState({
            roleDialogType: 1,
        })
        this.setState({
            roleDialogShow: true,
        })
    }

    // 修改角色
    editRole= (record) => {
    	let roleDialogInfo={
    		parentId:record.parentId,
    		roleName:record.roleName,
    		roleId:record.roleId,
    		description:record.description
    	}

    	this.setState({
            roleDialogInfo: Object.assign({},roleDialogInfo)
        })
    	this.setState({
            roleDialogType: 2,
        })
        this.setState({
            roleDialogShow: true,
        })
    }

    componentDidMount() {
        this.getTableData()
    }


  	//关闭弹框
  	roleDialogClose=()=>{
  		this.setState({
  			roleDialogShow:false
  		})
  	}

  	//弹框操作成功
  	roleDialogSuccess=()=>{
  		this.setState({
  			roleDialogShow:false
  		})
  		this.getTableData()
  	}
    
    render() {
		const columns = [{
		  title: '角色组/角色',
		  dataIndex: 'roleName',
		}, {
		  title: '描述',
		  dataIndex: 'description',
		  width:'38%',
		}, {
		  title: '操作',
		  dataIndex: 'oper',
		  width:'20%',
		  render: (text, record, index) => {
                return (
                    <span className="oper-btns">
                       <i className="iconfont icon-xiugai2 edit-btn" onClick={this.editRole.bind(this,record)}></i>
                       <i className="iconfont icon-zengjia1 add-btn" onClick={this.addRole.bind(this,record)}></i>
                       <i className="iconfont icon-close close-btn" onClick={this.deleteBtn.bind(this,record)}></i>
                    </span>
                )
            }
		}]

        return (
            <div className="role-main-content">
                <Crumbs routes={this.props.routes} className="crumbs-content" />
                <Container
                    headerShow={true}
                    addBtnShow={true}
                    addBtn={this.addRoleGroup}
                >
				    <div className="custom-table">
				    {this.state.chartData && this.state.chartData.length>0 && //有数据之后再渲染table，保证defaultExpandAllRows可用
				    	<Table columns={columns} dataSource={this.state.chartData} defaultExpandAllRows={true}
				    	 pagination={false} scroll={{ y:this.state.height }}
				    	/>
				    }
				    </div>
                </Container>
				{ this.state.roleDialogShow &&
	                <RoleOperDialog 
	                	roleDialogShow={this.state.roleDialogShow} 
	                	chartData={this.state.chartData} 
	                	onCancel={this.roleDialogClose}
	                	type={this.state.roleDialogType}
	                	data={this.state.roleDialogInfo}
	                	onSuccess={this.roleDialogSuccess}
	                />
            	}
            </div>
        )
    }
}
