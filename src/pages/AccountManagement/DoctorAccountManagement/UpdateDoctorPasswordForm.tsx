import {FC, useState} from 'react';
import * as Yup from 'yup';
import useAxios from '../../../hooks/useAxios';
import {useFormik} from 'formik';
import {Message} from 'primereact/message';
import FormInput from '../../../components/Form/FormInput';
import {Button} from 'primereact/button';

const UpdateDoctorPasswordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(50, 'Password must be at most 16 characters long'),
    confirmNewPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    currentPassword: Yup.string()
        .required('Current password is required'),
});

interface UpdateDoctorPasswordFormProps {
}

const UpdateDoctorPasswordForm: FC<UpdateDoctorPasswordFormProps> = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmNewPassword: '',
            currentPassword: '',
        },
        validationSchema: UpdateDoctorPasswordValidationSchema,
        onSubmit: values => {
            axios.patch('doctors/current', values)
                .then(() => {
                    setSuccess('Account information updated successfully');
                    setError('');
                })
                .catch(err => {
                    setSuccess('');
                    setError('');
                    if (!err.response)
                        return;

                    setError(err.response.data.message);
                });
        },
    });


    return (
        <div>
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Update password</div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            {success && <Message className="w-full mb-2" severity="success" text={success}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} label={'New password'} id={'newPassword'} type={'password'}/>
                <FormInput formik={formik} label={'Confirm new password'} id={'confirmNewPassword'} type={'password'}/>
                <FormInput formik={formik} label={'Current password'} id={'currentPassword'} type={'password'}/>

                <Button label="Update" type="submit" className="w-full"/>
            </form>
        </div>
    );
};

export default UpdateDoctorPasswordForm;