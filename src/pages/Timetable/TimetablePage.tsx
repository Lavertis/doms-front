import {FC} from 'react';
import DoctorTimetable from './DoctorTimetable/DoctorTimetable';
import PatientTimetable from './PatientTimetable/PatientTimetable';
import userStore from '../../store/user-store';
import {observer} from 'mobx-react-lite';

interface TimetablePageProps {
}

const TimetablePage: FC<TimetablePageProps> = () => {
    return (
        <>
            {userStore.user?.role === 'Doctor' ? <DoctorTimetable/> : <PatientTimetable/>}
        </>
    );
};

export default observer(TimetablePage);