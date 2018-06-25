import React, { Component } from 'react';
import { Modal, Table ,notification,Row,Col,Tree, Input,Button} from 'antd';
import Container from '../../../components/MyPublic/OfficialContainer';
import "../../../components/MyPublic/OfficialPublicCommon.less"
import request from '../../../utils/request';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './AuthorityManagement.less';
const confirm = Modal.confirm;

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

export default
class AuthorityManagement extends React.Component {
    // 初始状态
    state = {
    	height:document.body.clientHeight-185+'px',
    	height2:document.body.clientHeight-220+'px',
    	roleTreeData:[], //角色树数据
    	roleList:[],//角色列表
    	defaultRoleId:null,//默认显示id 的权限
    	expandedKeys: [],
    	selectedKeys:[],
	    searchValue: '',
	    autoExpandParent: true,
	    authorityTreeData:[],//权限树数据
	    checkedKeys:[], //权限树 选中keys
	    checkedNodes:[],
	    allAuthorityList:[]

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
    		if(!roleInfoDTOs.length&&!this.state.defaultRoleId){
    			this.setState({
    				defaultRoleId:roleId,
    				selectedKeys:[item.key]
    			})
    			this.getMenuTreeByRoleId(roleId)
    		}
    		if(roleInfoDTOs&&roleInfoDTOs.length){
    			item.children=roleInfoDTOs
    			delete item.roleInfoDTOs
    			this.setDataSource(item.children,roleList)
    		}else{
    			delete item.roleInfoDTOs
    		}
    	})
    }

    //查询角色树数据
    getRoleTreeData = () => {
        request({ url: '/wl/overview/roleManagement/getRoleList', method: 'get'}).then(res => {            
            let resData=res.ret
            let roleList=[]
            resData&&this.setDataSource(resData,roleList)
            this.setState({
                roleTreeData: resData,
                roleList
            })
        });
    }

    //设置权限元数据
    setAuthorityDataSource= (resData,defaultCheckedKeys,allAuthorityList) =>{
    	resData&&resData.map((item,index)=>{
    		item.key=String(item.menuId)
    		allAuthorityList.push({
    			menuId:item.menuId,
    			hasAuthority:item.hasAuthority
    		})
    		if(item.hasAuthority){
    			defaultCheckedKeys.push(item.key)
    		}
    		if(item.sub&&item.sub.length){
    			item.children=item.sub
    			delete item.sub
    			this.setAuthorityDataSource(item.children,defaultCheckedKeys,allAuthorityList)
    		}else{
    			delete item.sub
    		}
    	})
    }

    //获取权限列表
    getMenuTreeByRoleId = (roleId) => {
    	if(!roleId){
    		return
    	}
        request({ url: '/wl/overview/userManagement/getMenuTreeByRoleId', method: 'get',params:{roleId:Number(roleId)}}).then(res => {
	        if(!res.rc){           
	            let resData=res.ret
	            let defaultCheckedKeys=[]
	            let allAuthorityList=[]
	            resData&&resData.sub&&this.setAuthorityDataSource(resData.sub,defaultCheckedKeys,allAuthorityList)
	            
	            this.setState({
	                allAuthorityList:allAuthorityList,
	                checkedKeys:defaultCheckedKeys,
	                authorityTreeData: resData.sub
	            })
	        }else{
	        	this.setState({
			    	authorityTreeData:[]
			    })
	        }
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


    onExpand = (expandedKeys) => {
	    this.setState({
	        expandedKeys,
	        autoExpandParent: false,
	    });
	}

	getParentKey = (key, tree) => {
	    let parentKey;
	    for (let i = 0; i < tree.length; i++) {
	        const node = tree[i];
	        if (node.children) {
	            if (node.children.some(item => item.key === key)) {
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

	onSelect=(selectedKeys,event)=>{
		if(event.node.props.children||event.node.props.parentId==-1){
			notification.open({
                message: '提示',
                description: '不能选择角色组',
            })
            return
		}
		let key=String(event.node.props.roleId)
		this.getMenuTreeByRoleId(key)
		this.setState({
	    	selectedKeys:[key],
	    	checkedKeys:[]
	    })
	}

	//确认
	confirmAuthority=()=>{
		const menuIdList=this.state.checkedNodes&&this.state.checkedNodes.map((item,index)=>{
			return item.props.menuId
		})

		let allAuthorityList=this.state.allAuthorityList

		allAuthorityList.map((item,index)=>{
			let findItem=menuIdList.find((it)=>{
				return it===item.menuId
			})
			item.hasAuthority=findItem?true:false
			item.roleId=this.state.selectedKeys[0]
		})

		request({ url: '/wl/overview/userManagement/addMenuRole', method: 'post',data:allAuthorityList}).then(res => {            
            if(!res.rc){
            	notification.success({
                    message: '提示',
                    description: '修改成功',
                })
            }else{
            	notification.error({
                    message: '提示',
                    description: res.message,
                })
            }
        });
	}

	//tree checkbox选中
	onCheck = (checkedKeys, info) => {
	    this.setState({
	    	checkedNodes:info.checkedNodes,
	    	checkedKeys:checkedKeys
	    })
	}


    componentDidMount() {
        this.getRoleTreeData()
    }

    render() {
    	const { searchValue, expandedKeys, autoExpandParent } = this.state;
        return (
            <div className="authority-main-content">
                <Crumbs routes={this.props.routes} className="crumbs-content" />
                <Container
                    headerShow={false}
                >
				   <Row>
				      	<Col span={12}>
				      		<div className="panel-inner first">
				      			<div className="inner-title">
				      				<span>角色列表</span>
				      			</div>
				      			<Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
				      			<div className="inner-content" style={{height:this.state.height2}}>
							    	{this.state.roleTreeData && this.state.roleTreeData.length>0 && //有数据之后再渲染，保证defaultExpandAll可用
								        <Tree
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
				      		</div>
				      	</Col>
				      	<Col span={12}>
				      		<div className="panel-inner second">
				      			<div className="inner-title">
				      				<span>页面权限分配</span>
				      			</div>
				      			<div className="inner-content" style={{height:this.state.height}}>
				      			{this.state.authorityTreeData && this.state.authorityTreeData.length>0 &&
					      			<div>
						      			<Tree
						      				checkable
						      				onCheck={this.onCheck}
						      				checkedKeys={this.state.checkedKeys}
								          	defaultExpandAll={true}
		                                >
		                                    {this.renderTreeNodes(this.state.authorityTreeData)}
		                                </Tree>
		                                
	                            	</div>
	                            }
	                            </div>
	                            <div className='submit-button'>
                            		<Button  key="submit" type="primary" onClick={this.confirmAuthority.bind(this)} >确认</Button>
				      			</div>
				      		</div>
				      	</Col>
				    </Row>
                </Container>
            </div>
        )
    }
}
