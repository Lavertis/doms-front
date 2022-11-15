import React, {FC, useEffect, useRef, useState} from 'react';
import {Message} from 'primereact/message';
import {Button} from 'primereact/button';
import {useNavigate} from 'react-router-dom';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import FormInput from '../../components/Form/FormInput';
import YupPassword from "yup-password";
import {formatErrorsForFormik} from "../../utils/error-utils";
import {Toast, ToastSeverityType} from "primereact/toast";
import {request} from "../../services/api.service";
import userStore from "../../store/user-store";
import {observer} from "mobx-react-lite";

YupPassword(Yup);

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .max(100, 'First name must be at most 100 characters long'),
    lastName: Yup.string()
        .required('Last name is required')
        .max(100, 'Last name must be at most 100 characters long'),
    email: Yup.string()
        .required('Email is required')
        .email('Email must be valid'),
    phoneNumber: Yup.string()
        .required('Phone number is required'),
    dateOfBirth: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of birth must be in the past'),
    nationalId: Yup.string()
        .required('National ID is required')
        .length(11, 'National ID must be 11 characters long'),
    address: Yup.string()
        .required('Address is required')
        .max(100, 'Address must be at most 100 characters long'),
    password: Yup.string()
        .password()
        .required('Password is required'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

interface RegisterProps {
    redirectTo: string;
}

const Register: FC<RegisterProps> = ({redirectTo}) => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            nationalId: '',
            address: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: RegisterSchema,
        onSubmit: values => {
            values.dateOfBirth = new Date(values.dateOfBirth).toISOString();
            request.post('patients', values)
                .then(() => {
                    showToast('info', 'Account created', 'Go to your inbox and confirm your email.');
                    setTimeout(() => {
                        navigate(redirectTo, {replace: true});
                    }, 10_000);
                })
                .catch(err => {
                    if (err.response?.data.error != null)
                        setError(err.response.data.error)
                    if (err.response?.data.errors != null)
                        formik.setErrors(formatErrorsForFormik(err.response.data));
                });
        },
    });

    const toast = useRef<Toast>(null);
    const showToast = (severity: ToastSeverityType, summary: string, detail: string) => {
        if (toast.current)
            (toast.current).show({severity: severity, summary: summary, detail: detail, life: 10_000});
    }

    useEffect(() => {
        if (userStore.user) {
            navigate(redirectTo, {replace: true});
        }
    }, [navigate, redirectTo]);

    return (
        <div className="surface-card p-5 shadow-2 border-round w-full sm:w-7 lg:w-5 xl:w-4 mx-auto my-8">
            <Toast ref={toast}/>
            <div className="text-center mb-5">
                {/*TODO Logo here*/}
                {/*<img src="" alt="hyper" height={50} className="mb-3" />*/}
                <div className="text-900 text-3xl font-medium mb-3">Register</div>
                <span className="text-600 font-medium line-height-3">Already have an account ?</span>
                <div className="font-medium no-underline text-blue-500 cursor-pointer" onClick={() => {
                    navigate('/login');
                }}>
                    Go to login
                </div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} id="firstName" label="First name"/>
                <FormInput formik={formik} id="lastName" label="Last name"/>
                <FormInput formik={formik} id="email" label="Email" type="email"/>
                <FormInput formik={formik} id="phoneNumber" label="Phone number" type="tel"/>
                <FormInput formik={formik} id="dateOfBirth" label="Date of birth" type="date"/>
                <FormInput formik={formik} id="nationalId" label="National ID"/>
                <FormInput formik={formik} id="address" label="Address"/>
                <FormInput formik={formik} id="password" label="Password" type="password"/>
                <FormInput formik={formik} id="confirmPassword" label="Confirm password" type="password"/>

                <Button label="Sign Up &nbsp;&nbsp;&nbsp;&nbsp;" icon="pi pi-user" type="submit" className="w-full"/>
            </form>
        </div>
    );
};

export default observer(Register);