import {FC, useState} from 'react';
import useAxios from '../../../hooks/useAxios';
import {useNavigate} from 'react-router-dom';
import {useFormik} from 'formik';
import {Message} from 'primereact/message';
import FormInput from '../../../components/Form/FormInput';
import {Button} from 'primereact/button';

interface DeletePatientAccountFormProps {
}

const DeletePatientAccountForm: FC<DeletePatientAccountFormProps> = () => {
    const [error, setError] = useState('');
    const axios = useAxios();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
        },
        onSubmit: () => {
            // TODO add check for current password
            axios.delete('patients/current')
                .then(() => {
                    setError('');
                    navigate('/');
                })
                .catch(err => {
                    if (!err.response)
                        return;
                    setError(err.response.data.message);
                });
        },
    });

    return (
        <div>
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Delete account</div>
            </div>
            {error && <Message className="w-full mb-2" severity="error" text={error}/>}
            <form onSubmit={formik.handleSubmit}>
                <FormInput formik={formik} label={'Current password'} id={'currentPassword'} type={'password'}/>

                <Button label="Delete" type="submit" className="w-full p-button-danger"/>
            </form>
        </div>
    );
};

export default DeletePatientAccountForm;