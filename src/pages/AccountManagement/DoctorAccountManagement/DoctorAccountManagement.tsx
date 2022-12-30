import {FC} from 'react';
import UpdateDoctorAccountInfoForm from './UpdateDoctorAccountInfoForm';
import {TabPanel, TabView} from 'primereact/tabview';
import UpdateDoctorPasswordForm from './UpdateDoctorPasswordForm';

interface DoctorAccountManagementProps {
}

const DoctorAccountManagement: FC<DoctorAccountManagementProps> = () => {
    return (
        <div className="surface-card p-4 shadow-1 border-round w-full lg:w-6 mx-auto mt-5">
            <TabView className="">
                <TabPanel header="Update account">
                    <UpdateDoctorAccountInfoForm/>
                </TabPanel>
                <TabPanel header="Update password">
                    <UpdateDoctorPasswordForm/>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default DoctorAccountManagement;