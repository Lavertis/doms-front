import React, {useEffect, useState} from 'react';
import {TabPanel, TabView} from "primereact/tabview";
import DoctorList from "./components/DoctorList";
import PatientList from "./components/PatientList";
import {FilterMatchMode} from "primereact/api";
import {Doctor} from "../../../types/doctor";
import {Patient} from "../../../types/patient";
import {LazyParams} from "../../../types/data-table";
import {AxiosError} from "axios";
import {authRequest} from "../../../services/api.service";
import {observer} from "mobx-react-lite";
import userStore from "../../../store/user-store";

const UserManagement = () => {

    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [patientsLoading, setPatientsLoading] = useState(false);

    const [totalDoctorRecords, setTotalDoctorRecords] = useState<number>(0);
    const [totalPatientRecords, setTotalPatientRecords] = useState<number>(0);

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);

    const [doctorListLazyParams, setDoctorListLazyParams] = useState<LazyParams>({
        first: 0,
        rows: 10,
        page: 0,
        filters: {
            'firstName': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'lastName': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'email': {value: null, matchMode: FilterMatchMode.CONTAINS}
        }
    });

    const [patientListLazyParams, setPatientListLazyParams] = useState<LazyParams>({
        first: 0,
        rows: 10,
        page: 0,
        filters: {
            'firstName': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'lastName': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'email': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'nationalId': {value: null, matchMode: FilterMatchMode.CONTAINS}
        }
    });

    useEffect(() => {
        setPatientsLoading(true);
        const queryParams = {
            pageNumber: patientListLazyParams.page + 1,
            pageSize: patientListLazyParams.rows,
            firstName: patientListLazyParams.filters.firstName.value,
            lastName: patientListLazyParams.filters.lastName.value,
            email: patientListLazyParams.filters.email.value,
            nationalId: patientListLazyParams.filters.nationalId.value
        }

        Object.keys(queryParams).forEach(key => {
            if (queryParams[key as keyof typeof queryParams] === '') {
                queryParams[key as keyof typeof queryParams] = null;
            }
        });

        authRequest.get('patients', {params: queryParams}).then(response => {
            setPatients(response.data.records);
            setTotalPatientRecords(response.data.totalRecords);
            setPatientsLoading(false);
        }).catch((err: AxiosError) => {
            if (err.response?.status === 416) {
                setPatients([]);
                setTotalPatientRecords(0);
                setPatientsLoading(false);
            }
        });
    }, [patientListLazyParams]);

    useEffect(() => {
        if (userStore.user?.role !== 'Admin')
            return;

        setDoctorsLoading(true);
        const queryParams = {
            pageNumber: doctorListLazyParams.page + 1,
            pageSize: doctorListLazyParams.rows,
            firstName: doctorListLazyParams.filters.firstName.value,
            lastName: doctorListLazyParams.filters.lastName.value,
            email: doctorListLazyParams.filters.email.value
        };

        Object.keys(queryParams).forEach(key => {
            if (queryParams[key as keyof typeof queryParams] === '') {
                queryParams[key as keyof typeof queryParams] = null;
            }
        });

        authRequest.get('doctors', {params: queryParams}).then(response => {
            setDoctors(response.data.records);
            setTotalDoctorRecords(response.data.totalRecords);
            setDoctorsLoading(false);
        }).catch((err: AxiosError) => {
            if (err.response?.status === 416) {
                setDoctors([]);
                setTotalDoctorRecords(0);
                setDoctorsLoading(false);
            }
        });
    }, [doctorListLazyParams]);

    return (
        <div className="my-5 mx-auto col-11 xl:col-10">
            <TabView>
                <TabPanel header="Patients">
                    <PatientList
                        patients={patients}
                        totalRecords={totalPatientRecords}
                        loading={patientsLoading}
                        lazyParams={patientListLazyParams}
                        setLazyParams={setPatientListLazyParams}
                        allowDelete={userStore.user?.role === 'Admin'}
                    />
                </TabPanel>
                {userStore.user?.role === 'Admin' && <TabPanel header="Doctors">
                    <DoctorList
                        doctors={doctors}
                        totalRecords={totalDoctorRecords}
                        loading={doctorsLoading}
                        lazyParams={doctorListLazyParams}
                        setLazyParams={setDoctorListLazyParams}
                        allowDelete={userStore.user?.role === 'Admin'}
                    />
                </TabPanel>
                }
            </TabView>
        </div>
    );
};

export default observer(UserManagement);
