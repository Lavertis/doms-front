import React from 'react';
import {SickLeave} from "../../../../types/sickLeave";
import AddSickLeave from "../../../../components/SickLeave/AddSickLeave";
import SickLeaves from "../../../../components/SickLeave/SickLeaves";
import userStore from "../../../../store/user-store";
import {Roles} from "../../../../enums/Roles";

interface SickLeavesPanelProps {
    appointmentId: string;
    patientId: string;
    sickLeaves: SickLeave[];
    setSickLeaves: (sickLeaves: SickLeave[]) => void;
    fetchSickLeaves: () => void;
}

const SickLeavesPanelContent = ({
                                    appointmentId,
                                    patientId,
                                    sickLeaves,
                                    setSickLeaves,
                                    fetchSickLeaves
                                }: SickLeavesPanelProps) => {

    return (
        <div>
            {userStore.user?.role === Roles.Doctor &&
                <AddSickLeave
                    patientId={patientId}
                    appointmentId={appointmentId}
                    fetchSickLeaves={fetchSickLeaves}
                />
            }
            <div className="mt-5">
                <div className="text-center mb-5">
                    <div className="text-900 text-2xl font-medium mb-3">
                        Appointment sick leaves
                    </div>
                    <hr/>
                </div>
                <SickLeaves sickLeaves={sickLeaves} setSickLeaves={setSickLeaves}/>
            </div>
        </div>
    );
};

export default SickLeavesPanelContent;
