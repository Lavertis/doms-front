import {FC} from 'react';
import Forbidden403 from '../../components/Errors/Forbidden403';
import DoctorStatistics from "./DoctorStatistics";
import AdminStatistics from "./AdminStatistics";
import {observer} from "mobx-react-lite";
import {Roles} from "../../enums/Roles";
import userStore from "../../store/user-store";

const getStatisticsComponentByRole = (role: string) => {
    switch (role) {
        case Roles.Admin:
            return <AdminStatistics/>;
        case Roles.Doctor:
            return <DoctorStatistics/>;
        default:
            return <Forbidden403/>;
    }
};

interface StatisticsProps {
}

const Statistics: FC<StatisticsProps> = () => {
    return (
        <>
            {getStatisticsComponentByRole(userStore.user?.role ?? '')}
        </>
    );
};

export default observer(Statistics);