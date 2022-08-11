import {FC, useContext, useEffect, useState} from 'react';
import {Message} from 'primereact/message';
import {Button} from 'primereact/button';
import {useNavigate} from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import {useFormik} from 'formik';
import {AxiosError} from 'axios';
import * as Yup from 'yup';
import {TokenContext} from '../../App';
import FormInput from '../../components/Form/FormInput';

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
    userName: Yup.string()
        .required('Username is required')
        .min(4, 'Username must be at least 4 characters long')
        .max(16, 'Username must be at most 16 characters long'),
    address: Yup.string()
        .required('Address is required')
        .max(100, 'Address must be at most 100 characters long'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(50, 'Password must be at most 16 characters long'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

interface RegisterProps {
    redirectTo: string;
}

const Register: FC<RegisterProps> = ({redirectTo}) => {
    const [error, setError] = useState('');
    const {token} = useContext(TokenContext);
    const navigate = useNavigate();
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            userName: '',
            address: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: RegisterSchema,
        onSubmit: values => {
            values.dateOfBirth = new Date(values.dateOfBirth).toISOString();
            axios.post('patient', values)
                .then(() => {
                    navigate(redirectTo, {replace: true});
                })
                .catch((err: AxiosError) => {
                    if (!err.response)
                        return;
                    // TODO add field specific error messages
                    setError('An error occurred');
                });
        },
    });

    useEffect(() => {
        if (token) {
            navigate(redirectTo, {replace: true});
        }
    }, [navigate, redirectTo, token]);

    return (
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4 mx-auto my-8">
            <div className="text-center mb-5">
                {/*TODO Logo here*/}
                {/*<img src="" alt="hyper" height={50} className="mb-3" />*/}
                <div className="text-900 text-3xl font-medium mb-3">Register</div>
                <span className="text-600 font-medium line-height-3">Already have an account ?</span>
                <div className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" onClick={() => {
                    navigate('login');
                }}>Login page
                </div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} id="firstName" label="First name"/>
                <FormInput formik={formik} id="lastName" label="Last name"/>
                <FormInput formik={formik} id="email" label="Email" type="email"/>
                <FormInput formik={formik} id="phoneNumber" label="Phone number" type="tel"/>
                <FormInput formik={formik} id="dateOfBirth" label="Date of birth" type="date"/>
                <FormInput formik={formik} id="userName" label="Username"/>
                <FormInput formik={formik} id="address" label="Address"/>
                <FormInput formik={formik} id="password" label="Password" type="password"/>
                <FormInput formik={formik} id="confirmPassword" label="Confirm password" type="password"/>

                <Button label="Sign Up" icon="pi pi-user" type="submit" className="w-full"/>
            </form>
        </div>
    );
};

export default Register;