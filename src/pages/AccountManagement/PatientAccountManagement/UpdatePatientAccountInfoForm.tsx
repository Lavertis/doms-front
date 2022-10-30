import React, {FC, useEffect, useState} from 'react';
import useAxios from '../../../hooks/useAxios';
import {useFormik} from 'formik';
import {AxiosResponse} from 'axios';
import * as Yup from 'yup';
import {Message} from 'primereact/message';
import FormInput from '../../../components/Form/FormInput';
import {Button} from 'primereact/button';
import {formatErrorsForFormik} from "../../../utils/error-utils";

const UpdatePatientInfoValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .max(100, 'First name must be at most 100 characters long'),
    lastName: Yup.string()
        .max(100, 'Last name must be at most 100 characters long'),
    email: Yup.string()
        .email('Email must be valid'),
    phoneNumber: Yup.string(),
    dateOfBirth: Yup.date()
        .max(new Date(), 'Date of birth must be in the past'),
    nationalId: Yup.string()
        .required('National ID is required')
        .length(11, 'National ID must be 11 characters long'),
    address: Yup.string()
        .max(100, 'Address must be at most 100 characters long'),
    currentPassword: Yup.string()
        .required('Current password is required'),
});


interface UpdatePatientAccountInfoFormProps {
}

const UpdatePatientAccountInfoForm: FC<UpdatePatientAccountInfoFormProps> = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            nationalId: '',
            address: '',
            currentPassword: '',
        },
        validationSchema: UpdatePatientInfoValidationSchema,
        onSubmit: values => {
            values.dateOfBirth = new Date(values.dateOfBirth).toISOString();
            axios.patch('patients/current', values)
                .then(() => {
                    setSuccess('Account information updated successfully');
                    setError('');
                })
                .catch(err => {
                    console.log(err.response?.data);
                    setSuccess('');
                    if (err.response?.data.error != null)
                        console.log(err.response.data.error);
                    if (err.response?.data.errors != null)
                        formik.setErrors(formatErrorsForFormik(err.response.data));
                });

            formik.setFieldValue('currentPassword', '');
            formik.setFieldTouched('currentPassword', false);
            values.dateOfBirth = values.dateOfBirth.split('T')[0];
        },
    });

    useEffect(() => {
        axios.get('patients/current')
            .then((response: AxiosResponse) => {
                formik.setValues({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber,
                    dateOfBirth: response.data.dateOfBirth.split('T')[0],
                    nationalId: response.data.nationalId,
                    address: response.data.address,
                    currentPassword: '',
                });
            })
            .catch(() => {
                setError('Error getting user info');
                setSuccess('');
            });
    }, [axios]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Update account details</div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            {success && <Message className="w-full mb-2" severity="success" text={success}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} label={'First name'} id={'firstName'}/>
                <FormInput formik={formik} label={'Last name'} id={'lastName'}/>
                <FormInput formik={formik} label={'Email'} id={'email'} type={'email'}/>
                <FormInput formik={formik} label={'Phone number'} id={'phoneNumber'} type={'tel'}/>
                <FormInput formik={formik} label={'Date of birth'} id={'dateOfBirth'} type={'date'}/>
                <FormInput formik={formik} id="nationalId" label="National ID"/>
                <FormInput formik={formik} label={'Current password'} id={'currentPassword'} type={'password'}/>

                <Button label="Update" type="submit" className="w-full"/>
            </form>
        </div>
    );
};

export default UpdatePatientAccountInfoForm;