// 任务动态
import React from 'react'
import './TaskState.less';
import '../../../../less/page-tab.less';
import Title from '../../../../components/IndexComponents/Title';
import request from '../../../../utils/request';

import moment from 'moment';
import { Input, Button, Modal, Tree, Checkbox, Pagination, message, Tooltip  } from 'antd';
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;
import MyIcon from '../../../../components/PublicComponents/MyIcon';
const human = require("../../../../assets/images/human.png");
const people = require("../../../../assets/images/people.png");
const cont = require("../../../../assets/images/content.png");


const urgeIcon = [{
    responseGrade: "特别严重险情（Ⅰ级）",
    iconUrl:require("../../../../assets/images/i.png"),
}, {
    responseGrade: "严重险情（Ⅱ级）",
    iconUrl:require("../../../../assets/images/ii.png"),
}, {
    responseGrade: "较重险情（Ⅲ级）",
    iconUrl:require("../../../../assets/images/iii.png"),
},
{
    responseGrade: "一般险情（Ⅳ级）",
    iconUrl:require("../../../../assets/images/iv.png"),
}
];
  
let generateList = (data, _key, _level) => {
    const level = _level || 0;
    for (let i = 0; i < data.length; i++) {
        const k = _key || 0;
        const node = data[i];
        const key = k + "-" + i;
        node.key = key;
        //console.log(node);
        if (node.nodes) {
            generateList(data[i].nodes, key, level + 1);
        }
    }
};

