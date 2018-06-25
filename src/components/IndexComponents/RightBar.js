import React from 'react'
import { connect } from 'dva'
import { Form } from 'antd';
import Chart from 'echarts-for-react'

import styles from './RightBar.less';
import NormalSVGBorderHOC from './NormalSVGBorderHOC';
import echarts from 'echarts';
import CustomSvg from './CustomSvg'

class Page extends React.Component {
  componentDidMount() {
  }

  handClick = (index, data) => {
    if(this.props.handClick) this.props.handClick(index, data);
  }

  render() {
    let len = this.props.header ? this.props.header.length : 0;

    return (
      <div className={styles.container} style={this.props.style}>
        <CustomSvg
          style={{ width: this.props.style.width, height: this.props.style.height }}
          orientation="left"
          title={this.props.title}
          textStyle={{ fontSize: 15 }}
          className={styles.bgSvg}
        />
        {this.props.type === "tabel" &&
          <div className={styles.contentContainer}>
            <ul className={styles.contentNav} >
              {this.props.header.map((data, index) => {
                return (
                  <li key={index} className={styles.contentList} style={{ width: `${100 / len}%` }}><i className={`iconfont ${data.icon}`}></i>{data.name}</li>
                )
              })}
              <span className={styles.borderSmallLeftTop}></span>
              <span className={styles.borderSmallRightTop}></span>
              <span className={styles.borderSmallLeftBottom}></span>
              <span className={styles.borderSmallRightBottom}></span>
            </ul>

            {this.props.data && this.props.data.map((data, index) => {
              let name = styles.dataNav;
              if(this.props.select){
                name = this.props.select.indexOf(index) < 0 ? styles.dataNav : styles.dataNavActive;
              }
              return (
                <ul className={name} onClick={(e) => this.handClick(index, data)} key={index} style={this.props.select && {"cursor": "pointer"}}>
                  {this.props.header.map((data1, index1) => {
                    if (data[data1.key]) {
                      return (
                        <li key={index1} className={styles.dataList} style={{ width: `${100 / len}%` }}>{data[data1.key]}</li>
                      )
                    } else {
                      return (
                        <li key={index1} className={styles.dataList} style={{ width: `${100 / len}%` }}>{data1.render(index, data)}</li>
                      )
                    }

                  })}
                </ul>
              )
            })}
          </div>
        }

        {this.props.type === "chart" &&
          <div className={styles.contentContainer} style={{ height: this.props.style.height - 45 }}>
            <Chart
              echarts={echarts}
              option={this.props.chartOptions()}
              notMerge
              lazyUpdate
              style={{ height: '100%' }}
            />
          </div>
        }
      </div>
    )
  }
}

export default Page;

