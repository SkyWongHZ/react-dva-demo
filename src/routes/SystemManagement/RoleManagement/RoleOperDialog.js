import React, { Component } from 'react';
import { Button, Modal, Input, Table, Tree, Form ,notification} from 'antd';
const { InputGroup } = Input.Group
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
import request from '../../../utils/request';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import './RoleOperDialog.less';
const confirm = Modal.confirm;

class RoleOperDialog extends React.Component {
    // 初始状态
    state = {
    	isShowDropdown:false,//树形下拉 是否展开
        treeSelectId:null,//树形下拉 选中节点id
        parentId:null,
        parentName:'',
        roleName:'',
        description:''
	}

    componentDidMount () {
        // 在componentWillMount里使用form.setFieldsValue无法设置表单的值
        // 所以在componentDidMount里进行赋值
        // see: https://github.com/ant-design/ant-design/issues/4802
        const {data, form} = this.props;
        if (data) {
          form.setFieldsValue(data);
        }
      }

    //确认
    confirmRole=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            this.submit(fieldsValue)
        })
    }

    //提交
    submit = (formValue) => {
        let obj=Object.assign(this.props.data,formValue)

        request({ url: '/wl/overview/roleManagement/addOrUpdateRole', method: 'post',data:obj}).then(res => {            
            if(res.rc===0){
                let title=(this.props.type===1)?'新增':'修改'
                notification.success({
                    message: '提示',
                    description: title+'成功',
                })
                this.props.onSuccess()
            }
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <Modal
                className="roleManagement-modal"
                title={this.props.type===1?(this.props.data.parentId===-1?'新增角色组':'新增角色'):(this.props.data.parentId===-1?'修改角色组':'修改角色')}
                width={450}
                visible={this.props.roleDialogShow}
                onCancel={this.props.onCancel}
                maskClosable={false}
                footer={
                    <div className='modal-del'>
                        <Button  key="submit" type="primary" className='button' onClick={this.confirmRole.bind(this)} >确认</Button>
                    </div>
                }
            >
                <div className='modal-content modal-flex'>
                        <div className="modal-flex-column">
                    	<Form>
                            <FormItem
                              label={this.props.data.parentId===-1?'角色组名称':'角色名称'}
                            >
                                {getFieldDecorator('roleName', {
                                    rules: [{ 
                                        required: true, message: this.props.data.parentId===-1?'请填写角色组名称！':'请填写角色名称！'
                                    },{ 
                                        pattern: /^[\u4E00-\u9FA5a-zA-Z]{2,15}$/, message: '请填写2-15个字符的汉字/字母！' 
                                    }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            { 
                                this.props.data.parentId!=-1 &&
                                <FormItem
                                  label='描述'
                                >
                                {getFieldDecorator('description', {
                                    rules: [{ 
                                        pattern: /^([\u4E00-\u9FA5a-zA-Z0-9])*$/, message: '请填写汉字/字母/数字！' 
                                    }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input />
                                )}
                                </FormItem>
                            }
                    	</Form>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default Form.create()(RoleOperDialog);