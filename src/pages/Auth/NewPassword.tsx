import React, {useRef} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Divider} from "primereact/divider";
import YupPassword from "yup-password";
import {authRequest} from "../../services/api.service";

YupPassword(Yup);

const newPasswordValidationSchema = Yup.object().shape({
    password: Yup.string().password().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

interface NewPasswordProps {
    redirectTo: string;
}

const NewPassword = ({redirectTo}: NewPasswordProps) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const setNewPassword = (newPassword: string) => {
        const passwordResetToken = searchParams.get('token');
        const email = searchParams.get('email');
        authRequest.post('users/password-reset/new', {passwordResetToken, email, newPassword})
            .then(_ => {
                showToast('success', 'Password reset', 'Your password has been reset successfully');
                setTimeout(() => {
                    navigate(redirectTo);
                }, 3000);
            })
            .catch(e => {
                console.log(e);
                showToast('error', 'Error', 'An error occurred while resetting your password');
            })
    }

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: newPasswordValidationSchema,
        onSubmit: values => {
            setNewPassword(values.password);
        }
    });

    const isFormFieldValid = (name: string) => !!(formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]);
    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) &&
            <small className="p-error">{formik.errors[name as keyof typeof formik.errors]}</small>;
    };

    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider/>
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    const toast = useRef<Toast>(null);
    const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
        if (toast.current)
            (toast.current).show({severity: severity, summary: summary, detail: detail, life: 3000});
    }

    return (
        <div className="surface-card p-4 shadow-1 border-round w-full w-10 sm:w-8 lg:w-6 xl:w-4 mx-auto mt-8">
            <Toast ref={toast}/>
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Password reset</div>
                <div className="text-600 font-medium line-height-3 mb-5">
                    Type in your new password
                </div>
                <form onSubmit={formik.handleSubmit} className="p-fluid sm:col-8 lg:col-7 xl:col-6 mx-auto">
                    <div className="field mb-4">
                        <div className="p-float-label">
                            <Password id="password" name="password" value={formik.values.password}
                                      onChange={formik.handleChange} toggleMask
                                      className={classNames({'p-invalid': isFormFieldValid('password')})}
                                      header={passwordHeader} footer={passwordFooter}/>
                            <label htmlFor="password"
                                   className={classNames({'p-error': isFormFieldValid('password')})}>Password</label>
                        </div>
                        {getFormErrorMessage('password')}
                    </div>
                    <div className="field mb-4">
                        <div className="p-float-label">
                            <InputText id="confirmPassword" name="confirmPassword" value={formik.values.confirmPassword}
                                       onChange={formik.handleChange} type="password"
                                       className={classNames({'p-invalid': isFormFieldValid('confirmPassword')})}/>
                            <label htmlFor="confirmPassword"
                                   className={classNames({'p-error': isFormFieldValid('confirmPassword')})}>
                                Confirm password</label>
                        </div>
                        {getFormErrorMessage('confirmPassword')}
                    </div>
                    <Button label="Save password" type="submit" className="w-auto"></Button>
                </form>
            </div>
        </div>
    );
};

export default NewPassword;
