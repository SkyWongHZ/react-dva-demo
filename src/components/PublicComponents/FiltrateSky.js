/**
 * 表格上方筛选条件
 * input 输入框, select 下拉选, rangePicker 时间筛选框
 */
import { Form, Input, Select, Button, DatePicker, AutoComplete, Tabs } from 'antd';

const { RangePicker, MonthPicker } = DatePicker;
import React, { Component } from 'react';
import moment from 'moment';
import config from '../../config';
import Util from '../../utils/Util';
import './SkyPublicCommon.less';
import MyIcon from './MyIcon';

const TabPane = Tabs.TabPane;

// require('./components-css.less');
const FormItem = Form.Item;


function disabledDate(current) {
    // 当天以后时间禁选,组件传值   disabledDate:true
    return current && current.valueOf() > Date.now();
}

class FiltrateSky extends Component {

    componentDidMount() {
        let t = this;
        t.setState({
            params: t.props.form.getFieldsValue()
        });
    }


    submit() {
        let t = this;
        // Form 组件参数
        let params = t.props.form.getFieldsValue();
        let { submit } = t.props;
        submit(params);
    }

    // 清空 Form 组件输入的内容
    clearForm() {
        let t = this;
        t.props.form.resetFields();
    }

    // 额外按钮点击事件
    extraBtnClick(btnIndex) {
        let t = this;
        let funNameStr = t.props.extraBtn[btnIndex].funName;
        let params = t.props.form.getFieldsValue();
        t.props[funNameStr](params);
    }

    selectedChange(fun, value) {
        let t = this;
        if (typeof fun === "function") {
            fun(value);
        }
    }

    handleOpenChange = (status) => {
        if (status) {
            setTimeout(() => {
                var yearEle = document.querySelector(
                    ".ant-calendar-month-panel-year-select"
                );
                yearEle && yearEle.click();
                const hackYearCalendar = () => {
                    var yearTexts = document.querySelectorAll(
                        ".ant-calendar-year-panel-cell"
                    );
                    var currentYear = new Date().getFullYear();
                    for (let i = 0; i < yearTexts.length; i++) {
                        if (yearTexts[i].title > currentYear) {
                            yearTexts[i].firstChild.style.cssText = "cursor: not-allowed;color: #bcbcbc;background: #f7f7f7;";
                            // 官方样式用addEventListener添加的事件，获取不到那个回调函数，也就清空不了事件。所以想到用蒙层覆盖，不让用户点击
                            const mask = document.createElement("div");
                            mask.style.position = "absolute";
                            mask.style.cursor = "not-allowed";
                            mask.style.width = yearTexts[i].offsetWidth + "px";
                            mask.style.height = yearTexts[i].offsetHeight + "px";
                            mask.style.left = i % 3 * yearTexts[i].offsetWidth + "px";
                            mask.style.top =
                                Math.floor(i / 3) * yearTexts[i].offsetHeight + "px";
                            yearTexts[i].parentNode.parentNode.parentNode.style.position =
                                "relative";
                            yearTexts[i].parentNode.parentNode.parentNode.appendChild(mask);
                        } else if (i === 0) {
                            yearTexts[i].addEventListener("click", () => {
                              const table = document.querySelector('.ant-calendar-year-panel-table');
                              while(table.lastChild.nodeName.toLowerCase() ==="div") {
                                table.removeChild(
                                  table.lastChild
                                );
                              }
                                setTimeout(() => {
                                    hackYearCalendar();
                                });
                            });
                        } else if (i === 11) {
                            yearTexts[i].addEventListener("click", () => {
                                setTimeout(() => {
                                    hackYearCalendar();
                                });
                            });
                        } else {
                            yearTexts[i].addEventListener("click", () => {
                                document.querySelector(".ant-calendar-month").style.opacity = 0;
                                setTimeout(() => {
                                    document
                                        .querySelectorAll(".ant-calendar-month-panel-month")[0]
                                        .click();
                                }, 0);
                            });
                        }
                    }
                };
              document.querySelector('.ant-calendar-year-panel-prev-decade-btn').addEventListener('click', () => {
                const table = document.querySelector('.ant-calendar-year-panel-table');
                while(table.lastChild.nodeName.toLowerCase() ==="div") {
                  table.removeChild(
                    table.lastChild
                  );
                }
                setTimeout(() => {
                  hackYearCalendar();
                })
              })
              document.querySelector('.ant-calendar-year-panel-next-decade-btn').addEventListener('click', () => {
                const table = document.querySelector('.ant-calendar-year-panel-table');
                while(table.lastChild.nodeName.toLowerCase() ==="div") {
                  table.removeChild(
                    table.lastChild
                  );
                }
                setTimeout(() => {
                  hackYearCalendar();
                })
              })
              hackYearCalendar();
            }, 0);
        }
    }

