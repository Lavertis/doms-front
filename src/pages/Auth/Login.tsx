import {FC, useContext, useEffect, useState} from 'react';
import * as Yup from 'yup';
import {TokenContext} from '../../App';
import {useNavigate} from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import {useFormik} from 'formik';
import {AxiosResponse} from 'axios';
import {Button} from 'primereact/button';
import {Message} from 'primereact/message';
import FormInput from '../../components/Form/FormInput';

const LoginSchema = Yup.object().shape({
    login: Yup.string().required('login is required'),
    password: Yup.string().required('Password is required'),
});

interface LoginProps {
    redirectTo: string;
}

const Login: FC<LoginProps> = ({redirectTo}) => {
    const [error, setError] = useState('');
    const {token, setToken} = useContext(TokenContext);
    const navigate = useNavigate();
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        validationSchema: LoginSchema,
        onSubmit: values => {
            axios.post('auth/authenticate', values)
                .then((response: AxiosResponse) => {
                    setToken(response.data.jwtToken);
                    localStorage.setItem('jwtToken', response.data.jwtToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    navigate(redirectTo, {replace: true});
                })
                .catch(err => {
                    setError(err.response?.data.error);
                });
        },
    });

    useEffect(() => {
        if (token) {
            navigate(redirectTo, {replace: true});
        }
    }, [navigate, redirectTo, token]);

    return (
        <div className="surface-card p-5 shadow-2 border-round w-11 sm:w-7 lg:w-5 xl:w-4 mx-auto mt-8">
            <div className="text-center mb-5">
                {/*TODO Logo here*/}
                {/*<img src="" alt="hyper" height={50} className="mb-3" />*/}
                <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                <div className="font-medium no-underline text-blue-500 cursor-pointer"
                     onClick={() => {
                         navigate('/register');
                     }}>
                    Create today!
                </div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} id="login" label="Login"/>
                <FormInput formik={formik} id="password" label="Password" type="password"/>
                <div className="text-600 font-medium line-height-3 text-center">Forgot password?</div>
                <div className="font-medium no-underline text-blue-500 cursor-pointer text-center mb-3"
                     onClick={() => {
                         navigate('/password-reset');
                     }}>
                    Click to reset
                </div>
                <Button label="Sign In &nbsp;&nbsp;&nbsp;&nbsp;" icon="pi pi-user" type="submit" className="w-full"/>
            </form>
        </div>
    );
};

export default Login;