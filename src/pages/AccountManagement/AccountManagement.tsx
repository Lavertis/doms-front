import {FC} from 'react';
import PatientAccountManagement from './PatientAccountManagement/PatientAccountManagement';
import DoctorAccountManagement from './DoctorAccountManagement/DoctorAccountManagement';
import Forbidden403 from '../../components/Errors/Forbidden403';
import userStore from "../../store/user-store";
import {observer} from "mobx-react-lite";
import {Roles} from "../../enums/Roles";

const getAccountManagementComponentByRole = (role: string) => {
    switch (role) {
        case Roles.Patient:
            return <PatientAccountManagement/>;
        case Roles.Doctor:
            return <DoctorAccountManagement/>;
        default:
            return <Forbidden403/>;
    }
};

interface AccountManagementProps {
}

const AccountManagement: FC<AccountManagementProps> = () => {

    return (
        <>
            {getAccountManagementComponentByRole(userStore.user?.role!)}
        </>
    );
};

export default observer(AccountManagement);