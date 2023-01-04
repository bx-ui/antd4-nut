import React, { PureComponent, createRef } from 'react';
import { Input } from 'antd';
import Form, { Field } from './rc-field-form';
import type { GetFormType } from './rc-field-form/useForm';

class App extends PureComponent {
  formRef: React.RefObject<GetFormType>;

  constructor(props: any) {
    super(props);

    this.formRef = createRef<GetFormType>();
  }

  handleFinish = (form: { [key: string]: any }) => {
    console.log(this.formRef);
    console.log('--------------onFinish-----------');
    console.log(form);
  };

  handleFailedFinish = (err: any, form: { [key: string]: any }) => {
    console.log(this.formRef);
    console.log('--------------handleFailedFinish--------------');
    console.log(err);
    console.log(form);
  };

  componentDidMount() {
    console.log(this.formRef);
    this.formRef.current?.setFieldsValue({
      username: 'bingX',
      password: '123456Abc',
    });
  }

  render() {
    return (
      <div style={{ width: '400px', margin: '40px auto' }}>
        <Form ref={this.formRef} onFinish={this.handleFinish} onFailedFinish={this.handleFailedFinish}>
          <Field name='username' rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder='请输入用户名' />
          </Field>
          <Field name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input placeholder='请输入密码' />
          </Field>
          <button>提交</button>
        </Form>
      </div>
    );
  }
}

export default App;
