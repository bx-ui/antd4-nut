import React, { memo, useContext, useReducer, useLayoutEffect } from 'react';
import type { ChangeEvent, FC, ReactNode } from 'react';
import FormContext from './context';

type FieldProps = {
  children: ReactNode;
  name: string;
  rules?: any[];
};

const Field: FC<FieldProps> = memo(({ children, name, rules }) => {
  const form = useContext(FormContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const onStoreChange = () => {
    forceUpdate();
  };

  useLayoutEffect(() => {
    const unReigsterFieldEntity = form?.registerFieldEntities({
      name,
      onStoreChange,
      rules,
    });

    return () => {
      unReigsterFieldEntity && unReigsterFieldEntity();
    };
  }, []);

  const getControlled = () => ({
    value: form?.getFieldValue(name),
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      form?.setFieldsValue({ [name]: value });
    },
  });

  return React.cloneElement(children as any, getControlled());
});

export default Field;
