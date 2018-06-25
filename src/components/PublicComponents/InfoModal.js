/***
 * modal 组件 定义了样式
 */
import React, {Component} from 'react';
import {Modal, Row, Col, Form} from 'antd';
import './components-css.less';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
let testData = {
    cat1: '防渗卷材',
    cat2: '树脂',
    cat3: '0.3mm单糙面LLDPE土工膜',
    unit: 'M22',
    name: '0.3mm单糙面LLDPE土工膜',
    code: 'FSJ-SZ-M0000037'
};
class InfoModal extends Component {

    state = {
        modalKey: 1
    };

    componentDidMount () {
    }

    render () {
        let t = this;
        let {onInfoModalCancel, infoModalItems, data} = t.props;
        if (!infoModalItems) {
            infoModalItems = [];
            console.info('infoModalItems错误, infoModalItems值为: ' + infoModalItems);
        }
        if (!data) {
            data = {};
            console.info('infoModal中data错误, data值为: ' + data);
        }
        return (
            <div>
                <Modal {...t.props}
                       key={t.state.modalKey}
                       className="wp-info-modal"
                       onCancel={onInfoModalCancel}
                       footer={null}
                >
                    <div className="wp-tab t-MB10">
                        <div className="wp-tab-header">
                            <span>基本信息</span>
                        </div>
                    </div>
                    <Form>
                        {
                            infoModalItems.map((row, rowIndex) => {
                                return (
                                    <Row key={rowIndex} gutter={0}>
                                        {
                                            row.map((col) => {
                                                return (
                                                    <Col key={col.key} span={col.span}>
                                                        <FormItem {...formItemLayout} label={col.title}>
                                                            <span>{data[col.key] || ''}</span>
                                                        </FormItem>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                )
                            })
                        }
                    </Form>

                </Modal>
            </div>
        )
    }
}

export default InfoModal;
