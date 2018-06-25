/**
 * Created by wadeforever on 2017/5/25.
 */
import React, {Component} from 'react';
import {Row, Col} from 'antd'
import './XNWPreview.less';
import PubliceService from '../services/PublicService'

class XnwPreview extends Component {
  state = {};

  deleteHandle(id) {
    this.props.deleteHandle(id)
  }

  render() {
    let t = this;
    let {data, showDeleteButton} = this.props;
    showDeleteButton = !showDeleteButton;
    data = PubliceService.changeFilesList(data);
    return (
      <div>
        {
          data.length !== 0 && data.map((item, index) => {
            return (
              <Row key={index} className="xnw-preview">
                <Col span={12}>
                  <a href={item.downloadUrl}>{item.pname}</a>
                </Col>
                <Col span={3} offset={3}>
                  <a href={item.previewUrl} target="_blank">预览</a>
                </Col>
                {
                  showDeleteButton ?
                    <Col span={3} offset={3}>
                      <span onClick={this.deleteHandle.bind(this, item.uid)} className="xnw-deleteSpan">X</span>
                    </Col>
                    : null
                }
              </Row>
            )
          })
        }
      </div>
    )
  }
}

export default XnwPreview
