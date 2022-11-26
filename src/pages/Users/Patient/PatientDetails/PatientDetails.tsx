import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Patient} from "../../../../types/patient";
import PatientFields from "./components/PatientFields";
import {Drug} from "../../../../types/drugs";
import {Prescription} from "../../../../types/prescription";
import {AxiosError} from "axios";
import {ErrorResult} from "../../../../types/error";
import AddPrescription from "../../../../components/Prescriptions/AddPrescription";
import Prescriptions from "../../../../components/Prescriptions/Prescriptions";
import {Fieldset} from 'primereact/fieldset';
import {authRequest} from "../../../../services/api.service";
import userStore from "../../../../store/user-store";
import {observer} from "mobx-react-lite";
import {Roles} from "../../../../enums/Roles";
import AddSickLeave from "../../../../components/SickLeave/AddSickLeave";
import SickLeaves from "../../../../components/SickLeave/SickLeaves";
import {SickLeave} from "../../../../types/sickLeave";

const PatientDetails = () => {
    const {id} = useParams();
    const [patient, setPatient] = useState<Patient>();

    const [drugItems, setDrugItems] = useState<Drug[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([]);

    useEffect(() => {
        authRequest.get(`/patients/${id}`)
            .then(response => {
                setPatient(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

    const fetchPrescriptions = () => {
        if (userStore.user?.role !== Roles.Doctor)
            return;
        authRequest.get(`prescriptions/patient/${id}`)
            .then(response => {
                setPrescriptions(response.data.records)
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }

    const fetchSickLeaves = () => {
        if (userStore.user?.role !== Roles.Doctor)
            return;
        authRequest.get(`sick-leaves/patient/${id}`)
            .then(response => {
                setSickLeaves(response.data.records)
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }

    useEffect(() => {
        fetchPrescriptions();
        fetchSickLeaves();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="col-11 lg:col-10 xl:col-8 mx-auto">
            <div className="card my-5">
                <Fieldset legend="Patient details" className="mb-3">
                    <PatientFields patient={patient}/>
                </Fieldset>

                {userStore.user?.role === Roles.Doctor && (
                    <>
                        <Fieldset legend="Prescriptions" toggleable collapsed className="mb-3">
                            <div>
                                <AddPrescription
                                    patientId={patient?.id ?? ''}
                                    drugItems={drugItems}
                                    setDrugItems={setDrugItems}
                                    fetchPrescriptions={fetchPrescriptions}
                                />
                            </div>
                            <div>
                                <h3>Prescription history</h3>
                                <Prescriptions
                                    prescriptions={prescriptions.slice(0, 5)}
                                    setPrescriptions={setPrescriptions}
                                />
                            </div>
                        </Fieldset>

                        <Fieldset legend="Sick leaves" toggleable collapsed className="mb-3">
                            <div>
                                <AddSickLeave
                                    patientId={patient?.id ?? ''}
                                    fetchSickLeaves={fetchSickLeaves}
                                />
                            </div>
                            <div>
                                <h3>Sick leave history</h3>
                                <SickLeaves
                                    sickLeaves={sickLeaves.slice(0, 5)}
                                    setSickLeaves={setSickLeaves}
                                />
                            </div>
                        </Fieldset>
                    </>
                )}

            </div>
        </div>
    );
};

export default observer(PatientDetails);
