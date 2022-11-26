import React, {useRef} from 'react';
import {Accordion, AccordionTab} from "primereact/accordion";
import {Button} from "primereact/button";
import moment from "moment";
import {SickLeave} from "../../types/sickLeave";
import {authRequest} from "../../services/api.service";
import userStore from "../../store/user-store";
import {Roles} from "../../enums/Roles";
import {saveFileFromApiResponse} from "../../utils/file-utils";
import ConfirmationModal from "../ConfirmationModal";
import {Toast} from "primereact/toast";

interface SickLeavesProps {
    sickLeaves: SickLeave[],
    setSickLeaves: (sickLeaves: SickLeave[]) => void,
}

const SickLeaves = ({sickLeaves, setSickLeaves}: SickLeavesProps) => {
    const [modalIsShown, setModalIsShown] = React.useState(false);
    const [currentSickLeaveId, setCurrentSickLeaveId] = React.useState('');

    const deleteSickLeave = (id: string) => {
        authRequest.delete(`sick-leaves/${id}`).then(() => {
            toast.current?.show({severity: 'success', summary: 'Success', detail: 'Sick leave deleted'});
            setSickLeaves(sickLeaves.filter(sickLeave => sickLeave.id !== id));
        });
    }

    const downloadSickLeave = (id: string) => {
        authRequest.get(`sick-leaves/${id}/download`, {responseType: 'blob'})
            .then(response => saveFileFromApiResponse(response))
            .catch(error => {
                console.log(error);
            });
    }

    const toast = useRef<Toast>(null);

    if (sickLeaves.length === 0) {
        return <div className="text-center">No sick leaves</div>
    }

    return (
        <div>
            <Toast ref={toast}/>
            <Accordion>
                {sickLeaves.map((sickLeave, idx) =>
                    <AccordionTab header={moment(sickLeave?.createdAt).format("Do MMMM YYYY, HH:mm:ss")}
                                  key={sickLeave.id}
                                  tabIndex={idx}>
                        <div className="flex flex-column align-items-left mb-3">
                            <div className="flex flex-row justify-content-between align-items-left mb-3">
                                <div className="flex align-items-center">
                                    <span className="font-bold">Time range:&nbsp;</span>
                                    {moment(sickLeave?.dateStart).format("Do MMMM YYYY")}
                                    &nbsp; - &nbsp;
                                    {moment(sickLeave?.dateEnd).format("Do MMMM YYYY")}
                                </div>
                                <div>
                                    <Button
                                        icon="pi pi-download"
                                        className="p-button-rounded p-button-info mr-1"
                                        aria-label="Download"
                                        onClick={() => downloadSickLeave(sickLeave.id)}
                                    />
                                    {userStore.user?.role === Roles.Doctor &&
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-danger"
                                            aria-label="Cancel"
                                            onClick={() => {
                                                setCurrentSickLeaveId(sickLeave.id);
                                                setModalIsShown(true)
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="mb-3">
                                <span className="font-bold">Diagnosis</span>
                                <div>{sickLeave?.diagnosis}</div>
                            </div>
                            <div className={"text-overflow-ellipsis"}>
                                <span className="font-bold">Purpose</span>
                                <div>{sickLeave?.purpose}</div>
                            </div>
                        </div>
                    </AccordionTab>
                )}
            </Accordion>
            <ConfirmationModal
                title={"Delete confirmation"}
                message={"Are you sure you want to delete this sick leave?"}
                isShown={modalIsShown}
                confirmAction={() => deleteSickLeave(currentSickLeaveId)}
                hide={() => setModalIsShown(false)}
            />
        </div>
    )
        ;
};

export default SickLeaves;
