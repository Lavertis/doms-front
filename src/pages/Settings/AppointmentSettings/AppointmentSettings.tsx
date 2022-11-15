import React from 'react';
import SetAppointmentFlowQuickButtons
    from "../../AccountManagement/DoctorAccountManagement/SetAppointmentFlowQuickButtons";

const AppointmentSettings = () => {

    return (
        <div className="p-4 pt-3 surface-card shadow-3 border-round col-11 lg:col-9 xl:col-8 mx-auto mt-5">
            <h2 className="text-black-alpha-80 ml-3">Appointment Quick Buttons</h2>
            <SetAppointmentFlowQuickButtons/>
        </div>
    );
};

export default AppointmentSettings;
