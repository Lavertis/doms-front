import React, {useEffect, useState} from 'react';
import {authRequest} from "../../services/api.service";
import {AxiosError} from "axios";
import {ErrorResult} from "../../types/error";
import {observer} from "mobx-react-lite";
import {SickLeave} from "../../types/sickLeave";
import SickLeaves from "../../components/SickLeave/SickLeaves";

const PatientSickLeaveHistory = () => {
    const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([]);

    useEffect(() => {
        authRequest.get(`/sick-leaves/patient/current?pageSize=5&pageNumber=1`)
            .then(response => {
                setSickLeaves(response.data.records)
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, []);

    return (
        <div className="col-11 sm:col-10 md:col-9 lg:col-8 xl:col-6 mx-auto mt-5">
            <SickLeaves sickLeaves={sickLeaves} setSickLeaves={setSickLeaves}/>
        </div>
    );
};

export default observer(PatientSickLeaveHistory);
