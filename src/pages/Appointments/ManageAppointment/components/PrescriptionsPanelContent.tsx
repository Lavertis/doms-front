import React from 'react';
import AddPrescription from "../../../../components/Prescriptions/AddPrescription";
import Prescriptions from "../../../../components/Prescriptions/Prescriptions";
import {Prescription} from "../../../../types/prescription";
import {Drug} from "../../../../types/drugs";
import userStore from "../../../../store/user-store";
import {observer} from "mobx-react-lite";
import {Roles} from "../../../../enums/Roles";

interface PrescriptionsPanelContentProps {
    appointmentId?: string;
    patientId: string;
    prescriptions: Prescription[];
    setPrescriptions: (prescriptions: Prescription[]) => void;
    drugItems: Drug[],
    setDrugItems: (drugItems: Drug[]) => void
    fetchPrescriptions: () => void;
}

const PrescriptionsPanelContent = ({
                                       appointmentId,
                                       patientId,
                                       prescriptions,
                                       setPrescriptions,
                                       drugItems,
                                       setDrugItems,
                                       fetchPrescriptions
                                   }: PrescriptionsPanelContentProps) => {

    return (
        <div>
            {userStore.user?.role === Roles.Doctor &&
                <div className="p-4 shadow-1 border-round w-full mb-5">
                    <AddPrescription
                        patientId={patientId}
                        appointmentId={appointmentId}
                        drugItems={drugItems}
                        setDrugItems={setDrugItems}
                        fetchPrescriptions={fetchPrescriptions}
                    />
                </div>
            }
            <div className="p-4 shadow-1 border-round w-full">
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

export default observer(PrescriptionsPanelContent);
