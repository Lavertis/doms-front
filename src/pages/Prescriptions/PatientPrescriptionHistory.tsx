import React, {useEffect, useState} from 'react';
import Prescriptions from "../../components/Prescriptions/Prescriptions";
import {observer} from "mobx-react-lite";
import {Prescription} from "../../types/prescription";
import {authRequest} from "../../services/api.service";
import {AxiosError} from "axios";
import {ErrorResult} from "../../types/error";

const PatientPrescriptionHistory = () => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    useEffect(() => {
        authRequest.get(`/prescriptions/patient/current?pageSize=5&pageNumber=1`)
            .then(response => {
                setPrescriptions(response.data.records)
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, []);

    return (
        <div className="col-11 sm:col-10 md:col-9 lg:col-8 xl:col-6 mx-auto mt-5">
            <Prescriptions prescriptions={prescriptions} setPrescriptions={setPrescriptions}/>
        </div>
    );
};

export default observer(PatientPrescriptionHistory);
