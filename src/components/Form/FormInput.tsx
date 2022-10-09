import {FC} from 'react';
import {InputText} from 'primereact/inputtext';

interface FormInputProps {
    formik: any;
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const FormInput: FC<FormInputProps> = ({label, id, type, placeholder, formik, className, disabled}) => {
    type = type || 'text';
    placeholder = placeholder || '';
    className = className || '';

    const isFormFieldValid = (name: string) => !(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name: string) => {
        return !isFormFieldValid(name) &&
            <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <div className="mb-3">
            <label htmlFor={id} className="block text-900 font-medium mb-2">{label}</label>
            <InputText
                id={id}
                type={type}
                className={'w-full ' + className + (!isFormFieldValid(id) ? ' p-invalid' : '')}
                placeholder={placeholder}
                value={formik.values[id]}
                onChange={formik.handleChange}
                disabled={disabled}
            />
            {getFormErrorMessage(id)}

        </div>
    );
};

export default FormInput;