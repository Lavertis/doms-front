import React from 'react';
import {Button} from "primereact/button";
import {classNames} from "primereact/utils";
import {useFormik} from "formik";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Divider} from "primereact/divider";
import * as Yup from 'yup';
import useAxios from "../../hooks/useAxios";
import {useNavigate} from "react-router-dom";

const addDoctorValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    userName: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const AddDoctor = () => {
    const axios = useAxios();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            firstName: '',
            lastName: ''
        },
        validationSchema: addDoctorValidationSchema,
        onSubmit: values => {
            console.log(values);
            axios.post('doctors', values).then((response) => {
                console.log(response);
                navigate('/users', {replace: true});
            });
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

    return (
        <div className="flex justify-content-center mt-8">
            <div className="surface-card p-5 shadow-2 border-round col-12 sm:col-10 md:col-8 lg:col-6 xl:col-3">
                <div className="text-900 text-3xl font-medium mb-6 text-center">Add doctor</div>
                <form onSubmit={formik.handleSubmit} className="p-fluid">
                    <div className="field mb-4">
                        <div className="p-float-label">
                            <InputText id="firstName" name="firstName" value={formik.values.firstName}
                                       onChange={formik.handleChange}
                                       className={classNames({'p-invalid': isFormFieldValid('firstName')})}/>
                            <label htmlFor="firstName"
                                   className={classNames({'p-error': isFormFieldValid('firstName')})}>First name</label>
                        </div>
                        {getFormErrorMessage('firstName')}
                    </div>
                    <div className="field mb-4">
                        <div className="p-float-label">
                            <InputText id="lastName" name="lastName" value={formik.values.lastName}
                                       onChange={formik.handleChange}
                                       className={classNames({'p-invalid': isFormFieldValid('lastName')})}/>
                            <label htmlFor="lastName"
                                   className={classNames({'p-error': isFormFieldValid('lastName')})}>Last name</label>
                        </div>
                        {getFormErrorMessage('lastName')}
                    </div>
                    <div className="field mb-4">
                        <div className="p-float-label">
                            <InputText id="phoneNumber" name="phoneNumber" value={formik.values.phoneNumber}
                                       onChange={formik.handleChange}
                                       className={classNames({'p-invalid': isFormFieldValid('phoneNumber')})}/>
                            <label htmlFor="lastName"
                                   className={classNames({'p-error': isFormFieldValid('phoneNumber')})}>Phone
                                number</label>
                        </div>
                        {getFormErrorMessage('phoneNumber')}
                    </div>
                    <div className="field mb-4">
                        <div className="p-float-label">
                            <InputText id="userName" name="userName" value={formik.values.userName}
                                       onChange={formik.handleChange}
                                       className={classNames({'p-invalid': isFormFieldValid('userName')})}/>
                            <label htmlFor="userName"
                                   className={classNames({'p-error': isFormFieldValid('userName')})}>UserName</label>
                        </div>
                        {getFormErrorMessage('userName')}
                    </div>
                    <div className="field mb-4">
                        <div className="p-float-label p-input-icon-right">
                            <i className="pi pi-envelope"/>
                            <InputText id="email" name="email" value={formik.values.email}
                                       onChange={formik.handleChange}
                                       className={classNames({'p-invalid': isFormFieldValid('email')})}/>
                            <label htmlFor="email"
                                   className={classNames({'p-error': isFormFieldValid('email')})}>Email</label>
                        </div>
                        {getFormErrorMessage('email')}
                    </div>
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
                    <Button type="submit" label="Create" className="mt-2"/>
                </form>
            </div>
        </div>
    );
};

export default AddDoctor;
