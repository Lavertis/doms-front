import React, {useState} from 'react';
import {Accordion, AccordionTab} from "primereact/accordion";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Prescription} from "../../types/prescription";
import moment from "moment";
import ConfirmationModal from "../ConfirmationModal";
import {authRequest} from "../../services/api.service";
import userStore from "../../store/user-store";
import {observer} from "mobx-react-lite";
import {Roles} from "../../enums/Roles";
import {saveFileFromApiResponse} from "../../utils/file-utils";

interface PrescriptionsProps {
    prescriptions: Prescription[],
    setPrescriptions: (prescriptions: Prescription[]) => void,
}

const Prescriptions = ({prescriptions, setPrescriptions}: PrescriptionsProps) => {
    const [modalIsShown, setModalIsShown] = useState(false);
    const [currentPrescriptionId, setCurrentPrescriptionId] = useState('');

    const deletePrescription = (id: string) => {
        authRequest.delete(`prescriptions/${id}`).then(() => {
            setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
        });
    }

    if (prescriptions.length === 0) {
        return <div className="text-center">No prescriptions</div>
    }

    const downloadPrescription = (id: string) => {
        authRequest.get(`prescriptions/${id}/download`, {responseType: 'blob'})
            .then(response => saveFileFromApiResponse(response))
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div>
            <Accordion>
                {prescriptions.map((prescription, idx) =>
                    <AccordionTab header={moment(prescription.createdAt).format('Do MMMM YYYY, HH:mm:ss')}
                                  key={prescription.id}
                                  tabIndex={idx}>
                        <div className="flex justify-content-between align-items-center mb-3">
                            <div>
                                <span className="font-bold">Fulfillment date: </span>
                                {moment(prescription.fulfillmentDeadline).format('Do MMMM YYYY')}
                            </div>
                            <div>
                                <Button
                                    icon="pi pi-download"
                                    className="p-button-rounded p-button-info mr-1"
                                    aria-label="Download"
                                    onClick={() => downloadPrescription(prescription.id)}
                                />
                                {userStore.user?.role === Roles.Doctor &&
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger"
                                        aria-label="Cancel"
                                        onClick={() => {
                                            setCurrentPrescriptionId(prescription.id);
                                            setModalIsShown(true)
                                        }}
                                    />
                                }
                            </div>
                        </div>

                        <DataTable value={prescription.drugItems} responsiveLayout="scroll">
                            <Column field="name" header="Name"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                            <Column field="dosage" header="Dosage"></Column>
                        </DataTable>
                    </AccordionTab>
                )}
            </Accordion>
            <ConfirmationModal
                title={"Delete confirmation"}
                message={"Are you sure you want to delete this patient?"}
                isShown={modalIsShown}
                confirmAction={() => deletePrescription(currentPrescriptionId)}
                hide={() => setModalIsShown(false)}
            />
        </div>
    );
};

export default observer(Prescriptions);
