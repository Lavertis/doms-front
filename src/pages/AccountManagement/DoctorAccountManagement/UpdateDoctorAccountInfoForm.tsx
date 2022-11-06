import {FC, useEffect, useState} from 'react';
import * as Yup from 'yup';
import {AxiosResponse} from 'axios';
import {useFormik} from 'formik';
import {Message} from 'primereact/message';
import FormInput from '../../../components/Form/FormInput';
import {Button} from 'primereact/button';
import {authRequest} from "../../../services/api.service";

const UpdateDoctorInfoValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email must be valid'),
    phoneNumber: Yup.string(),
    currentPassword: Yup.string()
        .required('Current password is required'),
});

interface UpdateDoctorAccountInfoFormProps {
}

const UpdateDoctorAccountInfoForm: FC<UpdateDoctorAccountInfoFormProps> = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            currentPassword: '',
        },
        validationSchema: UpdateDoctorInfoValidationSchema,
        onSubmit: values => {
            authRequest.patch('doctors/current', values)
                .then(() => {
                    setSuccess('Account information updated successfully');
                    setError('');
                })
                .catch(err => {
                    console.log(err.response?.data);
                    setSuccess('');
                    setError('');
                    if (!err.response)
                        return;

                    setError(err.response.data.message);
                });

            formik.setFieldValue('currentPassword', '');
            formik.setFieldTouched('currentPassword', false);
        },
    });

    useEffect(() => {
        authRequest.get('doctors/current')
            .then((response: AxiosResponse) => {
                formik.setValues({
                    email: response.data.email,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNumber: response.data.phoneNumber,
                    currentPassword: '',
                });
            })
            .catch(() => {
                setError('Error getting user info');
                setSuccess('');
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Update account details</div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            {success && <Message className="w-full mb-2" severity="success" text={success}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} label={'Email'} id={'email'} type={'email'}/>
                <FormInput formik={formik} label={'First name'} id={'firstName'}/>
                <FormInput formik={formik} label={'Last name'} id={'lastName'}/>
                <FormInput formik={formik} label={'Phone number'} id={'phoneNumber'} type={'tel'}/>
                <FormInput formik={formik} label={'Current password'} id={'currentPassword'} type={'password'}/>

                <Button label="Update" type="submit" className="w-full"/>
            </form>
        </div>
    );
};

export default UpdateDoctorAccountInfoForm;