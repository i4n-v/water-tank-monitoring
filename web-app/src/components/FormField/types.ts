import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface IFormFieldProps {
  register: UseFormRegister<any>;
  error: FieldErrors<any>;
  name: string;
  type?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  customOnChange?: (value: string) => void;
  className?: string;
}

export default IFormFieldProps;
