import React, { forwardRef, memo, useImperativeHandle } from 'react';
import type { FormEvent, ReactNode, FC } from 'react';
import type { GetFormType } from './useForm';
import FormContext from './context';
import useForm from './useForm';

type FormProps = {
  children: ReactNode;
  form?: GetFormType;
  onFinish?: (form: { [key: string]: any }) => void;
  onFailedFinish?: (err: any, form: { [key: string]: any }) => void;
  ref?: any;
};

const Form: FC<FormProps> = memo(
  forwardRef(({ children, form, onFinish, onFailedFinish }, ref) => {
    const [formInstance] = useForm(form);

    useImperativeHandle(ref, () => formInstance);

    formInstance.setCallbacks({
      onFinish: onFinish || (() => {}),
      onFailedFinish: onFailedFinish || (() => {}),
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      formInstance.submit();
    };

    return (
      <form onSubmit={handleSubmit}>
        <FormContext.Provider value={formInstance}>{children}</FormContext.Provider>
      </form>
    );
  }),
);

export default Form;
