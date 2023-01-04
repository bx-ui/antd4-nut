import { GetFormType } from './useForm';
import { createContext } from 'react';

const FormContext = createContext<GetFormType | null>(null);

export default FormContext;
