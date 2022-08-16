import {FC} from 'react';
import UpdateDoctorAccountInfoForm from './UpdateDoctorAccountInfoForm';
import {TabPanel, TabView} from 'primereact/tabview';
import UpdateDoctorPasswordForm from './UpdateDoctorPasswordForm';

interface DoctorAccountManagementProps {
}

const DoctorAccountManagement: FC<DoctorAccountManagementProps> = () => {
    return (
        <TabView className="w-6 mx-auto my-5">
            <TabPanel header="Update account">
                <UpdateDoctorAccountInfoForm/>
            </TabPanel>
            <TabPanel header="Update password">
                <UpdateDoctorPasswordForm/>
            </TabPanel>
        </TabView>
    );
};

export default DoctorAccountManagement;