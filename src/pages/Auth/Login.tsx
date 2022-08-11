import {FC, useContext, useEffect, useState} from 'react';
import * as Yup from 'yup';
import {TokenContext} from '../../App';
import {useNavigate} from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import {useFormik} from 'formik';
import {AxiosError, AxiosResponse} from 'axios';
import {Button} from 'primereact/button';
import {Message} from 'primereact/message';
import FormInput from '../../components/Form/FormInput';

const LoginSchema = Yup.object().shape({
    userName: Yup.string().required('Username is required'),
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
            userName: '',
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
                .catch((err: AxiosError) => {
                    if (err.response && err.response.status === 400) {
                        setError('Invalid username or password');
                    } else {
                        setError('An error occurred');
                    }
                });
        },
    });

    useEffect(() => {
        if (token) {
            navigate(redirectTo, {replace: true});
        }
    }, [navigate, redirectTo, token]);

    return (
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4 mx-auto mt-8">
            <div className="text-center mb-5">
                {/*TODO Logo here*/}
                {/*<img src="" alt="hyper" height={50} className="mb-3" />*/}
                <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                <div className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" onClick={() => {
                    navigate('register');
                }}>Create today!
                </div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} id="userName" label="Username"/>
                <FormInput formik={formik} id="password" label="Password" type="password"/>
                <Button label="Sign In" icon="pi pi-user" type="submit" className="w-full"/>
            </form>
        </div>

    );
};

export default Login;