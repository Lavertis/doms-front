import React from 'react';
import AddPrescription from "../../../../components/Prescriptions/AddPrescription";
import Prescriptions from "../../../../components/Prescriptions/Prescriptions";
import {Prescription} from "../../../../types/prescription";
import {Drug} from "../../../../types/drugs";

interface PrescriptionsPanelContentProps {
    appointmentId?: string;
    patientId: string;
    prescriptions: Prescription[];
    setPrescriptions: (prescriptions: Prescription[]) => void;
    drugItems: Drug[],
    setDrugItems: (drugItems: Drug[]) => void
}

const PrescriptionsPanelContent = ({
                                       appointmentId,
                                       patientId,
                                       prescriptions,
                                       setPrescriptions,
                                       drugItems,
                                       setDrugItems
                                   }: PrescriptionsPanelContentProps) => {

    return (
        <div>
            <div className="surface-card p-4 shadow-2 border-round w-full">
                <AddPrescription
                    patientId={patientId}
                    appointmentId={appointmentId}
                    drugItems={drugItems}
                    setDrugItems={setDrugItems}
                />
            </div>
            <div className="surface-card p-4 shadow-2 border-round w-full mt-5">
                <div className="text-center mb-5">
                    <div className="text-900 text-2xl font-medium mb-3">
                        Appointment prescriptions
                    </div>
                    <hr/>
                </div>
                <Prescriptions prescriptions={prescriptions} setPrescriptions={setPrescriptions}/>
            </div>
        </div>
    );
};

export default PrescriptionsPanelContent;
