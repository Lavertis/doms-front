import {FC, useEffect, useState} from 'react';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';
import {useFormik} from 'formik';
import {Button} from 'primereact/button';
import {Message} from 'primereact/message';
import FormInput from '../../components/Form/FormInput';
import userStore from "../../store/user-store";
import {observer} from "mobx-react-lite";

const LoginSchema = Yup.object().shape({
    login: Yup.string().required('login is required'),
    password: Yup.string().required('Password is required'),
});

interface LoginProps {
    redirectTo: string;
}

const Login: FC<LoginProps> = ({redirectTo}) => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        validationSchema: LoginSchema,
        onSubmit: async values => {
            const signInResult = await userStore.signIn(values);
            if(signInResult)
                navigate(redirectTo, {replace: true});
            else
                setError("Wrong credentials");
        },
    });

    useEffect(() => {
        if (userStore.user != null) {
            navigate(redirectTo, {replace: true});
        }
    }, [navigate, redirectTo]);

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

export default observer(Login);