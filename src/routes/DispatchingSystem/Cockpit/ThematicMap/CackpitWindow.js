import React from 'react';
import moment from 'moment';
import  './CackpitWindow.less';
import { Select,Icon,Row,Col } from 'antd';

const CackpitWindow = ({ modalVisible, closeBtnClick, stationDetail, handleChange, pointArray, bigId, siteName}) => {
    const Option = Select.Option;     
    return (
        modalVisible && 
        <div className="custom-informationWindow">
            <Icon type="close-circle-o" className="close-icon"  onClick={closeBtnClick} />
            <h3 className="title-name"> <Icon type="double-right" /> 详细信息</h3>
            <div className="inner">
                <div className="panel">
                    <h3 className="panel-title"><span>基础信息</span></h3>
                    <Row gutter={10}>
                        <Col span={12}>
                            <label className="item-label">【项目名称】</label>
                            <div className="item-content">{stationDetail.name}</div>
                        </Col>
                        <Col span={12}>
                            <label className="item-label">【项目地址】</label>
                            <div className="item-content">{stationDetail.address}</div>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <label className="item-label">【设计规模】</label>
                            <div className="item-content">{stationDetail.scale}</div>
                        </Col>
                        <Col span={12}>
                            <label className="item-label">【测点类型】</label>
                            <div className="item-content">{stationDetail.monitorTypeName}</div>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <label className="item-label">【建造时间】</label>
                            <div className="item-content">{stationDetail.constructTimeString}</div>
                        </Col>
                        <Col span={12}>
                            <label className="item-label">【投运时间】</label>
                            <div className="item-content">{stationDetail.useTimeString}</div>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <label className="item-label">【负责人】</label>
                            <div className="item-content">{stationDetail.chargeMan}</div>
                        </Col>
                        <Col span={12}>
                            <label className="item-label">【联系方式】</label>
                            <div className="item-content">{stationDetail.phone}</div>
                        </Col>
                    </Row>
                </div>
                <div className="panel">
                    <h3 className="panel-title"></h3>
                    <div className="image-cover" style={{backgroundImage:'url('+stationDetail.path+')'}}>
                        <div className="sub-title">全景图片</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CackpitWindow


