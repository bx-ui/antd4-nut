import { useRef } from 'react';

export type GetFormType = {
  getFieldsValue: () => { [key: string]: any };
  getFieldValue: (key: string) => any;
  setFieldsValue: (newStore: { [key: string]: any }) => void;
  registerFieldEntities: (fieldEntities: FieldEntitiesType) => () => void;
  setCallbacks: (callbacks: Partial<CallBackType>) => void;
  submit: () => void;
};

export type FieldEntitiesType = {
  name: string;
  onStoreChange: () => void;
  rules?: any[];
};

export type CallBackType = {
  onFinish?: (form: { [key: string]: any }) => void;
  onFailedFinish?: (err: any, form: { [key: string]: any }) => void;
};

class FormStore {
  store: { [key: string]: any };
  fieldEntities: FieldEntitiesType[];
  callbacks: CallBackType;
  constructor() {
    this.store = {};
    this.fieldEntities = [];
    this.callbacks = {};
  }

  getFieldsValue = () => {
    return { ...this.store };
  };

  getFieldValue = (key: string) => {
    return this.store[key] || '';
  };

  setFieldsValue = (newStore: { [key: string]: any }) => {
    this.store = { ...this.store, ...newStore };
    console.log(this.store, 'update');

    // 通知组件更新
    Object.keys(newStore).forEach((key) => {
      const currentFieldEntity = this.fieldEntities.find((field) => field.name === key);
      if (currentFieldEntity) {
        currentFieldEntity.onStoreChange();
      }
    });
  };

  registerFieldEntities = (fieldEntities: FieldEntitiesType) => {
    this.fieldEntities.push(fieldEntities);

    return () => {
      const index = this.fieldEntities.findIndex((field) => field.name === fieldEntities.name);
      if (index) {
        this.fieldEntities.splice(index, 1);
      }
    };
  };

  validator = () => {
    const err: any[] = [];

    console.log(this.fieldEntities);

    this.fieldEntities.forEach((field) => {
      const { rules, name } = field;
      if (rules && rules.length > 0) {
        const r = rules[0];
        const v = this.store[name];
        if (r && r.required && (v === '' || v === undefined)) {
          err.push({ [name]: r.message || 'not found' });
        }
      }
    });

    // TODO: 验证
    return err;
  };

  submit = () => {
    const err = this.validator();
    if (err.length) {
      // 执行onFailedFinished
      this.callbacks.onFailedFinish && this.callbacks.onFailedFinish(err, this.store);
    } else {
      // 执行onFinished
      this.callbacks.onFinish && this.callbacks.onFinish(this.store);
    }
  };

  setCallbacks = (callbacks: Partial<CallBackType>) => {
    this.callbacks = { ...this.callbacks, ...callbacks };
  };

  getForm = (): GetFormType => ({
    getFieldsValue: this.getFieldsValue,
    getFieldValue: this.getFieldValue,
    setFieldsValue: this.setFieldsValue,
    registerFieldEntities: this.registerFieldEntities,
    setCallbacks: this.setCallbacks,
    submit: this.submit,
  });
}

export default function useForm(form?: GetFormType) {
  // useRef 会在每次渲染时返回同一个 ref 对象
  // 请记住，当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

  const formRef = useRef<GetFormType | null>(null);
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }
  return [formRef.current];
}
