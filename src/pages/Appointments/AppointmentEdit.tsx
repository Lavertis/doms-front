import React, {FC, useEffect, useState} from 'react';
import {uuidFromBase64, uuidToBase64} from '../../utils/uuid-utils';
import {Appointment} from '../../types/Appointments/Appointment';
import {AxiosError, AxiosResponse} from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import FormInput from '../../components/Form/FormInput';
import {Button} from 'primereact/button';
import {useFormik} from 'formik';
import {InputText} from 'primereact/inputtext';
import moment from 'moment';
import {InputTextarea} from 'primereact/inputtextarea';
import * as Yup from 'yup';
import {Calendar} from 'primereact/calendar';
import {formatErrorsForFormik} from '../../utils/error-utils';
import {ErrorResult} from '../../types/error';
import {authRequest} from '../../services/api.service';
import {Patient} from '../../types/Users/Patient';
import {AppointmentStatuses} from '../../enums/AppointmentStatuses';
import appointmentStatusStore from '../../store/appointment-status-store';
import AppointmentStatusStore from '../../store/appointment-status-store';
import {capitalizeFirstLetter} from '../../utils/string-utils';
import AppointmentTypeStore from '../../store/appointment-type-store';

interface AppointmentPageProps {
}

const UpdateAppointmentSchema = Yup.object().shape({
    description: Yup.string(),
    status: Yup.string().test((value, _) => Object.values(AppointmentStatuses).includes((value!.toUpperCase() as any)))
});

const AppointmentEdit: FC<AppointmentPageProps> = () => {
    const {id} = useParams();
    const [appointment, setAppointment] = useState<Appointment>(null!);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            date: new Date(),
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
            let appointmentDate = moment(values.date + ' ' + moment(values.time).format('HH:mm'));
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
                statusId: appointmentStatusStore.getByName(values.status.toUpperCase())!.id
            };
            authRequest.patch(`appointments/user/current/${uuidFromBase64(id!)}`, requestBody)
                .then((response: AxiosResponse<Appointment>) => {
                    const appointment = response.data;
                    appointment.status = AppointmentStatusStore.getById(appointment.statusId);
                    appointment.type = AppointmentTypeStore.getById(appointment.typeId);
                    setAppointment(appointment);
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
            moment(appointment?.date).format('YYYY-MM-DD') !== moment(formik.values.date).format('YYYY-MM-DD') ||
            moment(appointment?.date).format('HH:mm') !== moment(formik.values.time).format('HH:mm') ||
            appointment?.description !== formik.values.description ||
            appointment?.status?.name !== formik.values.status
        );
    };

    useEffect(() => {
        authRequest.get(`appointments/user/current/${uuidFromBase64(id!)}`)
            .then((response: AxiosResponse<Appointment>) => {
                const appointment = response.data;
                appointment.status = AppointmentStatusStore.getById(appointment.statusId);
                appointment.type = AppointmentTypeStore.getById(appointment.typeId);
                setAppointment(appointment);
                formik.setValues({
                    ...formik.values,
                    date: moment(appointment.date).toDate(),
                    time: moment(appointment.date).toDate(),
                    description: response.data.description,
                    status: appointment.status!.name,
                    type: appointment.type!.name
                });
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!appointment)
            return;
        authRequest.get(`patients/${appointment.patientId}`)
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
    }, [appointment]); // eslint-disable-line react-hooks/exhaustive-deps

    const isFormFieldValid = (name: string) => !!(formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]);
    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) &&
            <small className="p-error">{formik.errors[name as keyof typeof formik.errors] as string}</small>;
    };

    return (
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6 mx-auto mt-8">
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Appointment</div>
            </div>
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
                        <label htmlFor="date" className="block text-900 font-medium mb-2">Date</label>
                        <Calendar
                            id="date"
                            dateFormat="dd/mm/yy"
                            value={formik.values.date}
                            placeholder="Pick a date"
                            onChange={formik.handleChange}
                            showIcon
                        />
                        {getFormErrorMessage("date")}
                    </div>
                    <div className="col-12 md:col-6">
                        <label htmlFor="time" className="block text-900 font-medium mb-2">Time</label>
                        <Calendar
                            id="time"
                            value={formik.values.time}
                            onChange={formik.handleChange}
                            placeholder="Pick a time"
                            showIcon
                            icon={'pi pi-clock'}
                            timeOnly
                        />
                        {getFormErrorMessage("time")}
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
                            <InputText id="status" disabled value={capitalizeFirstLetter(formik.values.status)}/>
                            {[AppointmentStatuses.Pending].includes(formik.values.status as AppointmentStatuses) &&
                                <Button
                                    icon="pi pi-check"
                                    className="p-button-success"
                                    onClick={() => {
                                        formik.setFieldValue('status', AppointmentStatuses.Accepted);
                                    }}
                                />
                            }
                            {[AppointmentStatuses.Pending, AppointmentStatuses.Accepted].includes(formik.values.status as AppointmentStatuses) &&
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-danger"
                                    onClick={() => {
                                        formik.values.status === AppointmentStatuses.Pending && formik.setFieldValue('status', AppointmentStatuses.Rejected);
                                        formik.values.status === AppointmentStatuses.Accepted && formik.setFieldValue('status', AppointmentStatuses.Cancelled);
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
                        <Button
                            label="Update"
                            type="submit"
                            icon="pi pi-save"
                            className="w-full mb-3"
                            disabled={!isChanged()}
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button
                            label="Start appointment"
                            icon="pi pi-caret-right"
                            className="w-full p-button-success"
                            disabled={appointment?.status?.name !== AppointmentStatuses.Accepted}
                            onClick={() => navigate(`/appointments/${uuidToBase64(appointment.id)}`)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AppointmentEdit;