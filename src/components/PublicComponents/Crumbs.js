/**
 * Created by Sky
 */
import React, { Component } from 'react';
import { Breadcrumb } from 'antd';


class Crumbs extends Component {
    render() {
        let arr = this.props.routes[1].breadcrumbName.split("/");
        return(
            <Breadcrumb>
                {arr.map((data, index) => {
                    return(
                        <Breadcrumb.Item key={index} style={ arr.length - 1 == index ?{color:"#0FA4F3", cursor: "default"} : {cursor: "default"}}>{data}</Breadcrumb.Item>
                    )
                })}

            </Breadcrumb>
        )

    }
}
export default Crumbs;
