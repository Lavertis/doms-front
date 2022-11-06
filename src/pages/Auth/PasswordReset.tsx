import React, {useRef} from 'react';
import {Toast} from "primereact/toast";
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {authRequest} from "../../services/api.service";

const passwordResetValidationSchema = Yup.object().shape({
    email: Yup.string().email().required('Required')
});

interface PasswordResetProps {
    redirectTo: string;
}

const PasswordReset = ({redirectTo}: PasswordResetProps) => {
    const navigate = useNavigate();

    const toast = useRef<Toast>(null);
    const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
        if (toast.current)
            (toast.current).show({severity: severity, summary: summary, detail: detail, life: 3000});
    }

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: passwordResetValidationSchema,
        onSubmit: values => {
            authRequest.post('users/password-reset', {email: values.email})
                .then(_ => {
                    showToast('success', 'Password reset', 'A password reset link has been sent to your email');
                    setTimeout(() => {
                        navigate(redirectTo);
                    }, 3000);
                })
                .catch(e => {
                    console.log(e.response.data.error);
                    showToast('error', 'Error', "User with provided e-mail not found");
                });
        }
    });

    const isFormFieldValid = (name: string) => !!(formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]);
    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) &&
            <small className="p-error">{formik.errors[name as keyof typeof formik.errors]}</small>;
    };

    return (
        <div className="surface-card p-4 shadow-1 border-round w-full w-10 sm:w-8 lg:w-6 mx-auto mt-8">
            <Toast ref={toast}/>
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Password reset</div>
                <div className="text-600 font-medium line-height-3 mb-5">
                    Type in your e-mail.<br/>
                    We will send you a link to reset your password.
                </div>
                <form onSubmit={formik.handleSubmit} className="p-fluid sm:col-8 lg:col-7 xl:col-6 mx-auto">
                    <div className="field mb-4">
                        <div className="p-float-label">
                            <InputText id="email" name="email" value={formik.values.email}
                                       onChange={formik.handleChange} type="text"
                                       className={classNames({'p-invalid': isFormFieldValid('email')})}/>
                            <label htmlFor="email"
                                   className={classNames({'p-error': isFormFieldValid('email')})}>
                                Your e-mail</label>
                        </div>
                        {getFormErrorMessage('email')}
                    </div>
                    <Button label="Reset password" type="submit" className="w-auto"></Button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
