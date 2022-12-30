import {FC} from 'react';
import {TabPanel, TabView} from 'primereact/tabview';
import UpdatePatientAccountInfoForm from './UpdatePatientAccountInfoForm';
import UpdatePatientPasswordForm from './UpdatePatientPasswordForm';
import DeletePatientAccountForm from './DeletePatientAccountForm';

interface PatientAccountManagementProps {
}

const PatientAccountManagement: FC<PatientAccountManagementProps> = () => {
    return (
        <TabView className="w-6 mx-auto my-5 shadow-1 border-round">
            <TabPanel header="Update account">
                <UpdatePatientAccountInfoForm/>
            </TabPanel>
            <TabPanel header="Update password">
                <UpdatePatientPasswordForm/>
            </TabPanel>
            <TabPanel header="Delete account">
                <DeletePatientAccountForm/>
            </TabPanel>
        </TabView>
    );
};

export default PatientAccountManagement;