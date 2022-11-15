import React from 'react';
import DoctorAppointmentsTable from "./DoctorAppointmentsTable";
import PatientAppointmentsTable from "./PatientAppointmentsTable";
import userStore from "../../../store/user-store";
import {observer} from "mobx-react-lite";
import {Roles} from "../../../enums/Roles";

const AppointmentsTable = () => {

    const doctorAppointmentsTable = () => {
        return (<DoctorAppointmentsTable/>);
    }

    const patientAppointmentsTable = () => {
        return (<PatientAppointmentsTable/>);
    }

    return (
        <div className="col-11 xl:col-9 mx-auto">
            {userStore.user?.role === Roles.Doctor ? doctorAppointmentsTable() : patientAppointmentsTable()}
        </div>
    );
};

export default observer(AppointmentsTable);
