import React, {useState} from 'react';
import AppointmentHistory from "./components/AppointmentHistory";
import AppointmentDetails from "./components/AppointmentDetails";
import {useParams} from "react-router-dom";
import {Patient} from "../../../types/patient";
import {uuidFromBase64} from "../../../utils/uuid-utils";

const ManageAppointment = () => {
    const {id} = useParams();
    const [patient, setPatient] = useState<Patient>(null!);

    return (
        <div className="lg:col-11 xl:col-9 mx-auto my-5">
            <div className="p-card p-component">
                <div className="pl-4 py-3">
                    Appointment details
                </div>
                <hr className="border-black-alpha-30 m-0"/>
                <div className="p-card-body">
                    <AppointmentDetails
                        appointmentId={uuidFromBase64(id!)}
                        patient={patient}
                        setPatient={setPatient}
                    />
                </div>
            </div>

            <div className="p-card p-component mt-5">
                <div className="pl-4 py-3">
                    Appointment history
                </div>
                <hr className="border-black-alpha-30 m-0"/>
                <div className="p-card-body">
                    <AppointmentHistory patientId={patient?.id}/>
                </div>
            </div>
        </div>
    );
};

export default ManageAppointment;