class RealTimeAlarm extends React.Component {
    state = {
        menuList:[{
            name: "全部",
            key: 0,
            url: "/emergency/law/getEmergencyEvents",
            total:null,
            selected: true,
        }, {
            name: "紧急",
            key: 1,
            url: "/emergency/law/getEmergency",
            total:null,
        }, {
            name: "一般",
            key: 2,
            url: "/events/search/getState",
            total:null,
        }],
        dataList: null,
        index: 0,
        ModalVisible: false,
        baojingDetail: null,
        isurge: false,
        mark:null,
        pass:null,
        total:null,
        eventId: null,
        emergencyId:null,
        checktitle: [],
        editModalVisible: false,
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        treeData: [],
        title:'',
        ids: [],
        uploadman: { department: '供排水科', sign: '李强' },
        message: '',
        issave: false,
    }
    //树形控制
    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys, info) => {    //点击复选框触发
        console.log(checkedKeys);
        console.log('onCheck', info);
        const title=[],ids=[];
        let  findtitle = (data) => {
                data.map((item, index) => {
                    if (checkedKeys.some(item1 => item1 == item.key)) {
                        if (item.nodes.length == 0) {
                            let name = item.headName;
                            let key = item.key;
                            let id = item.id;
                            ids.push(id);
                            title.push({ name: name, key: key, id: id });
                        }
                    }
                    if (item.nodes.length != 0) {
                       findtitle(item.nodes);
                    }
                }
                )
            }
        findtitle(this.state.treeData);   
        console.log(title); 
        this.setState({
            checkedKeys,
            checktitle:title,
            ids:ids
        })
    }
    
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({
            selectedKeys,
        });
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.nodes) {
                return (
                    <TreeNode title={item.headName} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.nodes)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }



    //checkbox的onChange
    onChange = (obj) => {
        console.log(obj); //obj是剩下的选项数组   
        let keys = [],title=[],ids=[];
        this.state.checktitle.map((item) => {
            if (obj.some(item1 => item1 == item.name)) {
                keys.push(item.key);
                ids.push(item.id);
                title.push({name:item.name, key: item.key,id:item.id})
            }
        })
        console.log(keys);
        console.log(title);
        this.setState({
            checkedKeys: keys,
            checktitle:title,
            ids:ids
        });
    }

    //Modal显示
    onMessageshow = (obj, params,data) => {
        console.log(params);
        console.log(obj);
        const myKeys=[];
        let a = [];
        if(data==1)
        {
            if (obj.head ) {
                a= obj.head.split(',')
             }
        }
        else 
        {
            if (obj.eventHead ) {
                a= obj.eventHead.split(',')
             }
        }
             
        console.log(a);
        let  findkey = (data) => {
            data.map((item, index) => {
                if (a.some(item1 => item1 == item.id)) {
                    if (item.nodes.length == 0) {
                        let key = item.key;
                        myKeys.push(key);
                    }
                }
                if (item.nodes.length != 0) {
                    findkey(item.nodes);
                }
            }
            )
        }
        findkey(this.state.treeData);
       console.log(myKeys);

        this.setState({
            ModalVisible: true,
            message:'你有待办调度指令，请及时处理',
            eventId: obj.id,
            mark:obj.mark ? obj.mark:null,
            pass:obj.pass ? obj.pass:null,
            checkedKeys:myKeys,
        },()=>{
          const title=[],ids=[];
      let  findtitle = (data) => {
              data.map((item, index) => {
                  if (this.state.checkedKeys.some(item1 => item1 == item.key)) {
                      if (item.nodes.length == 0) {
                          let name = item.headName;
                          let key = item.key;
                          let id = item.id;
                          ids.push(id);
                          title.push({ name: name, key: key, id: id });
                      }
                  }
                  if (item.nodes.length != 0) {
                     findtitle(item.nodes);
                  }
              }
              )
          }
          findtitle(this.state.treeData);
          console.log(title);
          console.log(ids);
          this.setState({
              checktitle:title,
              ids:ids
          })
        });

        if (params == true) {
            this.setState({
                isurge: true,
                emergencyId:obj.id,
                title:'短信提醒'
            });
        }
        else
        {
            this.setState({
                title:'人员调度'
            });
        }
    }

    editModalshow = () => {
        this.setState({
            editModalVisible: true,
            issave: true,
        });
    }
    //modal消失
    onModalCancel = () => {
        this.setState({
            ModalVisible: false,
            editModalVisible: false,
            issave: false,
            isurge: false,
        });
    }

    editModalCancel = () => {
        this.setState({
            editModalVisible: false,
        });
    }

    // 编辑模态框保存
    editModalSaveBtn = () => {
        let content = document.getElementById('message').value;
        console.log(content);
        this.setState({
            editModalVisible: false,
            issave: false,
            message: content,
        });
    }

    //紧急短信发送
    onUrgesend = () => {
        console.log(this.state.ids);
        if (this.state.ids.length == 0) {
            message.error('请选择人员！')
            return false;
        }
        let data = {
                content: this.state.message,
                head: this.state.uploadman.sign,
                department: this.state.message.department,
                emergencyId:this.state.emergencyId,
                ids: this.state.ids,
                time: moment().format('x'),
            };
            request({ url: '/phone/urge/saveEmergency', method: 'POST', data })
            .then(res => {
                //console.log(res)
                if (res.rc === 0) {
                    message.success('发送成功')
                }
            });   
        this.setState({
            ModalVisible: false,
        });

    }



    //一般短信发送
    onModalsend = () => {        
        console.log(this.state.ids);
        console.log(this.state.pass);
        if (this.state.ids.length == 0) {
            message.error('请选择人员！')
            return false;
        }
        let data = null; 
        let action=null;
        let content=null;
        if (this.state.isurge) {          
                action= 1;
                content=this.state.message;
        }
        else {
            content = document.getElementById('baojingTitle').value;
            // if (!content) {
            //     message.error('请填写指令！')
            //     return false;
            // }
            action=0;
        }
        data = {
            content: content,
            head: this.state.uploadman.sign,
            department: this.state.uploadman.department,
            eventId: this.state.eventId,
            action:action,
            pass: this.state.pass,
            ids: this.state.ids,
            time: moment().format('x'),
        };
        request({ url: '/phone/urge/save', method: 'POST', data })
            .then(res => {
                //console.log(res)
                if (res.rc === 0) {
                    message.success('发送成功')
                }
            });
        this.setState({
            ModalVisible: false,
        });

    }

    toggleList = (data, index, e) => {
        // console.log(data)
        // console.log(index)
        // console.log(e)

    }
       //获取总数
       getTotal = () => {
        this.state.menuList.map((data,index)=>{
         request({ url: data.url, method: 'GET', params: { pageSize: 10, pageIndex: 1 } }).then(res => {
             data.total=res.ret.rowCount;
        })    
    })    
     }
     //限制字数
     limitdata = (data) => {
      let str=data;
      if(data.length>22)
      {
      str=data.slice(0,22);
      return `${str}...`;
      }
      return str;
     }

     limitdata1 = (data) => {
        let str=data;
        if(data.length>16)
        {
        str=data.slice(0,16);
        return `${str}...`;
        }
        return str;
       }
    componentDidMount() {

        this.getDataList(0);
        this.getTotal();
        // 获取人员列表
        let data = { id: 1 }
        request({ url: '/head/people/getHeadPeopleById', method: 'GET', params: data })
            .then((res) => {
                let data = [];
                data.push(res.ret);
                generateList(data);
                this.setState({
                    treeData: data,
                })
            })
    }
    getDataList = (index) => {
        let url = this.state.menuList[index].url;
        request({ url: url, method: 'GET', params: { pageSize: 3, pageIndex: 1 } }).then(res => {
            let arr = res.ret.items.slice(0, 3);
            this.setState({
                index: index,
                dataList: arr,
            });
            // console.log(arr)

        });



    }

    render() {
        // console.log(this.state.dataList);
        let t = this;

        let obj = [];
        t.state.checktitle.map((item, index) => {
            obj.push(item.name);
            return obj;
        })
        // console.log(t.state.checktitle)
        // console.log(obj)
        // console.log(t.state.ids);
        // console.log(t.state.mark);
        return (
            <div className="boxBlockf">
                <Title title="任务动态" list={t.state.menuList} more={false} menuClick={(data, index, e) => t.getDataList(index)} />
                <div className="task-content">
                    <ul>
                        {t.state.dataList && t.state.dataList.map((data, index) => {
                            return (
                                <li key={index}>
                                    {
                                        urgeIcon.map((item) =>{
                                            console.log(t.state.index);
                                            return (
                                             <div className="left-icon" key={item.responseGrade}>     
                                            {t.state.index == 0 && data.mark==1 && data.responseGrade==item.responseGrade && <img src={item.iconUrl} className="icon-level" />} 
                                            {t.state.index == 1 && data.responseGrade==item.responseGrade && <img src={item.iconUrl} className="icon-level" />} 
                                            </div>  
                                        )
                                        })
                                    }
                                    <div className="left-icon">
                                    {t.state.index == 0 && data.mark==0 && <i className="iconfont icon-xiangqing"></i>}
                                    {t.state.index == 2 && <i className="iconfont icon-xiangqing"></i>}
                                     </div>
                                    <div className="right-content">
                                       <Tooltip title={data.responseStandard ? data.responseStandard:data.details} placement="right">
                                        {t.state.index == 0 && data.mark==0 && <p className="task-title">{t.limitdata(data.details)}</p>}
                                        {t.state.index == 0 && data.mark==1 && <p className="task-title">响应标准：{t.limitdata1(data.responseStandard)}</p>}
                                        {t.state.index == 1 && <p className="task-title">响应标准：{t.limitdata1(data.responseStandard)}</p>}
                                        {t.state.index == 2 && <p className="task-title">{t.limitdata(data.details)}</p>}
                                        {t.state.index == 0 && <p className="time">{moment(data.time).format("YYYY-MM-DD hh:mm:ss")}</p>}
                                        {t.state.index == 2 && <p className="time">{moment(data.time).format("YYYY-MM-DD hh:mm:ss")}</p>}
                                        {t.state.index == 1 && <p className="time">{moment(data.emergencyTime).format("YYYY-MM-DD hh:mm:ss")}</p>}
                                        </Tooltip>
                                    </div>
                                    <img src={require("../../../../assets/images/line.png")} className="line" />
                                    {t.state.index == 1 && <div className="assign"><i className="iconfont icon-ziyuan5"></i><span>已指派</span></div>}
                                    {t.state.index == 2 && data.state == 2 && <div className="no-finish"><i className="iconfont icon-ziyuan6"></i><span>未完成</span></div>}
                                    {t.state.index == 2 && data.state == 3 && <div className="finish"><i className="iconfont icon-ziyuan4"></i><span>已完成</span></div>}
                                    {t.state.index == 0 && data.state == 2 && <div className="no-finish"><i className="iconfont icon-ziyuan6"></i><span>未完成</span></div>}
                                    {t.state.index == 0 && data.state == 3 && <div className="finish"><i className="iconfont icon-ziyuan4"></i><span>已完成</span></div>}
                                    {t.state.index == 0 && data.mark ==1 && <div className="assign"><i className="iconfont icon-ziyuan5"></i><span>已指派</span></div>}
                                     
                                    {t.state.index == 0 && data.mark ==1 && <i className="iconfont icon-duanxinfasong1" onClick={e => t.onMessageshow(data, true,1)}></i>}
                                    {t.state.index == 0 && data.mark ==0 && <i className="iconfont icon-duanxinfasong1 message" onClick={e => t.onMessageshow(data, true,0)}></i>}
                                    {t.state.index == 0 && data.mark ==0 && <i className="iconfont icon-renyuanbiangeng" onClick={e => t.onMessageshow(data, false,0)}></i>}
                                    {t.state.index == 1 && <i className="iconfont icon-duanxinfasong1" onClick={e => t.onMessageshow(data, true,1)}></i>}
                                    {t.state.index == 2 && <i className="iconfont icon-duanxinfasong1 message" onClick={e => t.onMessageshow(data, true,1)}></i>}
                                    {t.state.index == 2 && <i className="iconfont icon-renyuanbiangeng" onClick={e => t.onMessageshow(data, false,1)}></i>}
                                    <img src={require("../../../../assets/images/bottom-border.png")} className="bottom-border" />
                                </li>
                            )
                        })}
                    </ul>
                    {t.state.index != 0 &&
                        <div style={{ color: "#00D7EB", textAlign: "right", paddingRight: 34, fontSize: 14 }}>
                        <a href={t.state.index === 1 ? "/wrs_web/#/safetySpecial" : "/wrs_web/#/DispatchCenter?isMore=true"} style={{ color: "#00D7EB" }}>更多<i className="iconfont icon-shouqi"></i></a>
                        </div>}
                </div>
                {t.state.ModalVisible && <Modal
                    footer={null}
                    title={t.state.title}
                    width="720"
                    maskClosable={false}
                    visible={t.state.ModalVisible}
                    onCancel={t.onModalCancel.bind(t)}
                    wrapClassName='fwq-note-info-modal'
                >
                    <div>
                        <div className="send">
                            <div className="select-list">
                                <div className="send-title">
                                    <img className="human" src={human} />
                                    人员列表
                                </div>
                                <div className="select-list-people">
                                    <Tree
                                        checkable
                                        onExpand={t.onExpand}
                                        expandedKeys={t.state.expandedKeys}
                                        autoExpandParent={t.state.autoExpandParent}
                                        onCheck={t.onCheck}
                                        checkStrictly={false}
                                        checkedKeys={t.state.checkedKeys}
                                        onSelect={t.onSelect}
                                        selectedKeys={t.state.selectedKeys}
                                    >
                                        {
                                            t.renderTreeNodes(t.state.treeData)
                                        }

                                    </Tree>
                                </div>
                            </div>
                            <div className="send-list">
                                <div className="send-title">
                                    <img className="people" src={people} />
                                    {t.state.isurge && <div>已选人员</div>}
                                    {!t.state.isurge && <div>负责人员</div>}
                                </div>
                                <div className="send-people">
                                    <CheckboxGroup options={obj} value={obj} onChange={t.onChange} />
                                </div>

                            </div>


                            {t.state.isurge && <div className="send-content">
                                <div className="send-title">
                                    <img className="cont" src={cont} />
                                    发送内容
                            </div>
                                <div className="send-content-message">
                                    {!t.state.editModalVisible && <span className="content">{t.state.message} </span>}
                                    {t.state.editModalVisible && <TextArea id="message" defaultValue="你有待办调度指令，请及时处理" rows={3} />}
                                    <div className="send-content-inscribe">
                                        <div className="sign">{t.state.uploadman.department} {t.state.uploadman.sign}</div>
                                        <div className="time">{moment().format("YYYY-MM-DD")}</div>
                                    </div>
                                </div>
                            </div>
                            }


                            {!t.state.isurge && <div className="dispatch">
                                <div className="dispatch-head">
                                    <span className="show-one">调度指令</span>
                                    <span className="show-two">{moment().format("YYYY-MM-DD HH:mm:ss")}</span>
                                </div>
                                <div>
                                    调度人员:{t.state.uploadman.department} {t.state.uploadman.sign}
                                </div>
                                <div>
                                    报警详情:{this.state.baojingDetail}
                                </div>
                                <TextArea id="baojingTitle" />
                            </div>
                            }

                        </div>
                        <div className="operate">
                            {t.state.isurge && <div className="edit-or-save">
                                {!t.state.issave && <MyIcon type="icon-xiugai2" style={{ color: '#6392ff', fontSize: '14px' }} />}
                                {!t.state.issave && <span className="operation-name" onClick={t.editModalshow}>编辑</span>}
                                {t.state.issave && <MyIcon type="icon-baocun" style={{ color: '#6392ff', fontSize: '14px' }} />}
                                {t.state.issave && <span className="operation-name" onClick={t.editModalSaveBtn}>保存</span>}
                            </div>
                            }
                            {t.state.index ==0 && t.state.mark ==1 && <div className="send-button" onClick={t.onUrgesend.bind(t)}>发送</div>}
                            {t.state.index ==0 && t.state.mark ==0 && <div className="send-button" onClick={t.onModalsend.bind(t)}>发送</div>}
                            {t.state.index ==1 && <div className="send-button" onClick={t.onUrgesend.bind(t)}>发送</div>}
                            {t.state.index ==2 && <div className="send-button" onClick={t.onModalsend.bind(t)}>发送</div>}
                        </div>
                    </div>
                </Modal>
                }
            </div>
        )
    }
}

export default RealTimeAlarm
