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

const PatientDetails = () => {
    const {id} = useParams();
    const [patient, setPatient] = useState<Patient>();

    const [drugItems, setDrugItems] = useState<Drug[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    useEffect(() => {
        authRequest.get(`/patients/${id}`)
            .then(response => {
                setPatient(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

    useEffect(() => {
        if (userStore.user?.role !== "Doctor")
            return;
        authRequest.get(`prescriptions/patient/${id}`)
            .then(response => {
                setPrescriptions(response.data.records)
            })
            .catch((err: AxiosError<ErrorResult>) => {
                if (err.response?.data.error != null)
                    console.log(err.response.data.error);
            });
    }, [id]);

    return (
        <div className="col-11 lg:col-10 xl:col-8 mx-auto">
            <div className="card my-5">
                <Fieldset legend="Patient details" className="mb-3">
                    <PatientFields patient={patient}/>
                </Fieldset>

                {userStore.user?.role === 'Doctor' && (
                    <>
                        <Fieldset legend="Prescriptions" toggleable collapsed className="mb-3">
                            <div>
                                <AddPrescription
                                    patientId={patient?.id ?? ""}
                                    drugItems={drugItems}
                                    setDrugItems={setDrugItems}
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
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut
                                labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo
                                consequat.
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                nulla
                                pariatur. Excepteur sint occaecat
                                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                                laborum.</p>
                        </Fieldset>
                    </>
                )}

            </div>
        </div>
    );
};

export default observer(PatientDetails);
