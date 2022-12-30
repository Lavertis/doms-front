import React, {useEffect, useState} from 'react';
import {Fieldset} from 'primereact/fieldset';
import {useParams} from 'react-router-dom';
import {Patient} from '../../../../types/Users/Patient';
import DoctorFields from './components/DoctorFields';
import {authRequest} from '../../../../services/api.service';

const DoctorDetails = () => {
    const {id} = useParams();
    const [doctor, setDoctor] = useState<Patient>();

    useEffect(() => {
        authRequest.get(`/doctors/${id}`)
            .then(response => {
                setDoctor(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

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
