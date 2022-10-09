import React from 'react';
import {Accordion, AccordionTab} from "primereact/accordion";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Prescription} from "../../types/prescription";
import axios from "../../api/Axios";
import moment from "moment";

interface PrescriptionsProps {
    prescriptions: Prescription[],
    setPrescriptions: (prescriptions: Prescription[]) => void,
}

const Prescriptions = ({prescriptions, setPrescriptions}: PrescriptionsProps) => {

    const deletePrescription = (id: string) => {
        axios.delete(`prescriptions/${id}`).then();
        setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
    }

    return (
        <Accordion>
            {prescriptions.map(prescription =>
                <AccordionTab header={moment(prescription?.createdAt).toString()} key={prescription.id}>
                    <div className="flex justify-content-between align-items-center mb-3">
                        <div>
                            <span className="font-bold">Fulfillment date: </span>
                            {moment(prescription?.fulfilmentDate).toString()}
                        </div>
                        <div>
                            <Button
                                icon="pi pi-times"
                                className="p-button-rounded p-button-danger"
                                aria-label="Cancel"
                                onClick={() => deletePrescription(prescription.id)}
                            />
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
    );
};

export default Prescriptions;
