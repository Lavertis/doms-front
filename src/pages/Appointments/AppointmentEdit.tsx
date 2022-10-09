import {FC, useEffect, useState} from 'react';
import {uuidFromBase64, uuidToBase64} from '../../utils/uuid-utils';
import {Appointment} from '../../types/appointment';
import useAxios from '../../hooks/useAxios';
import {AxiosError, AxiosResponse} from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import FormInput from '../../components/Form/FormInput';
import {Button} from 'primereact/button';
import {useFormik} from 'formik';
import {InputText} from 'primereact/inputtext';
import moment from 'moment';
import {InputTextarea} from 'primereact/inputtextarea';
import {Patient} from '../../types/patient';
import * as Yup from 'yup';
import {Calendar} from 'primereact/calendar';
import {formatErrorsForFormik} from "../../utils/error-utils";
import {ErrorResult} from "../../types/error";

interface AppointmentPageProps {
}


const UpdateAppointmentSchema = Yup.object().shape({
    description: Yup.string(),
    status: Yup.string()
        .oneOf(['Pending', 'Accepted', 'Cancelled', 'Rejected', 'Completed'], 'Invalid status'),
});

const AppointmentEdit: FC<AppointmentPageProps> = () => {
    const {id} = useParams();
    const [appointment, setAppointment] = useState<Appointment>(null!);
    const axios = useAxios();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            date: '',
            time: new Date(),
            description: '',
            status: '',
            type: '',
            patientFirstName: '',
            patientLastName: '',
            address: ''
        },
        validationSchema: UpdateAppointmentSchema,
        onSubmit: values => {
            let appointmentDate = moment(values.date + ' ' + moment(values.time).format('HH:mm')); // TODO merge this into single date
            if (appointmentDate.clone().startOf('day').isBefore(moment().startOf('day'))) {
                formik.setFieldError('date', 'Selected date must be in the future');
                return;
            }
            if (appointmentDate.isBefore(moment())) {
                formik.setFieldError('time', 'Selected time must be in the future');
                return;
            }
            const requestBody = {
                date: appointmentDate.toISOString(),
                description: values.description,
                status: values.status
            };
            axios.patch(`appointments/user/current/${uuidFromBase64(id!)}`, requestBody)
                .then((response: AxiosResponse<Appointment>) => {
                    setAppointment(response.data);
                })
                .catch((err: AxiosError<ErrorResult>) => {
                    if (err.response?.data.error != null)
                        console.log(err.response.data.error);
                    if (err.response?.data.errors != null)
                        formik.setErrors(formatErrorsForFormik(err.response.data));
                });
        },
    });

    const isChanged = () => {
        return (
            moment(appointment?.date).format('YYYY-MM-DD') !== formik.values.date ||
            moment(appointment?.date).format('HH:mm') !== moment(formik.values.time).format('HH:mm') ||
            appointment?.description !== formik.values.description ||
            appointment?.status !== formik.values.status
        );
    };

    useEffect(() => {
        axios.get(`appointments/user/current/${uuidFromBase64(id!)}`)
            .then((response: AxiosResponse<Appointment>) => {
                setAppointment(response.data);
                formik.setValues({
                    ...formik.values,
                    date: moment(response.data.date).format('YYYY-MM-DD'),
                    time: moment(response.data.date).toDate(),
                    description: response.data.description,
                    status: response.data.status,
                    type: response.data.type
                });
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, [axios, id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!appointment)
            return;
        axios.get(`patients/${appointment.patientId}`)
            .then((response: AxiosResponse<Patient>) => {
                formik.setValues({
                    ...formik.values,
                    patientFirstName: response.data.firstName,
                    patientLastName: response.data.lastName,
                    address: response.data.address
                });
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, [appointment, axios]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6 mx-auto mt-8">
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Appointment</div>
            </div>
            {/*{error && <Message className="w-full mb-2" severity="error" text={error}/>}*/}
            <form onSubmit={formik.handleSubmit}>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-6">
                        <FormInput formik={formik} id="patientFirstName" label="Patient first name" disabled/>
                    </div>
                    <div className="col-12 md:col-6">
                        <FormInput formik={formik} id="patientLastName" label="Patient last name" disabled/>
                    </div>
                </div>
                <FormInput formik={formik} id="address" label="Patient address" disabled/>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-6">
                        <label htmlFor={id} className="block text-900 font-medium mb-2">Date</label>
                        <Calendar
                            id="date"
                            dateFormat="dd/mm/yy"
                            value={moment(formik.values.date).toDate()}
                            placeholder="Pick a date"
                            onChange={formik.handleChange}
                            showIcon
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <label htmlFor={id} className="block text-900 font-medium mb-2">Time</label>
                        <Calendar
                            id="time"
                            value={formik.values.time}
                            onChange={formik.handleChange}
                            placeholder="Pick a time"
                            showIcon
                            icon={'pi pi-clock'}
                            timeOnly
                        />
                    </div>
                </div>
                <div className="mb-3 w-full">
                    <label className="block text-900 font-medium mb-2" htmlFor="description">Description</label>
                    <InputTextarea
                        className="w-full"
                        id="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        autoResize
                    />
                </div>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-6">
                        <label htmlFor="status" className="block text-900 font-medium mb-2">Status</label>
                        <div className="p-inputgroup">
                            <InputText id="status" disabled value={formik.values.status}/>
                            {['Pending'].includes(formik.values.status) &&
                                <Button
                                    icon="pi pi-check"
                                    className="p-button-success"
                                    onClick={() => {
                                        formik.setFieldValue('status', 'Accepted');
                                    }}
                                />
                            }
                            {['Pending', 'Accepted'].includes(formik.values.status) &&
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-danger"
                                    onClick={() => {
                                        formik.values.status === 'Pending' && formik.setFieldValue('status', 'Rejected');
                                        formik.values.status === 'Accepted' && formik.setFieldValue('status', 'Cancelled');
                                    }}
                                />
                            }
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <FormInput formik={formik} id="type" label="Type" disabled/>
                    </div>
                </div>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-6">
                        <Button label="Update" type="submit" icon="pi pi-save" className="w-full mb-3"
                                disabled={!isChanged()}/>
                    </div>
                    <div className="col-12 md:col-6">
                        <Button label="Start appointment" icon="pi pi-caret-right" type="submit"
                                className="w-full p-button-success" disabled={appointment?.status !== 'Accepted'}
                                onClick={() => navigate(`/appointments/${uuidToBase64(appointment.id)}`)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AppointmentEdit;