import React, { memo, useCallback } from 'react';
import { Input } from 'antd';
import Form, { Field, useForm } from './rc-field-form';

const App = memo(() => {
  const [form] = useForm();

  const handleFinish = useCallback((form: { [key: string]: any }) => {
    console.log('--------------onFinish-----------');
    console.log(form);
  }, []);

  const handleFailedFinish = useCallback((err: any, form: { [key: string]: any }) => {
    console.log('--------------handleFailedFinish--------------');
    console.log(err);
    console.log(form);
  }, []);

  return (
    <div style={{ width: '400px', margin: '40px auto' }}>
      <Form form={form} onFinish={handleFinish} onFailedFinish={handleFailedFinish}>
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
});

export default App;
