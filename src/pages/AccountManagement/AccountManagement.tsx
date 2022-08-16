import {FC, useContext} from 'react';
import PatientAccountManagement from './PatientAccountManagement/PatientAccountManagement';
import {TokenContext} from '../../App';
import {getRoleFromToken} from '../../utils/jwt-utils';
import DoctorAccountManagement from './DoctorAccountManagement/DoctorAccountManagement';
import Forbidden403 from '../../components/Errors/Forbidden403';

const getAccountManagementComponentByRole = (role: string) => {
    switch (role) {
        case 'Patient':
            return <PatientAccountManagement/>;
        case 'Doctor':
            return <DoctorAccountManagement/>;
        default:
            return <Forbidden403/>;
    }
};

interface AccountManagementProps {
}

const AccountManagement: FC<AccountManagementProps> = () => {
    const {token} = useContext(TokenContext);

    return (
        <>
            {getAccountManagementComponentByRole(getRoleFromToken(token)!)}
        </>
    );
};

export default AccountManagement;