    render() {
        let t = this;
        let { items } = t.props;
        let extraBtn = t.props.extraBtn || [];
        let { getFieldDecorator } = t.props.form;
        const formItemLayout = {
            labelCol: { span: 13 },
            wrapperCol: { span: 11 },
        };

        return (
            <div className={`sky-components-filtrate ${this.props.className}`}>
                <Form className="t-ML10 lest" layout="inline" key="myForm">
                    {items &&
                        items.map((item, index) => {
                            if (item.type === 'input') {
                              const itemLayout = item.itemLayout || formItemLayout
                                return (<FormItem {...itemLayout} label={item.label} key={index}>
                                    {
                                        getFieldDecorator(item.paramName, {
                                            initialValue: item.initialValue ? item.initialValue : ''
                                        })(
                                            <Input size={config.size} placeholder={item.placeholder} />
                                            )
                                    }
                                </FormItem>)
                            } else if (item.type === 'select') {
                            //   const itemLayout = item.itemLayout || formItemLayout
                                const itemLayout = item.itemLayout ||formItemLayout||this.props.itemLayout
                                return (<FormItem {...itemLayout} label={item.label} key={index}>
                                    {
                                        getFieldDecorator(item.paramName, {
                                            initialValue: item.options[0] ? Util.numToString(item.options[0].value) : item.options[0],
                                        })(
                                            <Select
                                                size={config.size}
                                                showSearch
                                                optionFilterProp="children"
                                                dropdownMatchSelectWidth={t.props.dropdownMatchSelectWidth}
                                                onChange={t.selectedChange.bind(t, item.selectChange)}
                                                style={{ marginTop: '5px' }}
                                            >
                                                {   item.options.length &&
                                                    item.options.map(option => {
                                                        return (
                                                            <Select.Option key={option.value}
                                                                value={Util.numToString(option.value)}
                                                            >
                                                                {option.text}
                                                            </Select.Option>

                                                        )
                                                    })
                                                }
                                            </Select>
                                            )
                                    }
                                </FormItem>)
                            } else if (item.type === 'rangePicker') {

                                let disabled = item.disabledDate ? disabledDate : null;
                                const itemLayout = {
                                    labelCol: { span: 6 },
                                    wrapperCol: { span: 18 },
                                }
                                return (<FormItem {...itemLayout} className="range-picker" label={item.label}
                                    key={index}>
                                    {
                                        getFieldDecorator(item.paramName, {
                                            initialValue: [moment().add(-1, 'months'), moment()]
                                        })(
                                            <RangePicker size={config.size} disabledDate={disabled}>
                                            </RangePicker>
                                            )
                                    }
                                </FormItem>)
                            } else if (item.type === 'datePicker') {
                                let disabled = item.disabledDate ? disabledDate : null;
                                return (<FormItem {...formItemLayout} className="range-picker" label={item.label}
                                    key={index}>
                                    {
                                        getFieldDecorator(item.paramName, {
                                            initialValue: moment()
                                        })(
                                            <DatePicker size={config.size} disabledDate={disabled} />
                                            )
                                    }
                                </FormItem>)
                            } else if (item.type === 'monthPicker') {
                                return (<FormItem {...formItemLayout} className="month-picker" label={item.label}
                                    key={index}>
                                    {
                                        getFieldDecorator(item.paramName, {
                                            initialValue: item.initialValue ? item.initialValue : moment()
                                        })(
                                            <MonthPicker
                                                size={config.size}
                                                onChange={t.selectedChange.bind(t, item.selectChange)}
                                            />
                                            )
                                    }
                                </FormItem>)
                            } else if (item.type === 'autoComplete') {
                                //dataSource[]: string | { value: string; text: string; };
                                const { label, paramName, dataSource, initialValue, placeholder, itemLayout } = item;
                                const autoCompleteItemLayout = itemLayout || {
                                  labelCol: {span: 6},
                                  wrapperCol: {span: 18},
                                };
                                return (<FormItem {...autoCompleteItemLayout} className="auto-complete" label={label}
                                    key={index}>
                                    {
                                        getFieldDecorator(paramName, {
                                            initialValue: initialValue ? initialValue : ''
                                        })(
                                            <AutoComplete
                                                dataSource={dataSource}
                                                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                placeholder={placeholder}
                                                size={config.size}
                                            />
                                            )
                                    }
                                </FormItem>)
                            } else if (item.type === 'yearPicker') {
                                const itemLayout = item.itemLayout || {
                                    labelCol: { span: 11 },
                                    wrapperCol: { span: 13 },
                                };
                                return (<FormItem {...itemLayout} className="month-picker" label={item.label}
                                    key={index}>
                                    {
                                        getFieldDecorator(item.paramName, {
                                            initialValue: item.initialValue !== undefined ? item.initialValue :moment()
                                           
                                        })(
                                            <MonthPicker
                                                size={config.size}
                                                onChange={t.selectedChange.bind(t, item.selectChange)}
                                                onOpenChange={t.handleOpenChange}
                                                format="YYYY"
                                            />
                                            )
                                    }
                                </FormItem>)
                            }

                        })
                    }
                    <FormItem className="wp-btn-row" style={{ width: 70 }}>
                        {this.props.searchBtnShow &&
                            <Button size={config.size}
                                type="primary"
                                className="wp-btn t-MR16 klmar"
                                onClick={t.submit.bind(t)}
                            >
                                查询
                            </Button>
                        }
                        {
                            this.props.clearBtnShow &&

                            <Button size={config.size}
                                className="wp-btn t-MR16"
                                type="primary"
                                onClick={t.clearForm.bind(t)}
                            >
                                清空
              </Button>
                        }
                    </FormItem>

                    {/* 类型选择 */}
                    {this.props.extraType &&
                        <FormItem className="wp-btn-row">
                            <Tabs defaultActiveKey={this.props.extraType[0].index} onChange={this.props.extraTypeToggle} className="yk-filtrate-tabs">
                                {this.props.extraType.map((data, index) => {
                                    return (
                                        <TabPane tab={data.text} key={data.value}></TabPane>
                                    )
                                })}
                            </Tabs>
                        </FormItem>
                    }


                    {/* 额外的按钮 */}
                    {
                        extraBtn.map((btn, btnIndex) => {
                            return (
                                <FormItem key={btnIndex} className='yk-btn-row'>
                                    <Button size={config.size}
                                        className={`wp-btn t-MR16  ${btn.className}`}
                                        type="primary"
                                        onClick={t.extraBtnClick.bind(t, btnIndex, btn.funName)}
                                        style={btn.style}
                                    >
                                        {this.props.iconType &&
                                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '12px', color: '#3996FF ' }} type="icon-chaxun" />}
                                        {btn.name}
                                    </Button>
                                </FormItem>
                            )
                        })
                    }
                </Form>
                {/* 自定义的一些功能按钮 */}
                <div className="sky-show">
                    {
                        t.props.addBtnShow &&
                        <span onClick={this.props.addBtn} style={{cursor: 'pointer'}}>
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '14px', color: '#16b8be' }} type="icon-zengjia1" />
                            <span>新增</span>
                        </span>
                    }
                    {/* 导出 */}
                    {
                        t.props.exportBtnShow &&
                        <span onClick={this.props.exportBtn} style={{cursor: 'pointer'}}>
                            <MyIcon className="t-ML10 t-MR4" style={{ fontSize: '14px', color: '#6ED1A6 ' }} type="icon-daochu" />
                            <span>导出</span>
                        </span>
                    }


                </div>
                {/* 新增按钮 */}

            </div>
        )
    }
}

export default Form.create()(FiltrateSky);
