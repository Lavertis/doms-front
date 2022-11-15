import {TabPanel, TabView} from "primereact/tabview";
import React, {useEffect, useRef, useState} from "react";
import QuickButtonsEdit from "../../Settings/AppointmentSettings/QuickButtonsEdit";
import {QuickButton} from "../../../types/quick-button";
import {Toast} from "primereact/toast";
import {authRequest} from "../../../services/api.service";

const SetAppointmentFlowQuickButtons = () => {
    const toast = useRef<Toast>(null);
    const [interviewQuickButtons, setInterviewQuickButtons] = useState<QuickButton[]>([]);
    const [diagnosisQuickButtons, setDiagnosisQuickButtons] = useState<QuickButton[]>([]);
    const [recommendationsQuickButtons, setRecommendationsQuickButtons] = useState<QuickButton[]>([]);

    const addInterviewQuickButton = async (value: string) => {
        const response = await authRequest.post('quick-buttons/doctor/current', {value, type: 'Interview'});
        if (response.status === 201) {
            setInterviewQuickButtons([...interviewQuickButtons, response.data]);
            return true;
        }
        return false;
    }

    const deleteInterviewQuickButton = (id: string) => {
        authRequest.delete(`quick-buttons/doctor/current/${id}`)
            .then(() => {
                setInterviewQuickButtons(interviewQuickButtons.filter(quickButton => quickButton.id !== id));
                showToastForSuccessfulDeletion();
            })
            .catch(error => {
                console.error(error);
                showToastForUnsuccessfulDeletion();
            });
    }

    const addDiagnosisQuickButton = async (value: string) => {
        const response = await authRequest.post('quick-buttons/doctor/current', {value, type: 'Diagnosis'});
        if (response.status === 201) {
            setDiagnosisQuickButtons([...diagnosisQuickButtons, response.data]);
            return true;
        }
        return false;
    }

    const deleteDiagnosisQuickButton = (id: string) => {
        authRequest.delete(`quick-buttons/doctor/current/${id}`)
            .then(() => {
                setDiagnosisQuickButtons(diagnosisQuickButtons.filter(quickButton => quickButton.id !== id));
                showToastForSuccessfulDeletion();
            })
            .catch(error => {
                console.error(error);
                showToastForUnsuccessfulDeletion();
            });
    }

    const addRecommendationQuickButton = async (value: string) => {
        const response = await authRequest.post('quick-buttons/doctor/current', {value, type: 'Recommendations'});
        if (response.status === 201) {
            setRecommendationsQuickButtons([...recommendationsQuickButtons, response.data]);
            return true;
        }
        return false;
    }

    const deleteRecommendationQuickButton = (id: string) => {
        authRequest.delete(`quick-buttons/doctor/current/${id}`)
            .then(() => {
                setRecommendationsQuickButtons(recommendationsQuickButtons.filter(quickButton => quickButton.id !== id));
                showToastForSuccessfulDeletion();
            })
            .catch(error => {
                console.error(error);
                showToastForUnsuccessfulDeletion();
            });
    }

    useEffect(() => {
        authRequest.get('quick-buttons/doctor/current')
            .then(response => {
                setInterviewQuickButtons(response.data.interviewQuickButtons);
                setDiagnosisQuickButtons(response.data.diagnosisQuickButtons);
                setRecommendationsQuickButtons(response.data.recommendationsQuickButtons);
            })
            .catch(error => console.error(error));
    }, []);

    const showToastForSuccessfulDeletion = () => {
        toast.current?.show({
            severity: 'success',
            summary: 'Quick button',
            detail: 'Quick button deleted',
            life: 5000
        });
    }

    const showToastForUnsuccessfulDeletion = () => {
        toast.current?.show({
            severity: 'error',
            summary: 'Quick button',
            detail: 'Could not delete quick button',
            life: 5000
        });
    }

    return (
        <div className="">
            <Toast ref={toast}/>
            <TabView className="">
                <TabPanel header="Interview">
                    <QuickButtonsEdit
                        quickButtons={interviewQuickButtons}
                        addQuickButton={addInterviewQuickButton}
                        deleteQuickButton={deleteInterviewQuickButton}
                        toast={toast}
                    />
                </TabPanel>
                <TabPanel header="Diagnosis">
                    <QuickButtonsEdit
                        quickButtons={diagnosisQuickButtons}
                        addQuickButton={addDiagnosisQuickButton}
                        deleteQuickButton={deleteDiagnosisQuickButton}
                        toast={toast}
                    />
                </TabPanel>
                <TabPanel header="Recommendations">
                    <QuickButtonsEdit
                        quickButtons={recommendationsQuickButtons}
                        addQuickButton={addRecommendationQuickButton}
                        deleteQuickButton={deleteRecommendationQuickButton}
                        toast={toast}
                    />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default SetAppointmentFlowQuickButtons;
