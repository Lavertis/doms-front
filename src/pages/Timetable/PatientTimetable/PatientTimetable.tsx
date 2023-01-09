import React, {FC, useEffect, useRef, useState} from 'react';
import {Toast} from 'primereact/toast';
import Timetable from '../../../components/Timetable/Timetable';
import {useNavigate} from 'react-router-dom';
import {Dropdown} from 'primereact/dropdown';
import {Doctor} from '../../../types/Users/Doctor';
import {PagedResponse} from '../../../types/PagedResponse';
import {AxiosResponse} from 'axios';
import {DraggableEventData} from '../../../types/Timetable';
import {backgroundGroupId, EventStates, newAppointmentColor} from './utils';
import {Button} from 'primereact/button';
import {observer} from 'mobx-react-lite';
import {authRequest} from '../../../services/api.service';
import EventContent from '../PatientTimetable/EventContent';
import {
    onEventChangeCallback,
    onEventClickCallback,
    onEventReceiveCallback,
    onEventRemoveCallback,
    saveAppointments,
    updateEventsCallback
} from './callbacks';
import appointmentTypeStore from "../../../store/appointment-type-store";

interface PatientTimetableProps {
}

const PatientTimetable: FC<PatientTimetableProps> = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [changedEventIds, setChangedEventIds] = useState<Set<string>>(new Set());
    const [addedEventIds, setAddedEventIds] = useState<string[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
    const [draggableEventsData, setDraggableEventsData] = useState<DraggableEventData[]>([]);
    const navigate = useNavigate();
    const calendarRef: any = React.createRef();
    const toast = useRef<any>(null);
    const eventStates: EventStates = {
        addedEventIds: addedEventIds,
        setAddedEventIds: setAddedEventIds,
        changedEventIds: changedEventIds,
        setChangedEventIds: setChangedEventIds
    };
    const allDoctorsId = 'c68b263b-7c45-4b7c-bc3a-46253e948a62';

    useEffect(() => {
        authRequest.get('doctors')
            .then((response: AxiosResponse<PagedResponse<Doctor>>) => {
                setDoctors([{
                    id: allDoctorsId,
                    userName: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    createdAt: new Date()
                } as Doctor].concat(response.data.records));
            });
        setDraggableEventsData(appointmentTypeStore.appointmentTypes.map((appointmentType) => {
            return ({
                id: appointmentType.id,
                title: `${appointmentType.name}, (New)`,
                durationMinutes: appointmentType.durationMinutes,
                color: newAppointmentColor,
                editable: false,
            });
        }));
    }, []);

    const doctorOptionTemplate = (option: Doctor) => {
        if (option.id === allDoctorsId)
            return 'All doctors';
        return `${option.firstName[0]}. ${option.lastName}`;
    };

    const sidebarContent = <>
        <div className="xl:col-auto">
            <Dropdown
                className="xl:w-full mx-1 xl:mx-0"
                optionLabel="optionLabel"
                value={selectedDoctor}
                options={doctors}
                itemTemplate={doctorOptionTemplate}
                valueTemplate={selectedDoctor && doctorOptionTemplate} // TODO zip-tie right here
                onChange={(changeParams) => {
                    if (changeParams.value.id === allDoctorsId) {
                        setSelectedDoctor(null as any);
                        return;
                    }
                    setSelectedDoctor(changeParams.value);
                }}
                placeholder="Select a doctor"
            />
            <Button
                label="Save"
                onClick={() => saveAppointments(calendarRef, toast, eventStates, selectedDoctor)}
                className="xl:col-12 xl:my-2 mx-1 xl:mx-0"/>
        </div>
    </>;

    return (
        <>
            <Toast ref={toast}/>
            <Timetable
                calendarRef={calendarRef}
                eventSource={(info: any, successCallback: any, failureCallback: any) => updateEventsCallback(info, successCallback, failureCallback, selectedDoctor)}
                sidebarContent={sidebarContent}
                draggableEventsData={draggableEventsData}
                showDraggableEvents={!!selectedDoctor}
                showDropToRemoveDiv={!!selectedDoctor}
                backgroundGroupId={backgroundGroupId}
                restrictToBgEvents={true}
                eventContent={(renderProperties: any) => <EventContent
                    event={renderProperties.event}
                    selectedDoctor={selectedDoctor}
                />}
                onEventChangeCallback={(changeInfo: any) => onEventChangeCallback(changeInfo, eventStates)}
                onEventReceiveCallback={(info: any) => onEventReceiveCallback(info, eventStates)}
                onEventRemoveCallback={(changeInfo: any) => onEventRemoveCallback(changeInfo, eventStates)}
                onEventClickCallback={(eventInfo: any) => onEventClickCallback(eventInfo, navigate)}
            />
        </>
    );
};

export default observer(PatientTimetable);