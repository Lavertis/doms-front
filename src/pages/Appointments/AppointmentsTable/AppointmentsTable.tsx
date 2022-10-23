import React, {useContext} from 'react';
import {TokenContext} from "../../../App";
import {getRoleFromToken} from "../../../utils/jwt-utils";
import DoctorAppointmentsTable from "./DoctorAppointmentsTable";
import PatientAppointmentsTable from "./PatientAppointmentsTable";

const AppointmentsTable = () => {
    const {token} = useContext(TokenContext);
    const role = getRoleFromToken(token);

    const doctorAppointmentsTable = () => {
        return (<DoctorAppointmentsTable/>);
    }

    const patientAppointmentsTable = () => {
        return (<PatientAppointmentsTable/>);
    }

    return (
        <div className="xl:col-9 mx-auto">
            {role === 'Doctor' ? doctorAppointmentsTable() : patientAppointmentsTable()}
        </div>
    );
};

export default AppointmentsTable;
