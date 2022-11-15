import React, {useEffect, useState} from 'react';
import {Appointment} from "../../../../types/appointment";
import {AxiosError, AxiosResponse} from "axios";
import {Patient} from "../../../../types/patient";
import {TabPanel, TabView} from 'primereact/tabview';
import {Prescription} from "../../../../types/prescription";
import moment from "moment";
import {Button} from "primereact/button";
import {useFormik} from "formik";
import * as Yup from "yup";
import {MultipleChoiceItem, QuickButton} from "../../../../types/quick-button";
import {ErrorResult} from "../../../../types/error";
import {formatErrorsForFormik} from "../../../../utils/error-utils";
import TextAreaWithMultipleChoiceButtons from "./TextAreaWithMultipleChoiceButtons";
import PrescriptionsPanelContent from "./PrescriptionsPanelContent";
import {Drug} from "../../../../types/drugs";
import {authRequest} from "../../../../services/api.service";
import userStore from "../../../../store/user-store";
import {observer} from "mobx-react-lite";
import {Roles} from "../../../../enums/Roles";
import {AppointmentStatuses} from "../../../../enums/AppointmentStatuses";

const AppointmentValidationSchema = Yup.object().shape({
    interview: Yup.string().required('Interview is required'),
    diagnosis: Yup.string().required('Diagnosis is required'),
    recommendations: Yup.string().required('Recommendations are required')
});

interface AppointmentDetailsProps {
    appointmentId: string;
    patient: Patient;
    setPatient: (patient: Patient) => void;
}

