import React from 'react';
import styles from './Table.less'

class Table extends React.Component {

  render() {
    const { columns, dataSource=[] } = this.props;
    return (
      <div className={styles.table}>
        <div className={styles.contentContainer}>
          <ul className={styles.contentNav}>
            <li className={styles.contentList} style={{width:`20%`}}>
              <i className={`iconfont icon-zhuzhuangtu`} />
              排名
            </li>
            {columns.map(({icon, title, key}, index, list) => {
              const length = list.length;
              return (
                <li className={styles.contentList} style={{width:`calc(80% / ${length})`}} key={key}>
                  <i className={`iconfont icon-${icon}`} />
                  {title}
                </li>
              )
            })}
            <span className={styles.borderSmallLeftTop}></span>
            <span className={styles.borderSmallRightTop}></span>
            <span className={styles.borderSmallLeftBottom}></span>
            <span className={styles.borderSmallRightBottom}></span>
          </ul>
          <div className={styles.body}>
            {dataSource.map((item, index) => {
              return (
                <ul className={styles.dataNav} key={index}>
                  <li className={styles.dataList} style={{width:"20%"}}>{index<9? '0'+(index+1): index+1}</li>
                  {columns.map(({key}, index, list) => {
                    const length = list.length;
                    return (
                      <li className={styles.dataList} style={{width:`calc(80% / ${length})`}} key={key}>{item[key]}</li>
                    )
                  })}

                </ul>
              )
            })}}
          </div>
        </div>
      </div>
    )
  }

}

export default Table
