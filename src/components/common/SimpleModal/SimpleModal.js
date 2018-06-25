import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
const Item = Form.Item;
import SimpleModalSelect from './SimpleModalSelect';

const Component = { input: Input, select: SimpleModalSelect };

const SimpleModal = ({
  form,
  onOk,
  onCancel,
  title,
  top = 100,
  bodyStyle = { padding: 30 },
  visible = false,
  layout = 'horizontal',
  items = [],
  labelSpan = 6,
  closable = false,
  maskClosable = true,
  width = 520,
}) => {
  const modalProps = {
    onOk,
    onCancel,
    visible,
    layout,
    closable,
    maskClosable,
    width,
    bodyStyle,
    style: { top },
  };
  if (typeof title !== 'undefined') {
    modalProps.title = title;
  }
  return (
    <Modal {...modalProps}>
      <Form layout={layout}>
        {items.map((item, index) => {
          const { label, colon, type } = item;
          const formProps = {
            ...item,
            form,
          }
          const FormComponent = Component[type];
          return (
            <Item
              label={label}
              labelCol={{ span: labelSpan }}
              wrapperCol={{ span: 24 - labelSpan }}
              colon={colon}
              key={index}
            >
              <FormComponent
                {...formProps}
              />
            </Item>
          );
        })}
      </Form>
    </Modal>
  );
};
const formOptions = {
  onFieldsChange: ({onModelSave}, fields) => {
    const key = Object.keys(fields)[0];
    const value = fields[key].value;
    onModelSave({ [key]: value });
  },
};

export default Form.create(formOptions)(SimpleModal);