const AppointmentDetails = ({appointmentId, patient, setPatient}: AppointmentDetailsProps) => {
    const [appointment, setAppointment] = useState<Appointment>();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [patientAge, setPatientAge] = useState<number>(0);

    const [symptoms, setSymptoms] = useState<MultipleChoiceItem[]>([]);
    const [diseases, setDiseases] = useState<MultipleChoiceItem[]>([]);
    const [recommendations, setRecommendations] = useState<MultipleChoiceItem[]>([]);

    const [availableSymptoms, setAvailableSymptoms] = useState<MultipleChoiceItem[]>([]);
    const [availableDiseases, setAvailableDiseases] = useState<MultipleChoiceItem[]>([]);
    const [availableRecommendations, setAvailableRecommendations] = useState<MultipleChoiceItem[]>([]);

    const [drugItems, setDrugItems] = useState<Drug[]>([]);

    const formik = useFormik({
        initialValues: {
            interview: '',
            diagnosis: '',
            recommendations: ''
        },
        validationSchema: AppointmentValidationSchema,
        onSubmit: values => {
            const newValues = {...values, status: AppointmentStatuses.Completed}
            authRequest.patch(`appointments/user/current/${appointment?.id}`, newValues)
                .then((response: AxiosResponse<Appointment>) => {
                    setAppointment(response.data);
                })
                .catch(err => {
                    if (err.response?.data.error != null)
                        console.log(err.response.data.error);
                    if (err.response?.data.errors != null)
                        formik.setErrors(formatErrorsForFormik(err.response.data));
                });
        },
    });

    const fetchPrescriptions = () => {
        const url = userStore.user?.role === Roles.Doctor ?
            `prescriptions/appointment/${appointmentId}` : `prescriptions/patient/current/appointment/${appointmentId}`;

        authRequest.get(url)
            .then(response => {
                setPrescriptions(response.data.records)
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }

    useEffect(() => {
        const mapQuickButtonToMultipleChoiceItem = (quickButton: QuickButton) => ({
            id: quickButton.id,
            name: quickButton.value
        })
        authRequest.get(`quick-buttons/doctor/current`)
            .then(response => {
                const data = response.data;
                setAvailableSymptoms(data.interviewQuickButtons.map(mapQuickButtonToMultipleChoiceItem));
                setAvailableDiseases(data.diagnosisQuickButtons.map(mapQuickButtonToMultipleChoiceItem));
                setAvailableRecommendations(data.recommendationsQuickButtons.map(mapQuickButtonToMultipleChoiceItem));
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, []);

    useEffect(() => {
        authRequest.get(`appointments/user/current/${appointmentId}`)
            .then((response: AxiosResponse<Appointment>) => {
                const appointment = response.data;
                setAppointment(appointment);
                if (appointment.interview != null)
                    formik.setFieldValue('interview', appointment.interview);
                if (appointment.diagnosis != null)
                    formik.setFieldValue('diagnosis', appointment.diagnosis);
                if (appointment.recommendations != null)
                    formik.setFieldValue('recommendations', appointment.recommendations);
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });

        fetchPrescriptions();
    }, [appointmentId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!appointment)
            return;
        const url = userStore.user?.role === Roles.Doctor ? `patients/${appointment.patientId}` : 'patients/current';
        authRequest.get(url)
            .then((response: AxiosResponse<Patient>) => {
                const patient = response.data;
                setPatient(patient);
                setPatientAge(moment().diff(patient.dateOfBirth, 'years'));
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, [appointment]); // eslint-disable-line react-hooks/exhaustive-deps

    const getHeader = (header: string, fieldName: string) => {
        const isFormFieldValid = (name: string) =>
            !(formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]);
        return (
            <>
                <span className="ml-2">{header}</span>
                <span
                    className={"pi pi-info-circle ml-2 text-red-500" + (isFormFieldValid(fieldName) ? ' hidden' : '')}
                    style={{color: 'red'}}>
                </span>
            </>
        );
    }

    return (
        <div>
            <div className="flex justify-content-between">
                <div>
                    <div className="flex">
                        <div>
                            <i className="pi pi-calendar mr-1"></i>
                            {moment(appointment?.date).format('DD.MM.YYYY')}
                        </div>
                        <div className="ml-3">
                            <i className="pi pi-clock mr-1"></i>
                            {moment(appointment?.date).format('HH:mm')}
                        </div>
                    </div>
                    <h1 className="m-0">{patient?.firstName} {patient?.lastName}</h1>
                    <div className="flex">
                        <p className="font-bold text-black-alpha-40">
                            National ID <span className="text-black-alpha-70 ml-1">{patient?.nationalId}</span>
                        </p>
                        <p className="font-bold text-black-alpha-40 ml-3">
                            Age <span className="text-black-alpha-70 ml-1">{patientAge}</span>
                        </p>
                    </div>
                </div>
                <div>
                    {userStore.user?.role === Roles.Doctor &&
                        <form onSubmit={formik.handleSubmit} noValidate>
                            {appointment && appointment?.status !== AppointmentStatuses.Completed ?
                                <Button label="Save and complete" type="submit"></Button> :
                                <Button label={AppointmentStatuses.Completed} type="button" disabled></Button>
                            }
                        </form>
                    }
                </div>
            </div>

            <TabView className="tabview-header-icon">
                <TabPanel header={getHeader('Interview', 'interview')} leftIcon="pi pi-calendar">
                    <TextAreaWithMultipleChoiceButtons
                        formik={formik}
                        availableValues={availableSymptoms}
                        selectedValues={symptoms}
                        setSelectedValues={setSymptoms}
                        fieldName={'interview'}
                        fieldPlaceholder={"Interview with patient"}
                        disabled={appointment?.status === AppointmentStatuses.Completed}
                    />
                </TabPanel>

                <TabPanel header={getHeader('Diagnosis', 'diagnosis')} leftIcon="pi pi-user">
                    <TextAreaWithMultipleChoiceButtons
                        formik={formik}
                        availableValues={availableDiseases}
                        selectedValues={diseases}
                        setSelectedValues={setDiseases}
                        fieldName={'diagnosis'}
                        fieldPlaceholder={"Diagnosed disease(s)"}
                        disabled={appointment?.status === AppointmentStatuses.Completed}
                    />
                </TabPanel>

                <TabPanel header={getHeader('Recommendations', 'recommendations')} leftIcon="pi pi-search">
                    <TextAreaWithMultipleChoiceButtons
                        formik={formik}
                        availableValues={availableRecommendations}
                        selectedValues={recommendations}
                        setSelectedValues={setRecommendations}
                        fieldName={'recommendations'}
                        fieldPlaceholder={"Recommended treatment"}
                        disabled={appointment?.status === AppointmentStatuses.Completed}
                    />
                </TabPanel>

                <TabPanel header={<span className="ml-2">Prescriptions</span>} leftIcon="pi pi-cog">
                    <PrescriptionsPanelContent
                        patientId={patient?.id}
                        appointmentId={appointmentId}
                        prescriptions={prescriptions}
                        setPrescriptions={setPrescriptions}
                        drugItems={drugItems}
                        setDrugItems={setDrugItems}
                        fetchPrescriptions={fetchPrescriptions}
                    />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default observer(AppointmentDetails);
