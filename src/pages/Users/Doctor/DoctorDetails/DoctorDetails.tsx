import React, {useEffect, useState} from 'react';
import {Fieldset} from 'primereact/fieldset';
import {useParams} from "react-router-dom";
import useAxios from "../../../../hooks/useAxios";
import {Patient} from "../../../../types/patient";
import DoctorFields from "./components/DoctorFields";

const DoctorDetails = () => {
    const {id} = useParams();
    const axios = useAxios();
    const [doctor, setDoctor] = useState<Patient>();

    useEffect(() => {
        axios.get(`/doctors/${id}`)
            .then(response => {
                setDoctor(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [axios, id]);

    return (
        <div className="col-11 lg:col-10 xl:col-8 mx-auto">
            <div className="card my-5">
                <Fieldset legend="Doctor details" className="mb-3">
                    <DoctorFields doctor={doctor}/>
                </Fieldset>
            </div>
        </div>
    );
};

export default DoctorDetails;
