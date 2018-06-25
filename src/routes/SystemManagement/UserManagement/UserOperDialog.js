import React, { Component } from 'react';
import { Button, Modal, Input, Table, Tree, Form ,notification,DatePicker,Row,Col,Upload,Select,message} from 'antd';
const { InputGroup } = Input.Group
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const Option = Select.Option
const { MonthPicker }=DatePicker
import requestFrom from '../../../utils/requestFormData';
import request from '../../../utils/request';
import Crumbs from '../../../components/PublicComponents/Crumbs';
import moment from 'moment';
import './UserOperDialog.less';
const confirm = Modal.confirm;

class UserOperDialog extends React.Component {
    // 初始状态
    state = {
    	isShowDropdown:false,//树形下拉 是否展开
        treeSelectId:null,//树形下拉 选中节点id
        parentId:null,
        parentName:'',
        roleName:'',
        description:'',
        imageUrl:'',
        allSiteIdAndNameList:[],//项目名称枚举值
        formData:[],//表单数据
        imgFileList: {}
	}

    componentDidMount () {
        // 在componentWillMount里使用form.setFieldsValue无法设置表单的值
        // 所以在componentDidMount里进行赋值
        // see: https://github.com/ant-design/ant-design/issues/4802
        const {data, form} = this.props;
        if (data.userId) {
            
            const {birthday,education,exigentPerson,exigentPhone,
                filePath,phone,professional,sex,siteId,university,userId,userName,fileId}=data
            let formData={
                birthday:birthday?moment(birthday):null,
                education,exigentPerson,exigentPhone,
                filePath,phone,professional,sex,
                siteId:siteId?String(siteId):undefined,
                university,userId,userName,fileId
            }

            this.setState({
                formData:formData
            })
            form.setFieldsValue(formData);

            this.setState({
                imageUrl:data.filePath||''
            })

        }

        this.selectAllSiteIdAndName()
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

    //项目名称枚举值
    selectAllSiteIdAndName = () => {
        request({ url: '/wl/overview/appuserservice/selectAllSiteIdAndName', method: 'get'}).then(res => {            
            if(!res.rc){
                this.setState({
                    allSiteIdAndNameList:res.ret
                })
            }
        })
    }

    //确认
    confirmUser=(e)=>{
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
        let data=Object.assign(this.state.formData,formValue)
        data.birthday=data.birthday?data.birthday.format('YYYY/MM/DD'):''

        const {selectRoleModalList}=this.props
        data.ids=selectRoleModalList&&selectRoleModalList.map((item,index)=>{
            return Number(item.id)
        })

        const formData = new FormData();
        for(var i in data){
            if(data[i]){
                formData.append(i,data[i])
            }
        }

        this.state.imgFileList.name&&formData.append('multipartFile', this.state.imgFileList);

        requestFrom({ url: "/wl/overview/userManagement/saveOrUpdateUser", method: 'post',form:formData}).then(res => {
            if(!res.rc){
                let title=data.userId?'修改':'新增'
                notification.success({
                    message: '提示',
                    description: title+'成功',
                })

                this.props.onSuccess(data.userId)

            }
        })
    }

    beforeUpload = (file) => {
        const isLt2KB = file.size / 1024  < 100
        if (!isLt2KB) {
            message.error('上传图片大小不能超过 100KB!')
            return false
        }
        
        this.setState({
            imgFileList:file
        })

        this.getBase64(file, imageUrl => this.setState({ imageUrl }))//本地图片预览
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    renderNodes = (data) => {
        const that =this
        return data.map((item,index) => {
            return <div className="choose-role-out" key={item.id}><span>{item.title}</span><i className='icon iconfont icon-close close-btn'  onClick={that.props.delChosenModalRole.bind(that,item.id)} ></i><i className="icon iconfont icon-zengjia1 add-btn" onClick={that.props.addRole.bind(that)} ></i></div>
        });
    }

    renderList=(data)=>{
        const that =this
        return data.map((item,index) => {
            return <span key={item.id} className="role-name-tip">{item.title}</span>
        });
    }

    getText=(id)=>{
        let findItem=this.state.allSiteIdAndNameList.find((item,index)=>{
            return item.id==id
        })
        return findItem?findItem.name:''
    }
    
    render() {
        const { getFieldDecorator, } = this.props.form
        const {selectRoleModalList,isView,data}=this.props
        const siteNameOptions = this.state.allSiteIdAndNameList.map(item => <Option key={item.id}>{item.name}</Option>);
        const that=this

        const disabledDate =  (current) => {
            return current && current._d.getTime() > Date.now()
        }

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
          },
        };

        
        

        return (
        
            <Modal
                className="add-user-modal custom-modal"
                title={this.state.formData.userId?(this.props.isView?'详情':'编辑'):'新增'}
                width={ 860}
                visible={this.props.myModalVisibleDel}
                onCancel={this.props.onModalDelCancel}
                maskClosable={false}
                footer={
                    !this.props.isView &&
                    <div className='modal-del'>
                        <Button  key="submit" type="primary" className='button' onClick={this.confirmUser} >保存</Button>
                    </div>
                }
            >
                <div className='modal-content'>
                    <Form className={isView?'':'block-inner'}>
                         <Row gutter={70}>
                            <Col span={9}>
                            
                            <FormItem
                            {...formItemLayout}
                              label='姓名'
                            >
                            {!isView ?
                                <div>
                                {getFieldDecorator('userName', {
                                    rules: [{ 
                                        required: true, message: '请填写姓名！' 
                                    },{ 
                                        pattern: /^[\u4E00-\u9FA5a-zA-Z]{2,15}$/, message: '请填写2-15个字符的汉字/英文！' 
                                    }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input />
                                )}
                                </div>
                                :
                                <div>{data.userName}</div>
                            }
                            </FormItem>
                            
                            <FormItem
                            {...formItemLayout}
                              label='出生年月日'
                            >
                                {!isView ?
                                    <div>
                                    {getFieldDecorator('birthday')(
                                        <DatePicker disabledDate={disabledDate} format='YYYY-MM-DD' placeholder="" style={{width:'100%'}}/>
                                    )}
                                    </div>
                                    :
                                    <div>{data.birthday}</div>
                                }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='毕业院校'
                            >
                            {!isView ?
                                <div>
                                {getFieldDecorator('university', {
                                    rules: [{ 
                                        required: true, message: '请填写毕业院校！' 
                                    },{ 
                                        pattern: /^([\u4E00-\u9FA5]{2,10})$/, message: '请填写2-10个字符的汉字！' 
                                    }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input />
                                )}
                                </div>
                                :
                                <div>{data.university}</div>
                            }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='联系方式'
                              style={{height:isView?'':'123px'}}
                            >
                            {!isView ?
                                <div>
                                    {getFieldDecorator('phone', {
                                        rules: [{
                                            required: true, message: '请填写联系方式！' 
                                        },{ 
                                            pattern: /^(\d{3,4}-\d{7,8}(-\d{1,4})?$)|(1[34578]\d{9}$)/, message: '请填写正确的固定电话或手机号码！' 
                                        }],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input />
                                    )}
                                </div>
                                :
                                <div>{data.phone}</div>
                            }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='紧急联系人'
                            >
                            {!isView ?
                                <div>
                                {getFieldDecorator('exigentPerson', {
                                    rules: [{ 
                                        required: true, message: '请填写紧急联系人！' 
                                    },{ 
                                        pattern: /^[\u4E00-\u9FA5a-zA-Z]{2,15}$/, message: '请填写2-15个字符的汉字/英文！' 
                                    }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input />
                                )}
                                </div>
                                :
                                <div>{data.exigentPerson}</div>
                            }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='项目名称'
                            >
                            {!isView ?
                                <div>
                                {getFieldDecorator('siteId')(
                                    <Select
                                      style={{ width: '100%' }}
                                    >
                                      {siteNameOptions}
                                    </Select>
                                )}
                                </div>
                                :
                                <div>{this.getText(data.siteId)}</div>
                            }
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem
                            {...formItemLayout}
                              label='性别'
                            >
                            {!isView ?
                                <div>
                                    {getFieldDecorator('sex', {
                                        rules: [{ required: true, message: '请选择性别！' }],
                                    })(
                                        <Select>
                                            <Option value="男">男</Option>
                                            <Option value="女">女</Option>
                                        </Select>
                                    )}
                                </div>
                                :
                                <div>{data.sex}</div>
                            }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='文化程度'
                            >
                            {!isView ?
                                <div>
                                {getFieldDecorator('education')(
                                    <Select>
                                        <Option value="初中">初中</Option>
                                        <Option value="中专">中专</Option>
                                        <Option value="高中">高中</Option>
                                        <Option value="大专">大专</Option>
                                        <Option value="本科">本科</Option>
                                        <Option value="硕士">硕士</Option>
                                        <Option value="博士">博士</Option>
                                    </Select>
                                )}
                                </div>
                                :
                                <div>{data.education}</div>
                            }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='专业'
                            >
                            {!isView ?
                                <div>
                                {getFieldDecorator('professional', {
                                    rules: [{ 
                                        required: true, message: '请填写专业！' 
                                    },{ 
                                        pattern: /^[\u4E00-\u9FA5a-zA-Z]{2,30}$/, message: '请填写2-30个字符的汉字/字母！' 
                                    }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input />
                                )}
                                </div>
                                :
                                <div>{data.professional}</div>
                            }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='角色'
                            >
                            {!isView ?
                                <span className='role-area'>
                                    {this.renderNodes(selectRoleModalList)}

                                    {
                                        selectRoleModalList.length===0 && 
                                        <i className="icon iconfont icon-zengjia1 add-btn" onClick={that.props.addRole.bind(that)} style={{cursor:'pointer'}} ></i>
                                    }
                                
                                </span>
                                :
                                <div>{this.renderList(selectRoleModalList)}</div>
                            }
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                              label='紧急联系电话'
                            >
                            {!isView ?
                                <div>
                                {getFieldDecorator('exigentPhone', {
                                    rules: [{ 
                                        required: true, message: '请填写紧急联系电话！' 
                                    },{ 
                                        pattern: /^(\d{3,4}-\d{7,8}(-\d{1,4})?$)|(1[34578]\d{9}$)/, message: '请填写正确的固定电话或手机号码！' 
                                    }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input />
                                )}
                                </div>
                                :
                                <div>{data.exigentPhone}</div>
                            }
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                <Upload
                                    className="avatar-uploader"
                                    name="avatar"
                                    accept="image/jpeg, image/jpg"
                                    showUploadList={false}
                                    disabled={isView?true:false}
                                    beforeUpload={this.beforeUpload}
                                  >
                                    {
                                      this.state.imageUrl ?
                                        <img src={this.state.imageUrl} alt="" className="avatar" /> :
                                        (<div className='upload-border'>
                                            <i className='icon iconfont icon-upload'></i><br/>
                                            上传照片
                                        </div>
                                        )
                                    }
                                </Upload>
                            </FormItem>
                        </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        )
    }
}
export default Form.create()(UserOperDialog);